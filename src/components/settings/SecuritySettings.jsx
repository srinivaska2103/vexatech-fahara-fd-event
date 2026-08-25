"use client";
import React from 'react';
import PasswordSettings from './PasswordSettings';
import ActiveSessions from './ActiveSessions';
import LoginHistory from './LoginHistory';

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <PasswordSettings />
      <ActiveSessions />
      <LoginHistory />
    </div>
  );
};

export default SecuritySettings;
