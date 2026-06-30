import { useState } from 'react';
import { useClasses } from '@/application/hooks/useClasses';
import { Button } from '@/presentation/components/base/Button/Button';
import { Input } from '@/presentation/components/base/Input/Input';
import { Modal, ModalActions } from '@/presentation/components/base/Modal/Modal';
import { EmptyState } from '@/presentation/components/base/EmptyState/EmptyState';
import type { Class } from '@/domain/types';
import './ClassesPage.css';

type FormData = { name: string; subject: string };

export function ClassesPage() {
  const { classes, loading, error, createClass, updateClass, deleteClass } = useClasses();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Class | null>(null);
  const [form, setForm] = useState<FormData>({ name: '', subject: '' });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Class | null>(null);

  const filtered = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setEditTarget(null);
    setForm({ name: '', subject: '' });
    setShowModal(true);
  };

  const openEdit = (cls: Class) => {
    setEditTarget(cls);
    setForm({ name: cls.name, subject: cls.subject });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editTarget) {
        await updateClass(editTarget.id, form);
      } else {
        await createClass(form);
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

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await deleteClass(confirmDelete.id);
    setConfirmDelete(null);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header__left">
          <h1>Turmas</h1>
          <p>Gerencie suas turmas e disciplinas</p>
        </div>
        <Button id="create-class-btn" onClick={openCreate} variant="primary">
          + Nova turma
        </Button>
      </div>

      <div className="page-content">
        <div className="classes-toolbar">
          <Input
            placeholder="Buscar por nome ou disciplina..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 320 }}
          />
        </div>

        {loading && (
          <div className="skeleton-list">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton-item" style={{ height: 72 }} />)}
          </div>
        )}

        {!loading && error && (
          <EmptyState icon="⚠️" title="Erro ao carregar turmas" description={error} />
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon="🏫"
            title="Nenhuma turma encontrada"
            description={search ? 'Tente outro termo de busca.' : 'Crie sua primeira turma para começar.'}
            action={!search ? <Button onClick={openCreate}>Criar turma</Button> : undefined}
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="classes-grid">
            {filtered.map((cls) => (
              <div key={cls.id} className="class-card">
                <div className="class-card__header">
                  <div>
                    <h3 className="class-card__name">{cls.name}</h3>
                    <span className="class-card__subject">{cls.subject}</span>
                  </div>
                  <span className="class-card__icon" aria-hidden="true">🏫</span>
                </div>
                <div className="class-card__actions">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(cls)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => setConfirmDelete(cls)}>Excluir</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editTarget ? 'Editar turma' : 'Nova turma'}
        footer={
          <ModalActions
            onCancel={() => setShowModal(false)}
            onConfirm={handleSave}
            confirmLabel={editTarget ? 'Salvar' : 'Criar'}
            loading={saving}
          />
        }
      >
        <form id="class-form" onSubmit={handleSubmit} className="modal-form">
          <Input
            id="class-name"
            label="Nome da turma"
            placeholder="Ex: 1º Ano A"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            id="class-subject"
            label="Disciplina"
            placeholder="Ex: Matemática"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            required
          />
        </form>
      </Modal>

      {/* Confirm Delete */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Excluir turma"
        size="sm"
        footer={
          <ModalActions
            onCancel={() => setConfirmDelete(null)}
            onConfirm={handleDelete}
            confirmLabel="Excluir"
            danger
          />
        }
      >
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          Tem certeza que deseja excluir a turma <strong style={{ color: 'var(--color-text)' }}>{confirmDelete?.name}</strong>?
          Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  );
}
