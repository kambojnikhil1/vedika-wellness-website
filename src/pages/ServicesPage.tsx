import { ArrowRight } from 'lucide-react';
import type { Lang, PageId } from '../types';
import { getCopy } from '../data/translations';
import { SITE_IMAGES } from '../data/siteAssets';
import { SmartImage } from '../components/SmartImage';

interface ServicesPageProps {
  lang: Lang;
  onNavigate: (page: PageId, subParam?: string) => void;
}

export function ServicesPage({ lang, onNavigate }: ServicesPageProps) {
  const t = getCopy(lang);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">
      {/* Header Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {lang === 'en' ? '80% Food & Nutrition · 20% Simple Movement' : '80% भोजन एवं पोषण · 20% आसान व्यायाम'}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-50">
            {t.services.title}
          </h1>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
            {t.services.subtitle}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('book', '3-Day Free Demo')}
              className="cta-calm-shift inline-flex items-center gap-2 text-white font-semibold text-sm px-6 py-3 rounded-lg cursor-pointer whitespace-nowrap"
            >
              <span>{lang === 'en' ? 'Book Free Health Call' : 'फ्री हेल्थ कॉल बुक करें'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('programs')}
              className="px-5 py-3 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              {lang === 'en' ? 'See Pricing & Plans' : 'प्लान और कीमत देखें'}
            </button>
          </div>
        </div>
        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 min-h-[240px]">
          <SmartImage
            src={SITE_IMAGES.heroNutrition}
            alt={lang === 'en' ? 'Wholesome Indian everyday nutrition ingredients' : 'पौष्टिक भारतीय दैनिक भोजन सामग्री'}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 8 Services Editorial Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {t.services.items.map((service) => (
          <article
            key={service.num}
            className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 sm:p-8 flex flex-col justify-between gap-6"
          >
            <div className="space-y-3">
              <span className="font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {service.num}.
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-50">
                {service.title}
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                {service.body}
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => onNavigate(service.target, service.title)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <span>{service.cta}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
