import React from 'react';

export function EmptyState({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'EmptyState Component'}
    </div>
  );
}
