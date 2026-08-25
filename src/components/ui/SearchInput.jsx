import React from 'react';

export function SearchInput({ children, ...props }) {
  return (
    <div {...props}>
      {children || 'SearchInput Component'}
    </div>
  );
}
