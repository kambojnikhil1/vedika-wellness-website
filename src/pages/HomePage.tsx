import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  ExternalLink,
  Maximize2,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import type { Lang, PageId } from '../types';
import { getCopy } from '../data/translations';
import { SITE_IMAGES, SITE_LINKS } from '../data/siteAssets';
import { BLOG_POSTS } from '../data/blogsData';
import { SmartImage } from '../components/SmartImage';
import { PosterLightbox, type PosterItem } from '../components/PosterLightbox';
import { submitLead } from '../utils/api';

interface HomePageProps {
  lang: Lang;
  onNavigate: (page: PageId, subParam?: string) => void;
}

const SLIDE_IMAGES = [SITE_IMAGES.heroThali, SITE_IMAGES.heroNutrition, SITE_IMAGES.blogProtein];

export function HomePage({ lang, onNavigate }: HomePageProps) {
  const t = getCopy(lang);
  const [slideIndex, setSlideIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [activePoster, setActivePoster] = useState<PosterItem | null>(null);

  const officialPosters: PosterItem[] = [
    {
      src: SITE_IMAGES.flyerPlans,
      titleEn: 'Vedika Detailed Plans & 3-Day Free Trial',
      titleHi: 'वेदिका विस्तृत प्लान और 3-दिन का फ्री ट्रायल',
      captionEn: 'Compare Free Trial, Vedika Reset, and Vedika Transform plans with 100% Result Guarantee.',
      captionHi: 'फ्री ट्रायल, वेदिका रीसेट और वेदिका ट्रांसफॉर्म प्लान की पूरी जानकारी।',
    },
    {
      src: SITE_IMAGES.pamphletAbout,
      titleEn: 'About Vedika Health & Wellness — Four Pillars',
      titleHi: 'वेदिका हेल्थ एंड वेलनेस — स्वास्थ्य के चार स्तंभ',
      captionEn: 'Targeting root causes, medicine-free habits, modern science + ancient wisdom, and coach contacts.',
      captionHi: 'जड़ से स्वास्थ्य सुधार, आधुनिक विज्ञान व प्राचीन ज्ञान का संगम और कोच संपर्क।',
    },
    {
      src: SITE_IMAGES.posterBodyNumbers,
      titleEn: 'Know Your Body Numbers — Body Composition Analysis',
      titleHi: 'अपने शरीर के नंबर जानें — बॉडी कंपोज़िशन विश्लेषण',
      captionEn: 'Understand Body Fat %, Visceral Fat, Muscle Mass, Body Water, BMI, BMR & Metabolic Age.',
      captionHi: 'बॉडी फैट %, विसरल फैट, मसल मास, पानी, BMI, BMR और मेटाबॉलिक एज की जांच।',
    },
  ];

  // Quick Lead Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState('Sustainable Fat Loss');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const slides = t.home.heroSlides;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[slideIndex];

  const handleHeroPrimary = () => {
    if (slideIndex === 0) onNavigate('book', '3-Day Free Demo');
    else if (slideIndex === 1) onNavigate('studio');
    else onNavigate('programs');
  };

  const handleHeroSecondary = () => {
    if (slideIndex === 0) onNavigate('studio');
    else if (slideIndex === 1) onNavigate('book');
    else onNavigate('contact');
  };

  const handleQuickLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!phone.trim() && !email.trim()) {
      setFeedback({
        type: 'err',
        text:
          lang === 'en'
            ? 'Please enter your phone number or email so our coach can contact you.'
            : 'कृपया अपना फोन नंबर या ईमेल दर्ज करें ताकि हमारे कोच आपसे संपर्क कर सकें।',
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        goal,
        source: 'Home Quick Lead Form',
        mode: 'Online / Phone Call',
      });
      if (res.accepted) {
        setFeedback({
          type: 'ok',
          text:
            lang === 'en'
              ? 'Thank you! Your request has been sent to our coach. We will contact you shortly.'
              : 'धन्यवाद! आपका अनुरोध हमारे कोच को भेज दिया गया है। हम शीघ्र आपसे संपर्क करेंगे।',
        });
        setName('');
        setPhone('');
        setEmail('');
      } else {
        setFeedback({ type: 'err', text: res.error || 'Could not submit.' });
      }
    } catch {
      setFeedback({
        type: 'err',
        text:
          lang === 'en'
            ? 'Network error. Please call or WhatsApp +91 81939 89452 directly.'
            : 'नेटवर्क त्रुटि। कृपया सीधे +91 81939 89452 पर कॉल या व्हाट्सएप करें।',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-20 sm:space-y-24 pb-6">
      {/* 1. Dynamic Hero Carousel */}
      <section className="relative overflow-hidden bg-stone-900">
        <div className="relative min-h-[520px] sm:min-h-[580px] flex items-center">
          <SmartImage
            src={SLIDE_IMAGES[slideIndex]}
            alt={currentSlide.title}
            eager
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-stone-950/35"
          />

          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 sm:py-20">
            <div className="max-w-2xl space-y-6">
              <p className="text-xs sm:text-sm font-medium text-emerald-300 tracking-wide">
                {currentSlide.kicker}
              </p>
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-[1.12] tracking-tight">
                {currentSlide.title}
              </h1>
              <p className="text-base sm:text-lg text-stone-200 leading-relaxed max-w-xl">
                {currentSlide.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleHeroPrimary}
                  className="cta-calm-shift inline-flex items-center gap-2 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-lg cursor-pointer whitespace-nowrap shadow-md"
                >
                  <span>{currentSlide.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleHeroSecondary}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-medium text-sm sm:text-base px-5 py-3.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap backdrop-blur-sm"
                >
                  {currentSlide.ctaSecondary}
                </button>
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="mt-10 flex items-center justify-between max-w-2xl">
              <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
                {slides.map((s, idx) => (
                  <button
                    key={s.title}
                    type="button"
                    role="tab"
                    aria-selected={idx === slideIndex}
                    aria-label={`Slide ${idx + 1}`}
                    onClick={() => setSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === slideIndex ? 'w-8 bg-emerald-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() => setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="w-10 h-10 rounded-lg border border-white/25 bg-black/30 hover:bg-black/50 text-white inline-flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() => setSlideIndex((prev) => (prev + 1) % slides.length)}
                  className="w-10 h-10 rounded-lg border border-white/25 bg-black/30 hover:bg-black/50 text-white inline-flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Motivation: 80% Food / 20% Movement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {lang === 'en' ? 'Simple Food First Philosophy' : 'सरल भोजन-आधारित दृष्टिकोण'}
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
            {t.home.whyHeading}
          </h2>
          <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed">
            {t.home.whySub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.home.whyPoints.map((item) => (
            <div
              key={item.num}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 space-y-3"
            >
              <span className="font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {item.num}.
              </span>
              <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-50">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured ₹6,300 Monthly Plan + 3-Day Free Demo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                {t.home.featuredPlanKicker}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
                {t.home.featuredPlanTitle}
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                {t.home.featuredPlanSub}
              </p>
            </div>

            <ul className="space-y-3">
              {t.home.featuredPlanItems.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-sm sm:text-base text-stone-800 dark:text-stone-200"
                >
                  <Check className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('book', '1-Month Plan (₹6,300)')}
                className="cta-calm-shift text-white font-semibold text-sm px-6 py-3 rounded-lg cursor-pointer whitespace-nowrap"
              >
                {lang === 'en' ? 'Start Monthly Plan (₹6,300)' : 'मासिक प्लान शुरू करें (₹6,300)'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('programs')}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{lang === 'en' ? 'Compare 3-Month & Free Demo' : '3-महीने प्लान और फ्री डेमो देखें'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#F4F4F1] dark:bg-[#1B2420] p-6 sm:p-10 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-800">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {lang === 'en' ? 'All Coaching Programs' : 'सभी कोचिंग प्रोग्राम'}
              </p>
              <div className="space-y-3 text-sm">
                <div className="pb-3 border-b border-stone-200 dark:border-stone-700 flex items-baseline justify-between gap-4">
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {lang === 'en' ? '3 Days Free Demo' : '3 दिन का फ्री डेमो'}
                  </span>
                  <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    ₹0
                  </span>
                </div>
                <div className="pb-3 border-b border-stone-200 dark:border-stone-700 flex items-baseline justify-between gap-4">
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {lang === 'en' ? 'Fat Loss & Metabolic Reset' : 'फैट लॉस और मेटाबॉलिक रीसेट'}
                  </span>
                  <span className="font-mono font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                    ₹6,300 / ₹15,000
                  </span>
                </div>
                <div className="pb-3 border-b border-stone-200 dark:border-stone-700 flex items-baseline justify-between gap-4">
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {lang === 'en' ? 'Weight Gain & Lean Strength' : 'स्वस्थ वजन वृद्धि प्लान'}
                  </span>
                  <span className="font-mono font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                    ₹6,300 / ₹15,000
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {lang === 'en' ? 'Gut Healing & Hormonal Balance' : 'गट हीलिंग व हार्मोनल बैलेंस'}
                  </span>
                  <span className="font-mono font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                    ₹6,300 / ₹15,000
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-stone-600 dark:text-stone-400">
              {lang === 'en'
                ? '1 Month: ₹6,300 · 3 Months: ₹15,000 (Save ₹3,900). Online worldwide & offline in Dehradun.'
                : '1 महीना: ₹6,300 · 3 महीने: ₹15,000 (₹3,900 की बचत)। ऑनलाइन और देहरादून ऑफलाइन उपलब्ध।'}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Testimonials (Adjacent to Plan Claims) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {t.home.testimonialsKicker}
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50">
            {t.home.testimonialsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.home.testimonials.map((item) => (
            <article
              key={item.name}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 tabular-nums">
                  {item.result}
                </p>
                <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                  “{item.quote}”
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{item.name}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">{item.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Wellness Studio Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-6 relative min-h-[280px]">
            <SmartImage
              src={SITE_IMAGES.heroThali}
              alt={lang === 'en' ? 'Balanced Indian home cooked thali' : 'संतुलित भारतीय घर की थाली'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center space-y-5">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {t.home.studioKicker}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
              {t.home.studioTitle}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              {t.home.studioSub}
            </p>
            <ul className="space-y-2.5 text-sm text-stone-700 dark:text-stone-300">
              {t.home.studioFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-1" aria-hidden="true" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('studio', 'plate')}
                className="cta-calm-shift inline-flex items-center gap-2 text-white font-semibold text-sm px-6 py-3 rounded-lg cursor-pointer whitespace-nowrap"
              >
                <span>{lang === 'en' ? 'Make Your Healthy Thali' : 'अपनी हेल्दी थाली बनाएं'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('studio', 'eval')}
                className="px-5 py-3 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                {lang === 'en' ? 'Check BMI & BMR' : 'BMI और BMR जांचें'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Motivational Quotes Band */}
      <section className="bg-[#F4F4F1] dark:bg-[#141C18] border-y border-stone-200 dark:border-stone-800 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {t.home.quotesKicker}
          </p>
          <blockquote className="font-display text-xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-50 leading-snug">
            {t.home.quotes[quoteIndex]}
          </blockquote>
          <div className="flex items-center justify-center gap-2">
            {t.home.quotes.map((q, idx) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuoteIndex(idx)}
                aria-label={`Quote ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === quoteIndex
                    ? 'w-7 bg-emerald-700 dark:bg-emerald-400'
                    : 'w-2 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Meet Our Wellness Coaches */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {t.home.coachesKicker}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50">
              {t.home.coachesTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer self-start sm:self-auto"
          >
            <span>{lang === 'en' ? 'Read Their Full Story' : 'उनकी पूरी कहानी पढ़ें'}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nikhil Kamboj */}
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 flex flex-col sm:flex-row gap-6 items-start">
            <SmartImage
              src={SITE_IMAGES.coachNikhil}
              alt={SITE_LINKS.coaches.nikhil.nameEn}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover object-[50%_24%] shrink-0"
            />
            <div className="space-y-3">
              <div>
                <h3 className="font-display text-xl font-bold text-stone-900 dark:text-stone-50">
                  {lang === 'en' ? SITE_LINKS.coaches.nikhil.nameEn : SITE_LINKS.coaches.nikhil.nameHi}
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                  {lang === 'en' ? SITE_LINKS.coaches.nikhil.roleEn : SITE_LINKS.coaches.nikhil.roleHi}
                </p>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {lang === 'en'
                  ? 'Focuses on scientific weight management, fixing slow metabolism with simple home food, and back/posture alignment.'
                  : 'विज्ञान-आधारित वजन प्रबंधन, घर के सरल खाने से मेटाबॉलिज़्म सुधार और कमर व पोस्चर संतुलन पर मार्गदर्शन।'}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold">
                <a
                  href={SITE_LINKS.coaches.nikhil.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  WhatsApp
                </a>
                <a
                  href={SITE_LINKS.coaches.nikhil.tel}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  {SITE_LINKS.coaches.nikhil.phoneDisplay}
                </a>
              </div>
            </div>
          </div>

          {/* Mahant Anupamand Giri */}
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 flex flex-col sm:flex-row gap-6 items-start">
            <SmartImage
              src={SITE_IMAGES.coachAnupamand}
              alt={SITE_LINKS.coaches.anupamand.nameEn}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover object-[50%_30%] shrink-0"
            />
            <div className="space-y-3">
              <div>
                <h3 className="font-display text-xl font-bold text-stone-900 dark:text-stone-50">
                  {lang === 'en'
                    ? SITE_LINKS.coaches.anupamand.nameEn
                    : SITE_LINKS.coaches.anupamand.nameHi}
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                  {lang === 'en'
                    ? SITE_LINKS.coaches.anupamand.roleEn
                    : SITE_LINKS.coaches.anupamand.roleHi}
                </p>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {lang === 'en'
                  ? 'Guides practical daily lifestyle routines, mindful eating habits, and long-term consistency for families of all ages.'
                  : 'हर उम्र के लोगों के लिए सरल दैनिक जीवनशैली, संतुलित खान-पान की आदतें और नियमित मार्गदर्शन।'}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold">
                <a
                  href={SITE_LINKS.coaches.anupamand.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  WhatsApp
                </a>
                <a
                  href={SITE_LINKS.coaches.anupamand.tel}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  {SITE_LINKS.coaches.anupamand.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7b. Official Vedika Brochures & Posters Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {lang === 'en' ? 'Official Flyers & Health Guides' : 'आधिकारिक ब्रोशर और हेल्थ गाइड'}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50">
              {lang === 'en' ? 'Explore Our Programs & Body Check Posters' : 'हमारे प्लान और बॉडी चेक पोस्टर देखें'}
            </h2>
          </div>
          <a
            href={SITE_LINKS.bookFreeCallWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:underline self-start sm:self-auto"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>{lang === 'en' ? 'Ask Coach on WhatsApp' : 'व्हाट्सएप पर कोच से पूछें'}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {officialPosters.map((poster) => (
            <button
              key={poster.titleEn}
              type="button"
              onClick={() => setActivePoster(poster)}
              className="group text-left rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] overflow-hidden flex flex-col hover:border-emerald-600 dark:hover:border-emerald-500 transition-colors cursor-pointer"
            >
              <div className="relative aspect-[16/11] bg-stone-100 dark:bg-stone-900 overflow-hidden">
                <img
                  src={poster.src}
                  alt={lang === 'en' ? poster.titleEn : poster.titleHi}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
                <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-950/75 text-white text-[11px] font-semibold backdrop-blur-sm">
                  <Maximize2 className="w-3 h-3" aria-hidden="true" />
                  {lang === 'en' ? 'View Full' : 'पूरा देखें'}
                </span>
              </div>
              <div className="p-5 space-y-1.5">
                <h3 className="font-display text-base font-bold text-stone-900 dark:text-stone-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {lang === 'en' ? poster.titleEn : poster.titleHi}
                </h3>
                <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                  {lang === 'en' ? poster.captionEn : poster.captionHi}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 8. Social Media Updates (YouTube, Instagram, Facebook) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {t.home.socialKicker}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
            {t.home.socialTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl">
            {t.home.socialSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <a
            href={SITE_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 space-y-3 hover:border-emerald-600 dark:hover:border-emerald-500 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span>YouTube · @VedikaHealthandWellness</span>
              <ExternalLink className="w-4 h-4 group-hover:text-emerald-700 dark:group-hover:text-emerald-400" />
            </div>
            <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">
              {lang === 'en'
                ? 'Simple Indian Diet & Calorie Video Guides'
                : 'सरल भारतीय डाइट और कैलोरी वीडियो गाइड'}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              {lang === 'en'
                ? 'Watch short practical videos on weight loss thalis, protein myths, and evening snack swaps.'
                : 'वेट लॉस थाली, प्रोटीन के सही स्रोत और शाम के हेल्दी स्नैक्स पर छोटे आसान वीडियो देखें।'}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {lang === 'en' ? 'Watch on YouTube' : 'यूट्यूब पर देखें'}
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>

          <a
            href={SITE_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 space-y-3 hover:border-emerald-600 dark:hover:border-emerald-500 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span>Instagram · @VedikaHealthandWellness</span>
              <ExternalLink className="w-4 h-4 group-hover:text-emerald-700 dark:group-hover:text-emerald-400" />
            </div>
            <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">
              {lang === 'en'
                ? 'Daily Reels: Healthy vs Unhealthy Plate Checks'
                : 'रोज़ की रील्स: हेल्दी बनाम अनहेल्दी थाली तुलना'}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              {lang === 'en'
                ? 'Quick 30-second reels showing real calories in chai, biscuits, roti, paneer, and sprouts.'
                : 'चाय, बिस्किट, रोटी, पनीर और स्प्राउट्स की असली कैलोरी दिखाने वाली 30-सेकंड रील्स।'}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {lang === 'en' ? 'Follow on Instagram' : 'इंस्टाग्राम पर फॉलो करें'}
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>

          <a
            href={SITE_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 space-y-3 hover:border-emerald-600 dark:hover:border-emerald-500 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span>Facebook · VedikaHealthandWellness</span>
              <ExternalLink className="w-4 h-4 group-hover:text-emerald-700 dark:group-hover:text-emerald-400" />
            </div>
            <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">
              {lang === 'en'
                ? 'Community Tips & Live Session Announcements'
                : 'कम्युनिटी टिप्स और लाइव सेशन की जानकारी'}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              {lang === 'en'
                ? 'Join our growing wellness community for weekend free awareness talks and Hindi nutrition charts.'
                : 'फ्री अवेयरनेस टॉक और हिंदी न्यूट्रिशन चार्ट्स के लिए हमारे फेसबुक समुदाय से जुड़ें।'}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {lang === 'en' ? 'Visit Facebook Page' : 'फेसबुक पेज देखें'}
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>
      </section>

      {/* 9. Latest Blogs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {t.home.blogsKicker}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50">
              {t.home.blogsTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('blog')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer self-start sm:self-auto"
          >
            <span>{lang === 'en' ? 'Read All 5 Articles' : 'सभी 5 लेख पढ़ें'}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <article
              key={post.id}
              onClick={() => onNavigate('blog', post.id)}
              className="group rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] overflow-hidden cursor-pointer flex flex-col justify-between hover:border-emerald-600 dark:hover:border-emerald-500 transition-colors"
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-900">
                  <SmartImage
                    src={post.image}
                    alt={lang === 'en' ? post.titleEn : post.titleHi}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span>{lang === 'en' ? post.categoryEn : post.categoryHi}</span>
                    <span aria-hidden="true">·</span>
                    <span>{lang === 'en' ? post.readTimeEn : post.readTimeHi}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {lang === 'en' ? post.titleEn : post.titleHi}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-300 line-clamp-2">
                    {lang === 'en' ? post.excerptEn : post.excerptHi}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  {lang === 'en' ? 'Read & Try Tool' : 'पढ़ें और टूल आज़माएं'}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 10. Quick Lead Capture Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 sm:p-10 space-y-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
              {t.home.quickLeadTitle}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300">
              {t.home.quickLeadSub}
            </p>
          </div>

          <form onSubmit={handleQuickLeadSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'en' ? 'Your Name' : 'आपका नाम'}
              aria-label={lang === 'en' ? 'Your Name' : 'आपका नाम'}
              className="px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={lang === 'en' ? 'Phone / WhatsApp Number*' : 'फोन / व्हाट्सएप नंबर*'}
              aria-label={lang === 'en' ? 'Phone or WhatsApp Number' : 'फोन या व्हाट्सएप नंबर'}
              className="px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={lang === 'en' ? 'Email (optional if phone given)' : 'ईमेल (वैकल्पिक)'}
              aria-label={lang === 'en' ? 'Email address' : 'ईमेल पता'}
              className="px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              aria-label={lang === 'en' ? 'Main health goal' : 'मुख्य स्वास्थ्य लक्ष्य'}
              className="px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="3-Day Free Demo">
                {lang === 'en' ? '3-Day Free Demo' : '3-दिन का फ्री डेमो'}
              </option>
              <option value="Sustainable Fat Loss">
                {lang === 'en' ? 'Weight / Fat Loss' : 'वजन / चर्बी घटाना'}
              </option>
              <option value="Healthy Weight Gain">
                {lang === 'en' ? 'Healthy Weight Gain' : 'स्वस्थ वजन बढ़ाना'}
              </option>
              <option value="BP / Sugar / Thyroid Lifestyle">
                {lang === 'en' ? 'BP / Sugar / Thyroid Habits' : 'BP / शुगर / थायराइड जीवनशैली'}
              </option>
            </select>

            <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center gap-4 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="cta-calm-shift inline-flex items-center gap-2 text-white font-semibold text-sm px-6 py-3 rounded-lg cursor-pointer disabled:opacity-60 whitespace-nowrap"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>
                  {submitting
                    ? lang === 'en'
                      ? 'Sending...'
                      : 'भेजा जा रहा है...'
                    : lang === 'en'
                      ? 'Request Free Callback'
                      : 'फ्री कॉलबैक बुक करें'}
                </span>
              </button>
              <a
                href={SITE_LINKS.bookFreeCallWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>{lang === 'en' ? 'Or message directly on WhatsApp' : 'या सीधे व्हाट्सएप पर संदेश भेजें'}</span>
              </a>
            </div>
          </form>

          {feedback && (
            <p
              role="status"
              className={`text-sm font-medium px-4 py-3 rounded-lg border ${
                feedback.type === 'ok'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              }`}
            >
              {feedback.text}
            </p>
          )}
        </div>
      </section>

      <PosterLightbox poster={activePoster} lang={lang} onClose={() => setActivePoster(null)} />
    </div>
  );
}
