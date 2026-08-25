$ErrorActionPreference = 'Stop'
$appDir = "d:\Srinivas\faharaevent\src\app"

# 1. Create (auth) and move event auth routes
New-Item -ItemType Directory -Force -Path "$appDir\(auth)"
$authRoutes = @('login', 'signup', 'forgot-password', 'reset-password', 'verify-email')
foreach ($route in $authRoutes) {
    if (Test-Path "$appDir\event\$route") {
        Move-Item -Path "$appDir\event\$route" -Destination "$appDir\(auth)\$route" -Force
    }
}

# Remove event folder if empty
if (Test-Path "$appDir\event") {
    $remaining = Get-ChildItem -Path "$appDir\event"
    if ($remaining.Count -eq 0) {
        Remove-Item -Path "$appDir\event" -Recurse -Force
    }
}

# 2. Create owner and move (dashboard) routes
New-Item -ItemType Directory -Force -Path "$appDir\owner"
if (Test-Path "$appDir\(dashboard)\layout.jsx") {
    Move-Item -Path "$appDir\(dashboard)\layout.jsx" -Destination "$appDir\owner\layout.jsx" -Force
}
if (Test-Path "$appDir\(dashboard)\dashboard") {
    Move-Item -Path "$appDir\(dashboard)\dashboard" -Destination "$appDir\owner\dashboard" -Force
}
if (Test-Path "$appDir\(dashboard)\profile") {
    Move-Item -Path "$appDir\(dashboard)\profile" -Destination "$appDir\owner\profile" -Force
}

# Remove (dashboard) if empty
if (Test-Path "$appDir\(dashboard)") {
    $remaining = Get-ChildItem -Path "$appDir\(dashboard)"
    if ($remaining.Count -eq 0) {
        Remove-Item -Path "$appDir\(dashboard)" -Recurse -Force
    }
}

# 3. Create missing stubs for owner
$ownerRoutes = @('analytics', 'bookings', 'calendar', 'customers', 'events', 'notifications', 'packages', 'payments', 'revenue', 'reviews', 'services', 'settings', 'staff', 'support')

foreach ($route in $ownerRoutes) {
    $routePath = "$appDir\owner\$route"
    if (-not (Test-Path $routePath)) {
        New-Item -ItemType Directory -Force -Path $routePath
        
        $content = @"
export default function $( (Get-Culture).TextInfo.ToTitleCase($route) )Page() {
  return <div>$( (Get-Culture).TextInfo.ToTitleCase($route) ) Page - Future Phase</div>;
}
"@
        Set-Content -Path "$routePath\page.jsx" -Value $content
    }
}

# 4. Create loading.jsx and not-found.jsx
$loadingContent = @"
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
}
"@
Set-Content -Path "$appDir\owner\loading.jsx" -Value $loadingContent

$notFoundContent = @"
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center">
      <h2 className="text-4xl font-bold text-text mb-4">404 - Not Found</h2>
      <p className="text-text/60 mb-6">Could not find requested resource</p>
      <Link href="/owner/dashboard" className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition-colors">
        Return to Dashboard
      </Link>
    </div>
  );
}
"@
Set-Content -Path "$appDir\owner\not-found.jsx" -Value $notFoundContent

Write-Host "Restructure complete!"
