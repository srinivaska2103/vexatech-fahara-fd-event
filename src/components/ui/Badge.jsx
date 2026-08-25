import React from 'react';

export function Badge({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Badge Component'}
    </div>
  );
}
