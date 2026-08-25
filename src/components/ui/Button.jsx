import React from 'react';

export function Button({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Button Component'}
    </div>
  );
}
