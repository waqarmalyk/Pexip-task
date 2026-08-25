import { useState, useEffect, useCallback } from 'react';
import type {
  Device,
  DeviceStatus,
  Summary,
  HistoryEntry,
  AddDeviceFormData,
} from './types';

let nextId = 434;

function computeSummary(devices: Device[]): Summary {
  const s: Summary = {
    total: 0,
    online: 0,
    inMeeting: 0,
    offline: 0,
    deactivated: 0,
  };
  for (const d of devices) {
    s.total++;
    s[d.status]++;
  }
  return s;
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/devices.json').then((r) => r.json() as Promise<Device[]>),
      fetch('/status-history.json').then(
        (r) => r.json() as Promise<HistoryEntry[]>,
      ),
    ])
      .then(([devs, hist]) => {
        setDevices(devs);
        setHistory(hist);
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  const addDevice = useCallback((data: AddDeviceFormData) => {
    const newDevice: Device = {
      id: `dev-${String(nextId++).padStart(3, '0')}`,
      name: data.name,
      model: 'Custom',
      description: data.description,
      status: data.status,
    };
    setDevices((prev) => [newDevice, ...prev]);
  }, []);

  const removeDevice = useCallback((id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const updateDevice = useCallback(
    (
      id: string,
      patch: Partial<Pick<Device, 'name' | 'description' | 'status'>>,
    ) => {
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...patch } : d)),
      );
    },
    [],
  );

  const summary = computeSummary(devices);

  return {
    devices,
    history,
    summary,
    loading,
    error,
    addDevice,
    removeDevice,
    updateDevice,
  };
}

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
