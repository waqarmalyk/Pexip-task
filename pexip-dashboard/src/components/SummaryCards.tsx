import type { Summary } from '../types';
import { CARDS, STATUS_ICONS } from '../utils';
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
    <div className='grid grid-cols-2 gap-3 h-full'>
      {CARDS.map(({ key, label, accentColor }) => {
        const value =
          key === 'total'
            ? summary.total
            : summary[key as keyof Omit<Summary, 'total'>];
        const pct =
          summary.total > 0 && key !== 'total'
            ? (value / summary.total) * 100
            : null;
        const isActive =
          activeStatus === key || (key === 'total' && activeStatus === '');

        return (
          <button
            key={key}
            onClick={() => onFilterStatus(key === 'total' ? '' : key)}
            style={{
              background: isActive
                ? `linear-gradient(145deg, ${colors.bgElevated}, ${colors.bgSurface})`
                : colors.bgSurface,
              border: `1.5px solid ${isActive ? accentColor : colors.border}`,
              borderLeft: `4px solid ${accentColor}`,
              boxShadow: isActive
                ? `0 0 0 1px ${accentColor}33, 0 4px 20px ${accentColor}28`
                : `0 2px 8px rgba(0,0,0,0.35), inset 0 0 0 0.5px ${colors.border}`,
            }}
            className={`relative flex flex-col text-left px-4 py-4 rounded-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg group h-full${key === 'total' ? ' col-span-2' : ''}`}
          >
            <div className='flex items-center gap-2 mb-3'>
              <span className='text-base leading-none'>
                {STATUS_ICONS[key] ?? '•'}
              </span>
              <span
                className='text-xs font-semibold uppercase tracking-wider truncate'
                style={{ color: isActive ? accentColor : colors.textMuted }}
              >
                {label}
              </span>
            </div>

            <span
              className='text-4xl font-extrabold leading-none tabular-nums mb-2'
              style={{ color: isActive ? accentColor : colors.textPrimary }}
            >
              {value}
            </span>

            {pct !== null ? (
              <div className='mt-auto pt-2'>
                <div
                  className='w-full rounded-full h-1.5 overflow-hidden'
                  style={{ background: colors.bgSubtle }}
                >
                  <div
                    className='h-full rounded-full transition-all duration-500'
                    style={{
                      width: `${pct}%`,
                      background: accentColor,
                      opacity: 0.85,
                    }}
                  />
                </div>
                <span
                  className='text-xs mt-1 block'
                  style={{ color: colors.textMuted }}
                >
                  {pct.toFixed(1)}% of total
                </span>
              </div>
            ) : (
              <span
                className='text-xs mt-auto pt-2'
                style={{ color: colors.textMuted }}
              >
                All registered
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
