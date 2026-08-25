import { useMemo, useState } from 'react';
import './App.css';
import type { DeviceStatus } from './types';
import { colors } from './theme';
import { useDevices } from './hooks';
import SummaryCards from './components/SummaryCards';
import StatusHistoryChart from './components/StatusHistoryChart';
import DeviceList from './components/DeviceList';
import AddDeviceModal from './components/AddDeviceModal';

type StatusFilter = DeviceStatus | '';

export default function App() {
  const { devices, history, summary, loading, error, addDevice, removeDevice } =
    useDevices();

  const [filterStatus, setFilterStatus] = useState<StatusFilter>('');
  const [showAddModal, setShowAddModal] = useState(false);

  const visibleDevices = useMemo(() => {
    if (!filterStatus) return devices;
    return devices.filter((d) => d.status === filterStatus);
  }, [devices, filterStatus]);

  return (
    <div
      className='min-h-screen'
      style={{ background: colors.bgBase, color: colors.textPrimary }}
    >
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10'>
        <header className='mb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>
            Pexip Device Dashboard
          </h1>
          <p className='text-sm mt-2' style={{ color: colors.textMuted }}>
            Track room system status, trends, and inventory health.
          </p>
        </header>

        {error && (
          <div
            className='mb-6 rounded-lg px-4 py-3 text-sm'
            style={{
              border: `1px solid ${colors.offline}`,
              background: colors.offlineBgFaint,
              color: colors.offlineLight,
            }}
          >
            {error}
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 mb-8'>
          <SummaryCards
            summary={summary}
            activeStatus={filterStatus}
            onFilterStatus={(s) => setFilterStatus(s as StatusFilter)}
          />

          <StatusHistoryChart history={history} total={summary.total} />
        </div>

        <DeviceList
          key={filterStatus}
          devices={visibleDevices}
          onRemove={removeDevice}
          onOpenAdd={() => setShowAddModal(true)}
        />

        {loading && (
          <p className='text-xs mt-4' style={{ color: colors.textMuted }}>
            Loading data…
          </p>
        )}
      </main>

      {showAddModal && (
        <AddDeviceModal
          onAdd={addDevice}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
