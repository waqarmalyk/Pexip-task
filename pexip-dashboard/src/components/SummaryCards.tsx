import type { Summary } from '../types';
import { CARDS } from '../utils';
import { colors } from '../theme';

interface SummaryCardsProps {
  summary: Summary;
  activeStatus: string;
  onFilterStatus: (s: string) => void;
}

export default function SummaryCards({
  summary,
  activeStatus,
  onFilterStatus,
}: SummaryCardsProps) {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8'>
      {CARDS.map(({ key, label, accentColor }) => {
        const value =
          key === 'total'
            ? summary.total
            : summary[key as keyof Omit<Summary, 'total'>];
        const pct =
          summary.total > 0 && key !== 'total'
            ? ((value / summary.total) * 100).toFixed(1) + '%'
            : null;
        const isActive =
          activeStatus === key || (key === 'total' && activeStatus === '');
        return (
          <button
            key={key}
            onClick={() => onFilterStatus(key === 'total' ? '' : key)}
            style={{
              borderTopColor: accentColor,
              borderRightColor: isActive ? accentColor : colors.border,
              borderBottomColor: isActive ? accentColor : colors.border,
              borderLeftColor: isActive ? accentColor : colors.border,
              borderTopWidth: 3,
              background: colors.bgSurface,
            }}
            className='relative flex flex-col gap-2 text-left px-5 py-5 rounded-xl border hover:-translate-y-0.5 transition-transform cursor-pointer'
          >
            <span
              className='text-xs font-semibold uppercase tracking-wide'
              style={{ color: colors.textMuted }}
            >
              {label}
            </span>
            <span
              className='text-3xl font-bold leading-none'
              style={{ color: accentColor }}
            >
              {value}
            </span>
            {pct && (
              <span className='text-xs' style={{ color: colors.textMuted }}>
                {pct} of total
              </span>
            )}
            {key === 'total' && (
              <span className='text-xs' style={{ color: colors.textMuted }}>
                All registered
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
