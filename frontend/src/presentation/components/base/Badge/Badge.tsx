import type { AlertPriority, AlertStatus, AssessmentStatus, AssessmentType, PlanStatus } from '@/domain/types';
import './Badge.css';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export function Badge({ variant = 'muted', size = 'md', children }: BadgeProps) {
  return (
    <span className={`badge badge--${variant} badge--${size}`}>{children}</span>
  );
}

// Domain-specific badge helpers
const ASSESSMENT_TYPE_LABELS: Record<AssessmentType, string> = {
  PROVA: 'Prova',
  TRABALHO: 'Trabalho',
};
const ASSESSMENT_TYPE_VARIANT: Record<AssessmentType, BadgeVariant> = {
  PROVA: 'danger',
  TRABALHO: 'warning',
};
export function AssessmentTypeBadge({ type }: { type: AssessmentType }) {
  return <Badge variant={ASSESSMENT_TYPE_VARIANT[type]}>{ASSESSMENT_TYPE_LABELS[type]}</Badge>;
}

const ASSESSMENT_STATUS_LABELS: Record<AssessmentStatus, string> = {
  PENDING: 'Pendente',
  DONE: 'Concluída',
};
const ASSESSMENT_STATUS_VARIANT: Record<AssessmentStatus, BadgeVariant> = {
  PENDING: 'warning',
  DONE: 'success',
};
export function AssessmentStatusBadge({ status }: { status: AssessmentStatus }) {
  return <Badge variant={ASSESSMENT_STATUS_VARIANT[status]}>{ASSESSMENT_STATUS_LABELS[status]}</Badge>;
}

const ALERT_PRIORITY_LABELS: Record<AlertPriority, string> = {
  URGENT: 'Urgente',
  NEAR: 'Próximo',
  OVERDUE: 'Atrasado',
};
const ALERT_PRIORITY_VARIANT: Record<AlertPriority, BadgeVariant> = {
  URGENT: 'danger',
  NEAR: 'warning',
  OVERDUE: 'info',
};
export function AlertPriorityBadge({ priority }: { priority: AlertPriority }) {
  return <Badge variant={ALERT_PRIORITY_VARIANT[priority]}>{ALERT_PRIORITY_LABELS[priority]}</Badge>;
}

const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  PENDING: 'Pendente',
  DONE: 'Concluído',
};
export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  return <Badge variant={status === 'DONE' ? 'success' : 'muted'}>{ALERT_STATUS_LABELS[status]}</Badge>;
}

const PLAN_STATUS_LABELS: Record<PlanStatus, string> = {
  DRAFT: 'Rascunho',
  DONE: 'Concluído',
};
export function PlanStatusBadge({ status }: { status: PlanStatus }) {
  return <Badge variant={status === 'DONE' ? 'success' : 'muted'}>{PLAN_STATUS_LABELS[status]}</Badge>;
}
