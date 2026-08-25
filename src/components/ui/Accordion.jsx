import React from 'react';

export function Accordion({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'Accordion Component'}
    </div>
  );
}
