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
import { LINES, RANGE_META, RANGE_OPTIONS } from '../utils';
import type { RangeFilter } from '../utils';
import { colors } from '../theme';

interface StatusHistoryChartProps {
  history: HistoryEntry[];
  total: number;
}

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

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className='rounded-lg p-3 text-xs shadow-xl'
      style={{
        background: colors.bgElevated,
        border: `1px solid ${colors.border}`,
      }}
    >
      <p className='font-semibold mb-2' style={{ color: colors.textPrimary }}>
        {label}
      </p>
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
            <span style={{ color: colors.textMuted }}>{p.name}</span>
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
  total,
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
    <div
      className='rounded-xl overflow-hidden h-full'
      style={{
        background: colors.bgSurface,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div
        className='px-5 py-4 flex items-start justify-between gap-4 flex-wrap'
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <div>
          <h2
            className='text-sm font-semibold'
            style={{ color: colors.textPrimary }}
          >
            Device Status Over Time
          </h2>
          <p className='text-xs mt-0.5' style={{ color: colors.textMuted }}>
            {meta.subtitle}
          </p>
        </div>
        <div
          className='flex items-center gap-1 rounded-lg p-1'
          style={{
            background: colors.bgElevated,
            border: `1px solid ${colors.border}`,
          }}
        >
          {RANGE_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                range === key ? 'text-white shadow' : ''
              }`}
              style={
                range === key
                  ? { background: colors.accent }
                  : { color: colors.textMuted }
              }
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
            <CartesianGrid strokeDasharray='3 3' stroke={colors.bgSubtle} />
            <XAxis
              dataKey='period'
              tick={{ fill: colors.textMuted, fontSize: 11 }}
              tickFormatter={tickFormatter}
              axisLine={{ stroke: colors.border }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: colors.textMuted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
              domain={[0, total > 0 ? total : 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: 12,
                color: colors.textMuted,
                paddingTop: 8,
              }}
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
