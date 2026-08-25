import React from 'react';

export function Breadcrumb({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Breadcrumb Component'}
    </div>
  );
}
