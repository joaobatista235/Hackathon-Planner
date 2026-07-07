import { Icon, type IconName } from '@/presentation/components/base/Icon/Icon';
import type { ReactNode } from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon = 'loader', title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon-wrap" aria-hidden="true">
        <Icon name={icon} size={22} />
      </div>
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
