#Requires -Version 5.1
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'seed-images'
$manifestPath = Join-Path $outDir 'manifest.json'

if (-not (Test-Path $manifestPath)) {
  Write-Error "manifest.json not found at $manifestPath"
}

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$items = Get-Content $manifestPath -Raw | ConvertFrom-Json
$ok = 0
$fail = 0

foreach ($item in $items) {
  $dest = Join-Path $outDir $item.filename
  Write-Host "Downloading $($item.filename) ... " -NoNewline
  try {
    curl.exe -L -sS -o $dest --max-time 120 $item.url
    if (-not (Test-Path $dest)) { throw 'File not created' }
    $size = (Get-Item $dest).Length
    if ($size -lt 500) { throw "File too small ($size bytes)" }
    Write-Host "OK ($size bytes)"
    $ok++
  } catch {
    Write-Host "FAILED ($($_.Exception.Message))"
    if (Test-Path $dest) { Remove-Item $dest -Force }
    $fail++
  }
}

Write-Host ""
Write-Host "Done: $ok succeeded, $fail failed."
if ($fail -gt 0) {
  Write-Host "Tip: Google CDN may be blocked. Try VPN, then run this script again."
  exit 1
}
