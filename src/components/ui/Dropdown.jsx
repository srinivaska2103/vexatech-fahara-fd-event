import React from 'react';

export function Dropdown({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Dropdown Component'}
    </div>
  );
}
