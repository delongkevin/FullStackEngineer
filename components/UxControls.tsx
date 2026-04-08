'use client';

import { useEffect, useRef, useState } from 'react';
import { Command, Monitor, Moon, Sun, Contrast, Type, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ThemeMode = 'light' | 'dark' | 'contrast';
type ThemeTone = 'soft' | 'balanced' | 'vivid';
type DensityMode = 'comfortable' | 'compact';
type FontScale = 'sm' | 'md' | 'lg';
type TextContrast = 'soft' | 'balanced' | 'strong';

interface UxPreferences {
  theme: ThemeMode;
  themeTone: ThemeTone;
  density: DensityMode;
  fontScale: FontScale;
  textContrast: TextContrast;
  brightness: number;
}

const UX_PREFS_STORAGE_KEY = 'portfolio-ux-preferences-v1';

const defaultPrefs: UxPreferences = {
  theme: 'light',
  themeTone: 'balanced',
  density: 'comfortable',
  fontScale: 'md',
  textContrast: 'balanced',
  brightness: 100,
};

export default function UxControls() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isDisplayOpen, setIsDisplayOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [prefs, setPrefs] = useState<UxPreferences>(defaultPrefs);
  const panelRef = useRef<HTMLDivElement>(null);
  const paletteInputRef = useRef<HTMLInputElement>(null);

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
    root.style.setProperty('--ui-brightness', `${prefs.brightness}%`);
  }, [isMounted, prefs]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isCommandPaletteKey = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isCommandPaletteKey) {
        event.preventDefault();
        setIsPaletteOpen((current) => !current);
      }

      if (event.key === 'Escape') {
        setIsDisplayOpen(false);
        setIsPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!isDisplayOpen) {
      return;
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target)) {
        setIsDisplayOpen(false);
      }
    };

    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [isDisplayOpen]);

  useEffect(() => {
    if (!isPaletteOpen) {
      return;
    }

    setPaletteQuery('');
    requestAnimationFrame(() => {
      paletteInputRef.current?.focus();
    });
  }, [isPaletteOpen]);

  const cycleTheme = () => {
    setPrefs((current) => {
      const nextTheme: ThemeMode =
        current.theme === 'light' ? 'dark' : current.theme === 'dark' ? 'contrast' : 'light';
      return { ...current, theme: nextTheme };
    });
  };

  const adjustFontScale = (direction: 'up' | 'down') => {
    const order: FontScale[] = ['sm', 'md', 'lg'];
    setPrefs((current) => {
      const index = order.indexOf(current.fontScale);
      const nextIndex = direction === 'up' ? Math.min(index + 1, 2) : Math.max(index - 1, 0);
      return { ...current, fontScale: order[nextIndex] };
    });
  };

  const commands = [
    {
      id: 'go-home',
      label: 'Go to Home',
      keywords: 'home landing',
      run: () => router.push('/'),
    },
    {
      id: 'go-projects',
      label: 'Go to Projects',
      keywords: 'projects work portfolio',
      run: () => router.push('/projects'),
    },
    {
      id: 'go-resume',
      label: 'Go to Resume',
      keywords: 'resume cv experience',
      run: () => router.push('/resume'),
    },
    {
      id: 'go-about',
      label: 'Go to About',
      keywords: 'about profile',
      run: () => router.push('/about'),
    },
    {
      id: 'go-contact',
      label: 'Go to Contact',
      keywords: 'contact email',
      run: () => router.push('/contact'),
    },
    {
      id: 'theme-cycle',
      label: 'Cycle Theme Mode',
      keywords: 'theme dark light contrast',
      run: cycleTheme,
    },
    {
      id: 'theme-tone-cycle',
      label: 'Cycle Theme Tone',
      keywords: 'theme tone soft vivid balanced',
      run: () =>
        setPrefs((current) => ({
          ...current,
          themeTone:
            current.themeTone === 'soft'
              ? 'balanced'
              : current.themeTone === 'balanced'
                ? 'vivid'
                : 'soft',
        })),
    },
    {
      id: 'density-toggle',
      label: 'Toggle Compact Density',
      keywords: 'density compact spacing',
      run: () =>
        setPrefs((current) => ({
          ...current,
          density: current.density === 'comfortable' ? 'compact' : 'comfortable',
        })),
    },
    {
      id: 'font-increase',
      label: 'Increase Font Scale',
      keywords: 'font text scale larger',
      run: () => adjustFontScale('up'),
    },
    {
      id: 'font-decrease',
      label: 'Decrease Font Scale',
      keywords: 'font text scale smaller',
      run: () => adjustFontScale('down'),
    },
    {
      id: 'text-contrast-cycle',
      label: 'Cycle Text Contrast',
      keywords: 'text contrast font readability soft strong',
      run: () =>
        setPrefs((current) => ({
          ...current,
          textContrast:
            current.textContrast === 'soft'
              ? 'balanced'
              : current.textContrast === 'balanced'
                ? 'strong'
                : 'soft',
        })),
    },
    {
      id: 'brightness-increase',
      label: 'Increase Brightness',
      keywords: 'brightness lighter brighter',
      run: () => setPrefs((current) => ({ ...current, brightness: Math.min(current.brightness + 5, 120) })),
    },
    {
      id: 'brightness-decrease',
      label: 'Decrease Brightness',
      keywords: 'brightness darker dimmer',
      run: () => setPrefs((current) => ({ ...current, brightness: Math.max(current.brightness - 5, 85) })),
    },
  ];

  const filteredCommands = (() => {
    const q = paletteQuery.trim().toLowerCase();
    if (!q) {
      return commands;
    }

    return commands.filter((command) => {
      return command.label.toLowerCase().includes(q) || command.keywords.toLowerCase().includes(q);
    });
  })();

  const executeCommand = (command: (typeof commands)[number]) => {
    command.run();
    setIsPaletteOpen(false);
  };

  return (
    <>
      <div className="hidden md:flex items-center gap-2 relative" ref={panelRef}>
        <button
          type="button"
          onClick={() => setIsDisplayOpen((current) => !current)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border theme-border text-sm font-semibold theme-text-primary hover:opacity-90 surface-card"
          aria-expanded={isDisplayOpen}
          aria-controls="display-controls"
        >
          <Monitor size={16} aria-hidden="true" />
          Display
        </button>
        <button
          type="button"
          onClick={() => setIsPaletteOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border theme-border text-sm font-semibold theme-text-primary hover:opacity-90 surface-card"
          aria-label="Open command palette"
        >
          <Command size={16} aria-hidden="true" />
          Cmd+K
        </button>

        {isDisplayOpen && (
          <div
            id="display-controls"
            className="absolute right-0 top-12 w-80 rounded-xl surface-card p-4 shadow-xl z-[60]"
            role="dialog"
            aria-label="Display preferences"
          >
            <p className="text-sm font-semibold theme-text-primary mb-1">Display Preferences</p>
            <p className="text-xs theme-text-secondary mb-3">Tune brightness, tone, and text readability without leaving the page.</p>

            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide theme-text-tertiary">Theme</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPrefs((current) => ({ ...current, theme: 'light' }))}
                  className={`px-2 py-2 rounded-lg border text-xs font-semibold ${
                    prefs.theme === 'light' ? 'bg-blue-600 text-white border-blue-600' : 'theme-border theme-text-primary surface-subtle'
                  }`}
                >
                  <Sun size={14} className="mx-auto mb-1" aria-hidden="true" />
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setPrefs((current) => ({ ...current, theme: 'dark' }))}
                  className={`px-2 py-2 rounded-lg border text-xs font-semibold ${
                    prefs.theme === 'dark' ? 'bg-blue-600 text-white border-blue-600' : 'theme-border theme-text-primary surface-subtle'
                  }`}
                >
                  <Moon size={14} className="mx-auto mb-1" aria-hidden="true" />
                  Dark
                </button>
                <button
                  type="button"
                  onClick={() => setPrefs((current) => ({ ...current, theme: 'contrast' }))}
                  className={`px-2 py-2 rounded-lg border text-xs font-semibold ${
                    prefs.theme === 'contrast' ? 'bg-blue-600 text-white border-blue-600' : 'theme-border theme-text-primary surface-subtle'
                  }`}
                >
                  <Contrast size={14} className="mx-auto mb-1" aria-hidden="true" />
                  Contrast
                </button>
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
                    className={`px-2 py-2 rounded-lg border text-xs font-semibold ${
                      prefs.themeTone === tone ? 'bg-blue-600 text-white border-blue-600' : 'theme-border theme-text-primary surface-subtle'
                    }`}
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
                  className={`px-3 py-2 rounded-lg border text-xs font-semibold ${
                    prefs.density === 'comfortable' ? 'bg-blue-600 text-white border-blue-600' : 'theme-border theme-text-primary surface-subtle'
                  }`}
                >
                  Comfortable
                </button>
                <button
                  type="button"
                  onClick={() => setPrefs((current) => ({ ...current, density: 'compact' }))}
                  className={`px-3 py-2 rounded-lg border text-xs font-semibold ${
                    prefs.density === 'compact' ? 'bg-blue-600 text-white border-blue-600' : 'theme-border theme-text-primary surface-subtle'
                  }`}
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
                    className={`px-2 py-2 rounded-lg border text-xs font-semibold ${
                      prefs.textContrast === mode ? 'bg-blue-600 text-white border-blue-600' : 'theme-border theme-text-primary surface-subtle'
                    }`}
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
                  className="w-full accent-blue-600"
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
          </div>
        )}
      </div>

      {isPaletteOpen && (
        <div className="fixed inset-0 z-[70] p-4 flex items-start justify-center pt-28" style={{ background: 'var(--overlay-bg)' }}>
          <div className="w-full max-w-2xl rounded-xl surface-card shadow-2xl overflow-hidden">
            <div className="border-b theme-border p-3">
              <input
                ref={paletteInputRef}
                value={paletteQuery}
                onChange={(event) => setPaletteQuery(event.target.value)}
                placeholder="Type a command... (e.g., dark theme, go projects)"
                className="w-full rounded-lg theme-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Command palette search"
              />
            </div>
            <ul className="max-h-80 overflow-auto p-2">
              {filteredCommands.map((command) => (
                <li key={command.id}>
                  <button
                    type="button"
                    onClick={() => executeCommand(command)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm theme-text-primary hover:bg-blue-50 hover:text-blue-700"
                  >
                    {command.label}
                  </button>
                </li>
              ))}
              {filteredCommands.length === 0 && (
                <li className="px-3 py-4 text-sm theme-text-secondary">No matching commands.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
