import { ShieldAlert, Phone } from 'lucide-react';

export default function EmergencyContactCard({ staff }) {
  if (!staff) return null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text">Emergency Contact</h3>
          <p className="text-xs text-text/50">Contact info in case of emergency</p>
        </div>
      </div>

      <div className="bg-red-50/50 p-4 rounded-xl border border-red-100">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Primary Contact</span>
          <div className="flex items-center gap-2 text-sm font-semibold text-red-900 mt-2">
            <Phone className="w-4 h-4" />
            {staff.emergencyContact || 'No emergency contact provided'}
          </div>
        </div>
      </div>
    </div>
  );
}
