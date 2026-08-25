"use client";
import React from 'react';
import { useActivityHistory } from '@/hooks/notifications/useNotificationQueries';
import { useNotificationStore } from '@/store/useNotificationStore';
import ActivityCard from './ActivityCard';
import EmptyNotification from './EmptyNotification';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ActivityTimeline = () => {
  const filters = useNotificationStore(state => state.activityFilters);
  const { data: activityData, isLoading } = useActivityHistory(filters);

  // Mock data if empty
  const mockActivities = [];

  const activities = activityData?.length > 0 ? activityData : mockActivities;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (activities.length === 0) {
    return <EmptyNotification type="activity" />;
  }

  return (
    <div className="pt-2">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ActivityCard 
              activity={activity} 
              isLast={index === activities.length - 1} 
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ActivityTimeline;
