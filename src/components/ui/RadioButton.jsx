import React from 'react';

export function RadioButton({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'RadioButton Component'}
    </div>
  );
}
