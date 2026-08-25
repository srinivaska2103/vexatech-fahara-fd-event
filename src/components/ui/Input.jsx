import React from 'react';

export function Input({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Input Component'}
    </div>
  );
}
