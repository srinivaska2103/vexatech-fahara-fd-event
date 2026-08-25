$ErrorActionPreference = 'Stop'
$appDir = "d:\Srinivas\faharaevent\src\app"

if (Test-Path "$appDir\(dashboard)\layout.jsx") {
    Move-Item -Path "$appDir\(dashboard)\layout.jsx" -Destination "$appDir\event\layout.jsx" -Force
}
if (Test-Path "$appDir\(dashboard)\dashboard") {
    Move-Item -Path "$appDir\(dashboard)\dashboard" -Destination "$appDir\event\dashboard" -Force
}
if (Test-Path "$appDir\(dashboard)\profile") {
    Move-Item -Path "$appDir\(dashboard)\profile" -Destination "$appDir\event\profile" -Force
}

if (Test-Path "$appDir\(dashboard)") {
    Remove-Item -Path "$appDir\(dashboard)" -Recurse -Force
}
Write-Host "Moved dashboard to event!"
