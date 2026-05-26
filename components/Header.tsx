'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UxControls from './UxControls';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      // Focus first menu item when opened
      const firstLink = menuRef.current.querySelector('a');
      firstLink?.focus();
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInMenu = menuRef.current?.contains(target);
      const clickedButton = menuButtonRef.current?.contains(target);

      if (!clickedInMenu && !clickedButton) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Resume', href: '/resume' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isNavItemActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 w-full theme-header backdrop-blur-md z-50 border-b">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-2">
          {/* Logo */}
          <div className="flex-shrink min-w-0">
            <Link href="/" className="text-lg sm:text-2xl font-bold theme-accent-text truncate block">
              Kevin Delong
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item.href);
                return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                    isActive ? 'theme-accent-text surface-subtle' : 'theme-text-secondary hover:opacity-80'
                  }`}
                >
                  {item.name}
                </Link>
                );
              })}
            </div>
          </div>

          <UxControls />

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="theme-text-secondary hover:opacity-80 p-2 min-h-[44px] min-w-[44px]"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden" id="mobile-menu" role="navigation" aria-label="Mobile navigation">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 surface-card border-t theme-border">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item.href);
                return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block px-3 py-3 rounded-md text-base font-medium min-h-[44px] flex items-center ${
                    isActive ? 'theme-accent-text surface-subtle' : 'theme-text-secondary hover:opacity-80'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
