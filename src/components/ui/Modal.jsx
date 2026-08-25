import React from 'react';

export function Modal({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Modal Component'}
    </div>
  );
}
