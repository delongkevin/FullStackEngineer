#!/usr/bin/env bash
set -euo pipefail

# Codespace-safe Android APK build workflow:
# - no emulator dependency
# - compiles all native Android modules
# - verifies and collects APK artifacts

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="$REPO_ROOT/android"
ARTIFACT_DIR="$REPO_ROOT/public/apk-artifacts"
LOCAL_SDK_DEFAULT="$REPO_ROOT/android-sdk"
SKIP_CLEAN=0

usage() {
  cat <<'EOF'
Usage: scripts/build-all-android-apks.sh [options]

Options:
  --skip-clean   Skip `clean` and run only `assembleDebug`
  -h, --help     Show help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-clean) SKIP_CLEAN=1 ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 2
      ;;
  esac
  shift
done

log() {
  printf '\n[%s] %s\n' "$(date +%H:%M:%S)" "$*"
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Required command not found: $1" >&2
    exit 1
  }
}

# Prefer JDK 21 if available to avoid AGP/Kotlin issues with JDK 25.
if [[ -z "${JAVA_HOME:-}" && -d "/home/codespace/java/21.0.9-ms" ]]; then
  export JAVA_HOME="/home/codespace/java/21.0.9-ms"
fi

if [[ -n "${JAVA_HOME:-}" ]]; then
  export PATH="$JAVA_HOME/bin:$PATH"
fi

require_cmd java
JAVA_VERSION_RAW="$(java -version 2>&1 | head -n1)"
if [[ "$JAVA_VERSION_RAW" == *'25.'* ]]; then
  if [[ -d "/home/codespace/java/21.0.9-ms" ]]; then
    export JAVA_HOME="/home/codespace/java/21.0.9-ms"
    export PATH="$JAVA_HOME/bin:$PATH"
    JAVA_VERSION_RAW="$(java -version 2>&1 | head -n1)"
  else
    echo "Java 25 detected. Set JAVA_HOME to JDK 21 before building Android APKs." >&2
    exit 1
  fi
fi

# SDK location: prefer existing ANDROID_HOME, else repo-local sdk.
if [[ -z "${ANDROID_HOME:-}" ]]; then
  export ANDROID_HOME="$LOCAL_SDK_DEFAULT"
fi
export ANDROID_SDK_ROOT="$ANDROID_HOME"

if [[ ! -d "$ANDROID_HOME" ]]; then
  echo "Android SDK not found at: $ANDROID_HOME" >&2
  echo "Install SDK first or set ANDROID_HOME to a valid SDK path." >&2
  exit 1
fi

export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"
require_cmd sdkmanager

log "Using Java: $JAVA_VERSION_RAW"
log "Using Android SDK: $ANDROID_HOME"

log "Ensuring required Android SDK packages exist"
set +o pipefail
yes | sdkmanager --sdk_root="$ANDROID_HOME" \
  "platform-tools" \
  "platforms;android-34" \
  "build-tools;34.0.0" >/dev/null
sdk_status=${PIPESTATUS[1]}
set -o pipefail
if [[ $sdk_status -ne 0 ]]; then
  echo "sdkmanager failed while installing required packages." >&2
  exit 1
fi

# Keep Gradle SDK path deterministic in this workspace (gitignored).
printf 'sdk.dir=%s\n' "$ANDROID_HOME" > "$ANDROID_DIR/local.properties"
chmod +x "$ANDROID_DIR/gradlew"

TASKS=(assembleDebug)
if [[ $SKIP_CLEAN -eq 0 ]]; then
  TASKS=(clean assembleDebug)
fi

log "Running Gradle tasks: ${TASKS[*]}"
(
  cd "$ANDROID_DIR"
  ./gradlew "${TASKS[@]}" --no-daemon
)

APKS=(
  "book-app/book-app-debug.apk"
  "computer-store/computer-store-debug.apk"
  "embedded-video/embedded-video-debug.apk"
  "kamps-factory/kamps-factory-debug.apk"
  "medical-iot-monitor/medical-iot-monitor-debug.apk"
  "poker-app/poker-app-debug.apk"
  "insurance-app/insurance-app-debug.apk"
)

mkdir -p "$ARTIFACT_DIR"
rm -f "$ARTIFACT_DIR"/*.apk

log "Verifying and collecting APK outputs"
for item in "${APKS[@]}"; do
  module="${item%%/*}"
  apk_name="${item##*/}"
  src="$ANDROID_DIR/$module/build/outputs/apk/debug/$apk_name"
  if [[ ! -f "$src" ]]; then
    echo "Missing APK: $src" >&2
    exit 1
  fi
  cp "$src" "$ARTIFACT_DIR/$apk_name"
  ls -lh "$ARTIFACT_DIR/$apk_name"
done

log "APK build complete. Collected artifacts:"
find "$ARTIFACT_DIR" -maxdepth 1 -name '*.apk' -print | sort
