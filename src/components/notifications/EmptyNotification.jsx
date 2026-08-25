"use client";
import React from 'react';
import { BellOff } from 'lucide-react';

const EmptyNotification = ({ type = 'notifications' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <BellOff className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-text mb-1">
        {type === 'activity' ? 'No Activities Found' : 'No Notifications'}
      </h3>
      <p className="text-sm text-gray-500 max-w-[250px]">
        {type === 'activity' 
          ? "You don't have any recent activity matching these filters."
          : "You're all caught up! There are no new notifications at the moment."}
      </p>
    </div>
  );
};

export default EmptyNotification;
