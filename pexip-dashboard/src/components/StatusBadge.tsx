import type { DeviceStatus } from '../types';
import { STATUS_META } from '../utils';

interface StatusBadgeProps {
  status: DeviceStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const meta = STATUS_META[status];
  return (
    <span
      className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold'
      style={{ background: meta.bg, color: meta.color }}
    >
      <span
        className='w-1.5 h-1.5 rounded-full'
        style={{ background: meta.dot }}
      />
      {meta.label}
    </span>
  );
}
