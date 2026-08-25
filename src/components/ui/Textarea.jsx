import React from 'react';

export function Textarea({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Textarea Component'}
    </div>
  );
}
