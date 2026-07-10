$ErrorActionPreference = 'Stop'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$release = Join-Path $root 'release'
$manifest = Get-Content (Join-Path $root 'ASSET_MANIFEST.json') -Raw | ConvertFrom-Json
$unpacked = Join-Path $release 'win-unpacked'
$unpackedExe = Get-ChildItem $unpacked -Filter '*.exe' -File |
  Where-Object { $_.Name -notmatch 'uninstall|elevate' } | Select-Object -First 1
if (-not $unpackedExe) { throw 'win-unpacked application executable not found' }

function Assert-RuntimeAssets([string]$resources) {
  $ffmpeg = Join-Path $resources 'ffmpeg\ffmpeg.exe'
  $ffprobe = Join-Path $resources 'ffmpeg\ffprobe.exe'
  $license = Join-Path $resources 'licenses\FFmpeg-GPL-3.0.txt'
  foreach ($item in @($ffmpeg, $ffprobe, $license)) {
    if (-not (Test-Path $item)) { throw "Packaged runtime asset missing: $item" }
  }
  $expected = $manifest.assets.windowsFfmpeg.files
  if ((Get-FileHash $ffmpeg -Algorithm SHA256).Hash.ToLower() -ne $expected.'ffmpeg.exe') {
    throw 'Packaged ffmpeg.exe checksum mismatch'
  }
  if ((Get-FileHash $ffprobe -Algorithm SHA256).Hash.ToLower() -ne $expected.'ffprobe.exe') {
    throw 'Packaged ffprobe.exe checksum mismatch'
  }
  if ((Get-FileHash $license -Algorithm SHA256).Hash.ToLower() -ne $expected.'LICENSE.txt') {
    throw 'Packaged FFmpeg license checksum mismatch'
  }
}

function Test-AppLaunch([string]$executable, [string]$label) {
  $oldPath = $env:PATH
  $oldFfmpeg = $env:BLOCKOUT_FFMPEG
  $env:PATH = "$env:SystemRoot\System32"
  Remove-Item Env:BLOCKOUT_FFMPEG -ErrorAction SilentlyContinue
  $env:BLOCKOUT_SMOKE_DIR = Join-Path $env:RUNNER_TEMP "OneDrive - Studio\Director's Cut\José\Packaged Smoke"
  $env:BLOCKOUT_CONFIG_DIR = Join-Path $env:RUNNER_TEMP 'blockout-package-config'
  New-Item -ItemType Directory -Force -Path $env:BLOCKOUT_SMOKE_DIR | Out-Null
  try {
    $process = Start-Process -FilePath $executable -PassThru
    Start-Sleep -Seconds 6
    if ($process.HasExited) { throw "$label exited during launch smoke with code $($process.ExitCode)" }
    & taskkill.exe /PID $process.Id /T /F | Out-Null
  } finally {
    $env:PATH = $oldPath
    if ($null -ne $oldFfmpeg) { $env:BLOCKOUT_FFMPEG = $oldFfmpeg }
  }
}

Assert-RuntimeAssets (Join-Path $unpacked 'resources')
Test-AppLaunch $unpackedExe.FullName 'win-unpacked app'

$installer = Get-ChildItem $release -Filter '*.exe' -File |
  Where-Object { $_.Name -notmatch 'uninstall' } | Sort-Object Length -Descending | Select-Object -First 1
if (-not $installer) { throw 'NSIS installer not found' }
$installDir = Join-Path $env:LOCALAPPDATA 'Programs\Blockout Test José'
Remove-Item $installDir -Recurse -Force -ErrorAction SilentlyContinue
$install = Start-Process -FilePath $installer.FullName -ArgumentList @('/S', "/D=$installDir") -Wait -PassThru
if ($install.ExitCode -ne 0) { throw "Silent NSIS install failed with $($install.ExitCode)" }

$installedExe = Get-ChildItem $installDir -Filter '*.exe' -File |
  Where-Object { $_.Name -notmatch 'uninstall|elevate' } | Select-Object -First 1
if (-not $installedExe) { throw 'Installed application executable not found' }
Assert-RuntimeAssets (Join-Path $installDir 'resources')

$startMenuShortcut = Get-ChildItem (Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs') -Filter 'Blockout*.lnk' -File -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
$desktopShortcut = Get-ChildItem ([Environment]::GetFolderPath('Desktop')) -Filter 'Blockout*.lnk' -File -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $startMenuShortcut) { throw 'Start Menu shortcut was not created' }
if (-not $desktopShortcut) { throw 'Desktop shortcut was not created' }
Test-AppLaunch $installedExe.FullName 'installed app'

# Uninstall removes program files/shortcuts but deliberately preserves user data.
$dataRoot = Join-Path $env:APPDATA 'blockout'
$marker = Join-Path $dataRoot 'uninstall-preserves-user-data.marker'
New-Item -ItemType Directory -Force -Path $dataRoot | Out-Null
Set-Content -Path $marker -Value 'preserve'
$uninstaller = Get-ChildItem $installDir -Filter '*Uninstall*.exe' -File | Select-Object -First 1
if (-not $uninstaller) { throw 'NSIS uninstaller not found' }
$uninstall = Start-Process -FilePath $uninstaller.FullName -ArgumentList '/S' -Wait -PassThru
if ($uninstall.ExitCode -ne 0) { throw "Silent uninstall failed with $($uninstall.ExitCode)" }
Start-Sleep -Seconds 2
if (Test-Path $installedExe.FullName) { throw 'Application executable remains after uninstall' }
if (-not (Test-Path $marker)) { throw 'Uninstall unexpectedly removed the user-data root' }

if (Get-Command Start-MpScan -ErrorAction SilentlyContinue) {
  $scanCompleted = $false
  try {
    Start-MpScan -ScanType CustomScan -ScanPath $release
    $scanCompleted = $true
  } catch {
    Write-Warning "Microsoft Defender custom scan unavailable or inconclusive: $($_.Exception.Message)"
  }
  if ($scanCompleted) {
    $threats = @(Get-MpThreatDetection -ErrorAction SilentlyContinue | Where-Object {
      $_.Resources -match [regex]::Escape($release)
    })
    if ($threats.Count -gt 0) { throw "Microsoft Defender reported $($threats.Count) release threat(s)" }
    Write-Host 'Microsoft Defender custom scan completed with no release threats.'
  }
} else {
  Write-Warning 'Microsoft Defender cmdlets are unavailable on this runner.'
}

Write-Host 'Windows unpacked launch, silent install/launch/uninstall, resources, shortcuts, and data policy passed.'
