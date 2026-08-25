import React from 'react';

export function Drawer({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Drawer Component'}
    </div>
  );
}
