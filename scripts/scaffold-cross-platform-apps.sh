#!/usr/bin/env bash
set -euo pipefail
# One-off scaffolding script: generates Android WebView-wrapper modules and
# Electron desktop shells for a batch of fullstack demos, following the
# insurance-app / insurance-admin-desktop pattern. Safe to re-run (overwrites).

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="$REPO_ROOT/android"
DESKTOP_DIR="$REPO_ROOT/desktop"
TEMPLATE_ANDROID="$ANDROID_DIR/insurance-app"
TEMPLATE_DESKTOP="$DESKTOP_DIR/insurance-admin-desktop"

# Fields: module|package|appTitle|liveSlug|product|desktopDir|fullTitle
APPS=(
  "order-system|ordersystemapp|ShopQuick Grocery|order-system|ShopQuick|order-system-desktop|Online Grocery Order System"
  "task-manager|taskmanagerapp|TaskFlow|task-manager|TaskFlow|task-manager-desktop|Task Manager"
  "avionics-test|avionicstestapp|AvionicsTest|avionics-test-systems|AvionicsTest|avionics-test-desktop|Avionics Test Systems Engineer"
  "om-platform|omplatformapp|OM Platform|om-platform|OMPlatform|om-platform-desktop|SQL & XML Data Operations Platform"
  "sit-dashboard|sitdashboardapp|SIT Dashboard|sit-dashboard|SITDashboard|sit-dashboard-desktop|System Integration Test Management Dashboard"
  "qa-dashboard|qadashboardapp|QA Dashboard|qa-dashboard|QADashboard|qa-dashboard-desktop|Software QA Analyst Platform"
  "ai-trainer|aitrainerapp|AI Code Trainer|ai-trainer|AICodeTrainer|ai-trainer-desktop|AI Code Training Platform"
  "a11y-qa-trainer|a11yqaapp|A11y QA Trainer|accessibility-qa-ai-trainer|A11yQATrainer|a11y-qa-trainer-desktop|Accessibility QA Engineer AI Trainer Platform"
  "sap-test-manager|saptestmanagerapp|SAP Test Manager|sap-test-manager|SAPTestManager|sap-test-manager-desktop|SAP Test Manager Greenfield Command Center"
  "erp-workbench|erpworkbenchapp|ERP Workbench|enterprise-erp-workbench|ERPWorkbench|erp-workbench-desktop|Enterprise ERP Workbench"
  "wireless-audio|wirelessaudioapp|Wireless Audio|wireless-audio-platform|WirelessAudio|wireless-audio-desktop|Wireless Audio Platform"
)

for entry in "${APPS[@]}"; do
  IFS='|' read -r MODULE PACKAGE APPTITLE SLUG PRODUCT DESKTOPDIR FULLTITLE <<< "$entry"
  PRIMARY_URL="https://fullstackengineer.netlify.app/projects/${SLUG}/index.html"
  FALLBACK_URL="https://fullstackengineer.netlify.app/projects/${SLUG}/"

  echo "== Android module: $MODULE ($PACKAGE) =="
  DEST="$ANDROID_DIR/$MODULE"
  rm -rf "$DEST"
  mkdir -p "$DEST/src/main/java/com/portfolio/$PACKAGE"
  mkdir -p "$DEST/src/main/res/layout" "$DEST/src/main/res/values" "$DEST/src/main/res/drawable" "$DEST/src/main/res/mipmap-anydpi-v26" "$DEST/src/main/assets"

  cat > "$DEST/build.gradle.kts" <<EOF
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.portfolio.$PACKAGE"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.portfolio.$PACKAGE"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
}
EOF

  echo "# Add project specific ProGuard rules here." > "$DEST/proguard-rules.pro"

  cat > "$DEST/src/main/AndroidManifest.xml" <<'EOF'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.App">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
EOF

  cat > "$DEST/src/main/res/layout/activity_main.xml" <<'EOF'
<?xml version="1.0" encoding="utf-8"?>
<WebView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/webview"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
EOF

  cat > "$DEST/src/main/res/values/colors.xml" <<'EOF'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary_500">#FF2196F3</color>
    <color name="primary_700">#FF1976D2</color>
    <color name="ic_launcher_bg">#FF0D1B2A</color>
    <color name="white">#FFFFFFFF</color>
</resources>
EOF

  cat > "$DEST/src/main/res/values/strings.xml" <<EOF
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">$APPTITLE</string>
</resources>
EOF

  cat > "$DEST/src/main/res/values/themes.xml" <<'EOF'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.App" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/primary_500</item>
        <item name="colorPrimaryVariant">@color/primary_700</item>
        <item name="colorOnPrimary">@color/white</item>
        <item name="android:statusBarColor">?attr/colorPrimaryVariant</item>
    </style>
</resources>
EOF

  cat > "$DEST/src/main/res/drawable/ic_launcher_foreground.xml" <<'EOF'
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#FFFFFFFF"
        android:pathData="M54,20L86,36V58C86,76 72,88 54,94C36,88 22,76 22,58V36Z" />
    <path
        android:fillColor="#FF2196F3"
        android:pathData="M54,30L78,42V57C78,70 68,80 54,85C40,80 30,70 30,57V42Z" />
    <path
        android:fillColor="#FFFFFFFF"
        android:pathData="M48,52H60V64H48Z" />
</vector>
EOF

  for f in ic_launcher ic_launcher_round; do
    cat > "$DEST/src/main/res/mipmap-anydpi-v26/$f.xml" <<'EOF'
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_bg" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
EOF
  done

  cat > "$DEST/src/main/assets/offline.html" <<EOF
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>$PRODUCT Offline</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0d1b2a; color: #e8f4fd; display: grid; place-items: center; min-height: 100vh; padding: 24px; box-sizing: border-box; }
    .card { width: min(560px, 100%); background: #1a2d44; border: 1px solid #2a4060; border-radius: 14px; padding: 24px; box-sizing: border-box; }
    h1 { margin: 0 0 10px; font-size: 24px; }
    p { margin: 0 0 12px; line-height: 1.5; color: #8cb4d2; }
    .hint { color: #4caf50; }
  </style>
</head>
<body>
  <main class="card">
    <h1>$PRODUCT Is Unavailable</h1>
    <p>We could not load the live $FULLTITLE right now.</p>
    <p>Please check your internet connection and try again in a moment.</p>
    <p class="hint">Close and reopen the app to retry automatic loading.</p>
  </main>
</body>
</html>
EOF

  cat > "$DEST/src/main/java/com/portfolio/$PACKAGE/MainActivity.kt" <<EOF
package com.portfolio.$PACKAGE

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val primaryUrl = "$PRIMARY_URL"
    private val fallbackUrl = "$FALLBACK_URL"
    private val offlinePageUrl = "file:///android_asset/offline.html"
    private var triedFallback = false
    private var loadedOfflinePage = false

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                return false
            }

            override fun onReceivedHttpError(
                view: WebView,
                request: WebResourceRequest,
                errorResponse: WebResourceResponse
            ) {
                super.onReceivedHttpError(view, request, errorResponse)
                if (request.isForMainFrame && errorResponse.statusCode >= 400) {
                    loadFallbackOrOffline(view, request.url?.toString())
                }
            }

            override fun onReceivedError(
                view: WebView,
                request: WebResourceRequest,
                error: WebResourceError
            ) {
                super.onReceivedError(view, request, error)
                if (request.isForMainFrame) {
                    loadFallbackOrOffline(view, request.url?.toString())
                }
            }

            override fun onPageFinished(view: WebView, url: String?) {
                super.onPageFinished(view, url)
                if (url.equals(primaryUrl, ignoreCase = true) || url.equals(fallbackUrl, ignoreCase = true)) {
                    loadedOfflinePage = false
                }
            }

            private fun loadFallbackOrOffline(view: WebView, failingUrl: String?) {
                if (!triedFallback && !failingUrl.equals(fallbackUrl, ignoreCase = true)) {
                    triedFallback = true
                    view.loadUrl(fallbackUrl)
                    return
                }
                if (!loadedOfflinePage) {
                    loadedOfflinePage = true
                    view.loadUrl(offlinePageUrl)
                }
            }
        }
        webView.loadUrl(primaryUrl)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            @Suppress("DEPRECATION")
            super.onBackPressed()
        }
    }
}
EOF

  echo "== Desktop app: $DESKTOPDIR ($PRODUCT) =="
  DDEST="$DESKTOP_DIR/$DESKTOPDIR"
  rm -rf "$DDEST"
  mkdir -p "$DDEST"

  cat > "$DDEST/main.js" <<EOF
// $PRODUCT desktop shell — loads the live $FULLTITLE
// dashboard in a native window, falling back to a bundled offline page if the
// site is unreachable. Same "web-wrapped native app" approach used by the
// Android build in android/$MODULE.

const { app, BrowserWindow } = require('electron');
const path = require('path');

const PRIMARY_URL = '$PRIMARY_URL';
const OFFLINE_URL = \`file://\${path.join(__dirname, 'offline.html')}\`;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    title: '$PRODUCT — $FULLTITLE',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(PRIMARY_URL).catch(() => win.loadURL(OFFLINE_URL));

  win.webContents.on('did-fail-load', (_event, errorCode, _desc, validatedURL) => {
    if (validatedURL !== OFFLINE_URL && errorCode !== -3 /* ERR_ABORTED from navigation cancel */) {
      win.loadURL(OFFLINE_URL);
    }
  });

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
EOF

  cat > "$DDEST/offline.html" <<EOF
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>$PRODUCT Offline</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0d1b2a; color: #e8f4fd; display: grid; place-items: center; min-height: 100vh; padding: 24px; box-sizing: border-box; }
    .card { width: min(560px, 100%); background: #1a2d44; border: 1px solid #2a4060; border-radius: 14px; padding: 24px; box-sizing: border-box; }
    h1 { margin: 0 0 10px; font-size: 24px; }
    p { margin: 0 0 12px; line-height: 1.5; color: #8cb4d2; }
    .hint { color: #4caf50; }
  </style>
</head>
<body>
  <main class="card">
    <h1>$PRODUCT Is Unavailable</h1>
    <p>We could not load the live $FULLTITLE right now.</p>
    <p>Please check your internet connection and try again in a moment.</p>
    <p class="hint">Close and reopen the app to retry automatic loading.</p>
  </main>
</body>
</html>
EOF

  cat > "$DDEST/package.json" <<EOF
{
  "name": "$DESKTOPDIR",
  "version": "1.0.0",
  "description": "$PRODUCT $FULLTITLE — Windows/macOS desktop shell",
  "main": "main.js",
  "author": "Kevin Delong",
  "license": "MIT",
  "scripts": {
    "start": "electron .",
    "dist:win": "electron-builder --win",
    "dist:mac": "electron-builder --mac",
    "dist": "electron-builder --win --mac"
  },
  "devDependencies": {
    "electron": "^30.0.0",
    "electron-builder": "^24.13.3"
  },
  "build": {
    "appId": "com.portfolio.${PACKAGE}.desktop",
    "productName": "$PRODUCT",
    "directories": {
      "output": "dist"
    },
    "files": [
      "main.js",
      "offline.html",
      "package.json"
    ],
    "win": {
      "target": "nsis",
      "artifactName": "$PRODUCT-Windows-Setup.\${ext}"
    },
    "mac": {
      "target": "dmg",
      "artifactName": "$PRODUCT-macOS.\${ext}",
      "category": "public.app-category.business"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
EOF

  cat > "$DDEST/README.md" <<EOF
# $PRODUCT Desktop (Windows / macOS)

Native desktop shell for the [$FULLTITLE](../../public/projects/$SLUG/index.html) demo, built with Electron. Loads the live dashboard in a dedicated window (falling back to an offline page if unreachable) so it can be installed and launched like any other desktop app.

## Run locally

\`\`\`bash
cd desktop/$DESKTOPDIR
npm install
npm start
\`\`\`

## Build installers

\`\`\`bash
npm run dist:win   # -> dist/$PRODUCT-Windows-Setup.exe (run on/targeting Windows)
npm run dist:mac    # -> dist/$PRODUCT-macOS.dmg (must run on macOS)
\`\`\`

> \`electron-builder\` can only produce \`.dmg\` output when run on macOS. Windows and Linux builds can be produced from any host. The [\`release-desktop.yml\`](../../.github/workflows/release-desktop.yml) GitHub Actions workflow builds all desktop apps on \`windows-latest\` and \`macos-latest\` runners and publishes them to the rolling \`desktop-artifacts-latest\` GitHub Release, which is what the portfolio site's Windows/macOS download buttons link to.
EOF

done

echo "Scaffolding complete."
