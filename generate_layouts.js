const fs = require('fs');
const path = require('path');

function createFiles(dir, files, template) {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  files.forEach(file => {
    const filePath = path.join(dir, `${file}.jsx`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, template(file));
    }
  });
}

// Layout Components
const layoutComponents = ['ResponsiveSidebar', 'ResponsiveHeader', 'TopNavigation', 'PageContainer', 'ContentWrapper', 'Footer', 'MobileNavigation', 'DesktopNavigation', 'UserProfileDropdown', 'NotificationDropdown'];
createFiles(path.join(__dirname, 'components', 'layouts'), layoutComponents, (name) => `export function ${name}({ children }) {\n  return <div>{children || '${name} Component'}</div>;\n}\n`);

// Layouts
const layouts = ['RootLayout', 'DashboardLayout', 'AuthLayout', 'ProtectedLayout', 'PublicLayout', 'ResponsiveLayout'];
createFiles(path.join(__dirname, 'layouts'), layouts, (name) => `export default function ${name}({ children }) {\n  return <div>{children}</div>;\n}\n`);

// Routes
const routes = ['dashboard', 'profile', 'services', 'packages', 'bookings', 'calendar', 'staff', 'customers', 'reviews', 'revenue', 'analytics', 'notifications', 'settings'];
routes.forEach(route => {
  const dir = path.join(__dirname, 'app', '(dashboard)', route);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.jsx'), `export default function ${route.charAt(0).toUpperCase() + route.slice(1)}Page() {\n  return <div>${route.charAt(0).toUpperCase() + route.slice(1)} Page - Future Phase</div>;\n}\n`);
});

// Utilities
const utils = ['dateFormatter', 'currencyFormatter', 'phoneFormatter', 'validationHelpers', 'storageHelpers', 'tokenHelpers', 'permissionHelpers', 'routeHelpers'];

if (!fs.existsSync(path.join(__dirname, 'utils'))) fs.mkdirSync(path.join(__dirname, 'utils'));
utils.forEach(u => fs.writeFileSync(path.join(__dirname, 'utils', `${u}.js`), `export const ${u} = () => {};\n`));

// Hooks
const hooks = ['useAxios', 'useToast', 'useModal', 'usePagination', 'useDebounce', 'useLocalStorage', 'useMediaQuery', 'useLoading'];
if (!fs.existsSync(path.join(__dirname, 'hooks'))) fs.mkdirSync(path.join(__dirname, 'hooks'));
hooks.forEach(h => fs.writeFileSync(path.join(__dirname, 'hooks', `${h}.js`), `export const ${h} = () => {};\n`));

// Error pages
fs.writeFileSync(path.join(__dirname, 'app', 'not-found.jsx'), `export default function NotFound() {\n  return <div>404 - Not Found</div>;\n}\n`);
fs.writeFileSync(path.join(__dirname, 'app', 'error.jsx'), `'use client';\nexport default function Error({ error, reset }) {\n  return <div>500 - Error</div>;\n}\n`);
fs.writeFileSync(path.join(__dirname, 'components', 'ui', 'NetworkError.jsx'), `export function NetworkError() {\n  return <div>Network Error Component</div>;\n}\n`);
fs.writeFileSync(path.join(__dirname, 'components', 'ui', 'APIError.jsx'), `export function APIError() {\n  return <div>API Error Component</div>;\n}\n`);

console.log('Layouts, routes, utils, hooks, and errors generated.');
