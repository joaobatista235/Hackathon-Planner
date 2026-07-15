import { useState, useRef, useEffect } from 'react';
import { useClasses } from '@/application/hooks/useClasses';
import { useLessons } from '@/application/hooks/useLessons';
import { useAttachments } from '@/application/hooks/useAttachments';
import { Button } from '@/presentation/components/base/Button/Button';
import { Input } from '@/presentation/components/base/Input/Input';
import { Textarea } from '@/presentation/components/base/Textarea/Textarea';
import { Select } from '@/presentation/components/base/Select/Select';
import { Modal, ModalActions } from '@/presentation/components/base/Modal/Modal';
import { EmptyState } from '@/presentation/components/base/EmptyState/EmptyState';
import { Icon } from '@/presentation/components/base/Icon/Icon';
import type { Lesson } from '@/domain/types';
import './LessonsPage.css';

type FormData = { title: string; description: string; date: string; classId: string };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AttachmentIcon({ mimetype }: { mimetype: string }) {
  return mimetype === 'application/pdf'
    ? <Icon name="clipboard" size={14} />
    : <Icon name="play" size={14} />;
}

export function LessonsPage() {
  const { classes } = useClasses();
  const [filterClass, setFilterClass] = useState('');
  const { lessons, loading, error, createLesson, updateLesson, deleteLesson } = useLessons(filterClass || undefined);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Lesson | null>(null);
  const [form, setForm] = useState<FormData>({ title: '', description: '', date: '', classId: '' });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Lesson | null>(null);
  const [savedLessonId, setSavedLessonId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { attachments, uploading, error: uploadError, load, uploadFile, removeAttachment } =
    useAttachments(savedLessonId);

  const classOptions = classes.map((c) => ({ value: c.id, label: `${c.name} — ${c.subject}` }));
  const today = new Date().toISOString().split('T')[0];

  const openCreate = () => {
    setEditTarget(null);
    setSavedLessonId(null);
    setForm({ title: '', description: '', date: '', classId: '' });
    setShowModal(true);
  };

  const openEdit = (lesson: Lesson) => {
    setEditTarget(lesson);
    setSavedLessonId(lesson.id);
    setForm({
      title: lesson.title,
      description: lesson.description,
      date: lesson.date.split('T')[0],
      classId: lesson.classId,
    });
    setShowModal(true);
  };

  useEffect(() => {
    if (savedLessonId) load();
  }, [savedLessonId, load]);

  const handleSave = async () => {
    if (!form.title || !form.date || !form.classId) {
      alert('Preencha título, data e turma.');
      return;
    }
    setSaving(true);
    try {
      const toISO = (d: string) => d.includes('T') ? d : `${d}T00:00:00.000Z`;
      if (editTarget) {
        await updateLesson(editTarget.id, {
          title: form.title,
          description: form.description,
          date: toISO(form.date),
        });
        setSavedLessonId(editTarget.id);
      } else {
        const created = await createLesson({ ...form, date: toISO(form.date) });
        setSavedLessonId(created.id);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSavedLessonId(null);
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!savedLessonId) { alert('Salve a aula primeiro antes de anexar arquivos.'); return; }
    const file = e.dataTransfer.files[0];
    if (file) await uploadFile(file);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!savedLessonId) { alert('Salve a aula primeiro antes de anexar arquivos.'); return; }
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
    e.target.value = '';
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

      {/* ── Lesson modal ── */}
      <Modal
        open={showModal}
        onClose={handleClose}
        title={editTarget ? 'Editar aula' : 'Nova aula'}
        size="lg"
        footer={
          savedLessonId ? (
            <ModalActions onCancel={handleClose} onConfirm={handleClose} confirmLabel="Fechar" />
          ) : (
            <ModalActions
              onCancel={handleClose}
              onConfirm={handleSave}
              confirmLabel={editTarget ? 'Salvar' : 'Criar aula'}
              loading={saving}
            />
          )
        }
      >
        <div className="lesson-modal">
          {/* Left: form */}
          <div className="lesson-modal__form modal-form">
            <Input id="lesson-title" label="Título" placeholder="Ex: Introdução à álgebra"
              value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required disabled={!!savedLessonId && !editTarget} />
            <Textarea id="lesson-desc" label="Descrição" rows={5}
              placeholder="Descreva o conteúdo da aula, objetivos e atividades…"
              value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              disabled={!!savedLessonId && !editTarget} />
            <Input id="lesson-date" label="Data" type="date"
              value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required disabled={!!savedLessonId && !editTarget} />
            <Select id="lesson-class" label="Turma" options={classOptions} placeholder="Selecione a turma"
              value={form.classId} onChange={(e) => setForm((f) => ({ ...f, classId: e.target.value }))}
              required disabled={!!savedLessonId && !editTarget} />

            {!savedLessonId && (
              <Button variant="primary" onClick={handleSave} loading={saving} style={{ alignSelf: 'flex-start' }}>
                {editTarget ? 'Salvar e ir para anexos' : 'Criar e ir para anexos'}
              </Button>
            )}
          </div>

          {/* Right: attachments */}
          <div className="lesson-modal__attachments">
            <p className="lesson-modal__section-title">Materiais de apoio</p>

            {!savedLessonId && (
              <div className="attach-hint">
                <Icon name="info" size={14} />
                <span>Salve a aula primeiro para anexar arquivos.</span>
              </div>
            )}

            {savedLessonId && (
              <>
                {/* Drop zone */}
                <div
                  className={`dropzone ${dragOver ? 'dropzone--active' : ''} ${uploading ? 'dropzone--loading' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,video/mp4,video/webm,video/ogg,video/quicktime"
                    style={{ display: 'none' }}
                    onChange={handleFileInput}
                  />
                  {uploading ? (
                    <span className="dropzone__label">Enviando…</span>
                  ) : (
                    <>
                      <Icon name="plus" size={20} />
                      <span className="dropzone__label">Clique ou arraste PDF / vídeo</span>
                      <span className="dropzone__hint">Máximo 50 MB</span>
                    </>
                  )}
                </div>

                {uploadError && <p className="attach-error">{uploadError}</p>}

                {/* List */}
                {attachments.length > 0 && (
                  <ul className="attach-list">
                    {attachments.map((att) => (
                      <li key={att.id} className="attach-item">
                        <div className="attach-item__icon">
                          <AttachmentIcon mimetype={att.mimetype} />
                        </div>
                        <div className="attach-item__info">
                          <a
                            className="attach-item__name truncate"
                            href={`http://localhost:3000${att.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={att.originalName}
                          >
                            {att.originalName}
                          </a>
                          <span className="attach-item__meta">{formatBytes(att.size)}</span>
                        </div>
                        {att.mimetype.startsWith('video/') && (
                          <video
                            className="attach-item__preview"
                            src={`http://localhost:3000${att.url}`}
                            controls
                            preload="metadata"
                          />
                        )}
                        <button
                          className="icon-btn icon-btn--danger"
                          onClick={() => removeAttachment(att.id)}
                          title="Remover"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {attachments.length === 0 && !uploading && (
                  <p className="attach-empty">Nenhum material anexado.</p>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Excluir aula" size="sm"
        footer={<ModalActions onCancel={() => setConfirmDelete(null)} onConfirm={async () => { if (confirmDelete) { await deleteLesson(confirmDelete.id); setConfirmDelete(null); }}} confirmLabel="Excluir" danger />}
      >
        <p className="confirm-text">Excluir a aula <strong>{confirmDelete?.title}</strong>?</p>
      </Modal>
    </div>
  );
}
