import type { DeviceStatus } from './types';

// ── Status metadata ────────────────────────────────────────────────────────────

export const STATUS_META: Record<
  DeviceStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  online: {
    label: 'Online',
    color: '#3fb950',
    bg: 'rgba(63,185,80,.12)',
    dot: '#3fb950',
  },
  inMeeting: {
    label: 'In Meeting',
    color: '#d29922',
    bg: 'rgba(210,153,34,.12)',
    dot: '#d29922',
  },
  offline: {
    label: 'Offline',
    color: '#f85149',
    bg: 'rgba(248,81,73,.12)',
    dot: '#f85149',
  },
  deactivated: {
    label: 'Deactivated',
    color: '#6e7681',
    bg: 'rgba(110,118,129,.12)',
    dot: '#6e7681',
  },
};

// ── Device statuses list ───────────────────────────────────────────────────────

export const STATUSES: DeviceStatus[] = [
  'online',
  'inMeeting',
  'offline',
  'deactivated',
];

// ── Summary cards ──────────────────────────────────────────────────────────────

export const CARDS = [
  { key: 'total', label: 'Total Devices', accentColor: '#2ea8e0' },
  { key: 'online', label: 'Online', accentColor: '#3fb950' },
  { key: 'inMeeting', label: 'In Meeting', accentColor: '#d29922' },
  { key: 'offline', label: 'Offline', accentColor: '#f85149' },
  { key: 'deactivated', label: 'Deactivated', accentColor: '#6e7681' },
] as const;

// ── Chart lines ────────────────────────────────────────────────────────────────

export const LINES = [
  { key: 'online', label: 'Online', color: '#3fb950' },
  { key: 'inMeeting', label: 'In Meeting', color: '#d29922' },
  { key: 'offline', label: 'Offline', color: '#f85149' },
  { key: 'deactivated', label: 'Deactivated', color: '#6e7681' },
] as const;

// ── Chart range options & meta ─────────────────────────────────────────────────

export type RangeFilter = 'daily' | 'monthly' | 'all';

export const RANGE_OPTIONS: { key: RangeFilter; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'all', label: 'All Time' },
];

export const RANGE_META: Record<
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
