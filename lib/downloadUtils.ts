/**
 * Utilities for handling mobile app downloads from GitHub releases
 */

export interface DownloadInfo {
  platform: 'android' | 'ios';
  url: string;
  isDirectDownload: boolean;
  fileName?: string;
}

/**
 * Check if a URL is a GitHub release download URL
 */
export function isGitHubReleaseDownload(url: string): boolean {
  return /^https:\/\/github\.com\/[^/]+\/[^/]+\/releases\/download\/.+\/.+\.(apk|zip|ipa)$/i.test(url);
}

/**
 * Extract file name from a GitHub release download URL
 */
export function getFileNameFromUrl(url: string): string | undefined {
  const match = url.match(/\/([^/]+\.(apk|zip|ipa))$/i);
  return match ? match[1] : undefined;
}

/**
 * Parse download information from project URLs
 */
export function getDownloadInfo(androidUrl?: string, iosUrl?: string): DownloadInfo[] {
  const downloads: DownloadInfo[] = [];

  if (androidUrl) {
    downloads.push({
      platform: 'android',
      url: androidUrl,
      isDirectDownload: isGitHubReleaseDownload(androidUrl),
      fileName: getFileNameFromUrl(androidUrl),
    });
  }

  if (iosUrl && iosUrl !== androidUrl) {
    downloads.push({
      platform: 'ios',
      url: iosUrl,
      isDirectDownload: isGitHubReleaseDownload(iosUrl),
      fileName: getFileNameFromUrl(iosUrl),
    });
  }

  return downloads;
}

/**
 * Get compilation instructions for a platform
 */
export function getCompilationInstructions(platform: 'android' | 'ios', projectTitle: string): {
  title: string;
  steps: string[];
  requirements: string[];
} {
  if (platform === 'android') {
    return {
      title: 'Building Android APK',
      requirements: [
        'Android Studio installed',
        'Java Development Kit (JDK) 17 or later',
        'Android SDK with Build Tools',
        'Git for cloning the repository',
      ],
      steps: [
        'Clone the repository: `git clone https://github.com/delongkevin/FullStackEngineer.git`',
        'Navigate to the project root: `cd FullStackEngineer`',
        'Open Android Studio and import the android module',
        'Wait for Gradle sync to complete',
        'Select the appropriate module (e.g., poker-app, computer-store, etc.)',
        'Build the APK: Build → Build Bundle(s) / APK(s) → Build APK(s)',
        'Find the APK in `android/<module-name>/build/outputs/apk/debug/`',
        'Install on your device using `adb install <apk-file>`',
      ],
    };
  } else {
    return {
      title: 'Building iOS App',
      requirements: [
        'macOS computer (iOS development requires macOS)',
        'Xcode 14 or later installed from the App Store',
        'XcodeGen installed: `brew install xcodegen`',
        'iOS Simulator (included with Xcode)',
        'Git for cloning the repository',
      ],
      steps: [
        'Clone the repository: `git clone https://github.com/delongkevin/FullStackEngineer.git`',
        'Navigate to the project root: `cd FullStackEngineer`',
        'Navigate to the iOS module: `cd ios/<module-name>` (e.g., poker-app, computer-store)',
        'Generate the Xcode project: `xcodegen generate`',
        'Open the project in Xcode: `open <AppName>.xcodeproj`',
        'Select a simulator (e.g., iPhone 15) from the device menu',
        'Build and run: Product → Run (or press Cmd+R)',
        'The app will launch in the iOS Simulator',
        'To create an .app bundle for distribution: Product → Build (Cmd+B)',
        'Find the .app in `DerivedData` or archive it: Product → Archive',
      ],
    };
  }
}

/**
 * Check if a GitHub release asset exists (client-side check)
 * Returns a promise that resolves to true if accessible, false otherwise
 */
export async function checkReleaseAssetExists(url: string): Promise<boolean> {
  try {
    // Make a HEAD request to check if the resource exists
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
