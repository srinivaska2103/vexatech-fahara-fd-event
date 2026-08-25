import { useStaffPerformance } from '@/hooks/staff/useStaffQueries';
import { Award, TrendingUp, Star, CheckCircle2, Loader2 } from 'lucide-react';

export default function PerformanceCard({ staff }) {
  const { data: performance, isLoading } = useStaffPerformance(staff?.id);

  if (!staff) return null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text">Performance Dashboard</h3>
          <p className="text-xs text-text/50">Metrics and event completion stats</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8 text-text/50">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : performance ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-2 text-text/60">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Events Done</span>
            </div>
            <div className="text-2xl font-bold text-text">{performance.completedEvents || 0}</div>
          </div>
          
          <div className="bg-background p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-2 text-text/60">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold uppercase">Avg Rating</span>
            </div>
            <div className="text-2xl font-bold text-text">{performance.averageRating || 'N/A'}</div>
          </div>
          
          <div className="bg-background p-4 rounded-xl border border-border col-span-2">
            <div className="flex items-center gap-2 mb-2 text-text/60">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase">Completion Rate</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${performance.completionRate || 0}%` }}
                ></div>
              </div>
              <div className="text-sm font-bold text-text">{performance.completionRate || 0}%</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-background border border-border border-dashed rounded-xl text-text/50">
          <p className="text-sm font-semibold">No performance data available yet.</p>
        </div>
      )}
    </div>
  );
}
