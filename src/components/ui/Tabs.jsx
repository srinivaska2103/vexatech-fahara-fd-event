import React from 'react';

export function Tabs({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Tabs Component'}
    </div>
  );
}
