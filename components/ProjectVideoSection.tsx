'use client';

import { PlayCircle, Video } from 'lucide-react';

interface ProjectVideoSectionProps {
  videoUrl?: string;
  projectTitle: string;
}

function isValidEmbedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const isYouTube =
      (parsed.hostname === 'www.youtube.com' || parsed.hostname === 'youtube.com') &&
      parsed.pathname.startsWith('/embed/');
    const isVimeo =
      parsed.hostname === 'player.vimeo.com' && parsed.pathname.startsWith('/video/');
    return isYouTube || isVimeo;
  } catch {
    return false;
  }
}

export default function ProjectVideoSection({ videoUrl, projectTitle }: ProjectVideoSectionProps) {
  const hasVideo = !!videoUrl && isValidEmbedUrl(videoUrl);

  // Don't render anything if no video is available
  if (!hasVideo) {
    return null;
  }

  return (
    <section className="surface-card rounded-xl shadow-lg p-6 mt-8" aria-label="Technical overview video">
      <div className="flex items-center gap-3 mb-4">
        <Video size={22} className="text-blue-500" aria-hidden="true" />
        <h2 className="text-2xl font-bold theme-text-primary">Technical Overview</h2>
      </div>
      <p className="theme-text-secondary mb-6 text-sm">
        Watch a technical walkthrough explaining the architecture, key design decisions, and
        implementation highlights of this project.
      </p>

      <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={videoUrl}
          className="absolute inset-0 w-full h-full border-0"
          title={`${projectTitle} – Technical Overview`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </section>
  );
}
