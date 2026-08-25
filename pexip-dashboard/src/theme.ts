// ── Design Token / Theme ─────────────────────────────────────────────────────
// Change colours here and they will update everywhere in the app.

export const colors = {
  // ── Backgrounds
  bgBase: '#0d1117', // page background
  bgSurface: '#161b22', // cards, modals, panels
  bgElevated: '#1c2128', // inputs, table header, tabs
  bgSubtle: '#21262d', // grid lines, row dividers

  // ── Borders
  border: '#30363d', // default border

  // ── Text
  textPrimary: '#e6edf3', // headings, values
  textMuted: '#7d8590', // labels, placeholders, secondary text

  // ── Accent / Brand
  accent: '#2ea8e0', // buttons, active states, focus rings
  accentHover: '#1b8fc4', // accent hover

  // ── Status: Online
  online: '#3fb950',
  onlineBg: 'rgba(63,185,80,.12)',

  // ── Status: In Meeting
  inMeeting: '#d29922',
  inMeetingBg: 'rgba(210,153,34,.12)',

  // ── Status: Offline / Danger
  offline: '#f85149',
  offlineBg: 'rgba(248,81,73,.12)',
  offlineBgFaint: 'rgba(248,81,73,.10)',
  offlineLight: '#ffb3ad',

  // ── Status: Deactivated
  deactivated: '#6e7681',
  deactivatedBg: 'rgba(110,118,129,.12)',

  // ── Overlay
  overlay: 'rgba(0,0,0,0.7)',
} as const;

export type Colors = typeof colors;
