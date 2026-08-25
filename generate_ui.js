const fs = require('fs');
const path = require('path');

const components = [
  'Button', 'Input', 'Textarea', 'Select', 'Checkbox', 'RadioButton', 'ToggleSwitch',
  'Modal', 'Drawer', 'Dialog', 'Dropdown', 'Tooltip', 'Popover', 'Badge', 'Avatar',
  'Card', 'Table', 'Pagination', 'Breadcrumb', 'Tabs', 'Accordion', 'SearchInput',
  'Loader', 'Spinner', 'Skeleton', 'EmptyState', 'ErrorState', 'NoData'
];

const dir = path.join(__dirname, 'components', 'ui');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

components.forEach(comp => {
  const file = path.join(dir, `${comp}.jsx`);
  const content = `import React from 'react';\n\nexport function ${comp}({ children, ...props }) {\n  return (\n    <div {...props}>\n      {children || '${comp} Component'}\n    </div>\n  );\n}\n`;
  fs.writeFileSync(file, content);
});

console.log('UI components generated.');
