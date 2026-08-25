import React from 'react';

export function ErrorState({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'ErrorState Component'}
    </div>
  );
}
