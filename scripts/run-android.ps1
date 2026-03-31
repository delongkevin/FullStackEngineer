<#
.SYNOPSIS
  Build and deploy an Android app from this repo to the Pixel_9a emulator.

.DESCRIPTION
  - Selects which app to build (book-app by default)
  - Starts the Pixel_9a AVD if it is not already running
  - Builds the debug APK using the Gradle wrapper
  - Installs the APK via adb

.PARAMETER App
  Which sub-project to build. One of:
    book-app | computer-store | poker-app | kamps-factory | embedded-video
  Default: book-app

.PARAMETER AvdName
  Name of the Android Virtual Device to launch.
  Default: Pixel_9a

.PARAMETER Config
  Gradle build variant. debug (default) or release.

.EXAMPLE
  .\scripts\run-android.ps1
  .\scripts\run-android.ps1 -App poker-app
  .\scripts\run-android.ps1 -App computer-store -Config release
#>

param(
    [ValidateSet("book-app", "computer-store", "poker-app", "kamps-factory", "embedded-video")]
    [string]$App = "book-app",

    [string]$AvdName = "Pixel_9a",

    [ValidateSet("debug", "release")]
    [string]$Config = "debug"
)

Set-StrictMode -Version Latest
# Use Continue so native-exe stderr messages (e.g. adb daemon startup) don't
# become terminating errors. Exit codes are checked explicitly after each call.
$ErrorActionPreference = "Continue"

# ─── Paths ────────────────────────────────────────────────────────────────────
$SDK        = "$env:LOCALAPPDATA\Android\Sdk"
$ADB        = "$SDK\platform-tools\adb.exe"
$EMULATOR   = "$SDK\emulator\emulator.exe"
$JAVA_HOME  = "C:\Program Files\Android\Android Studio\jbr"
$REPO_ROOT  = Split-Path -Parent $PSScriptRoot
$ANDROID_DIR = Join-Path $REPO_ROOT "android"

# ─── App → module name map ────────────────────────────────────────────────────
$MODULE_MAP = @{
    "book-app"       = @{ Module = "book-app";       ApkName = "BookStore";            TaskPrefix = ":book-app" }
    "computer-store" = @{ Module = "computer-store"; ApkName = "ComputerStore";        TaskPrefix = ":computer-store" }
    "poker-app"      = @{ Module = "poker-app";      ApkName = "PokerApp";             TaskPrefix = ":poker-app" }
    "kamps-factory"  = @{ Module = "kamps-factory";  ApkName = "KampsSmartFactory";    TaskPrefix = ":kamps-factory" }
    "embedded-video" = @{ Module = "embedded-video"; ApkName = "EmbeddedVideoEngineer"; TaskPrefix = ":embedded-video" }
}

$entry = $MODULE_MAP[$App]

# ─── Validation ───────────────────────────────────────────────────────────────
foreach ($required in @($ADB, $EMULATOR, "$JAVA_HOME\bin\java.exe", "$ANDROID_DIR\gradlew.bat")) {
    if (-not (Test-Path $required)) {
        Write-Host "ERROR: Required file not found: $required" -ForegroundColor Red
        exit 1
    }
}

# ─── Environment setup ────────────────────────────────────────────────────────
$env:JAVA_HOME          = $JAVA_HOME
$env:ANDROID_HOME       = $SDK
$env:ANDROID_SDK_ROOT   = $SDK
$env:PATH               = "$JAVA_HOME\bin;$SDK\platform-tools;$SDK\emulator;" + $env:PATH

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Android Deploy: $App  [$Config]" -ForegroundColor Cyan
Write-Host "  AVD            : $AvdName" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# ─── 1. Start emulator if not running ─────────────────────────────────────────
Write-Host ">> Checking emulator status..." -ForegroundColor Yellow
# Redirect stderr to null so adb daemon startup messages don't trigger Stop
$runningDevices = (& $ADB devices 2>$null) | Select-String "emulator"
if ($runningDevices) {
    Write-Host "  Emulator already running: $runningDevices" -ForegroundColor Green
} else {
    Write-Host "  Starting AVD '$AvdName'..." -ForegroundColor Yellow
    Start-Process -FilePath $EMULATOR -ArgumentList "-avd", $AvdName, "-no-snapshot-save" -WindowStyle Normal

    Write-Host "  Waiting for emulator to boot (up to 120 seconds)..." -ForegroundColor Yellow
    $timeout = 120
    $elapsed = 0
    $booted  = $false
    while ($elapsed -lt $timeout) {
        Start-Sleep -Seconds 5
        $elapsed += 5
        $bootProp = (& $ADB shell getprop sys.boot_completed 2>$null)
        if ($bootProp -match "^1") {
            $booted = $true
            Write-Host "  Emulator booted. ($elapsed s)" -ForegroundColor Green
            break
        }
        Write-Host "  Waiting... ($elapsed s)" -ForegroundColor DarkGray
    }
    if (-not $booted) {
        Write-Host "ERROR: Emulator did not boot within $timeout seconds. Try launching it manually from Android Studio." -ForegroundColor Red
        exit 1
    }
    # Give the system services a moment to settle
    Start-Sleep -Seconds 3
}

# ─── 2. Build APK ─────────────────────────────────────────────────────────────
$variant    = (Get-Culture).TextInfo.ToTitleCase($Config)    # debug -> Debug
$gradleTask = "$($entry.TaskPrefix):assemble$variant"

Write-Host ""
Write-Host ">> Building $App ($gradleTask)..." -ForegroundColor Yellow
Push-Location $ANDROID_DIR
try {
    cmd /c "gradlew.bat $gradleTask --no-daemon"
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Gradle build failed (exit $LASTEXITCODE)" -ForegroundColor Red; exit 1 }
} finally {
    Pop-Location
}

# ─── 3. Locate APK ────────────────────────────────────────────────────────────
$apkSearch = Join-Path $ANDROID_DIR "$($entry.Module)\build\outputs\apk\$Config\*.apk"
$apkPath   = Get-ChildItem $apkSearch -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName

if (-not $apkPath) {
    Write-Host "ERROR: APK not found at $apkSearch. Check build output above." -ForegroundColor Red
    exit 1
}
Write-Host ""
Write-Host "  APK: $apkPath" -ForegroundColor Green

# ─── 4. Install APK ───────────────────────────────────────────────────────────
Write-Host ""
Write-Host ">> Installing APK on emulator..." -ForegroundColor Yellow
& $ADB install -r $apkPath
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: adb install failed (exit $LASTEXITCODE)" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "DONE: $App is installed on $AvdName." -ForegroundColor Green
Write-Host "  Open the app from the emulator home screen." -ForegroundColor Green
Write-Host ""
