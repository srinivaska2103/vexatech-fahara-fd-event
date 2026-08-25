import { Crown } from 'lucide-react';

export default function VIPBadge({ isVip }) {
  if (!isVip) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
      <Crown className="w-3 h-3" />
      VIP
    </span>
  );
}
