import { useState } from 'react';
import { useClasses } from '@/application/hooks/useClasses';
import { useBimesterPlans } from '@/application/hooks/useBimesterPlans';
import { Button } from '@/presentation/components/base/Button/Button';
import { Input } from '@/presentation/components/base/Input/Input';
import { Select } from '@/presentation/components/base/Select/Select';
import { Modal, ModalActions } from '@/presentation/components/base/Modal/Modal';
import { EmptyState } from '@/presentation/components/base/EmptyState/EmptyState';
import { PlanStatusBadge } from '@/presentation/components/base/Badge/Badge';
import { Icon } from '@/presentation/components/base/Icon/Icon';
import type { BimesterPlan } from '@/domain/types';
import './BimesterPlansPage.css';

type FormData = { title: string; goals: string; startsAt: string; endsAt: string; classId: string };

export function BimesterPlansPage() {
  const { classes } = useClasses();
  const [filterClass, setFilterClass] = useState('');
  const { plans, loading, error, createPlan, updatePlan, completePlan, deletePlan } = useBimesterPlans(filterClass || undefined);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<BimesterPlan | null>(null);
  const [form, setForm] = useState<FormData>({ title: '', goals: '', startsAt: '', endsAt: '', classId: '' });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<BimesterPlan | null>(null);

  const classOptions = classes.map((c) => ({ value: c.id, label: `${c.name} — ${c.subject}` }));

  const openCreate = () => {
    setEditTarget(null);
    setForm({ title: '', goals: '', startsAt: '', endsAt: '', classId: '' });
    setShowModal(true);
  };

  const openEdit = (p: BimesterPlan) => {
    setEditTarget(p);
    setForm({ title: p.title, goals: p.goals, startsAt: p.startsAt.split('T')[0], endsAt: p.endsAt.split('T')[0], classId: p.classId });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...form, startsAt: new Date(form.startsAt).toISOString(), endsAt: new Date(form.endsAt).toISOString() };
      if (editTarget) { await updatePlan(editTarget.id, data); }
      else { await createPlan(data); }
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave();
  };

  function getProgress(p: BimesterPlan) {
    const start = new Date(p.startsAt).getTime();
    const end = new Date(p.endsAt).getTime();
    const now = Date.now();
    if (now <= start) return 0;
    if (now >= end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header__left">
          <h1>Planejamento Bimestral</h1>
          <p>Organize objetivos e progresso por turma</p>
        </div>
        <Button id="create-plan-btn" onClick={openCreate} variant="primary">
          <Icon name="plus" size={14} />
          Novo planejamento
        </Button>
      </div>

      <div className="page-content">
        <div className="plans-toolbar">
          <Select options={[{ value: '', label: 'Todas as turmas' }, ...classOptions]} value={filterClass} onChange={(e) => setFilterClass(e.target.value)} style={{ maxWidth: 280 }} />
        </div>

        {loading && <div className="skeleton-list">{[1,2,3].map(i => <div key={i} className="skeleton-item" style={{ height: 120 }} />)}</div>}
        {!loading && error && <EmptyState icon="alert-triangle" title={error} />}
        {!loading && !error && plans.length === 0 && (
          <EmptyState icon="bar-chart" title="Nenhum planejamento" action={<Button onClick={openCreate}>Criar planejamento</Button>} />
        )}

        {!loading && !error && plans.length > 0 && (
          <div className="plans-grid">
            {plans.map((plan) => {
              const progress = plan.status === 'DONE' ? 100 : getProgress(plan);
              return (
                <div key={plan.id} className={`plan-card ${plan.status === 'DONE' ? 'plan-card--done' : ''}`}>
                  <div className="plan-card__header">
                    <div>
                      <h3 className="plan-card__title">{plan.title}</h3>
                      <span className="plan-card__class">{plan.class?.name ?? '—'} · {plan.class?.subject ?? '—'}</span>
                    </div>
                    <PlanStatusBadge status={plan.status} />
                  </div>
                  <p className="plan-card__goals">{plan.goals}</p>
                  <div className="plan-card__dates tabular-nums">
                    <Icon name="calendar" size={12} />
                    <span>{new Date(plan.startsAt).toLocaleDateString('pt-BR')} – {new Date(plan.endsAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="plan-card__progress">
                    <div className="plan-card__progress-bar">
                      <div className="plan-card__progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="plan-card__progress-label tabular-nums">{progress}%</span>
                  </div>
                  <div className="plan-card__actions">
                    {plan.status === 'DRAFT' && (
                      <button className="icon-btn" onClick={() => completePlan(plan.id)} title="Concluir">
                        <Icon name="check" size={14} />
                      </button>
                    )}
                    <button className="icon-btn" onClick={() => openEdit(plan)} title="Editar">
                      <Icon name="pencil" size={14} />
                    </button>
                    <button className="icon-btn icon-btn--danger" onClick={() => setConfirmDelete(plan)} title="Excluir">
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Editar planejamento' : 'Novo planejamento'} size="lg"
        footer={<ModalActions onCancel={() => setShowModal(false)} onConfirm={handleSave} confirmLabel={editTarget ? 'Salvar' : 'Criar'} loading={saving} />}
      >
        <form id="plan-form" onSubmit={handleSubmit} className="modal-form">
          <Input id="plan-title" label="Título" placeholder="Ex: 1º Bimestre 2025" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
          <Input id="plan-goals" label="Objetivos" placeholder="Descreva os objetivos do período…" value={form.goals} onChange={(e) => setForm(f => ({ ...f, goals: e.target.value }))} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Input id="plan-start" label="Início" type="date" value={form.startsAt} onChange={(e) => setForm(f => ({ ...f, startsAt: e.target.value }))} required />
            <Input id="plan-end" label="Término" type="date" value={form.endsAt} onChange={(e) => setForm(f => ({ ...f, endsAt: e.target.value }))} required />
          </div>
          <Select id="plan-class" label="Turma" options={classOptions} placeholder="Selecione a turma" value={form.classId} onChange={(e) => setForm(f => ({ ...f, classId: e.target.value }))} required />
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Excluir planejamento" size="sm"
        footer={<ModalActions onCancel={() => setConfirmDelete(null)} onConfirm={async () => { if (confirmDelete) { await deletePlan(confirmDelete.id); setConfirmDelete(null); }}} confirmLabel="Excluir" danger />}
      >
        <p className="confirm-text">Excluir <strong>{confirmDelete?.title}</strong>?</p>
      </Modal>
    </div>
  );
}
