"use client";
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User, CalendarDays, DollarSign, Star, Briefcase } from 'lucide-react';

const getActivityIcon = (type) => {
  switch (type) {
    case 'booking': return <CalendarDays className="w-4 h-4 text-white" />;
    case 'customer': return <User className="w-4 h-4 text-white" />;
    case 'payment': return <DollarSign className="w-4 h-4 text-white" />;
    case 'review': return <Star className="w-4 h-4 text-white" />;
    case 'staff': return <Briefcase className="w-4 h-4 text-white" />;
    default: return <User className="w-4 h-4 text-white" />;
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'booking': return 'bg-blue-500';
    case 'customer': return 'bg-teal-500';
    case 'payment': return 'bg-green-500';
    case 'review': return 'bg-yellow-500';
    case 'staff': return 'bg-indigo-500';
    default: return 'bg-gray-500';
  }
};

const ActivityCard = ({ activity, isLast }) => {
  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[19px] top-[40px] bottom-[-24px] w-0.5 bg-gray-200"></div>
      )}
      
      {/* Icon */}
      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm border-2 border-white ${getActivityColor(activity.type)}`}>
        {getActivityIcon(activity.type)}
      </div>
      
      {/* Content */}
      <div className="flex-1 bg-white p-4 rounded-xl border border-border shadow-sm mb-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          {activity.title ? (
            <p className="text-sm font-bold text-gray-800">
              {activity.title}
            </p>
          ) : (
            <p className="text-sm text-gray-800">
              <span className="font-bold text-text">{activity.user_name || 'System'}</span>{' '}
              {activity.action}{' '}
              <span className="font-semibold text-primary">{activity.target}</span>
            </p>
          )}
          
          <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
            {formatDistanceToNow(new Date(activity.created_at || activity.time || activity.date || Date.now()), { addSuffix: true })}
          </span>
        </div>
        
        {(activity.details || activity.description) && (
          <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
            {activity.details || activity.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
