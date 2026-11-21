import { ArrowRight } from 'lucide-react';
import type { Lang, PageId } from '../types';
import { getCopy } from '../data/translations';
import { SITE_IMAGES, SITE_LINKS } from '../data/siteAssets';
import { SmartImage } from '../components/SmartImage';

interface AboutPageProps {
  lang: Lang;
  onNavigate: (page: PageId, subParam?: string) => void;
}

export function AboutPage({ lang, onNavigate }: AboutPageProps) {
  const t = getCopy(lang);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
      {/* Opening Quote */}
      <section className="space-y-4 border-b border-stone-200 dark:border-stone-800 pb-12">
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          {t.about.originKicker}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-50">
          {t.about.title}
        </h1>
        <div className="pt-4 space-y-2 max-w-3xl">
          <p className="font-display text-xl sm:text-2xl font-semibold text-emerald-800 dark:text-emerald-400">
            {t.about.sanskrit1}
          </p>
          <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed">
            {t.about.sanskrit1Meaning}
          </p>
        </div>
        <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-3xl pt-2">
          {t.about.originIntro}
        </p>
      </section>

      {/* Founders' Stories */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Nikhil Kamboj */}
        <article className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] overflow-hidden flex flex-col">
          <div className="aspect-[4/3] bg-stone-100 dark:bg-stone-900">
            <SmartImage
              src={SITE_IMAGES.coachNikhil}
              alt={SITE_LINKS.coaches.nikhil.nameEn}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="p-6 sm:p-8 space-y-3 flex-1">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {t.about.nikhilTag}
            </p>
            <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
              {lang === 'en' ? SITE_LINKS.coaches.nikhil.nameEn : SITE_LINKS.coaches.nikhil.nameHi}
            </h2>
            <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              {t.about.nikhilStory}
            </p>
          </div>
        </article>

        {/* Mahant Anupamand Giri */}
        <article className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] overflow-hidden flex flex-col">
          <div className="aspect-[4/3] bg-stone-100 dark:bg-stone-900">
            <SmartImage
              src={SITE_IMAGES.coachAnupamand}
              alt={SITE_LINKS.coaches.anupamand.nameEn}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="p-6 sm:p-8 space-y-3 flex-1">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {t.about.anupamandTag}
            </p>
            <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
              {lang === 'en'
                ? SITE_LINKS.coaches.anupamand.nameEn
                : SITE_LINKS.coaches.anupamand.nameHi}
            </h2>
            <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              {t.about.anupamandStory}
            </p>
          </div>
        </article>
      </section>

      {/* Convergence */}
      <section className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 sm:p-10 space-y-5">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
          {t.about.convergenceTitle}
        </h2>
        <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
          {t.about.convergenceBody}
        </p>
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-1">
          <p className="font-display text-xl font-semibold text-emerald-800 dark:text-emerald-400">
            {t.about.sanskrit2}
          </p>
          <p className="text-sm text-stone-600 dark:text-stone-400">{t.about.sanskrit2Meaning}</p>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-[#F4F4F1] dark:bg-[#141C18] p-6 sm:p-10 space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {lang === 'en' ? 'Modern Science Backed' : 'आधुनिक विज्ञान पर आधारित'}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
            {t.about.commitmentTitle}
          </h2>
          <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300 max-w-3xl">
            {t.about.commitmentBody}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A231F] p-5 space-y-1">
            <p className="font-display font-bold text-stone-900 dark:text-stone-50">
              {lang === 'en' ? 'Metabolic Reignition' : 'मेटाबॉलिज़्म सुधार'}
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              {lang === 'en'
                ? 'Right meal timings, protein, and hydration to wake up natural energy.'
                : 'सही समय पर प्रोटीन व पानी के साथ प्राकृतिक ऊर्जा बढ़ाना।'}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A231F] p-5 space-y-1">
            <p className="font-display font-bold text-stone-900 dark:text-stone-50">
              {lang === 'en' ? 'Visceral Fat Reduction' : 'पेट की चर्बी में कमी'}
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              {lang === 'en'
                ? 'Target deep belly fat while protecting lean muscle strength.'
                : 'मांसपेशियों को बचाते हुए पेट की जिद्दी चर्बी को कम करना।'}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A231F] p-5 space-y-1">
            <p className="font-display font-bold text-stone-900 dark:text-stone-50">
              {lang === 'en' ? 'Lasting Daily Habits' : 'स्थायी स्वस्थ आदतें'}
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              {lang === 'en'
                ? 'Simple routines you can happily follow with your family for life.'
                : 'सरल आदतें जिन्हें आप पूरे परिवार के साथ जीवन भर अपना सकें।'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('book', '3-Day Free Demo')}
            className="cta-calm-shift inline-flex items-center gap-2 text-white font-semibold text-sm px-6 py-3 rounded-lg cursor-pointer whitespace-nowrap"
          >
            <span>{lang === 'en' ? 'Book Your Free Consultation' : 'अपनी फ्री कंसल्टेशन बुक करें'}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('studio')}
            className="px-5 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1A231F] text-stone-800 dark:text-stone-100 text-sm font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            {lang === 'en' ? 'Explore Wellness Studio' : 'वेलनेस स्टूडियो देखें'}
          </button>
        </div>
      </section>
    </div>
  );
}
