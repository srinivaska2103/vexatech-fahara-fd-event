'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Calendar as CalendarIcon, 
  AlertTriangle, 
  Loader2, 
  ShieldAlert, 
  Building2, 
  Package, 
  FileText, 
  Repeat, 
  Check, 
  Trash2 
} from 'lucide-react';
import { useCalendarStore } from '@/store/useCalendarStore';
import { useCreateBlockMutation, useUpdateBlockMutation, useDeleteBlockMutation } from '@/hooks/calendar/useCalendarMutations';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import CustomSelect from '@/components/ui/CustomSelect';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomTimePicker from '@/components/ui/CustomTimePicker';

const REASON_OPTIONS = [
  { value: 'PRIVATE_EVENT', label: 'Private Event (Birthday, Wedding, Corporate)' },
  { value: 'PERSONAL_BOOKING', label: 'Personal Booking / Vacation' },
  { value: 'HOLIDAY', label: 'Public Holiday / Festival' },
  { value: 'EQUIPMENT_SETUP', label: 'Equipment Setup & Sound Check' },
  { value: 'MAINTENANCE', label: 'Maintenance & Service Inspection' },
  { value: 'UNAVAILABLE', label: 'Unavailable / Off Duty' },
  { value: 'OTHER', label: 'Other' },
];

export default function AvailabilityBlockModal({ services = [], venues = [] }) {
  const { isBlockModalOpen, editingBlock, defaultBlockDate, closeBlockModal } = useCalendarStore();

  const createMutation = useCreateBlockMutation();
  const updateMutation = useUpdateBlockMutation();
  const deleteMutation = useDeleteBlockMutation();

  const isEditing = Boolean(editingBlock);

  // Form states
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('PRIVATE_EVENT');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('18:00');
  const [isAllDay, setIsAllDay] = useState(false);
  const [serviceId, setServiceId] = useState('');
  const [venueId, setVenueId] = useState('');
  const [bufferMinutes, setBufferMinutes] = useState(0);
  const [maxConcurrentEvents, setMaxConcurrentEvents] = useState(1);
  const [recurrence, setRecurrence] = useState('NONE');
  const [notes, setNotes] = useState('');
  const [allowOverlap, setAllowOverlap] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Pre-fill form when editing or opening
  useEffect(() => {
    if (editingBlock) {
      setTitle(editingBlock.title || '');
      setReason(editingBlock.reason || 'UNAVAILABLE');
      const start = new Date(editingBlock.start_at || editingBlock.startAt);
      const end = new Date(editingBlock.end_at || editingBlock.endAt);
      setStartDate(format(start, 'yyyy-MM-dd'));
      setStartTime(format(start, 'HH:mm'));
      setEndDate(format(end, 'yyyy-MM-dd'));
      setEndTime(format(end, 'HH:mm'));
      setIsAllDay(Boolean(editingBlock.is_all_day));
      setServiceId(editingBlock.service_id || '');
      setVenueId(editingBlock.venue_id || '');
      setBufferMinutes(editingBlock.buffer_minutes || 0);
      setMaxConcurrentEvents(editingBlock.max_concurrent_events || 1);
      setRecurrence(editingBlock.recurrence || 'NONE');
      setNotes(editingBlock.notes || '');
      setAllowOverlap(false);
    } else {
      const baseDate = defaultBlockDate || new Date();
      const dateStr = format(baseDate, 'yyyy-MM-dd');
      setTitle('');
      setReason('PRIVATE_EVENT');
      setStartDate(dateStr);
      setStartTime('09:00');
      setEndDate(dateStr);
      setEndTime('18:00');
      setIsAllDay(false);
      setServiceId('');
      setVenueId('');
      setBufferMinutes(0);
      setMaxConcurrentEvents(1);
      setRecurrence('NONE');
      setNotes('');
      setAllowOverlap(false);
    }
    setConfirmDelete(false);
    setValidationError('');
  }, [editingBlock, defaultBlockDate, isBlockModalOpen]);

  if (!isBlockModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Please enter a title for this availability block');
      return;
    }

    if (!startDate || !endDate) {
      setValidationError('Start date and end date are required');
      return;
    }

    let startIso;
    let endIso;

    if (isAllDay) {
      // Use local date start to local date end in ISO
      const sDateObj = new Date(`${startDate}T00:00:00`);
      const eDateObj = new Date(`${endDate}T23:59:59.999`);
      startIso = sDateObj.toISOString();
      endIso = eDateObj.toISOString();
    } else {
      startIso = new Date(`${startDate}T${startTime}:00`).toISOString();
      endIso = new Date(`${endDate}T${endTime}:00`).toISOString();
    }

    if (new Date(endIso) <= new Date(startIso)) {
      setValidationError('End date/time must be strictly after start date/time');
      return;
    }

    const payload = {
      title: title.trim(),
      reason,
      startAt: startIso,
      endAt: endIso,
      isAllDay,
      serviceId: serviceId || null,
      venueId: venueId || null,
      bufferMinutes: parseInt(bufferMinutes, 10) || 0,
      maxConcurrentEvents: parseInt(maxConcurrentEvents, 10) || 1,
      recurrence,
      notes: notes.trim() || null,
      allowOverlap
    };

    if (isEditing) {
      closeBlockModal();
      updateMutation.mutate(
        { blockId: editingBlock.id, blockData: payload },
        {
          onError: (err) => {
            // Reopen if there's an error so user can adjust
            toast.error(err.response?.data?.message || 'Failed to update block');
          }
        }
      );
    } else {
      closeBlockModal();
      createMutation.mutate(payload, {
        onError: (err) => {
          toast.error(err.response?.data?.message || 'Failed to create block');
        }
      });
    }
  };

  const handleDelete = () => {
    if (!editingBlock) return;
    deleteMutation.mutate(editingBlock.id, {
      onSuccess: () => closeBlockModal()
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E8DED5] rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#E8DED5] bg-[#FFF8F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#2C1810]">
                {isEditing ? 'Edit Availability Block' : 'Add Availability Block'}
              </h3>
              <p className="text-xs text-[#8C6D58] font-semibold">
                Configure manager schedules, buffers, and blocked periods.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeBlockModal}
            className="w-9 h-9 rounded-xl text-[#8C6D58] hover:text-[#2C1810] hover:bg-[#E8DED5]/40 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {validationError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-black text-[#2C1810] mb-1.5 uppercase tracking-wider">
              Block Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wedding Event Hall Reservation, Equipment Maintenance"
              className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl px-4 py-2.5 text-xs font-bold text-[#2C1810] placeholder:text-[#8C6D58]/40 focus:border-[#6F4E37] focus:outline-none transition-colors"
            />
          </div>

          {/* Block Reason & Recurrence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-black text-[#2C1810] mb-1.5 uppercase tracking-wider">
                Reason
              </label>
              <CustomSelect
                value={reason}
                onChange={setReason}
                options={REASON_OPTIONS}
                icon={ShieldAlert}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#2C1810] mb-1.5 uppercase tracking-wider">
                Recurrence
              </label>
              <CustomSelect
                value={recurrence}
                onChange={setRecurrence}
                options={[
                  { value: 'NONE', label: 'Does not repeat' },
                  { value: 'DAILY', label: 'Daily (Every day)' },
                  { value: 'WEEKLY', label: 'Weekly (Every week)' }
                ]}
                icon={Repeat}
              />
            </div>
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#FFF8F0]/70 border border-[#E8DED5] rounded-2xl">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#6F4E37]" />
              <span className="text-xs font-black text-[#2C1810]">All-Day Event / Full Day Block</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAllDay(!isAllDay)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                isAllDay ? 'bg-[#6F4E37]' : 'bg-[#E8DED5]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isAllDay ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Start and End Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-black text-[#2C1810] mb-1.5 uppercase tracking-wider">
                Start Date {!isAllDay && '& Time'} <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-2">
                <CustomDatePicker
                  value={startDate}
                  onChange={(d) => {
                    setStartDate(d);
                    if (endDate < d) setEndDate(d);
                  }}
                  label="Select start date"
                />
                {!isAllDay && (
                  <CustomTimePicker
                    value={startTime}
                    onChange={setStartTime}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#2C1810] mb-1.5 uppercase tracking-wider">
                End Date {!isAllDay && '& Time'} <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-2">
                <CustomDatePicker
                  value={endDate}
                  onChange={setEndDate}
                  label="Select end date"
                />
                {!isAllDay && (
                  <CustomTimePicker
                    value={endTime}
                    onChange={setEndTime}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Service & Venue Coordination Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-black text-[#2C1810] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#6F4E37]" />
                Event Package / Service
              </label>
              <CustomSelect
                value={serviceId}
                onChange={setServiceId}
                placeholder="All Services (Entire Profile Block)"
                searchable
                icon={Package}
                options={[
                  { value: '', label: 'All Services (Entire Profile Block)', sublabel: 'Blocks all manager packages & services' },
                  ...services.map((s) => ({
                    value: s.id,
                    label: s.service_name,
                    sublabel: s.category || 'Package'
                  }))
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#2C1810] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#6F4E37]" />
                Venue / Cafe Coordination
              </label>
              <CustomSelect
                value={venueId}
                onChange={setVenueId}
                placeholder="No Specific Venue (Offsite / Any)"
                searchable
                icon={Building2}
                options={[
                  { value: '', label: 'No Specific Venue (Offsite / Any)', sublabel: 'General or client-chosen location' },
                  ...venues.map((v) => ({
                    value: v.id,
                    label: v.name,
                    sublabel: v.city ? `Partner Cafe in ${v.city}` : 'Fahara Listed Partner Cafe'
                  }))
                ]}
              />
            </div>
          </div>

          {/* Buffer Minutes & Concurrent Bookings Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-black text-[#2C1810] mb-1.5 uppercase tracking-wider">
                Buffer Time (Minutes)
              </label>
              <input
                type="number"
                min="0"
                max="720"
                step="15"
                value={bufferMinutes}
                onChange={(e) => setBufferMinutes(e.target.value)}
                placeholder="0"
                className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl px-4 py-2 text-xs font-bold text-[#2C1810] focus:border-[#6F4E37] focus:outline-none"
              />
              <span className="text-[10px] text-[#8C6D58] font-semibold mt-1 block">
                Cleanup & prep buffer before and after events
              </span>
            </div>

            <div>
              <label className="block text-xs font-black text-[#2C1810] mb-1.5 uppercase tracking-wider">
                Simultaneous Events Capacity
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={maxConcurrentEvents}
                onChange={(e) => setMaxConcurrentEvents(e.target.value)}
                placeholder="1"
                className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl px-4 py-2 text-xs font-bold text-[#2C1810] focus:border-[#6F4E37] focus:outline-none"
              />
              <span className="text-[10px] text-[#8C6D58] font-semibold mt-1 block">
                Max concurrent bookings handled at once
              </span>
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-xs font-black text-[#2C1810] mb-1.5 uppercase tracking-wider">
              Internal Notes (Kept Private)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Private details, client requirements, vendor contacts..."
              className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl px-4 py-2.5 text-xs font-bold text-[#2C1810] placeholder:text-[#8C6D58]/40 focus:border-[#6F4E37] focus:outline-none resize-none transition-colors"
            />
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-3 border-t border-[#E8DED5] flex items-center justify-between gap-3">
            {isEditing ? (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-2xl transition-all shadow-xs"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-2 text-xs font-bold text-[#8C6D58] hover:text-[#2C1810]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-black rounded-2xl transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Block
                </button>
              )
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={closeBlockModal}
                disabled={isPending}
                className="px-4 py-2 text-xs font-black text-[#8C6D58] hover:text-[#2C1810] rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 bg-[#6F4E37] hover:bg-[#2C1810] text-white text-xs font-black rounded-2xl transition-all shadow-xs flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Create Block'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
