$ErrorActionPreference = 'Stop'
$appDir = "d:\Srinivas\faharaevent\src\app"

# 1. Restore event auth routes from (auth)
New-Item -ItemType Directory -Force -Path "$appDir\event"
$authRoutes = @('login', 'signup', 'forgot-password', 'reset-password', 'verify-email')
foreach ($route in $authRoutes) {
    if (Test-Path "$appDir\(auth)\$route") {
        Move-Item -Path "$appDir\(auth)\$route" -Destination "$appDir\event\$route" -Force
    }
}
if (Test-Path "$appDir\(auth)") {
    Remove-Item -Path "$appDir\(auth)" -Recurse -Force
}

# 2. Restore (dashboard) routes from owner
New-Item -ItemType Directory -Force -Path "$appDir\(dashboard)"
if (Test-Path "$appDir\owner\layout.jsx") {
    Move-Item -Path "$appDir\owner\layout.jsx" -Destination "$appDir\(dashboard)\layout.jsx" -Force
}
if (Test-Path "$appDir\owner\dashboard") {
    Move-Item -Path "$appDir\owner\dashboard" -Destination "$appDir\(dashboard)\dashboard" -Force
}
if (Test-Path "$appDir\owner\profile") {
    Move-Item -Path "$appDir\owner\profile" -Destination "$appDir\(dashboard)\profile" -Force
}

# Delete remaining owner folder (with all the dummy routes)
if (Test-Path "$appDir\owner") {
    Remove-Item -Path "$appDir\owner" -Recurse -Force
}

Write-Host "Revert complete!"
