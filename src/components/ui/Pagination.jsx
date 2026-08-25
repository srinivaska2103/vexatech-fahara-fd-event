import React from 'react';

export function Pagination({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Pagination Component'}
    </div>
  );
}
