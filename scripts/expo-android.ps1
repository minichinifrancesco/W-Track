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

$npmArgs = @('--prefix', 'mobile', 'run', 'android', '--') + $args
& npm @npmArgs
exit $LASTEXITCODE
