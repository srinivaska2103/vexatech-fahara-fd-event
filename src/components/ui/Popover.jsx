import React from 'react';

export function Popover({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Popover Component'}
    </div>
  );
}
