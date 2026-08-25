import { Clock, CheckCircle, XCircle, AlertCircle, PlayCircle, ShieldCheck } from 'lucide-react';

export default function BookingStatusBadge({ status }) {
  const styles = {
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: Clock, label: 'Pending' },
    accepted: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: ShieldCheck, label: 'Accepted' },
    confirmed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: ShieldCheck, label: 'Confirmed' },
    assigned: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: CheckCircle, label: 'Assigned' },
    in_progress: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: PlayCircle, label: 'In Progress' },
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle, label: 'Completed' },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle, label: 'Rejected' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', icon: AlertCircle, label: 'Cancelled' },
  };

  const current = styles[status?.toLowerCase()] || styles.pending;
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} ${current.text} ${current.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {current.label}
    </span>
  );
}
