$ErrorActionPreference = 'Stop'
$eventDir = "d:\Srinivas\faharaevent\src\app\event"

# Create a route group for the dashboard area
New-Item -ItemType Directory -Force -Path "$eventDir\(dashboard)"

# Move the dashboard layout and pages into the route group
if (Test-Path "$eventDir\layout.jsx") {
    Move-Item -Path "$eventDir\layout.jsx" -Destination "$eventDir\(dashboard)\layout.jsx" -Force
}
if (Test-Path "$eventDir\dashboard") {
    Move-Item -Path "$eventDir\dashboard" -Destination "$eventDir\(dashboard)\dashboard" -Force
}
if (Test-Path "$eventDir\profile") {
    Move-Item -Path "$eventDir\profile" -Destination "$eventDir\(dashboard)\profile" -Force
}

Write-Host "Fixed layout scope!"
