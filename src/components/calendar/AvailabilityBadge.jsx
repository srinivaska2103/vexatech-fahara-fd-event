import { Clock, Briefcase, Calendar as CalendarIcon, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function AvailabilityBadge({ status }) {
  const getBadgeConfig = () => {
    switch (status?.toLowerCase()) {
      case 'available':
        return { icon: CheckCircle2, colors: 'bg-green-100 text-green-700 border-green-200' };
      case 'busy':
        return { icon: Briefcase, colors: 'bg-orange-100 text-orange-700 border-orange-200' };
      case 'leave':
      case 'holiday':
        return { icon: CalendarIcon, colors: 'bg-purple-100 text-purple-700 border-purple-200' };
      case 'unavailable':
      default:
        return { icon: XCircle, colors: 'bg-red-100 text-red-700 border-red-200' };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${config.colors}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="capitalize">{status || 'Unknown'}</span>
    </span>
  );
}
