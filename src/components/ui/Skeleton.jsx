import React from 'react';

export function Skeleton({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Skeleton Component'}
    </div>
  );
}
