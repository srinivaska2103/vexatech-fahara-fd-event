import React from 'react';

export function Checkbox({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Checkbox Component'}
    </div>
  );
}
