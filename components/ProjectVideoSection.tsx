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
    const isYouTubeShort =
      parsed.hostname === 'youtu.be';
    const isVimeo =
      (parsed.hostname === 'player.vimeo.com') && parsed.pathname.startsWith('/video/');
    return isYouTube || isYouTubeShort || isVimeo;
  } catch {
    return false;
  }
}

export default function ProjectVideoSection({ videoUrl, projectTitle }: ProjectVideoSectionProps) {
  const hasVideo = !!videoUrl && isValidEmbedUrl(videoUrl);

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

      {hasVideo ? (
        <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ paddingTop: '56.25%' }}>
          <iframe
            src={videoUrl}
            className="absolute inset-0 w-full h-full border-0"
            title={`Technical overview video for ${projectTitle}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-lg text-center gap-4 py-16 px-6"
          style={{
            background: 'var(--surface-2)',
            border: '2px dashed var(--border-soft)',
          }}
        >
          <PlayCircle size={56} className="text-blue-400 opacity-60" aria-hidden="true" />
          <div>
            <p className="text-lg font-semibold theme-text-primary">Video Presentation Coming Soon</p>
            <p className="theme-text-secondary text-sm mt-2 max-w-md">
              An AI-generated video walkthrough explaining the technical details of this project will
              be added here. The presenter will cover architecture decisions, technology choices, and
              key implementation highlights.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <PlayCircle size={12} aria-hidden="true" />
            In Production
          </span>
        </div>
      )}
    </section>
  );
}
