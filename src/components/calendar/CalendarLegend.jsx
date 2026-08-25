export default function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-text/60 p-4 border-t border-border mt-auto">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-primary"></div>
        <span>Confirmed</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-accent"></div>
        <span>Pending</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <span>Cancelled</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <span>Completed</span>
      </div>
    </div>
  );
}
