import { useState } from 'react';
import { ArrowRight, Check, Maximize2, MessageCircle } from 'lucide-react';
import type { Lang, PageId } from '../types';
import { getCopy } from '../data/translations';
import { SITE_IMAGES, SITE_LINKS } from '../data/siteAssets';
import { PosterLightbox, type PosterItem } from '../components/PosterLightbox';

interface ProgramsPageProps {
  lang: Lang;
  onNavigate: (page: PageId, subParam?: string) => void;
}

export function ProgramsPage({ lang, onNavigate }: ProgramsPageProps) {
  const t = getCopy(lang);
  const [duration, setDuration] = useState<'1m' | '3m'>('1m');
  const [activePoster, setActivePoster] = useState<PosterItem | null>(null);

  const plansFlyer: PosterItem = {
    src: SITE_IMAGES.flyerPlans,
    titleEn: 'Vedika Health Transformation Journey — Detailed Plans Flyer',
    titleHi: 'वेदिका हेल्थ ट्रांसफॉर्मेशन जर्नी — विस्तृत प्लान फ्लायर',
    captionEn:
      '3 Days Free Trial, Vedika Reset (10 Days), and Vedika Transform (1 Month) with Result Guarantee.',
    captionHi:
      '3 दिन का फ्री ट्रायल, वेदिका रीसेट (10 दिन) और वेदिका ट्रांसफॉर्म (1 महीना) — रिज़ल्ट गारंटी के साथ।',
  };

  const comparisonRows =
    lang === 'en'
      ? [
          { feature: '1-on-1 Personal Coach Check-ins', demo: 'Intro session', m1: 'Daily WhatsApp & Weekly Call', m3: 'Daily WhatsApp & Weekly Call' },
          { feature: 'Customized Indian Home Diet Chart', demo: 'Sample Guide', m1: 'Updated Every 2 Weeks', m3: 'Full 12-Week Progressive Plan' },
          { feature: 'Online / Dehradun Offline Sessions', demo: '3 Days Free', m1: 'Full Month Access', m3: 'Full 3 Months Access' },
          { feature: 'Low-Calorie High-Protein Support', demo: 'Guidance Only', m1: '1 Month Included', m3: '3 Months Included' },
          { feature: '30-Day Money-Back Guarantee', demo: 'Free Trial', m1: 'Included', m3: 'Included' },
          { feature: 'Total Fee', demo: '₹0', m1: '₹6,300', m3: '₹15,000 (Save ₹3,900)' },
        ]
      : [
          { feature: '1-ऑन-1 पर्सनल कोच मार्गदर्शन', demo: 'इंट्रो सेशन', m1: 'रोज़ व्हाट्सएप व साप्ताहिक कॉल', m3: 'रोज़ व्हाट्सएप व साप्ताहिक कॉल' },
          { feature: 'कस्टम भारतीय घर का डाइट चार्ट', demo: 'सैंपल गाइड', m1: 'हर 2 हफ्ते में अपडेट', m3: 'पूरे 12 हफ्ते का चरणबद्ध प्लान' },
          { feature: 'ऑनलाइन / देहरादून ऑफलाइन क्लासेस', demo: '3 दिन फ्री', m1: 'पूरे 1 महीने की सुविधा', m3: 'पूरे 3 महीने की सुविधा' },
          { feature: 'लो-कैलोरी हाई-प्रोटीन सपोर्ट', demo: 'सिर्फ़ जानकारी', m1: '1 महीने के लिए शामिल', m3: '3 महीने के लिए शामिल' },
          { feature: '30-दिन मनी-बैक गारंटी', demo: 'फ्री ट्रायल', m1: 'शामिल', m3: 'शामिल' },
          { feature: 'कुल शुल्क', demo: '₹0', m1: '₹6,300', m3: '₹15,000 (₹3,900 बचत)' },
        ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">
      {/* Intro & Duration Switch */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {lang === 'en' ? 'Transparent Indian Pricing' : 'स्पष्ट और पारदर्शी शुल्क'}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-50">
            {t.programs.title}
          </h1>
          <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed">
            {t.programs.subtitle}
          </p>
        </div>

        {/* Segmented Duration Selector */}
        <div
          role="group"
          aria-label="Plan duration"
          className="inline-flex items-center gap-1 p-1 rounded-lg bg-stone-200/80 dark:bg-stone-800 self-start"
        >
          <button
            type="button"
            onClick={() => setDuration('1m')}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              duration === '1m'
                ? 'bg-white dark:bg-[#161D1A] text-stone-900 dark:text-stone-50 shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {lang === 'en' ? '1 Month · ₹6,300' : '1 महीना · ₹6,300'}
          </button>
          <button
            type="button"
            onClick={() => setDuration('3m')}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              duration === '3m'
                ? 'bg-white dark:bg-[#161D1A] text-stone-900 dark:text-stone-50 shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {lang === 'en' ? '3 Months · ₹15,000 (Best Value)' : '3 महीने · ₹15,000 (सबसे बेहतर)'}
          </button>
        </div>
      </section>

      {/* 3 Days Free Demo Banner */}
      <section className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
            {lang === 'en' ? 'Zero Cost · Zero Pressure' : 'बिल्कुल मुफ्त · कोई दबाव नहीं'}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
            {t.programs.demoTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            {t.programs.demoSub}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('book', '3-Day Free Demo')}
          className="cta-calm-shift inline-flex items-center justify-center gap-2 text-white font-semibold text-sm px-6 py-3.5 rounded-lg cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>{t.programs.demoCta}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>

      {/* 3 Core Coaching Plans */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {t.programs.plans.map((plan, index) => {
          const isHighlighted = index === 0;
          return (
            <article
              key={plan.id}
              className={`rounded-2xl border p-6 sm:p-8 flex flex-col justify-between gap-6 bg-white dark:bg-[#161D1A] ${
                isHighlighted
                  ? 'border-emerald-600 dark:border-emerald-500 ring-1 ring-emerald-600/20'
                  : 'border-stone-200 dark:border-stone-800'
              }`}
            >
              <div className="space-y-4">
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  {plan.audience}
                </p>
                <h3 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
                  {plan.name}
                </h3>

                <div className="pt-2 pb-4 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50 tabular-nums">
                      {duration === '1m' ? plan.price1m : plan.price3m}
                    </span>
                    <span className="text-sm text-stone-500 dark:text-stone-400">
                      / {duration === '1m' ? (lang === 'en' ? '1 month' : '1 महीना') : lang === 'en' ? '3 months' : '3 महीने'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-1 tabular-nums">
                    {duration === '1m'
                      ? lang === 'en'
                        ? 'Or ₹15,000 for 3 months (save ₹3,900)'
                        : 'या 3 महीने के लिए ₹15,000 (₹3,900 की बचत)'
                      : plan.save3m}
                  </p>
                </div>

                <ul className="space-y-3 pt-1">
                  {plan.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-2.5 text-sm text-stone-700 dark:text-stone-300"
                    >
                      <Check
                        className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() =>
                  onNavigate(
                    'book',
                    `${plan.name} (${duration === '1m' ? '1 Month ₹6,300' : '3 Months ₹15,000'})`
                  )
                }
                className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  isHighlighted
                    ? 'cta-calm-shift text-white'
                    : 'bg-stone-900 hover:bg-stone-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white'
                }`}
              >
                {lang === 'en' ? 'Book This Program' : 'यह प्लान चुनें'}
              </button>
            </article>
          );
        })}
      </section>

      {/* Clear Comparison Table */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
          {lang === 'en' ? 'What Is Included in Each Option' : 'हर विकल्प में क्या शामिल है'}
        </h2>
        <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A]">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-[#F4F4F1] dark:bg-[#1C2521]">
                <th className="py-3.5 px-4 font-semibold text-stone-900 dark:text-stone-100">
                  {lang === 'en' ? 'Included Support' : 'शामिल सुविधाएं'}
                </th>
                <th className="py-3.5 px-4 font-semibold text-stone-900 dark:text-stone-100">
                  {lang === 'en' ? '3-Day Free Demo' : '3-दिन फ्री डेमो'}
                </th>
                <th className="py-3.5 px-4 font-semibold text-stone-900 dark:text-stone-100">
                  {lang === 'en' ? '1-Month Plan' : '1-महीने का प्लान'}
                </th>
                <th className="py-3.5 px-4 font-semibold text-emerald-800 dark:text-emerald-400">
                  {lang === 'en' ? '3-Month Plan' : '3-महीने का प्लान'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                  <td className="py-3.5 px-4 font-medium text-stone-900 dark:text-stone-100">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300 tabular-nums">
                    {row.demo}
                  </td>
                  <td className="py-3.5 px-4 text-stone-700 dark:text-stone-200 tabular-nums">
                    {row.m1}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-emerald-800 dark:text-emerald-400 tabular-nums">
                    {row.m3}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Official Detailed Plans & 3 Days Free Trial Flyer */}
      <section className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {lang === 'en' ? 'Official Center Brochure & Result Guarantee' : 'आधिकारिक प्लान फ्लायर एवं रिज़ल्ट गारंटी'}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
              {lang === 'en' ? 'Detailed Plans & 3 Days Free Trial Flyer' : 'विस्तृत प्लान और 3-दिन फ्री ट्रायल फ्लायर'}
            </h2>
          </div>
          <a
            href={SITE_LINKS.bookFreeCallWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-calm-shift inline-flex items-center gap-2 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg whitespace-nowrap self-start sm:self-auto"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>{lang === 'en' ? 'Book Free Call on WhatsApp' : 'व्हाट्सएप पर फ्री कॉल बुक करें'}</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setActivePoster(plansFlyer)}
          className="group relative block w-full overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700 cursor-pointer text-left"
        >
          <img
            src={SITE_IMAGES.flyerPlans}
            alt={plansFlyer.titleEn}
            className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-950/75 text-white text-xs font-semibold backdrop-blur-sm">
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            {lang === 'en' ? 'Tap to Read Full Flyer' : 'पूरा फ्लायर बड़ा करके पढ़ें'}
          </span>
        </button>
      </section>

      <PosterLightbox poster={activePoster} lang={lang} onClose={() => setActivePoster(null)} />
    </div>
  );
}
