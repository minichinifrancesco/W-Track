$ErrorActionPreference = 'Stop'

$sdk = if ($env:ANDROID_HOME) {
  $env:ANDROID_HOME
} elseif ($env:ANDROID_SDK_ROOT) {
  $env:ANDROID_SDK_ROOT
} else {
  Join-Path $env:LOCALAPPDATA 'Android\Sdk'
}

$adb = Join-Path $sdk 'platform-tools\adb.exe'
$emulator = Join-Path $sdk 'emulator\emulator.exe'
$cmdlineTools = Join-Path $sdk 'cmdline-tools\latest\bin'

if (!(Test-Path $adb) -or !(Test-Path $emulator)) {
  throw "Android SDK non trovato in '$sdk'. Installa Android Studio oppure imposta ANDROID_HOME/ANDROID_SDK_ROOT."
}

$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk
$env:Path = "$(Join-Path $sdk 'platform-tools');$(Join-Path $sdk 'emulator');$cmdlineTools;$env:Path"

$shouldStartServer = $args -notcontains '--help' -and $args -notcontains '-h'
$serverListening = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($shouldStartServer -and !$serverListening) {
  $serverDir = Join-Path (Resolve-Path '.').Path 'server'
  $outLog = Join-Path $serverDir 'dev-server.log'
  $errLog = Join-Path $serverDir 'dev-server.err.log'
  Write-Host 'Avvio backend W-Note su http://localhost:3000 ...'
  Start-Process `
    -FilePath npm.cmd `
    -ArgumentList 'run', 'start:dev' `
    -WorkingDirectory $serverDir `
    -WindowStyle Hidden `
    -RedirectStandardOutput $outLog `
    -RedirectStandardError $errLog | Out-Null
  Start-Sleep -Seconds 5
}

$npmArgs = @('--prefix', 'mobile', 'run', 'android', '--') + $args
& npm @npmArgs
exit $LASTEXITCODE
