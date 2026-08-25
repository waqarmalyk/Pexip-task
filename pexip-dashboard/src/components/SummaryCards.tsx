import type { Summary } from '../types';

interface SummaryCardsProps {
  summary: Summary;
  activeStatus: string;
  onFilterStatus: (s: string) => void;
}

const CARDS = [
  { key: 'total', label: 'Total Devices', accentColor: '#2ea8e0' },
  { key: 'online', label: 'Online', accentColor: '#3fb950' },
  { key: 'inMeeting', label: 'In Meeting', accentColor: '#d29922' },
  { key: 'offline', label: 'Offline', accentColor: '#f85149' },
  { key: 'deactivated', label: 'Deactivated', accentColor: '#6e7681' },
] as const;

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
              borderColor: isActive ? accentColor : '#30363d',
              borderTopColor: accentColor,
              borderTopWidth: 3,
            }}
            className='relative flex flex-col gap-2 text-left px-5 py-5 rounded-xl border bg-[#161b22] hover:-translate-y-0.5 transition-transform cursor-pointer'
          >
            <span className='text-xs font-semibold uppercase tracking-wide text-[#7d8590]'>
              {label}
            </span>
            <span
              className='text-3xl font-bold leading-none'
              style={{ color: accentColor }}
            >
              {value}
            </span>
            {pct && (
              <span className='text-xs text-[#7d8590]'>{pct} of total</span>
            )}
            {key === 'total' && (
              <span className='text-xs text-[#7d8590]'>All registered</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
