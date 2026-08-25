import React from 'react';

export function ToggleSwitch({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'ToggleSwitch Component'}
    </div>
  );
}
