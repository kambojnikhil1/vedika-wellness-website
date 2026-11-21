import { useState } from 'react';
import { ChevronDown, Search, ArrowRight } from 'lucide-react';
import type { Lang, PageId } from '../types';
import { getCopy } from '../data/translations';

interface FaqPageProps {
  lang: Lang;
  onNavigate: (page: PageId, subParam?: string) => void;
}

export function FaqPage({ lang, onNavigate }: FaqPageProps) {
  const t = getCopy(lang);
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = t.faq.items.filter(
    (item) =>
      item.q.toLowerCase().includes(query.toLowerCase()) ||
      item.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          {lang === 'en' ? 'Clear & Honest Answers' : 'सरल और स्पष्ट उत्तर'}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-50">
          {t.faq.title}
        </h1>
        <p className="text-base text-stone-600 dark:text-stone-300">{t.faq.subtitle}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            lang === 'en'
              ? 'Search questions (e.g. roti, thyroid, ₹6,300, vegetarian)...'
              : 'सवाल खोजें (जैसे: रोटी, थायराइड, ₹6,300, शाकाहारी)...'
          }
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161D1A] text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
      </div>

      {/* Accordion */}
      <div className="divide-y divide-stone-200 dark:divide-stone-800 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-stone-500 dark:text-stone-400">
            {lang === 'en'
              ? 'No matching question found. Ask our coach directly below!'
              : 'कोई मिलता-जुलता सवाल नहीं मिला। नीचे सीधे हमारे कोच से पूछें!'}
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer"
                >
                  <span className="font-display font-semibold text-base sm:text-lg text-stone-900 dark:text-stone-50">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-500 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm sm:text-base leading-relaxed text-stone-600 dark:text-stone-300">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still have a question CTA */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-[#F4F4F1] dark:bg-[#141C18] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-50">
            {lang === 'en' ? 'Still have a personal health question?' : 'क्या आपके मन में कोई और सवाल है?'}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            {lang === 'en'
              ? 'Speak directly with Nikhil Kamboj or Mahant Anupamand Giri — friendly and free.'
              : 'निखिल कांबोज या महंत अनुपमानंद गिरी से सीधे और मुफ्त बात करें।'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('book')}
          className="cta-calm-shift inline-flex items-center gap-2 text-white font-semibold text-sm px-6 py-3 rounded-lg cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>{lang === 'en' ? 'Book Free Call' : 'फ्री कॉल बुक करें'}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
