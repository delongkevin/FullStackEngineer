'use client';

import { useState } from 'react';
import { Copy, ExternalLink, RefreshCw } from 'lucide-react';

interface ProjectDemoEmbedProps {
  liveUrl: string;
  title: string;
  category: string;
}

export default function ProjectDemoEmbed({ liveUrl, title, category }: ProjectDemoEmbedProps) {
  const [iframeKey, setIframeKey] = useState(0);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }

    setTimeout(() => {
      setCopyStatus('idle');
    }, 1500);
  };

  return (
    <div className="bg-gray-100 rounded-lg p-6 min-h-[600px]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-gray-600">
          Run the interactive demo directly in this page, or open it in a dedicated tab for full-screen testing.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIframeKey((value) => value + 1)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Reload Demo
          </button>
          <a
            href={liveUrl}
            target={liveUrl.startsWith('http') ? '_blank' : '_self'}
            rel={liveUrl.startsWith('http') ? 'noopener noreferrer' : ''}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-300 bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 transition-colors"
          >
            <ExternalLink size={16} aria-hidden="true" />
            Open Demo
          </a>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
            aria-live="polite"
          >
            <Copy size={16} aria-hidden="true" />
            {copyStatus === 'copied' ? 'Copied' : copyStatus === 'error' ? 'Copy Failed' : 'Copy Link'}
          </button>
        </div>
      </div>

      <p id="demo-description" className="sr-only">
        This interactive demo allows you to try {title}. Use keyboard navigation to interact with the embedded content.
      </p>
      <iframe
        key={iframeKey}
        src={liveUrl}
        className="w-full h-[600px] border-0 rounded-lg bg-white"
        title={`Interactive demo of ${title} - ${category} project`}
        aria-describedby="demo-description"
        loading="lazy"
        sandbox="allow-forms allow-scripts allow-same-origin"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
}
