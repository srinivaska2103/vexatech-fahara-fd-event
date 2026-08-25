import { AlertTriangle, AlertCircle } from 'lucide-react';

export default function ConflictAlert({ type, message, actionText, onAction }) {
  const isWarning = type === 'warning';
  
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${isWarning ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
      {isWarning ? (
        <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <h4 className={`text-sm font-bold ${isWarning ? 'text-orange-800' : 'text-red-800'}`}>
          Scheduling Conflict Detected
        </h4>
        <p className={`text-xs mt-1 ${isWarning ? 'text-orange-600' : 'text-red-600'}`}>
          {message}
        </p>
        {actionText && onAction && (
          <button 
            onClick={onAction}
            className={`mt-3 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
              isWarning ? 'bg-orange-200 text-orange-800 hover:bg-orange-300' : 'bg-red-200 text-red-800 hover:bg-red-300'
            }`}
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
}
