import { useState } from 'react';
import { X } from 'lucide-react';
import type { AddDeviceFormData } from '../types';
import { STATUS_META, STATUSES } from '../utils';

interface AddDeviceModalProps {
  onAdd: (data: AddDeviceFormData) => void;
  onClose: () => void;
}

export default function AddDeviceModal({
  onAdd,
  onClose,
}: AddDeviceModalProps) {
  const [form, setForm] = useState<AddDeviceFormData>({
    name: '',
    description: '',
    status: 'online',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof AddDeviceFormData, string>>
  >({});

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd(form);
    onClose();
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className='bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-md shadow-2xl'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-[#30363d]'>
          <h3 className='text-sm font-semibold text-[#e6edf3]'>
            Add New Device
          </h3>
          <button
            onClick={onClose}
            className='p-1 rounded-md text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#1c2128] transition-colors'
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='px-6 py-5 flex flex-col gap-5'>
          <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-semibold text-[#7d8590] uppercase tracking-wide'>
              Name <span className='text-[#f85149]'>*</span>
            </label>
            <input
              type='text'
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder='e.g. London - Boardroom 1'
              className={`bg-[#1c2128] border rounded-lg px-3 py-2.5 text-sm text-[#e6edf3] placeholder-[#7d8590] outline-none transition-colors ${
                errors.name
                  ? 'border-[#f85149]'
                  : 'border-[#30363d] focus:border-[#2ea8e0]'
              }`}
            />
            {errors.name && (
              <span className='text-xs text-[#f85149]'>{errors.name}</span>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-semibold text-[#7d8590] uppercase tracking-wide'>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder='Optional description…'
              rows={3}
              className='bg-[#1c2128] border border-[#30363d] focus:border-[#2ea8e0] rounded-lg px-3 py-2.5 text-sm text-[#e6edf3] placeholder-[#7d8590] outline-none resize-none transition-colors'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-xs font-semibold text-[#7d8590] uppercase tracking-wide'>
              Status
            </label>
            <div className='grid grid-cols-2 gap-2'>
              {STATUSES.map((s) => {
                const meta = STATUS_META[s];
                const active = form.status === s;
                return (
                  <button
                    key={s}
                    type='button'
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    style={{
                      borderColor: active ? meta.color : '#30363d',
                      background: active ? meta.bg : '#1c2128',
                    }}
                    className='flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-all'
                  >
                    <span
                      className='w-2 h-2 rounded-full'
                      style={{ background: meta.dot }}
                    />
                    <span style={{ color: active ? meta.color : '#7d8590' }}>
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className='flex gap-3 pt-1'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2.5 rounded-lg border border-[#30363d] text-sm text-[#7d8590] hover:text-[#e6edf3] hover:border-[#7d8590] transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='flex-1 px-4 py-2.5 rounded-lg bg-[#2ea8e0] hover:bg-[#1b8fc4] text-white text-sm font-semibold transition-colors'
            >
              Save Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
