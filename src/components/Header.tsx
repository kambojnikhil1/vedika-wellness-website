import { useState } from 'react';
import { Menu, X, Sun, Moon, Languages } from 'lucide-react';
import type { Lang, PageId, Theme } from '../types';
import { getCopy } from '../data/translations';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId, subParam?: string) => void;
  lang: Lang;
  onToggleLang: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({
  currentPage,
  onNavigate,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = getCopy(lang);

  const primaryLinks: { id: PageId; label: string }[] = [
    { id: 'studio', label: t.nav.studio },
    { id: 'programs', label: t.nav.programs },
    { id: 'services', label: t.nav.services },
    { id: 'blog', label: t.nav.blog },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleLinkClick = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAFAF9]/95 dark:bg-[#0F1412]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element Brand wordmark */}
          <button
            type="button"
            onClick={() => handleLinkClick('home')}
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 rounded"
          >
            {t.brand}
          </button>

          {/* Zone 2: 5 clean single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-300"
          >
            {primaryLinks.map((link) => {
              const active = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleLinkClick(link.id)}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer border-b-2 ${
                    active
                      ? 'text-emerald-800 dark:text-emerald-400 border-emerald-700 dark:border-emerald-400 font-semibold'
                      : 'border-transparent hover:text-stone-950 dark:hover:text-white hover:border-stone-300 dark:hover:border-stone-600'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary CTA button (+ mobile menu toggle on small screens) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleLinkClick('book')}
              className="cta-calm-shift text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-lg whitespace-nowrap shrink-0 cursor-pointer shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              {t.nav.bookCta}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#141B18] px-4 py-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'home', label: t.nav.home },
                  ...primaryLinks,
                  { id: 'about', label: t.nav.about },
                  { id: 'faq', label: t.nav.faq },
                  { id: 'admin', label: t.nav.admin },
                ] as { id: PageId; label: string }[]
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleLinkClick(item.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === item.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Non-sticky Workspace Utility Strip for Language, Theme, and Secondary Pages */}
      <div className="no-print border-b border-stone-200/80 dark:border-stone-800/80 bg-[#F4F4F1] dark:bg-[#141B18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-4 text-stone-600 dark:text-stone-300">
            <button
              type="button"
              onClick={() => handleLinkClick('home')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap ${
                currentPage === 'home' ? 'font-semibold text-emerald-800 dark:text-emerald-400' : ''
              }`}
            >
              {t.nav.home}
            </button>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">
              ·
            </span>
            <button
              type="button"
              onClick={() => handleLinkClick('about')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap ${
                currentPage === 'about' ? 'font-semibold text-emerald-800 dark:text-emerald-400' : ''
              }`}
            >
              {t.nav.about}
            </button>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">
              ·
            </span>
            <button
              type="button"
              onClick={() => handleLinkClick('faq')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap ${
                currentPage === 'faq' ? 'font-semibold text-emerald-800 dark:text-emerald-400' : ''
              }`}
            >
              {t.nav.faq}
            </button>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">
              ·
            </span>
            <button
              type="button"
              onClick={() => handleLinkClick('admin')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap ${
                currentPage === 'admin' ? 'font-semibold text-emerald-800 dark:text-emerald-400' : ''
              }`}
            >
              {t.nav.admin}
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onToggleLang}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1C2521] text-stone-800 dark:text-stone-100 hover:border-emerald-600 dark:hover:border-emerald-500 font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              <span>{t.utility.langSwitch}</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1C2521] text-stone-800 dark:text-stone-100 hover:border-emerald-600 dark:hover:border-emerald-500 font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  <span>{t.utility.lightMode}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-stone-600" aria-hidden="true" />
                  <span>{t.utility.darkMode}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
