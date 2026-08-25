import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { HistoryEntry } from '../types';

interface StatusHistoryChartProps {
  history: HistoryEntry[];
}

const LINES = [
  { key: 'online', label: 'Online', color: '#3fb950' },
  { key: 'inMeeting', label: 'In Meeting', color: '#d29922' },
  { key: 'offline', label: 'Offline', color: '#f85149' },
  { key: 'deactivated', label: 'Deactivated', color: '#6e7681' },
] as const;

interface TooltipPayloadItem {
  dataKey: string;
  name: string;
  value: number;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

type RangeFilter = 'daily' | 'monthly' | 'all';

const RANGE_OPTIONS: { key: RangeFilter; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'all', label: 'All Time' },
];

const RANGE_META: Record<
  RangeFilter,
  { sliceCount: number | null; tickEvery: number; subtitle: string }
> = {
  daily: {
    sliceCount: 30,
    tickEvery: 5,
    subtitle: 'Last 30 months · recent view',
  },
  monthly: { sliceCount: 12, tickEvery: 1, subtitle: 'Last 12 months' },
  all: {
    sliceCount: null,
    tickEvery: 6,
    subtitle: 'All time · Jan 2021 – Aug 2025',
  },
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className='bg-[#1c2128] border border-[#30363d] rounded-lg p-3 text-xs shadow-xl'>
      <p className='font-semibold text-[#e6edf3] mb-2'>{label}</p>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          className='flex items-center justify-between gap-6'
        >
          <span className='flex items-center gap-1.5'>
            <span
              className='w-2 h-2 rounded-full'
              style={{ background: p.color }}
            />
            <span className='text-[#7d8590]'>{p.name}</span>
          </span>
          <span className='font-semibold' style={{ color: p.color }}>
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function StatusHistoryChart({
  history,
}: StatusHistoryChartProps) {
  const [range, setRange] = useState<RangeFilter>('all');

  const meta = RANGE_META[range];

  const filteredHistory = useMemo(() => {
    if (!meta.sliceCount) return history;
    return history.slice(-meta.sliceCount);
  }, [history, meta.sliceCount]);

  const tickFormatter = (val: string, idx: number) =>
    idx % meta.tickEvery === 0 ? val : '';

  return (
    <div className='bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden mb-8'>
      <div className='px-5 py-4 border-b border-[#30363d] flex items-start justify-between gap-4 flex-wrap'>
        <div>
          <h2 className='text-sm font-semibold text-[#e6edf3]'>
            Device Status Over Time
          </h2>
          <p className='text-xs text-[#7d8590] mt-0.5'>{meta.subtitle}</p>
        </div>
        <div className='flex items-center gap-1 bg-[#1c2128] border border-[#30363d] rounded-lg p-1'>
          {RANGE_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                range === key
                  ? 'bg-[#2ea8e0] text-white shadow'
                  : 'text-[#7d8590] hover:text-[#e6edf3]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className='px-4 py-5' style={{ height: 280 }}>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={filteredHistory}
            margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#21262d' />
            <XAxis
              dataKey='period'
              tick={{ fill: '#7d8590', fontSize: 11 }}
              tickFormatter={tickFormatter}
              axisLine={{ stroke: '#30363d' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#7d8590', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#7d8590', paddingTop: 8 }}
              iconType='circle'
              iconSize={8}
            />
            {LINES.map((line) => (
              <Line
                key={line.key}
                type='monotone'
                dataKey={line.key}
                name={line.label}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
