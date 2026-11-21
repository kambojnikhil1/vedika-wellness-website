import { useState } from 'react';
import { ArrowRight, Maximize2, MessageCircle } from 'lucide-react';
import type { Lang, PageId } from '../types';
import { getCopy } from '../data/translations';
import { SITE_IMAGES, SITE_LINKS } from '../data/siteAssets';
import { SmartImage } from '../components/SmartImage';
import { PosterLightbox, type PosterItem } from '../components/PosterLightbox';

interface ServicesPageProps {
  lang: Lang;
  onNavigate: (page: PageId, subParam?: string) => void;
}

export function ServicesPage({ lang, onNavigate }: ServicesPageProps) {
  const t = getCopy(lang);
  const [activePoster, setActivePoster] = useState<PosterItem | null>(null);

  const bodyNumbersPoster: PosterItem = {
    src: SITE_IMAGES.posterBodyNumbers,
    titleEn: 'Know Your Body Numbers — Body Composition Analysis',
    titleHi: 'अपने शरीर के सही नंबर जानें — बॉडी कंपोज़िशन विश्लेषण',
    captionEn:
      'Tanita body-composition assessment covering Body Fat %, Visceral Fat, Muscle Mass, BMR, Bone Mass, and Metabolic Age.',
    captionHi:
      'तनिता बॉडी कंपोज़िशन जांच: बॉडी फैट %, विसरल फैट, मसल मास, BMR, बोन मास और मेटाबॉलिक एज की पूरी रिपोर्ट।',
  };

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
            <a
              href={SITE_LINKS.bookFreeCallWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-calm-shift inline-flex items-center gap-2 text-white font-semibold text-sm px-6 py-3 rounded-lg cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>{lang === 'en' ? 'Book Free Health Call' : 'फ्री हेल्थ कॉल बुक करें'}</span>
            </a>
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

      {/* Body Composition Analysis Poster Showcase */}
      <section className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 p-4 sm:p-6 bg-[#F4F4F1] dark:bg-[#121916]">
          <button
            type="button"
            onClick={() => setActivePoster(bodyNumbersPoster)}
            className="group relative block w-full overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700 cursor-pointer text-left"
          >
            <img
              src={SITE_IMAGES.posterBodyNumbers}
              alt={bodyNumbersPoster.titleEn}
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
            />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-950/75 text-white text-xs font-semibold backdrop-blur-sm">
              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
              {lang === 'en' ? 'Tap to Enlarge' : 'बड़ा करके देखें'}
            </span>
          </button>
        </div>
        <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {lang === 'en' ? 'Offline Dehradun Assessment' : 'देहरादून केंद्र पर संपूर्ण बॉडी जांच'}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
            {lang === 'en' ? 'Know Your True Body Numbers' : 'अपने शरीर के असली आंकड़े जानें'}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {lang === 'en'
              ? 'We look beyond simple scale weight. Understand your Body Fat %, Visceral Fat, Muscle Mass, Body Water, Bone Mass, and Metabolic Age so your food plan targets fat loss—not muscle loss.'
              : 'केवल वजन का कांटा पूरी कहानी नहीं बताता। अपने बॉडी फैट %, विसरल फैट, मसल मास, पानी, बोन मास और मेटाबॉलिक एज को समझकर सही डाइट प्लान शुरू करें।'}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={SITE_LINKS.bookFreeCallWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-calm-shift inline-flex items-center gap-2 text-white font-semibold text-sm px-5 py-2.5 rounded-lg whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>{lang === 'en' ? 'Book Body Analysis on WhatsApp' : 'व्हाट्सएप पर जांच बुक करें'}</span>
            </a>
            <button
              type="button"
              onClick={() => onNavigate('studio', 'eval')}
              className="px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            >
              {lang === 'en' ? 'Try Online BMI & BMR Check' : 'ऑनलाइन BMI व BMR जांचें'}
            </button>
          </div>
        </div>
      </section>

      <PosterLightbox poster={activePoster} lang={lang} onClose={() => setActivePoster(null)} />
    </div>
  );
}
