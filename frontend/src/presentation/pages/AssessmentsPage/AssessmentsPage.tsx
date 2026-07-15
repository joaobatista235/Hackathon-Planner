import { useState } from 'react';
import { useClasses } from '@/application/hooks/useClasses';
import { useAssessments } from '@/application/hooks/useAssessments';
import { Button } from '@/presentation/components/base/Button/Button';
import { Input } from '@/presentation/components/base/Input/Input';
import { Textarea } from '@/presentation/components/base/Textarea/Textarea';
import { Select } from '@/presentation/components/base/Select/Select';
import { Modal, ModalActions } from '@/presentation/components/base/Modal/Modal';
import { EmptyState } from '@/presentation/components/base/EmptyState/EmptyState';
import { AssessmentTypeBadge, AssessmentStatusBadge } from '@/presentation/components/base/Badge/Badge';
import { Icon } from '@/presentation/components/base/Icon/Icon';
import type { Assessment } from '@/domain/types';
import './AssessmentsPage.css';

type FormData = { title: string; description: string; type: string; dueDate: string; classId: string };

export function AssessmentsPage() {
  const { classes } = useClasses();
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const { assessments, loading, error, createAssessment, updateAssessment, deleteAssessment } = useAssessments(filterClass || undefined);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Assessment | null>(null);
  const [form, setForm] = useState<FormData>({ title: '', description: '', type: 'PROVA', dueDate: '', classId: '' });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Assessment | null>(null);

  const classOptions = classes.map((c) => ({ value: c.id, label: `${c.name} — ${c.subject}` }));
  const filtered = filterStatus ? assessments.filter((a) => a.status === filterStatus) : assessments;

  const openCreate = () => {
    setEditTarget(null);
    setForm({ title: '', description: '', type: 'PROVA', dueDate: '', classId: '' });
    setShowModal(true);
  };

  const openEdit = (a: Assessment) => {
    setEditTarget(a);
    setForm({ title: a.title, description: a.description ?? '', type: a.type, dueDate: a.dueDate.split('T')[0], classId: a.classId });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.dueDate || !form.classId) {
      alert('Preencha título, data e turma.');
      return;
    }
    setSaving(true);
    try {
      const toISO = (d: string) => d.includes('T') ? d : `${d}T00:00:00.000Z`;
      const dueDate = toISO(form.dueDate);
      if (editTarget) {
        await updateAssessment(editTarget.id, { ...form, dueDate });
      } else {
        await createAssessment({ ...form, dueDate });
      }
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave();
  };

  const toggleDone = async (a: Assessment) => {
    await updateAssessment(a.id, { status: a.status === 'PENDING' ? 'DONE' : 'PENDING' });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header__left">
          <h1>Avaliações</h1>
          <p>Provas e trabalhos por turma</p>
        </div>
        <Button id="create-assessment-btn" onClick={openCreate} variant="primary">
          <Icon name="plus" size={14} />
          Nova avaliação
        </Button>
      </div>

      <div className="page-content">
        <div className="assessments-toolbar">
          <Select options={[{ value: '', label: 'Todas as turmas' }, ...classOptions]} value={filterClass} onChange={(e) => setFilterClass(e.target.value)} style={{ maxWidth: 240 }} />
          <Select options={[{ value: '', label: 'Todos os status' }, { value: 'PENDING', label: 'Pendente' }, { value: 'DONE', label: 'Concluída' }]} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ maxWidth: 180 }} />
        </div>

        {loading && <div className="skeleton-list">{[1,2,3].map(i => <div key={i} className="skeleton-item" style={{ height: 80 }} />)}</div>}
        {!loading && error && <EmptyState icon="alert-triangle" title="Erro ao carregar avaliações" description={error} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState icon="clipboard" title="Nenhuma avaliação" action={<Button onClick={openCreate}>Criar avaliação</Button>} />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="assessments-list">
            {filtered.map((a) => (
              <div key={a.id} className={`assessment-row assessment-row--${a.status === 'DONE' ? 'done' : a.type.toLowerCase()}`}>
                <div className="assessment-row__accent" />
                <div className="assessment-row__content">
                  <span className="assessment-row__title">{a.title}</span>
                  <span className="assessment-row__meta">{a.class?.name ?? '—'} · Entrega: {new Date(a.dueDate).toLocaleDateString('pt-BR')}</span>
                  {a.description && <span className="assessment-row__desc truncate">{a.description}</span>}
                </div>
                <div className="assessment-row__badges">
                  <AssessmentTypeBadge type={a.type} />
                  <AssessmentStatusBadge status={a.status} />
                </div>
                <div className="assessment-row__actions">
                  <button
                    className="icon-btn"
                    onClick={() => toggleDone(a)}
                    title={a.status === 'DONE' ? 'Reabrir' : 'Concluir'}
                  >
                    <Icon name="check" size={14} />
                  </button>
                  <button className="icon-btn" onClick={() => openEdit(a)} title="Editar">
                    <Icon name="pencil" size={14} />
                  </button>
                  <button className="icon-btn icon-btn--danger" onClick={() => setConfirmDelete(a)} title="Excluir">
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Editar avaliação' : 'Nova avaliação'}
        footer={<ModalActions onCancel={() => setShowModal(false)} onConfirm={handleSave} confirmLabel={editTarget ? 'Salvar' : 'Criar'} loading={saving} />}
      >
        <form id="assessment-form" onSubmit={handleSubmit} className="modal-form">
          <Input id="ass-title" label="Título" placeholder="Ex: Prova de Álgebra" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
          <Textarea id="ass-desc" label="Observações" placeholder="Conteúdo, critérios de avaliação…" rows={3} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
          <Select id="ass-type" label="Tipo" options={[{ value: 'PROVA', label: 'Prova' }, { value: 'TRABALHO', label: 'Trabalho' }]} value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} />
          <Input id="ass-date" label="Data de entrega" type="date" value={form.dueDate} onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))} required />
          <Select id="ass-class" label="Turma" options={classOptions} placeholder="Selecione a turma" value={form.classId} onChange={(e) => setForm(f => ({ ...f, classId: e.target.value }))} required />
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Excluir avaliação" size="sm"
        footer={<ModalActions onCancel={() => setConfirmDelete(null)} onConfirm={async () => { if (confirmDelete) { await deleteAssessment(confirmDelete.id); setConfirmDelete(null); }}} confirmLabel="Excluir" danger />}
      >
        <p className="confirm-text">Excluir <strong>{confirmDelete?.title}</strong>?</p>
      </Modal>
    </div>
  );
}
