import { useState } from 'react';
import { useClasses } from '@/application/hooks/useClasses';
import { useLessons } from '@/application/hooks/useLessons';
import { Button } from '@/presentation/components/base/Button/Button';
import { Input } from '@/presentation/components/base/Input/Input';
import { Select } from '@/presentation/components/base/Select/Select';
import { Modal, ModalActions } from '@/presentation/components/base/Modal/Modal';
import { EmptyState } from '@/presentation/components/base/EmptyState/EmptyState';
import { Icon } from '@/presentation/components/base/Icon/Icon';
import type { Lesson } from '@/domain/types';
import './LessonsPage.css';

type FormData = { title: string; description: string; date: string; classId: string };

export function LessonsPage() {
  const { classes } = useClasses();
  const [filterClass, setFilterClass] = useState('');
  const { lessons, loading, error, createLesson, updateLesson, deleteLesson } = useLessons(filterClass || undefined);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Lesson | null>(null);
  const [form, setForm] = useState<FormData>({ title: '', description: '', date: '', classId: '' });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Lesson | null>(null);

  const classOptions = classes.map((c) => ({ value: c.id, label: `${c.name} — ${c.subject}` }));
  const today = new Date().toISOString().split('T')[0];

  const openCreate = () => {
    setEditTarget(null);
    setForm({ title: '', description: '', date: '', classId: '' });
    setShowModal(true);
  };

  const openEdit = (lesson: Lesson) => {
    setEditTarget(lesson);
    setForm({
      title: lesson.title,
      description: lesson.description,
      date: lesson.date.split('T')[0],
      classId: lesson.classId,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editTarget) {
        await updateLesson(editTarget.id, { title: form.title, description: form.description, date: new Date(form.date).toISOString() });
      } else {
        await createLesson({ ...form, date: new Date(form.date).toISOString() });
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
    await deleteLesson(confirmDelete.id);
    setConfirmDelete(null);
  };

  function lessonStatus(lesson: Lesson) {
    const d = lesson.date.split('T')[0];
    if (d === today) return 'today';
    if (d > today) return 'future';
    return 'past';
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header__left">
          <h1>Aulas</h1>
          <p>Registre e acompanhe suas aulas por turma</p>
        </div>
        <Button id="create-lesson-btn" onClick={openCreate} variant="primary">
          <Icon name="plus" size={14} />
          Nova aula
        </Button>
      </div>

      <div className="page-content">
        <div className="lessons-toolbar">
          <Select
            options={[{ value: '', label: 'Todas as turmas' }, ...classOptions]}
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            style={{ maxWidth: 280 }}
          />
        </div>

        {loading && (
          <div className="skeleton-list">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton-item" style={{ height: 72 }} />)}
          </div>
        )}

        {!loading && error && <EmptyState icon="alert-triangle" title="Erro ao carregar aulas" description={error} />}

        {!loading && !error && lessons.length === 0 && (
          <EmptyState icon="book-open" title="Nenhuma aula encontrada"
            action={<Button onClick={openCreate}>Criar aula</Button>}
          />
        )}

        {!loading && !error && lessons.length > 0 && (
          <div className="lessons-list">
            {lessons.map((lesson) => {
              const status = lessonStatus(lesson);
              return (
                <div key={lesson.id} className={`lesson-row lesson-row--${status}`}>
                  <div className="lesson-row__date tabular-nums">
                    <span className="lesson-row__day">{new Date(lesson.date).getDate().toString().padStart(2, '0')}</span>
                    <span className="lesson-row__month">{new Date(lesson.date).toLocaleString('pt-BR', { month: 'short' })}</span>
                  </div>
                  <div className="lesson-row__accent" />
                  <div className="lesson-row__content">
                    <span className="lesson-row__title">{lesson.title}</span>
                    <span className="lesson-row__meta">{lesson.class?.name ?? '—'} · {lesson.class?.subject ?? '—'}</span>
                    {lesson.description && <p className="lesson-row__desc truncate">{lesson.description}</p>}
                  </div>
                  {status === 'today' && <span className="lesson-row__badge lesson-row__badge--today">Hoje</span>}
                  <div className="lesson-row__actions">
                    <button className="icon-btn" onClick={() => openEdit(lesson)} title="Editar">
                      <Icon name="pencil" size={14} />
                    </button>
                    <button className="icon-btn icon-btn--danger" onClick={() => setConfirmDelete(lesson)} title="Excluir">
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Editar aula' : 'Nova aula'}
        footer={<ModalActions onCancel={() => setShowModal(false)} onConfirm={handleSave} confirmLabel={editTarget ? 'Salvar' : 'Criar'} loading={saving} />}
      >
        <form id="lesson-form" onSubmit={handleSubmit} className="modal-form">
          <Input id="lesson-title" label="Título" placeholder="Ex: Introdução à álgebra" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          <Input id="lesson-desc" label="Descrição" placeholder="Conteúdo da aula…" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <Input id="lesson-date" label="Data" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
          <Select id="lesson-class" label="Turma" options={classOptions} placeholder="Selecione a turma" value={form.classId} onChange={(e) => setForm((f) => ({ ...f, classId: e.target.value }))} required />
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Excluir aula" size="sm"
        footer={<ModalActions onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} confirmLabel="Excluir" danger />}
      >
        <p className="confirm-text">Excluir a aula <strong>{confirmDelete?.title}</strong>?</p>
      </Modal>
    </div>
  );
}
