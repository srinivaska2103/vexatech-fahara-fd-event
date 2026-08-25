import React from 'react';

export function Spinner({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Spinner Component'}
    </div>
  );
}
