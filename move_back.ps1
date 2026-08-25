$ErrorActionPreference = 'Stop'
$appDir = "d:\Srinivas\faharaevent\src\app"
$eventMgmt = "$appDir\eventmanagement"
$eventDash = "$appDir\event\(dashboard)"

if (-not (Test-Path $eventDash)) {
    New-Item -ItemType Directory -Force -Path $eventDash
}

if (Test-Path "$eventMgmt\layout.jsx") {
    Move-Item -Path "$eventMgmt\layout.jsx" -Destination "$eventDash\layout.jsx" -Force
}

if (Test-Path "$eventMgmt\dashboard") {
    Move-Item -Path "$eventMgmt\dashboard" -Destination "$eventDash\dashboard" -Force
}

if (Test-Path "$eventMgmt\profile") {
    Move-Item -Path "$eventMgmt\profile" -Destination "$eventDash\profile" -Force
}

if (Test-Path $eventMgmt) {
    Remove-Item -Path $eventMgmt -Recurse -Force
}

Write-Host "Moved eventmanagement back to event/(dashboard)!"
