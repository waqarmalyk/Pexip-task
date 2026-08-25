import type { DeviceStatus } from './types';
import { colors } from './theme';

// ── Status metadata

export const STATUS_META: Record<
  DeviceStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  online: {
    label: 'Online',
    color: colors.online,
    bg: colors.onlineBg,
    dot: colors.online,
  },
  inMeeting: {
    label: 'In Meeting',
    color: colors.inMeeting,
    bg: colors.inMeetingBg,
    dot: colors.inMeeting,
  },
  offline: {
    label: 'Offline',
    color: colors.offline,
    bg: colors.offlineBg,
    dot: colors.offline,
  },
  deactivated: {
    label: 'Deactivated',
    color: colors.deactivated,
    bg: colors.deactivatedBg,
    dot: colors.deactivated,
  },
};

// ── Device statuses list

export const STATUSES: DeviceStatus[] = [
  'online',
  'inMeeting',
  'offline',
  'deactivated',
];

// ── Status icons ──

export const STATUS_ICONS: Record<string, string> = {
  total: '📊',
  online: '🟢',
  inMeeting: '🎥',
  offline: '🔴',
  deactivated: '⚫',
};

// ── Summary cards ──

export const CARDS = [
  { key: 'total', label: 'Total Devices', accentColor: colors.accent },
  { key: 'online', label: 'Online', accentColor: colors.online },
  { key: 'inMeeting', label: 'In Meeting', accentColor: colors.inMeeting },
  { key: 'offline', label: 'Offline', accentColor: colors.offline },
  { key: 'deactivated', label: 'Deactivated', accentColor: colors.deactivated },
] as const;

// ── Chart lines ────

export const LINES = [
  { key: 'online', label: 'Online', color: colors.online },
  { key: 'inMeeting', label: 'In Meeting', color: colors.inMeeting },
  { key: 'offline', label: 'Offline', color: colors.offline },
  { key: 'deactivated', label: 'Deactivated', color: colors.deactivated },
] as const;

// ── Chart range options & meta

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
