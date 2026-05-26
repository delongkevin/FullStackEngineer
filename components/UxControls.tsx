'use client';

import { useEffect, useRef, useState } from 'react';
import { Monitor, Moon, Sun, Contrast, Type, Minus, Plus } from 'lucide-react';
import { createPortal } from 'react-dom';

type ThemeMode = 'light' | 'dark' | 'contrast';
type ThemeTone = 'soft' | 'balanced' | 'vivid';
type DensityMode = 'comfortable' | 'compact';
type FontScale = 'sm' | 'md' | 'lg';
type TextContrast = 'soft' | 'balanced' | 'strong';
type AccentPreset = 'blue' | 'teal' | 'amber' | 'rose';
type FontFamilyPreset = 'system' | 'tech' | 'classic';

interface UxPreferences {
  theme: ThemeMode;
  themeTone: ThemeTone;
  density: DensityMode;
  fontScale: FontScale;
  textContrast: TextContrast;
  brightness: number;
  accent: AccentPreset;
  fontFamily: FontFamilyPreset;
}

const UX_PREFS_STORAGE_KEY = 'portfolio-ux-preferences-v1';

const defaultPrefs: UxPreferences = {
  theme: 'light',
  themeTone: 'balanced',
  density: 'comfortable',
  fontScale: 'md',
  textContrast: 'balanced',
  brightness: 100,
  accent: 'blue',
  fontFamily: 'system',
};

export default function UxControls() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDisplayOpen, setIsDisplayOpen] = useState(false);
  const [prefs, setPrefs] = useState<UxPreferences>(defaultPrefs);
  const displayButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const raw = window.localStorage.getItem(UX_PREFS_STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as Partial<UxPreferences>;
      setPrefs({
        theme: parsed.theme === 'dark' || parsed.theme === 'contrast' ? parsed.theme : 'light',
        themeTone: parsed.themeTone === 'soft' || parsed.themeTone === 'vivid' ? parsed.themeTone : 'balanced',
        density: parsed.density === 'compact' ? 'compact' : 'comfortable',
        fontScale: parsed.fontScale === 'sm' || parsed.fontScale === 'lg' ? parsed.fontScale : 'md',
        textContrast: parsed.textContrast === 'soft' || parsed.textContrast === 'strong' ? parsed.textContrast : 'balanced',
        brightness: typeof parsed.brightness === 'number' ? Math.min(Math.max(parsed.brightness, 85), 120) : 100,
        accent:
          parsed.accent === 'teal' || parsed.accent === 'amber' || parsed.accent === 'rose'
            ? parsed.accent
            : 'blue',
        fontFamily:
          parsed.fontFamily === 'tech' || parsed.fontFamily === 'classic'
            ? parsed.fontFamily
            : 'system',
      });
    } catch {
      setPrefs(defaultPrefs);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    window.localStorage.setItem(UX_PREFS_STORAGE_KEY, JSON.stringify(prefs));

    const root = document.documentElement;
    root.dataset.theme = prefs.theme;
    root.dataset.themeTone = prefs.themeTone;
    root.dataset.density = prefs.density;
    root.dataset.fontScale = prefs.fontScale;
    root.dataset.textContrast = prefs.textContrast;
    root.dataset.accent = prefs.accent;
    root.dataset.fontFamily = prefs.fontFamily;
    root.style.setProperty('--ui-brightness', `${prefs.brightness}%`);
  }, [isMounted, prefs]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDisplayOpen(false);
        displayButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!isDisplayOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isDisplayOpen]);

  const adjustFontScale = (direction: 'up' | 'down') => {
    const order: FontScale[] = ['sm', 'md', 'lg'];
    setPrefs((current) => {
      const index = order.indexOf(current.fontScale);
      const nextIndex = direction === 'up' ? Math.min(index + 1, 2) : Math.max(index - 1, 0);
      return { ...current, fontScale: order[nextIndex] };
    });
  };

  const resetDisplayPreferences = () => {
    setPrefs(defaultPrefs);
  };

  const choiceButtonClassName = 'px-2 py-2 rounded-lg border text-xs font-semibold theme-border theme-text-primary surface-subtle';

  const renderDisplayPanelContent = () => (
    <>
      <div className="sticky top-0 z-10 -mx-4 px-4 pt-1 pb-3 mb-3 surface-card border-b theme-border">
        <div className="w-12 h-1.5 mx-auto mb-3 rounded-full" style={{ background: 'var(--border-soft)' }} aria-hidden="true" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold theme-text-primary mb-1">Display Preferences</p>
            <p className="text-xs theme-text-secondary">Tune palette, typography, spacing, and readability for any screen.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsDisplayOpen(false)}
            className="px-3 py-1.5 rounded-lg border theme-border text-xs font-semibold theme-text-secondary surface-subtle hover:opacity-90"
            aria-label="Close display preferences"
          >
            Done
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide theme-text-tertiary">Theme</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPrefs((current) => ({ ...current, theme: 'light' }))}
            className={choiceButtonClassName}
            style={prefs.theme === 'light' ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#ffffff' } : undefined}
          >
            <Sun size={14} className="mx-auto mb-1" aria-hidden="true" />
            Light
          </button>
          <button
            type="button"
            onClick={() => setPrefs((current) => ({ ...current, theme: 'dark' }))}
            className={choiceButtonClassName}
            style={prefs.theme === 'dark' ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#ffffff' } : undefined}
          >
            <Moon size={14} className="mx-auto mb-1" aria-hidden="true" />
            Dark
          </button>
          <button
            type="button"
            onClick={() => setPrefs((current) => ({ ...current, theme: 'contrast' }))}
            className={choiceButtonClassName}
            style={prefs.theme === 'contrast' ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#ffffff' } : undefined}
          >
            <Contrast size={14} className="mx-auto mb-1" aria-hidden="true" />
            Contrast
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide theme-text-tertiary">Accent Color</p>
        <div className="grid grid-cols-4 gap-2">
          {([
            { key: 'blue', label: 'Blue' },
            { key: 'teal', label: 'Teal' },
            { key: 'amber', label: 'Amber' },
            { key: 'rose', label: 'Rose' },
          ] as { key: AccentPreset; label: string }[]).map((accent) => (
            <button
              key={accent.key}
              type="button"
              onClick={() => setPrefs((current) => ({ ...current, accent: accent.key }))}
              className="px-2 py-2 rounded-lg border text-xs font-semibold theme-border theme-text-primary surface-subtle"
              style={prefs.accent === accent.key ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#ffffff' } : undefined}
            >
              {accent.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide theme-text-tertiary">Font Family</p>
        <div className="grid grid-cols-3 gap-2">
          {([
            { key: 'system', label: 'Modern' },
            { key: 'tech', label: 'Tech' },
            { key: 'classic', label: 'Classic' },
          ] as { key: FontFamilyPreset; label: string }[]).map((fontOption) => (
            <button
              key={fontOption.key}
              type="button"
              onClick={() => setPrefs((current) => ({ ...current, fontFamily: fontOption.key }))}
              className="px-2 py-2 rounded-lg border text-xs font-semibold theme-border theme-text-primary surface-subtle"
              style={prefs.fontFamily === fontOption.key ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#ffffff' } : undefined}
            >
              {fontOption.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide theme-text-tertiary">Theme Tone</p>
        <div className="grid grid-cols-3 gap-2">
          {(['soft', 'balanced', 'vivid'] as ThemeTone[]).map((tone) => (
            <button
              key={tone}
              type="button"
              onClick={() => setPrefs((current) => ({ ...current, themeTone: tone }))}
              className={choiceButtonClassName}
              style={prefs.themeTone === tone ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#ffffff' } : undefined}
            >
              {tone[0].toUpperCase() + tone.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide theme-text-tertiary">Density</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPrefs((current) => ({ ...current, density: 'comfortable' }))}
            className="px-3 py-2 rounded-lg border text-xs font-semibold theme-border theme-text-primary surface-subtle"
            style={prefs.density === 'comfortable' ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#ffffff' } : undefined}
          >
            Comfortable
          </button>
          <button
            type="button"
            onClick={() => setPrefs((current) => ({ ...current, density: 'compact' }))}
            className="px-3 py-2 rounded-lg border text-xs font-semibold theme-border theme-text-primary surface-subtle"
            style={prefs.density === 'compact' ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#ffffff' } : undefined}
          >
            Compact
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide theme-text-tertiary">Text Contrast</p>
        <div className="grid grid-cols-3 gap-2">
          {(['soft', 'balanced', 'strong'] as TextContrast[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setPrefs((current) => ({ ...current, textContrast: mode }))}
              className={choiceButtonClassName}
              style={prefs.textContrast === mode ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#ffffff' } : undefined}
            >
              {mode[0].toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide theme-text-tertiary">Brightness</p>
        <div className="space-y-2 mb-4">
          <input
            type="range"
            min="85"
            max="120"
            step="5"
            value={prefs.brightness}
            onChange={(event) => setPrefs((current) => ({ ...current, brightness: Number(event.target.value) }))}
            className="w-full"
            style={{ accentColor: 'var(--accent)' }}
            aria-label="Adjust interface brightness"
          />
          <div className="flex items-center justify-between text-xs theme-text-secondary">
            <span>Dim</span>
            <span>{prefs.brightness}%</span>
            <span>Bright</span>
          </div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide theme-text-tertiary">Font Scale</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => adjustFontScale('down')}
            className="px-2 py-2 rounded-lg border theme-border theme-text-primary surface-subtle"
            aria-label="Decrease font scale"
          >
            <Minus size={14} aria-hidden="true" />
          </button>
          <div className="flex-1 rounded-lg border theme-border px-3 py-2 text-xs font-semibold theme-text-primary flex items-center justify-center gap-2 surface-subtle">
            <Type size={14} aria-hidden="true" />
            {prefs.fontScale === 'sm' ? 'Small' : prefs.fontScale === 'lg' ? 'Large' : 'Default'}
          </div>
          <button
            type="button"
            onClick={() => adjustFontScale('up')}
            className="px-2 py-2 rounded-lg border theme-border theme-text-primary surface-subtle"
            aria-label="Increase font scale"
          >
            <Plus size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t theme-border flex justify-end">
        <button
          type="button"
          onClick={resetDisplayPreferences}
          className="px-3 py-2 rounded-lg border theme-border text-xs font-semibold theme-text-secondary surface-subtle hover:opacity-90"
        >
          Reset to defaults
        </button>
      </div>
    </>
  );

  const displayOverlay = (
    <div
      className="fixed inset-0 z-[90] flex items-end md:items-start md:justify-end"
      style={{ background: 'var(--overlay-bg)' }}
      onClick={() => setIsDisplayOpen(false)}
    >
      <div
        id="display-controls"
        className="w-full md:w-80 md:mt-20 md:mr-4 rounded-t-2xl md:rounded-xl surface-card p-4 shadow-xl overflow-y-auto"
        style={{
          maxHeight: 'min(90dvh, calc(100svh - 0.75rem))',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
        }}
        role="dialog"
        aria-label="Display preferences"
        onClick={(event) => event.stopPropagation()}
      >
        {renderDisplayPanelContent()}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          ref={displayButtonRef}
          type="button"
          onClick={() => setIsDisplayOpen((current) => !current)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border theme-border text-sm font-semibold theme-text-primary hover:opacity-90 surface-card"
          aria-expanded={isDisplayOpen}
          aria-controls="display-controls"
        >
          <Monitor size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Display</span>
        </button>
      </div>

      {isMounted && isDisplayOpen ? createPortal(displayOverlay, document.body) : null}

    </>
  );
}
