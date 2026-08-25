import { useState } from 'react';
import {
  Trash2,
  Search,
  PlusCircle,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';
import type { Device } from '../types';
import StatusBadge from './StatusBadge';
import { colors } from '../theme';

interface DeviceListProps {
  devices: Device[];
  filterStatus: string;
  onRemove: (id: string) => void;
  onOpenAdd: () => void;
}

type SortKey = 'name' | 'model' | 'status' | 'id';

export default function DeviceList({
  devices,
  filterStatus,
  onRemove,
  onOpenAdd,
}: DeviceListProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortAsc((a) => !a);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const filtered = devices
    .filter((d) => {
      if (filterStatus && d.status !== filterStatus) return false;
      if (
        search &&
        !`${d.name} ${d.model} ${d.id}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      const av = a[sortKey],
        bv = b[sortKey];
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortAsc ? (
        <ChevronUp size={13} style={{ color: colors.accent }} />
      ) : (
        <ChevronDown size={13} style={{ color: colors.accent }} />
      )
    ) : (
      <ChevronsUpDown size={13} style={{ color: colors.textMuted }} />
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
            {filtered.length} of {devices.length} devices
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
            placeholder='Search by name, model or ID…'
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
              {(
                [
                  { key: 'id', label: 'ID' },
                  { key: 'name', label: 'Name' },
                  { key: 'model', label: 'Model' },
                  { key: 'status', label: 'Status' },
                ] as { key: SortKey; label: string }[]
              ).map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className='text-left px-4 py-3 cursor-pointer select-none whitespace-nowrap hover:opacity-80'
                >
                  <span className='flex items-center gap-1'>
                    {col.label} <SortIcon col={col.key} />
                  </span>
                </th>
              ))}
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
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className='flex gap-1.5'>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
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
              else if (page <= 4) p = i + 1;
              else if (page >= totalPages - 3) p = totalPages - 6 + i;
              else p = page - 3 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className='px-3 py-1.5 rounded-md border transition-colors'
                  style={
                    p === page
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
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
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
