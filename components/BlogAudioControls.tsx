'use client';

import { Pause, Play, Square, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BlogAudioControlsProps {
  title: string;
  excerpt: string;
  sections: { heading: string; paragraphs: string[] }[];
}

type SpeechStatus = 'idle' | 'playing' | 'paused' | 'unsupported';

export default function BlogAudioControls({ title, excerpt, sections }: BlogAudioControlsProps) {
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const narration = [title, excerpt, ...sections.flatMap((section) => [section.heading, ...section.paragraphs])].join('. ');

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setStatus('unsupported');
    }

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const startSpeech = () => {
    if (!('speechSynthesis' in window)) {
      setStatus('unsupported');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.lang = 'en-US';
    utterance.onstart = () => setStatus('playing');
    utterance.onpause = () => setStatus('paused');
    utterance.onresume = () => setStatus('playing');
    utterance.onend = () => setStatus('idle');
    utterance.onerror = () => setStatus('idle');
    window.speechSynthesis.speak(utterance);
    setStatus('playing');
  };

  const toggleSpeech = () => {
    if (status === 'playing') {
      window.speechSynthesis.pause();
    } else if (status === 'paused') {
      window.speechSynthesis.resume();
    } else {
      startSpeech();
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setStatus('idle');
  };

  if (status === 'unsupported') {
    return <p className="theme-text-secondary text-sm">Audio playback is not supported by this browser.</p>;
  }

  const isActive = status === 'playing' || status === 'paused';
  const actionLabel = status === 'playing' ? 'Pause reading' : status === 'paused' ? 'Resume reading' : 'Listen to this post';

  return (
    <div className="surface-subtle rounded-lg p-3 sm:p-4 flex flex-wrap items-center gap-3" aria-label="Audio controls">
      <button type="button" onClick={toggleSpeech} className="btn-primary inline-flex items-center gap-2 py-2 px-4" aria-label={actionLabel}>
        {status === 'playing' ? <Pause size={17} aria-hidden="true" /> : status === 'paused' ? <Play size={17} aria-hidden="true" /> : <Volume2 size={17} aria-hidden="true" />}
        <span>{status === 'playing' ? 'Pause' : status === 'paused' ? 'Resume' : 'Listen'}</span>
      </button>
      {isActive && (
        <button type="button" onClick={stopSpeech} className="btn-secondary inline-flex items-center gap-2 py-2 px-4" aria-label="Stop reading">
          <Square size={15} aria-hidden="true" />
          <span>Stop</span>
        </button>
      )}
      <span className="theme-text-secondary text-sm">Uses your browser&apos;s available voice.</span>
    </div>
  );
}