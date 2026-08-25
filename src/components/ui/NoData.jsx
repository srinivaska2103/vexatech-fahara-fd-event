import React from 'react';

export function NoData({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'NoData Component'}
    </div>
  );
}
