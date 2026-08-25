import React from 'react';

export function Select({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Select Component'}
    </div>
  );
}
