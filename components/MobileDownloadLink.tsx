'use client';

import { useMemo, useState } from 'react';

type Platform = 'android' | 'ios';

type ReleaseDownloadParts = {
  owner: string;
  repo: string;
  tag: string;
  assetName: string;
};

function parseGithubReleaseDownloadUrl(url: string): ReleaseDownloadParts | null {
  const match = url.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/([^/]+)$/i
  );
  if (!match) return null;
  const [, owner, repo, tag, assetName] = match;
  return { owner, repo, tag, assetName };
}

function getWorkflowUrl(platform: Platform): string {
  if (platform === 'android') {
    return 'https://github.com/delongkevin/FullStackEngineer/actions/workflows/release-android.yml';
  }
  return 'https://github.com/delongkevin/FullStackEngineer/actions/workflows/release-ios.yml';
}

function getLocalBuildInstructions(platform: Platform): string[] {
  if (platform === 'android') {
    return [
      'Clone the repo and install prerequisites: JDK 17 + Android SDK',
      'Native apps: cd android && ./gradlew :<module>:assembleDebug',
      'Expo apps: cd <app> && npm ci && npx expo prebuild --platform android --clean && cd android && ./gradlew assembleDebug',
    ];
  }

  return [
    'Native SwiftUI apps: cd ios/<app> && xcodegen generate && xcodebuild -sdk iphonesimulator -configuration Debug build',
    'Expo apps: cd <app> && npm ci && npx expo prebuild --platform ios --clean && npx pod-install --non-interactive && xcodebuild -workspace ios/*.xcworkspace -scheme <scheme> -sdk iphonesimulator build',
    'Package simulator builds: zip `Payload/<App>.app` as `<name>-ios-sim.ipa` (IPA is a ZIP container)',
  ];
}

async function githubReleaseHasAsset(parts: ReleaseDownloadParts): Promise<boolean> {
  const url = `https://api.github.com/repos/${parts.owner}/${parts.repo}/releases/tags/${encodeURIComponent(parts.tag)}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  });

  if (!response.ok) return false;
  const release = (await response.json()) as { assets?: Array<{ name: string }> };
  return Boolean(release.assets?.some((asset) => asset.name === parts.assetName));
}

export default function MobileDownloadLink({
  href,
  platform,
  projectTitle,
  className,
  style,
  ariaLabel,
  children,
}: {
  href: string;
  platform: Platform;
  projectTitle: string;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  const parts = useMemo(() => parseGithubReleaseDownloadUrl(href), [href]);
  const workflowUrl = useMemo(() => getWorkflowUrl(platform), [platform]);
  const [isChecking, setIsChecking] = useState(false);
  const [isUnavailableOpen, setIsUnavailableOpen] = useState(false);

  const instructions = useMemo(() => getLocalBuildInstructions(platform), [platform]);

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = async (event) => {
    if (!parts) return;

    event.preventDefault();
    if (isChecking) return;
    setIsChecking(true);

    try {
      const hasAsset = await githubReleaseHasAsset(parts);
      if (hasAsset) {
        window.location.assign(href);
        return;
      }

      setIsUnavailableOpen(true);
    } catch {
      window.location.assign(href);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <a
        href={href}
        onClick={onClick}
        className={className}
        style={style}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        aria-disabled={isChecking}
      >
        {children}
      </a>

      {isUnavailableOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsUnavailableOpen(false)}
            aria-label="Close download instructions"
          />
          <div
            className="relative w-full max-w-lg rounded-xl surface-card shadow-2xl p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Download not available"
          >
            <p className="text-lg font-bold theme-text-primary mb-2">Download not available</p>
            <p className="text-sm theme-text-secondary mb-4">
              The requested {platform === 'android' ? 'Android APK' : 'iOS IPA'} for <span className="font-semibold">{projectTitle}</span>{' '}
              is not currently published in the GitHub Release tag <span className="font-mono">{parts.tag}</span>.
            </p>

            <div className="space-y-2 mb-4">
              <p className="text-sm font-semibold theme-text-primary">How to compile it</p>
              <ol className="list-decimal list-inside space-y-1 text-sm theme-text-secondary">
                {instructions.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={workflowUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
              >
                Open build workflow
              </a>
              <button
                type="button"
                onClick={() => setIsUnavailableOpen(false)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border theme-border text-sm font-semibold theme-text-primary hover:opacity-90 surface-subtle"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

