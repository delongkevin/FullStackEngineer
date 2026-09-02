# Android and iOS Build Dependency Matrix

This document summarizes what is required to produce successful Android APKs and iOS outputs in this repository. It separates repo-provided inputs from external tooling and signing material, and it distinguishes normal local development artifacts from signed distribution artifacts.

## 1. Android APK Requirements

The Android apps live under [android/](../android). The root build uses Gradle Kotlin DSL with Android Gradle Plugin 8.4.0 and Kotlin 1.9.22. The checked-in Android SDK is wired through [android/local.properties](../android/local.properties) and the shared repositories are `google()` and `mavenCentral()`.

### Required toolchain

- JDK 17
- Gradle wrapper 8.6
- Android SDK 34
- Build tools 34.0.0 or 33.0.1
- Platform tools
- Accepted Android SDK licenses

### Shared Android app dependencies

All six Android modules use:

- `androidx.core:core-ktx:1.12.0`
- `androidx.appcompat:appcompat:1.6.1`
- `com.google.android.material:material:1.11.0`

### Book App only

The Book App adds the following libraries on top of the shared set:

- `androidx.constraintlayout:constraintlayout:2.1.4`
- `androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0`
- `androidx.lifecycle:lifecycle-livedata-ktx:2.7.0`
- `androidx.navigation:navigation-fragment-ktx:2.7.7`
- `androidx.navigation:navigation-ui-ktx:2.7.7`
- `androidx.recyclerview:recyclerview:1.3.2`
- `com.github.bumptech.glide:glide:4.16.0`
- `androidx.fragment:fragment-ktx:1.6.2`

### Module configuration required for a successful APK

Each module must have:

- `compileSdk = 34`
- `minSdk = 26`
- `targetSdk = 34`
- Java compatibility set to 17
- Kotlin JVM target set to 17
- A valid `AndroidManifest.xml`
- Sources under `src/main/java/` or `src/main/kotlin/`
- Resources under `src/main/res/`
- Release ProGuard rules present, even if minification is disabled

### Android artifact notes

- Debug APKs are the normal local output and do not require signing credentials.
- Release APKs still require a valid signing configuration if you want a distributable artifact.
- The repository already contains prebuilt APK artifacts under [android/apk-artifacts/](../android/apk-artifacts).

### Android build command

```bash
cd android
./gradlew assembleDebug
```

## 2. Native iOS Build Requirements

The native iOS apps live under [ios/](../ios). Each app uses an XcodeGen `project.yml` file and a SwiftUI source tree. The workflow in [.github/workflows/release-ios.yml](../.github/workflows/release-ios.yml) shows the expected build path.

### Required toolchain for local builds

- macOS
- Xcode
- Swift 5.9
- XcodeGen
- xcpretty
- xcodebuild

### Shared native iOS project requirements

Each native iOS app needs:

- A `project.yml` file for XcodeGen
- A matching app source folder
- An `App.swift` entry point
- A `ContentView.swift` UI root
- An `Info.plist`
- A deployment target of iOS 16.0

### Native simulator output: `.app`

To produce a simulator bundle, the build only needs local Xcode tooling. No Apple signing materials are required when `CODE_SIGNING_ALLOWED=NO` is used, which is the path used by the release workflow.

Required inputs for simulator builds:

- XcodeGen-generated `.xcodeproj`
- Matching scheme name
- iOS simulator SDK
- `CODE_SIGNING_ALLOWED=NO`

### Native device / distribution output: `.ipa`

To produce a signed `.ipa`, you need Apple signing material in addition to the simulator toolchain:

- Apple Developer Program access
- A signing certificate in `.p12` form
- The certificate password
- A provisioning profile
- Apple Team ID
- The provisioning profile name
- A bundle identifier that matches the provisioning profile

### Native iOS bundle identifiers

The current `project.yml` files use a placeholder bundle ID prefix (`com.yourname`). That is fine for simulator builds, but it must be replaced with real signing values before device or App Store builds.

### Native iOS artifact notes

- The normal local artifact is a simulator `.app` bundle.
- The repository’s release workflow packages simulator builds as `.zip` archives containing `.app` bundles.
- Object files (`.o`) are intermediate compiler outputs, not the intended final artifact for these apps.

## 3. Expo / EAS iOS Build Requirements

The Expo-based mobile apps are separate from the native Swift apps. They live at the repository root in directories such as [chat-app/](../chat-app), [real-estate-app/](../real-estate-app), [finance-app/](../finance-app), [fitness-tracker-app/](../fitness-tracker-app), and [music-streaming-app/](../music-streaming-app).

### Required toolchain

- Node.js
- npm, yarn, or pnpm
- Expo CLI
- EAS CLI for production iOS builds
- macOS and Xcode for local simulator runs

### Shared Expo dependencies

These apps all rely on the Expo managed workflow and React Native, with variations in the Expo SDK version and native plugins.

Common build-time dependencies across the Expo apps include combinations of:

- `expo`
- `react`
- `react-native`
- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `@react-navigation/stack` or `@react-navigation/native-stack`
- `@react-native-async-storage/async-storage`
- `react-native-screens`
- `react-native-safe-area-context`
- `axios`
- `moment`

### App-specific Expo native modules

- `chat-app` uses `expo-notifications` and Socket.IO client dependencies.
- `real-estate-app` uses `expo-location` and `expo-notifications`.
- `finance-app` uses `react-native-chart-kit`, `react-native-gesture-handler`, `react-native-reanimated`, and `react-native-svg`.
- `fitness-tracker-app` uses `expo-camera`, `expo-location`, `expo-sensors`, `expo-notifications`, `react-native-chart-kit`, `react-native-gesture-handler`, `react-native-reanimated`, and `react-native-svg`.
- `music-streaming-app` uses `expo-av` for audio playback.

### Expo simulator output: `.app`

For local simulator runs, the minimum requirements are:

- Installed Node dependencies
- Valid Expo config in each app package
- Xcode and the iOS simulator runtime on macOS
- A working Expo development server or `expo start --ios`

### Expo device or store output: `.ipa`

For production iOS output through EAS, you need:

- EAS CLI
- Expo account access
- Apple Developer credentials
- Valid iOS bundle identifiers
- Signing certificates and provisioning profiles managed by EAS or supplied manually

### Expo artifact notes

- These apps do not use the native XcodeGen flow in this repo.
- Production iOS output is normally handled by EAS rather than by a checked-in `.xcodeproj`.
- If you want a low-level `.o` compilation inventory for Expo apps, that would require a separate build-system audit because the repo is centered on managed Expo configuration rather than a raw Xcode project.

## 4. Practical Dependency Checklist

### Android APK

- JDK 17
- Gradle wrapper 8.6
- Android SDK 34
- Build tools 34.0.0 or 33.0.1
- AndroidX and Material dependencies from the module manifests

### Native iOS `.app`

- macOS
- Xcode
- XcodeGen
- xcpretty
- Swift 5.9
- iOS 16.0 deployment target

### Native iOS `.ipa`

- Everything required for `.app`
- Signing certificate
- Provisioning profile
- Team ID
- Matching bundle identifier

### Expo/EAS iOS `.app` or `.ipa`

- Node.js and package manager
- Expo CLI
- EAS CLI for production builds
- Xcode for simulator runs
- Apple Developer signing material for `.ipa`
