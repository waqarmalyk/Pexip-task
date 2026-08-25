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
        <ChevronUp size={13} className='text-[#2ea8e0]' />
      ) : (
        <ChevronDown size={13} className='text-[#2ea8e0]' />
      )
    ) : (
      <ChevronsUpDown size={13} className='text-[#7d8590]' />
    );

  return (
    <div className='bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden'>
      <div className='flex items-center justify-between px-5 py-4 border-b border-[#30363d]'>
        <div>
          <h2 className='text-sm font-semibold text-[#e6edf3]'>All Devices</h2>
          <p className='text-xs text-[#7d8590] mt-0.5'>
            {filtered.length} of {devices.length} devices
          </p>
        </div>
        <button
          onClick={onOpenAdd}
          className='flex items-center gap-2 bg-[#2ea8e0] hover:bg-[#1b8fc4] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors'
        >
          <PlusCircle size={14} />
          Add Device
        </button>
      </div>

      <div className='px-5 py-3 border-b border-[#30363d]'>
        <div className='relative max-w-sm'>
          <Search
            size={13}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8590]'
          />
          <input
            type='search'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder='Search by name, model or ID…'
            className='w-full bg-[#1c2128] border border-[#30363d] rounded-lg pl-8 pr-4 py-2 text-xs text-[#e6edf3] placeholder-[#7d8590] outline-none focus:border-[#2ea8e0]'
          />
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-[#1c2128] text-xs text-[#7d8590] font-semibold uppercase tracking-wide'>
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
                  className='text-left px-4 py-3 cursor-pointer hover:text-[#e6edf3] select-none whitespace-nowrap'
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
                  className='text-center py-16 text-[#7d8590] text-sm'
                >
                  No devices match your filters.
                </td>
              </tr>
            ) : (
              paged.map((device) => (
                <tr
                  key={device.id}
                  className='border-t border-[#21262d] hover:bg-[#1c2128] transition-colors group'
                >
                  <td className='px-4 py-3 font-mono text-xs text-[#7d8590]'>
                    {device.id}
                  </td>
                  <td className='px-4 py-3 font-medium text-[#e6edf3] whitespace-nowrap'>
                    {device.name}
                  </td>
                  <td className='px-4 py-3 text-[#7d8590] whitespace-nowrap'>
                    {device.model}
                  </td>
                  <td className='px-4 py-3'>
                    <StatusBadge status={device.status} />
                  </td>
                  <td className='px-4 py-3 text-xs text-[#7d8590] max-w-xs truncate'>
                    {device.description}
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <button
                      onClick={() => onRemove(device.id)}
                      className='opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-[#7d8590] hover:text-[#f85149] hover:bg-[rgba(248,81,73,.1)] transition-all'
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
        <div className='flex items-center justify-between px-5 py-3 border-t border-[#30363d] text-xs text-[#7d8590]'>
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className='flex gap-1.5'>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className='px-3 py-1.5 rounded-md bg-[#1c2128] border border-[#30363d] disabled:opacity-30 hover:border-[#2ea8e0] hover:text-[#2ea8e0] transition-colors'
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
                  className={`px-3 py-1.5 rounded-md border transition-colors ${
                    p === page
                      ? 'bg-[#2ea8e0] border-[#2ea8e0] text-white'
                      : 'bg-[#1c2128] border-[#30363d] hover:border-[#2ea8e0] hover:text-[#2ea8e0]'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className='px-3 py-1.5 rounded-md bg-[#1c2128] border border-[#30363d] disabled:opacity-30 hover:border-[#2ea8e0] hover:text-[#2ea8e0] transition-colors'
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
