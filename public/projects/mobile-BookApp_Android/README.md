# Book App Android Demo

This project is a demo Android app module for the portfolio.

## Current Structure

The app module uses:
- `app/src/main/AndroidManifest.xml`
- Kotlin source under `java/`
- Android resources under `res/`

The Gradle module is configured via `sourceSets` in `app/build.gradle.kts` to consume those directories directly.

## Build (Local)

From this folder, if Gradle is installed globally:

```bash
gradle :app:assembleDebug
```

Or from the workspace root, using the shared Android wrapper:

```bash
/workspaces/FullStackEngineer/android/gradlew -p /workspaces/FullStackEngineer/public/projects/mobile-BookApp_Android :app:assembleDebug
```

Recommended environment variables:

```bash
export JAVA_HOME=/usr/local/sdkman/candidates/java/21.0.9-ms
export PATH=$JAVA_HOME/bin:$PATH
export ANDROID_HOME=/workspaces/FullStackEngineer/android-sdk
export ANDROID_SDK_ROOT=/workspaces/FullStackEngineer/android-sdk
```

## Verification Status

- Build path verification: reached Gradle configuration, Android resource processing, and Kotlin compilation successfully after project fixes.
- Current blocker in this container: Java image transform step fails in `:app:compileDebugJavaWithJavac` (`JdkImageTransform`/`jlink`) with the current toolchain combination.
- Additional environment warning observed: SDK XML schema mismatch from mixed Android command-line tool versions.

## Blocker Resolution

If assemble fails at `JdkImageTransform`/`jlink`:

1. Use JDK 17 for Android Gradle Plugin 8.1.x projects.
2. Ensure `ANDROID_HOME`/`ANDROID_SDK_ROOT` point to a consistent SDK installation.
3. Update command-line tools and platform packages to matching generations.
4. Re-run:

```bash
/workspaces/FullStackEngineer/android/gradlew -p /workspaces/FullStackEngineer/public/projects/mobile-BookApp_Android :app:clean :app:assembleDebug --refresh-dependencies
```

## Notes

- If your environment does not have Android SDK configured, set:
  - `ANDROID_HOME` (or `ANDROID_SDK_ROOT`)
  - required Build Tools and Platform packages
- If build cache or plugin metadata gets stale, run with `--refresh-dependencies`.
