import React from 'react';

export function Loader({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Loader Component'}
    </div>
  );
}
