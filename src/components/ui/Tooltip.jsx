import React from 'react';

export function Tooltip({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Tooltip Component'}
    </div>
  );
}
