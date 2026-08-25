import React from 'react';

export function Dialog({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Dialog Component'}
    </div>
  );
}
