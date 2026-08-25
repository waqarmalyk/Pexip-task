export type DeviceStatus = 'online' | 'inMeeting' | 'offline' | 'deactivated';

export interface Device {
  id: string;
  name: string;
  model: string;
  description: string;
  status: DeviceStatus;
}

export interface Summary {
  total: number;
  online: number;
  inMeeting: number;
  offline: number;
  deactivated: number;
}

export interface HistoryEntry {
  period: string;
  online: number;
  inMeeting: number;
  offline: number;
  deactivated: number;
}

export interface AddDeviceFormData {
  name: string;
  description: string;
  status: DeviceStatus;
}
