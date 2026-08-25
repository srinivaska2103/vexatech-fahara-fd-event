import React from 'react';

export function Table({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Table Component'}
    </div>
  );
}
