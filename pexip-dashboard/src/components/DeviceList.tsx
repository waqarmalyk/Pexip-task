import { useState } from 'react';
import { Trash2, PlusCircle, Search } from 'lucide-react';
import type { Device } from '../types';
import StatusBadge from './StatusBadge';
import { colors } from '../theme';

interface DeviceListProps {
  devices: Device[];
  onRemove: (id: string) => void;
  onOpenAdd: () => void;
}

export default function DeviceList({
  devices,
  onRemove,
  onOpenAdd,
}: DeviceListProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const filtered = search.trim()
    ? devices.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    : devices;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  // Always clamp to a valid page so stale page state never shows too few / zero rows
  const currentPage = Math.min(Math.max(1, page), Math.max(1, totalPages));
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div
      className='rounded-xl overflow-hidden'
      style={{
        background: colors.bgSurface,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div
        className='flex items-center justify-between px-5 py-4'
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <div>
          <h2
            className='text-sm font-semibold'
            style={{ color: colors.textPrimary }}
          >
            All Devices
          </h2>
          <p className='text-xs mt-0.5' style={{ color: colors.textMuted }}>
            {search.trim()
              ? `${filtered.length} of ${devices.length} devices`
              : `${devices.length} devices`}
          </p>
        </div>
        <button
          onClick={onOpenAdd}
          className='flex items-center gap-2 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors'
          style={{ background: colors.accent }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              colors.accentHover;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              colors.accent;
          }}
        >
          <PlusCircle size={14} />
          Add Device
        </button>
      </div>

      <div
        className='px-5 py-3'
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <div className='relative max-w-sm'>
          <Search
            size={13}
            className='absolute left-3 top-1/2 -translate-y-1/2'
            style={{ color: colors.textMuted }}
          />
          <input
            type='search'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder='Filter by device name…'
            className='w-full rounded-lg pl-8 pr-4 py-2 text-xs outline-none'
            style={{
              background: colors.bgElevated,
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary,
            }}
          />
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr
              className='text-xs font-semibold uppercase tracking-wide'
              style={{ background: colors.bgElevated, color: colors.textMuted }}
            >
              <th className='text-left px-4 py-3 whitespace-nowrap'>ID</th>
              <th className='text-left px-4 py-3 whitespace-nowrap'>Name</th>
              <th className='text-left px-4 py-3 whitespace-nowrap'>Model</th>
              <th className='text-left px-4 py-3 whitespace-nowrap'>Status</th>
              <th className='text-left px-4 py-3'>Description</th>
              <th className='px-4 py-3' />
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className='text-center py-16 text-sm'
                  style={{ color: colors.textMuted }}
                >
                  No devices match your filters.
                </td>
              </tr>
            ) : (
              paged.map((device) => (
                <tr
                  key={device.id}
                  className='border-t transition-colors group'
                  style={{ borderColor: colors.bgSubtle }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      colors.bgElevated;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      'transparent';
                  }}
                >
                  <td
                    className='px-4 py-3 font-mono text-xs'
                    style={{ color: colors.textMuted }}
                  >
                    {device.id}
                  </td>
                  <td
                    className='px-4 py-3 font-medium whitespace-nowrap'
                    style={{ color: colors.textPrimary }}
                  >
                    {device.name}
                  </td>
                  <td
                    className='px-4 py-3 whitespace-nowrap'
                    style={{ color: colors.textMuted }}
                  >
                    {device.model}
                  </td>
                  <td className='px-4 py-3'>
                    <StatusBadge status={device.status} />
                  </td>
                  <td
                    className='px-4 py-3 text-xs max-w-xs truncate'
                    style={{ color: colors.textMuted }}
                  >
                    {device.description}
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <button
                      onClick={() => onRemove(device.id)}
                      className='opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all'
                      style={{ color: colors.textMuted }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color =
                          colors.offline;
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = colors.offlineBgFaint;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color =
                          colors.textMuted;
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = 'transparent';
                      }}
                      title='Remove device'
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div
          className='flex items-center justify-between px-5 py-3 text-xs'
          style={{
            borderTop: `1px solid ${colors.border}`,
            color: colors.textMuted,
          }}
        >
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{' '}
            {filtered.length}
          </span>
          <div className='flex gap-1.5'>
            <button
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className='px-3 py-1.5 rounded-md disabled:opacity-30 transition-colors'
              style={{
                background: colors.bgElevated,
                border: `1px solid ${colors.border}`,
                color: colors.textMuted,
              }}
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p: number;
              if (totalPages <= 7) p = i + 1;
              else if (currentPage <= 4) p = i + 1;
              else if (currentPage >= totalPages - 3) p = totalPages - 6 + i;
              else p = currentPage - 3 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className='px-3 py-1.5 rounded-md border transition-colors'
                  style={
                    p === currentPage
                      ? {
                          background: colors.accent,
                          borderColor: colors.accent,
                          color: '#fff',
                        }
                      : {
                          background: colors.bgElevated,
                          borderColor: colors.border,
                          color: colors.textMuted,
                        }
                  }
                >
                  {p}
                </button>
              );
            })}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
              className='px-3 py-1.5 rounded-md disabled:opacity-30 transition-colors'
              style={{
                background: colors.bgElevated,
                border: `1px solid ${colors.border}`,
                color: colors.textMuted,
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
