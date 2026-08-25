$ErrorActionPreference = 'Stop'
$appDir = "d:\Srinivas\faharaevent\src\app\event"

# Create (dashboard) route group
if (-not (Test-Path "$appDir\(dashboard)")) {
    New-Item -ItemType Directory -Force -Path "$appDir\(dashboard)"
}

# Move dashboard inside it
if (Test-Path "$appDir\dashboard") {
    Move-Item -Path "$appDir\dashboard" -Destination "$appDir\(dashboard)\dashboard" -Force
}

Write-Host "Files arranged!"
