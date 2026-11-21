import { useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { SITE_LINKS } from '../data/siteAssets';
import type { Lang } from '../types';

export interface PosterItem {
  src: string;
  titleEn: string;
  titleHi: string;
  captionEn: string;
  captionHi: string;
}

interface PosterLightboxProps {
  poster: PosterItem | null;
  lang: Lang;
  onClose: () => void;
}

export function PosterLightbox({ poster, lang, onClose }: PosterLightboxProps) {
  useEffect(() => {
    if (!poster) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [poster, onClose]);

  if (!poster) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'en' ? poster.titleEn : poster.titleHi}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-2xl bg-white dark:bg-[#141C18] border border-stone-200 dark:border-stone-700 overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-stone-200 dark:border-stone-800">
          <div className="min-w-0">
            <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 dark:text-stone-50 truncate">
              {lang === 'en' ? poster.titleEn : poster.titleHi}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
              {lang === 'en' ? poster.captionEn : poster.captionHi}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={lang === 'en' ? 'Close poster' : 'बंद करें'}
            className="w-9 h-9 rounded-lg border border-stone-300 dark:border-stone-700 inline-flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-stone-100 dark:bg-stone-950 p-3 sm:p-5 flex items-center justify-center">
          <img
            src={poster.src}
            alt={lang === 'en' ? poster.titleEn : poster.titleHi}
            className="max-h-[72vh] w-auto object-contain rounded-lg shadow-md"
          />
        </div>

        <div className="px-5 py-3.5 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 bg-[#FAFAF9] dark:bg-[#111714]">
          <p className="text-xs text-stone-600 dark:text-stone-400">
            {lang === 'en'
              ? 'Have questions about our plans or body composition check?'
              : 'हमारे प्लान या बॉडी चेक के बारे में कोई सवाल है?'}
          </p>
          <a
            href={SITE_LINKS.bookFreeCallWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-calm-shift inline-flex items-center gap-2 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>{lang === 'en' ? 'Book Free Call on WhatsApp' : 'व्हाट्सएप पर फ्री कॉल बुक करें'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
