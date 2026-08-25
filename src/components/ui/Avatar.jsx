import React from 'react';

export function Avatar({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Avatar Component'}
    </div>
  );
}
