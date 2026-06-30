import { useState } from 'react';
import { useAuth } from '@/application/context/AuthContext';
import { useClasses } from '@/application/hooks/useClasses';
import { useAssessments } from '@/application/hooks/useAssessments';
import { useAlerts } from '@/application/hooks/useAlerts';
import { useLessons } from '@/application/hooks/useLessons';
import { AssessmentTypeBadge } from '@/presentation/components/base/Badge/Badge';
import { AlertPriorityBadge } from '@/presentation/components/base/Badge/Badge';
import './DashboardPage.css';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function DashboardPage() {
  const { user } = useAuth();
  const { classes, loading: loadingClasses } = useClasses();
  const { lessons, loading: loadingLessons } = useLessons();
  const { assessments, loading: loadingAssessments } = useAssessments();
  const { alerts, loading: loadingAlerts } = useAlerts(true);
  const [today] = useState(new Date().toISOString().split('T')[0]);

  const todayLessons = lessons.filter(
    (l) => l.date.split('T')[0] === today,
  );

  const upcomingAssessments = assessments
    .filter((a) => a.status === 'PENDING')
    .slice(0, 5);

  const pendingAlerts = alerts.filter((a) => a.status === 'PENDING').slice(0, 5);

  return (
    <div className="dashboard">
      <div className="page-header">
        <div className="page-header__left">
          <h1>{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      <div className="page-content">
        {/* Stats row */}
        <div className="dashboard__stats">
          <StatCard
            label="Turmas"
            value={loadingClasses ? '—' : String(classes.length)}
            icon="🏫"
            color="primary"
          />
          <StatCard
            label="Aulas hoje"
            value={loadingLessons ? '—' : String(todayLessons.length)}
            icon="📖"
            color="success"
          />
          <StatCard
            label="Avaliações próximas"
            value={loadingAssessments ? '—' : String(upcomingAssessments.length)}
            icon="📝"
            color="warning"
          />
          <StatCard
            label="Alertas pendentes"
            value={loadingAlerts ? '—' : String(pendingAlerts.length)}
            icon="🔔"
            color="danger"
          />
        </div>

        <div className="dashboard__grid">
          {/* Today schedule */}
          <section className="dashboard__section">
            <h2 className="dashboard__section-title">Agenda de hoje</h2>
            {loadingLessons ? (
              <div className="skeleton-list">
                {[1, 2, 3].map((i) => <div key={i} className="skeleton-item" />)}
              </div>
            ) : todayLessons.length === 0 ? (
              <p className="dashboard__empty">Nenhuma aula agendada para hoje.</p>
            ) : (
              <ul className="dashboard__list">
                {todayLessons.map((lesson) => (
                  <li key={lesson.id} className="event-row event-row--lesson">
                    <div className="event-row__accent" />
                    <div className="event-row__content">
                      <span className="event-row__title">{lesson.title}</span>
                      <span className="event-row__sub">{lesson.class?.name ?? '—'}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Upcoming assessments */}
          <section className="dashboard__section">
            <h2 className="dashboard__section-title">Próximas avaliações</h2>
            {loadingAssessments ? (
              <div className="skeleton-list">
                {[1, 2, 3].map((i) => <div key={i} className="skeleton-item" />)}
              </div>
            ) : upcomingAssessments.length === 0 ? (
              <p className="dashboard__empty">Nenhuma avaliação pendente.</p>
            ) : (
              <ul className="dashboard__list">
                {upcomingAssessments.map((a) => (
                  <li key={a.id} className="event-row event-row--assessment">
                    <div className="event-row__accent" />
                    <div className="event-row__content">
                      <span className="event-row__title">{a.title}</span>
                      <span className="event-row__sub">{a.class?.name ?? '—'}</span>
                    </div>
                    <div className="event-row__right">
                      <AssessmentTypeBadge type={a.type} />
                      <span className="event-row__date tabular-nums">{formatDate(a.dueDate)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Pending alerts */}
          <section className="dashboard__section dashboard__section--full">
            <h2 className="dashboard__section-title">Alertas pendentes</h2>
            {loadingAlerts ? (
              <div className="skeleton-list">
                {[1, 2].map((i) => <div key={i} className="skeleton-item" />)}
              </div>
            ) : pendingAlerts.length === 0 ? (
              <p className="dashboard__empty">Nenhum alerta pendente. ✓</p>
            ) : (
              <ul className="dashboard__list">
                {pendingAlerts.map((alert) => (
                  <li key={alert.id} className="event-row event-row--alert">
                    <div className="event-row__accent" />
                    <div className="event-row__content">
                      <span className="event-row__title">{alert.title}</span>
                      <span className="event-row__sub">{alert.message}</span>
                    </div>
                    <AlertPriorityBadge priority={alert.priority} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: {
  label: string; value: string; icon: string; color: string;
}) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <span className="stat-card__icon">{icon}</span>
      <div>
        <p className="stat-card__value tabular-nums">{value}</p>
        <p className="stat-card__label">{label}</p>
      </div>
    </div>
  );
}
