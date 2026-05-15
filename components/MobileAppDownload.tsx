'use client';

import { useState, useEffect } from 'react';
import { Download, Smartphone, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getDownloadInfo, getCompilationInstructions, checkReleaseAssetExists, type DownloadInfo } from '../lib/downloadUtils';

interface MobileAppDownloadProps {
  androidUrl?: string;
  iosUrl?: string;
  projectTitle: string;
}

export default function MobileAppDownload({ androidUrl, iosUrl, projectTitle }: MobileAppDownloadProps) {
  const [downloads, setDownloads] = useState<DownloadInfo[]>([]);
  const [availability, setAvailability] = useState<Record<string, boolean | null>>({});
  const [expandedInstructions, setExpandedInstructions] = useState<Record<string, boolean>>({});
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const downloadInfos = getDownloadInfo(androidUrl, iosUrl);
    setDownloads(downloadInfos);

    // Check availability of direct download links
    const checkAvailability = async () => {
      const results: Record<string, boolean | null> = {};

      for (const info of downloadInfos) {
        if (info.isDirectDownload) {
          try {
            const exists = await checkReleaseAssetExists(info.url);
            results[info.url] = exists;
          } catch {
            results[info.url] = null; // Unknown state
          }
        } else {
          results[info.url] = true; // Source links are always "available"
        }
      }

      setAvailability(results);
      setChecking(false);
    };

    checkAvailability();
  }, [androidUrl, iosUrl]);

  const toggleInstructions = (platform: string) => {
    setExpandedInstructions((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  if (downloads.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t theme-border">
      <p className="text-sm font-semibold theme-text-secondary mb-3 flex items-center gap-2">
        <Smartphone size={16} aria-hidden="true" />
        Download Mobile App
      </p>
      <div className="space-y-3">
        {downloads.map((download) => {
          const isAvailable = availability[download.url];
          const isChecking = checking;
          const platformEmoji = download.platform === 'android' ? '🤖' : '🍎';
          const platformName = download.platform === 'android' ? 'Android APK' : 'iOS App';
          const instructions = getCompilationInstructions(download.platform, projectTitle);
          const isExpanded = expandedInstructions[download.platform];

          return (
            <div key={download.url} className="surface-subtle rounded-lg p-4">
              {/* Download Button or Status */}
              {download.isDirectDownload ? (
                <>
                  {isChecking ? (
                    <div className="flex items-center gap-2 text-sm theme-text-secondary">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Checking availability...
                    </div>
                  ) : isAvailable ? (
                    <a
                      href={download.url}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                      download={download.fileName}
                      aria-label={`Download ${platformName} for ${projectTitle}`}
                    >
                      <Download size={16} aria-hidden="true" />
                      <span>{platformEmoji} Download {platformName}</span>
                    </a>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm theme-text-secondary bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-yellow-600 dark:text-yellow-500" aria-hidden="true" />
                        <div>
                          <p className="font-medium text-yellow-800 dark:text-yellow-400">
                            Download Not Available
                          </p>
                          <p className="mt-1 text-yellow-700 dark:text-yellow-500">
                            The pre-built {platformName} is currently unavailable. You can build it yourself using the instructions below.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Compilation Instructions - Always shown if download is unavailable */}
                  {(!isChecking && !isAvailable) || isExpanded ? (
                    <div className="mt-3 pt-3 border-t theme-border">
                      <button
                        onClick={() => toggleInstructions(download.platform)}
                        className="flex items-center gap-2 text-sm font-medium theme-text-primary hover:opacity-80 transition-opacity"
                        aria-expanded={isExpanded}
                        aria-controls={`instructions-${download.platform}`}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {isExpanded ? 'Hide' : 'Show'} Build Instructions
                      </button>

                      {isExpanded && (
                        <div id={`instructions-${download.platform}`} className="mt-3 space-y-3 text-sm">
                          <div>
                            <h4 className="font-semibold theme-text-primary mb-2">{instructions.title}</h4>

                            <div className="mb-3">
                              <p className="font-medium theme-text-secondary mb-1">Requirements:</p>
                              <ul className="list-disc list-inside space-y-1 theme-text-secondary">
                                {instructions.requirements.map((req, idx) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <p className="font-medium theme-text-secondary mb-1">Steps:</p>
                              <ol className="list-decimal list-inside space-y-2 theme-text-secondary">
                                {instructions.steps.map((step, idx) => (
                                  <li key={idx} className="pl-2">
                                    <span dangerouslySetInnerHTML={{ __html: step.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">$1</code>') }} />
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>

                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <p className="text-xs text-blue-800 dark:text-blue-400">
                              <strong>Note:</strong> For detailed build instructions and troubleshooting, please refer to the{' '}
                              <a
                                href="https://github.com/delongkevin/FullStackEngineer/blob/main/README.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:opacity-80"
                              >
                                project README
                              </a>
                              {' '}and the workflow files in the{' '}
                              <a
                                href={`https://github.com/delongkevin/FullStackEngineer/tree/main/.github/workflows/release-${download.platform}.yml`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:opacity-80"
                              >
                                .github/workflows directory
                              </a>.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : isAvailable && !isExpanded ? (
                    <button
                      onClick={() => toggleInstructions(download.platform)}
                      className="mt-2 text-xs theme-text-tertiary hover:theme-text-secondary transition-colors flex items-center gap-1"
                      aria-expanded={isExpanded}
                      aria-controls={`instructions-${download.platform}`}
                    >
                      <ChevronDown size={14} />
                      Or build it yourself
                    </button>
                  ) : null}
                </>
              ) : (
                // For source code links (not direct downloads)
                <a
                  href={download.url}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 transition-colors text-sm font-medium"
                  style={{ background: 'var(--surface-3)', color: 'var(--text-1)', border: '1px solid var(--border-soft)' }}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${download.platform} source for ${projectTitle}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                  <span>{platformEmoji} {platformName} Source</span>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
