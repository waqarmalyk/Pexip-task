import { useState } from 'react';
import { X } from 'lucide-react';
import type { AddDeviceFormData } from '../types';
import { STATUS_META, STATUSES } from '../utils';
import { colors } from '../theme';

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
      style={{ background: colors.overlay }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className='rounded-xl w-full max-w-md shadow-2xl'
        style={{
          background: colors.bgSurface,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          className='flex items-center justify-between px-6 py-4'
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <h3
            className='text-sm font-semibold'
            style={{ color: colors.textPrimary }}
          >
            Add New Device
          </h3>
          <button
            onClick={onClose}
            className='p-1 rounded-md transition-colors'
            style={{ color: colors.textMuted }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                colors.textPrimary;
              (e.currentTarget as HTMLButtonElement).style.background =
                colors.bgElevated;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                colors.textMuted;
              (e.currentTarget as HTMLButtonElement).style.background =
                'transparent';
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='px-6 py-5 flex flex-col gap-5'>
          <div className='flex flex-col gap-1.5'>
            <label
              className='text-xs font-semibold uppercase tracking-wide'
              style={{ color: colors.textMuted }}
            >
              Name <span style={{ color: colors.offline }}>*</span>
            </label>
            <input
              type='text'
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder='e.g. London - Boardroom 1'
              className='rounded-lg px-3 py-2.5 text-sm outline-none transition-colors'
              style={{
                background: colors.bgElevated,
                border: `1px solid ${errors.name ? colors.offline : colors.border}`,
                color: colors.textPrimary,
              }}
            />
            {errors.name && (
              <span className='text-xs' style={{ color: colors.offline }}>
                {errors.name}
              </span>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <label
              className='text-xs font-semibold uppercase tracking-wide'
              style={{ color: colors.textMuted }}
            ></label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder='Optional description…'
              rows={3}
              className='rounded-lg px-3 py-2.5 text-sm outline-none resize-none transition-colors'
              style={{
                background: colors.bgElevated,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
              }}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label
              className='text-xs font-semibold uppercase tracking-wide'
              style={{ color: colors.textMuted }}
            ></label>
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
                      borderColor: active ? meta.color : colors.border,
                      background: active ? meta.bg : colors.bgElevated,
                    }}
                    className='flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-all'
                  >
                    <span
                      className='w-2 h-2 rounded-full'
                      style={{ background: meta.dot }}
                    />
                    <span
                      style={{ color: active ? meta.color : colors.textMuted }}
                    >
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
              className='flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors'
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.textMuted,
              }}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors'
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
              Save Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
