import { useState, useMemo } from 'react';
import { useLessons } from '@/application/hooks/useLessons';
import { useAssessments } from '@/application/hooks/useAssessments';
import './CalendarPage.css';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

type CalendarEvent = {
  id: string;
  title: string;
  type: 'lesson' | 'prova' | 'trabalho';
  date: string;
  meta?: string;
};

export function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(today.toISOString().split('T')[0]);

  const { lessons } = useLessons();
  const { assessments } = useAssessments();

  const events = useMemo((): CalendarEvent[] => {
    const lessonEvents: CalendarEvent[] = lessons.map((l) => ({
      id: l.id,
      title: l.title,
      type: 'lesson',
      date: l.date.split('T')[0],
      meta: l.class?.name,
    }));
    const assessmentEvents: CalendarEvent[] = assessments.map((a) => ({
      id: a.id,
      title: a.title,
      type: a.type === 'PROVA' ? 'prova' : 'trabalho',
      date: a.dueDate.split('T')[0],
      meta: a.class?.name,
    }));
    return [...lessonEvents, ...assessmentEvents];
  }, [lessons, assessments]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [events]);

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const todayStr = today.toISOString().split('T')[0];

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const dayEvents = selectedDay ? (eventsByDate[selectedDay] ?? []) : [];

  const toDateStr = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return (
    <div>
      <div className="page-header">
        <div className="page-header__left">
          <h1>Calendário</h1>
          <p>Aulas e avaliações por dia</p>
        </div>
      </div>

      <div className="page-content calendar-layout">
        <div className="cal-main">
          {/* Header */}
          <div className="cal-nav">
            <button className="cal-nav__btn" onClick={prevMonth} aria-label="Mês anterior">‹</button>
            <h2 className="cal-nav__title">{MONTH_NAMES[month]} {year}</h2>
            <button className="cal-nav__btn" onClick={nextMonth} aria-label="Próximo mês">›</button>
          </div>

          {/* Weekdays */}
          <div className="cal-grid cal-grid--head">
            {WEEKDAYS.map((d) => <div key={d} className="cal-cell cal-cell--head">{d}</div>)}
          </div>

          {/* Days */}
          <div className="cal-grid">
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="cal-cell cal-cell--empty" />;
              const dateStr = toDateStr(day);
              const dayEvs = eventsByDate[dateStr] ?? [];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDay;
              return (
                <button
                  key={dateStr}
                  className={`cal-cell cal-cell--day ${isToday ? 'cal-cell--today' : ''} ${isSelected ? 'cal-cell--selected' : ''}`}
                  onClick={() => setSelectedDay(dateStr)}
                  aria-label={`${day} de ${MONTH_NAMES[month]}`}
                >
                  <span className="cal-cell__num">{day}</span>
                  {dayEvs.length > 0 && (
                    <div className="cal-cell__dots">
                      {dayEvs.slice(0, 3).map((ev) => (
                        <span key={ev.id} className={`cal-dot cal-dot--${ev.type}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <aside className="cal-panel">
          <h3 className="cal-panel__title">
            {selectedDay
              ? new Date(selectedDay + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
              : 'Selecione um dia'}
          </h3>
          {dayEvents.length === 0 ? (
            <p className="cal-panel__empty">Nenhum evento neste dia.</p>
          ) : (
            <ul className="cal-panel__list">
              {dayEvents.map((ev) => (
                <li key={ev.id} className={`cal-event cal-event--${ev.type}`}>
                  <div className="cal-event__accent" />
                  <div>
                    <span className="cal-event__title">{ev.title}</span>
                    {ev.meta && <span className="cal-event__meta">{ev.meta}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Legend */}
          <div className="cal-legend">
            <span className="cal-dot cal-dot--lesson" /> Aula
            <span className="cal-dot cal-dot--prova" /> Prova
            <span className="cal-dot cal-dot--trabalho" /> Trabalho
          </div>
        </aside>
      </div>
    </div>
  );
}
