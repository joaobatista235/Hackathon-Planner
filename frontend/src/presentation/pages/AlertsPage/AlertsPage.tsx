import { useState } from 'react';
import { useAlerts } from '@/application/hooks/useAlerts';
import { Button } from '@/presentation/components/base/Button/Button';
import { Input } from '@/presentation/components/base/Input/Input';
import { Textarea } from '@/presentation/components/base/Textarea/Textarea';
import { Select } from '@/presentation/components/base/Select/Select';
import { Modal, ModalActions } from '@/presentation/components/base/Modal/Modal';
import { EmptyState } from '@/presentation/components/base/EmptyState/EmptyState';
import { AlertPriorityBadge, AlertStatusBadge } from '@/presentation/components/base/Badge/Badge';
import { Icon } from '@/presentation/components/base/Icon/Icon';
import type { Alert } from '@/domain/types';
import './AlertsPage.css';

type FormData = { title: string; message: string; priority: string; dueDate: string };

export function AlertsPage() {
  const { alerts, loading, error, createAlert, completeAlert, deleteAlert } = useAlerts();
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormData>({ title: '', message: '', priority: 'NEAR', dueDate: '' });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Alert | null>(null);

  const filtered = filterStatus ? alerts.filter((a) => a.status === filterStatus) : alerts;

  const handleSave = async () => {
    setSaving(true);
    try {
      await createAlert({
        title: form.title,
        message: form.message,
        priority: form.priority,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      });
      setShowModal(false);
      setForm({ title: '', message: '', priority: 'NEAR', dueDate: '' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave();
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header__left">
          <h1>Alertas</h1>
          <p>Acompanhe alertas manuais e automáticos</p>
        </div>
        <Button id="create-alert-btn" onClick={() => setShowModal(true)} variant="primary">
          <Icon name="plus" size={14} />
          Novo alerta
        </Button>
      </div>

      <div className="page-content">
        <div className="alerts-toolbar">
          <Select
            options={[{ value: '', label: 'Todos' }, { value: 'PENDING', label: 'Pendentes' }, { value: 'DONE', label: 'Concluídos' }]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ maxWidth: 180 }}
          />
        </div>

        {loading && <div className="skeleton-list">{[1,2,3].map(i => <div key={i} className="skeleton-item" style={{ height: 76 }} />)}</div>}
        {!loading && error && <EmptyState icon="alert-triangle" title={error} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState icon="bell" title="Nenhum alerta" action={<Button onClick={() => setShowModal(true)}>Criar alerta</Button>} />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="alerts-list">
            {filtered.map((alert) => (
              <div key={alert.id} className={`alert-row alert-row--${alert.priority.toLowerCase()} ${alert.status === 'DONE' ? 'alert-row--done' : ''}`}>
                <div className="alert-row__accent" />
                <div className="alert-row__content">
                  <span className="alert-row__title">{alert.title}</span>
                  <span className="alert-row__message">{alert.message}</span>
                  {alert.dueDate && (
                    <span className="alert-row__date tabular-nums">
                      Vence: {new Date(alert.dueDate).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
                <div className="alert-row__badges">
                  <AlertPriorityBadge priority={alert.priority} />
                  <AlertStatusBadge status={alert.status} />
                </div>
                <div className="alert-row__actions">
                  {alert.status === 'PENDING' && (
                    <button className="icon-btn" onClick={() => completeAlert(alert.id)} title="Concluir">
                      <Icon name="check" size={14} />
                    </button>
                  )}
                  <button className="icon-btn icon-btn--danger" onClick={() => setConfirmDelete(alert)} title="Excluir">
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Novo alerta"
        footer={<ModalActions onCancel={() => setShowModal(false)} onConfirm={handleSave} confirmLabel="Criar" loading={saving} />}
      >
        <form id="alert-form" onSubmit={handleSubmit} className="modal-form">
          <Input id="alert-title" label="Título" placeholder="Ex: Reunião de pais" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
          <Textarea id="alert-message" label="Mensagem" placeholder="Descreva o alerta com detalhes…" rows={3} value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} required />
          <Select id="alert-priority" label="Prioridade" options={[{ value: 'NEAR', label: 'Próximo (7 dias)' }, { value: 'URGENT', label: 'Urgente (24h)' }, { value: 'OVERDUE', label: 'Atrasado' }]} value={form.priority} onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))} />
          <Input id="alert-date" label="Data de vencimento (opcional)" type="date" value={form.dueDate} onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))} />
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Excluir alerta" size="sm"
        footer={<ModalActions onCancel={() => setConfirmDelete(null)} onConfirm={async () => { if (confirmDelete) { await deleteAlert(confirmDelete.id); setConfirmDelete(null); }}} confirmLabel="Excluir" danger />}
      >
        <p className="confirm-text">Excluir <strong>{confirmDelete?.title}</strong>?</p>
      </Modal>
    </div>
  );
}
