# Building Mobile Applications

This guide explains how to build the Android APK and iOS app bundles for the mobile applications in this portfolio.

## Overview

The repository contains multiple mobile applications that can be built for Android and iOS platforms:

- **Android Apps**: Native Kotlin apps and Expo/React Native apps that build to APK files
- **iOS Apps**: Native Swift apps that build to .app bundles for iOS Simulator

## Android Build Instructions

### Prerequisites

- **Android Studio** (latest version recommended)
- **Java Development Kit (JDK)** 17 or later
- **Android SDK** with Build Tools version 35.0.0
- **Git** for cloning the repository

### Building Native Android Apps

1. Clone the repository:
   ```bash
   git clone https://github.com/delongkevin/FullStackEngineer.git
   cd FullStackEngineer
   ```

2. Open Android Studio and select "Open an Existing Project"

3. Navigate to the `android` directory in the repository

4. Wait for Gradle sync to complete (this may take several minutes on first run)

5. Select the module you want to build from the dropdown menu:
   - `book-app` - Book store native Android app
   - `computer-store` - Computer store e-commerce app
   - `poker-app` - Poker game app
   - `kamps-factory` - Smart factory dashboard
   - `embedded-video` - Embedded video viewer
   - `medical-iot-monitor` - Medical IoT monitoring dashboard

6. Build the APK:
   - Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
   - Or run in terminal: `./gradlew :<module-name>:assembleDebug`

7. Find the APK file:
   - Location: `android/<module-name>/build/outputs/apk/debug/<module-name>-debug.apk`

8. Install on your Android device:
   ```bash
   adb install android/<module-name>/build/outputs/apk/debug/<module-name>-debug.apk
   ```

### Building Expo/React Native Apps for Android

Some apps use Expo/React Native and require additional steps:

1. Navigate to the app directory:
   ```bash
   cd fitness-tracker-app  # or finance-app, chat-app, real-estate-app, music-streaming-app, weather-app
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Generate the native Android project:
   ```bash
   npx expo prebuild --platform android --clean
   ```

4. Build the APK:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

5. Find the APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

## iOS Build Instructions

### Prerequisites

- **macOS** computer (iOS development requires macOS)
- **Xcode** 14 or later (install from Mac App Store)
- **XcodeGen** - Install via Homebrew: `brew install xcodegen`
- **iOS Simulator** (included with Xcode)
- **Git** for cloning the repository

### Building iOS Apps

1. Clone the repository:
   ```bash
   git clone https://github.com/delongkevin/FullStackEngineer.git
   cd FullStackEngineer
   ```

2. Navigate to the iOS module directory:
   ```bash
   cd ios/book-app  # or computer-store, poker-app, kamps-factory, embedded-video, medical-iot-monitor
   ```

3. Generate the Xcode project:
   ```bash
   xcodegen generate
   ```

4. Open the project in Xcode:
   ```bash
   open *.xcodeproj
   ```

5. Select a simulator from the device menu (e.g., iPhone 15, iPhone 15 Pro)

6. Build and run the app:
   - Press **Cmd+R** to build and run
   - Or go to **Product → Run**

7. The app will launch in the iOS Simulator

8. To create an .app bundle for distribution:
   - **Product → Build** (Cmd+B)
   - Find the .app in DerivedData directory
   - Or use **Product → Archive** to create an archive

### Building Expo Apps for iOS

For Expo-based apps, iOS builds require additional configuration and are typically done via EAS Build service. Refer to the [Expo documentation](https://docs.expo.dev/build/introduction/) for iOS build instructions.

## Automated Builds via GitHub Actions

The repository includes GitHub Actions workflows that automatically build all mobile apps:

- **Android**: `.github/workflows/release-android.yml`
- **iOS**: `.github/workflows/release-ios.yml`

These workflows:
1. Build all mobile applications
2. Create GitHub releases
3. Upload APK/IPA files as release assets

To trigger a build:
1. Push changes to the `main` branch that affect mobile app directories
2. Or manually trigger via GitHub Actions UI: "Run workflow"

## Download Pre-built Apps

Pre-built applications are available as GitHub release assets:

- **Android APKs**: [android-artifacts-latest](https://github.com/delongkevin/FullStackEngineer/releases/tag/android-artifacts-latest)
- **iOS Simulators**: [ios-artifacts-latest](https://github.com/delongkevin/FullStackEngineer/releases/tag/ios-artifacts-latest)

Direct download links are provided on each project's detail page in the portfolio website.

## Troubleshooting

### Android Build Issues

1. **Gradle sync fails**:
   - Ensure you have JDK 17 or later installed
   - Check your Android SDK installation
   - Clear Gradle cache: `./gradlew clean`

2. **Build tools not found**:
   - Open Android Studio → SDK Manager
   - Install required SDK versions and build tools

3. **Out of memory errors**:
   - Increase Gradle heap size in `gradle.properties`:
     ```
     org.gradle.jvmargs=-Xmx2048m
     ```

### iOS Build Issues

1. **XcodeGen not found**:
   - Install via Homebrew: `brew install xcodegen`

2. **Code signing errors**:
   - For simulator builds, disable code signing: `CODE_SIGNING_ALLOWED=NO`
   - For device builds, configure provisioning profiles in Xcode

3. **Deployment target errors**:
   - Ensure your Xcode version supports the deployment target
   - Update deployment target in `project.yml` if needed

## Additional Resources

- [Android Developer Documentation](https://developer.android.com/)
- [iOS Developer Documentation](https://developer.apple.com/documentation/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

## Support

For issues or questions about building these applications, please:
1. Check the workflow files in `.github/workflows/`
2. Review the project README
3. Open an issue on the GitHub repository
