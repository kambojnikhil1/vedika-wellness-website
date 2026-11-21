import { useState } from 'react';
import { ExternalLink, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import type { Lang } from '../types';
import { getCopy } from '../data/translations';
import { SITE_IMAGES, SITE_LINKS } from '../data/siteAssets';
import { SmartImage } from '../components/SmartImage';
import { submitLead } from '../utils/api';

interface ContactPageProps {
  lang: Lang;
}

export function ContactPage({ lang }: ContactPageProps) {
  const t = getCopy(lang);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!phone.trim() && !email.trim()) {
      setStatus({
        ok: false,
        text:
          lang === 'en'
            ? 'Please enter a valid phone number or email address.'
            : 'कृपया सही फोन नंबर या ईमेल पता दर्ज करें।',
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        goal: 'Contact Inquiry',
        source: 'Contact Page Form',
        mode: 'Contact Message',
        message: message.trim(),
      });
      if (res.accepted) {
        setStatus({
          ok: true,
          text:
            lang === 'en'
              ? 'Message received! Our coach will reach out to you soon.'
              : 'संदेश प्राप्त हुआ! हमारे कोच शीघ्र आपसे संपर्क करेंगे।',
        });
        setName('');
        setPhone('');
        setEmail('');
        setMessage('');
      } else {
        setStatus({ ok: false, text: res.error || 'Could not send message.' });
      }
    } catch {
      setStatus({ ok: false, text: 'Network error. Please message us on WhatsApp directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">
      {/* Title */}
      <section className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          {lang === 'en' ? 'Connect Instantly on WhatsApp & Telegram' : 'व्हाट्सएप और टेलीग्राम पर तुरंत जुड़ें'}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-50">
          {t.contact.title}
        </h1>
        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
          {t.contact.subtitle}
        </p>
      </section>

      {/* Two Coaches Instant Connect */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nikhil Kamboj */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-4">
            <SmartImage
              src={SITE_IMAGES.coachNikhil}
              alt={SITE_LINKS.coaches.nikhil.nameEn}
              className="w-20 h-20 rounded-xl object-cover object-[50%_24%] shrink-0"
            />
            <div>
              <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
                {lang === 'en' ? SITE_LINKS.coaches.nikhil.nameEn : SITE_LINKS.coaches.nikhil.nameHi}
              </h2>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {lang === 'en' ? SITE_LINKS.coaches.nikhil.roleEn : SITE_LINKS.coaches.nikhil.roleHi}
              </p>
              <p className="text-sm font-mono text-stone-700 dark:text-stone-300 tabular-nums mt-0.5">
                {SITE_LINKS.coaches.nikhil.phoneDisplay}
              </p>
            </div>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {lang === 'en'
              ? 'Focus areas: Scientific weight management, metabolic correction, Indian food planning, and posture/spinal alignment advice.'
              : 'विशेषज्ञता: विज्ञान-आधारित वजन प्रबंधन, मेटाबॉलिज़्म सुधार, भारतीय डाइट प्लानिंग और कमर/पोस्चर सलाह।'}
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <a
              href={SITE_LINKS.coaches.nikhil.tel}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {lang === 'en' ? 'Call' : 'कॉल'}
            </a>
            <a
              href={SITE_LINKS.coaches.nikhil.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href={SITE_LINKS.coaches.nikhil.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white transition-colors"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              Telegram
            </a>
          </div>
        </div>

        {/* Mahant Anupamand Giri */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-4">
            <SmartImage
              src={SITE_IMAGES.coachAnupamand}
              alt={SITE_LINKS.coaches.anupamand.nameEn}
              className="w-20 h-20 rounded-xl object-cover object-[50%_30%] shrink-0"
            />
            <div>
              <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
                {lang === 'en'
                  ? SITE_LINKS.coaches.anupamand.nameEn
                  : SITE_LINKS.coaches.anupamand.nameHi}
              </h2>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {lang === 'en'
                  ? SITE_LINKS.coaches.anupamand.roleEn
                  : SITE_LINKS.coaches.anupamand.roleHi}
              </p>
              <p className="text-sm font-mono text-stone-700 dark:text-stone-300 tabular-nums mt-0.5">
                {SITE_LINKS.coaches.anupamand.phoneDisplay}
              </p>
            </div>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {lang === 'en'
              ? 'Focus areas: Holistic everyday lifestyle habits, disciplined meal routines, and personal wellness guidance.'
              : 'विशेषज्ञता: संपूर्ण दैनिक जीवनशैली सुधार, संतुलित खान-पान की आदतें और व्यक्तिगत वेलनेस मार्गदर्शन।'}
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <a
              href={SITE_LINKS.coaches.anupamand.tel}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {lang === 'en' ? 'Call' : 'कॉल'}
            </a>
            <a
              href={SITE_LINKS.coaches.anupamand.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href={SITE_LINKS.coaches.anupamand.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white transition-colors"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              Telegram
            </a>
          </div>
        </div>
      </section>

      {/* Online & Offline Center + Contact Form */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 space-y-2.5">
            <h3 className="font-display text-xl font-bold text-stone-900 dark:text-stone-50">
              {t.contact.onlineTitle}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {t.contact.onlineBody}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 space-y-3">
            <h3 className="font-display text-xl font-bold text-stone-900 dark:text-stone-50">
              {t.contact.offlineTitle}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {t.contact.offlineBody}
            </p>
            <div className="pt-2 space-y-2 text-sm text-stone-700 dark:text-stone-200">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-1" aria-hidden="true" />
                <span>{lang === 'en' ? SITE_LINKS.addressEn : SITE_LINKS.addressHi}</span>
              </p>
              <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
                Google Maps Code: {SITE_LINKS.gmapCode}
              </p>

              {/* Embedded Google Map for Dehradun Center */}
              <div className="pt-2">
                <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-900 shadow-sm">
                  <iframe
                    title={
                      lang === 'en'
                        ? 'Vedika Health and Wellness Dehradun Center Map'
                        : 'वेदिका हेल्थ एंड वेलनेस देहरादून केंद्र का नक्शा'
                    }
                    src={SITE_LINKS.gmapsEmbedUrl}
                    className="w-full h-60 sm:h-64 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>

              <a
                href={SITE_LINKS.gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline pt-1"
              >
                <span>{lang === 'en' ? 'Open in Google Maps' : 'गूगल मैप्स पर लोकेशन खोलें'}</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 space-y-3 text-sm">
            <a
              href={`mailto:${SITE_LINKS.email}`}
              className="flex items-center gap-2 font-medium text-stone-800 dark:text-stone-200 hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              <Mail className="w-4 h-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              <span>{SITE_LINKS.email}</span>
            </a>
            <div className="flex flex-wrap gap-4 pt-1 text-emerald-800 dark:text-emerald-400 font-semibold">
              <a href={SITE_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="hover:underline">
                YouTube
              </a>
              <a href={SITE_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Instagram
              </a>
              <a href={SITE_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Direct Message Form */}
        <div className="lg:col-span-7 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 sm:p-8 space-y-5">
          <div className="space-y-1">
            <h3 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
              {lang === 'en' ? 'Send Us a Quick Message' : 'हमें सीधा संदेश भेजें'}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              {lang === 'en'
                ? 'Share your phone number or email and we will reply personally.'
                : 'अपना फोन नंबर या ईमेल लिखें — हमारे कोच आपसे व्यक्तिगत रूप से संपर्क करेंगे।'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  {lang === 'en' ? 'Your Name' : 'आपका नाम'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  {lang === 'en' ? 'Phone / WhatsApp Number*' : 'फोन / व्हाट्सएप नंबर*'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {lang === 'en' ? 'Email Address (optional if phone entered)' : 'ईमेल पता (वैकल्पिक)'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {lang === 'en' ? 'How can we help you?' : 'हम आपकी कैसे मदद कर सकते हैं?'}
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  lang === 'en'
                    ? 'Tell us your goal (e.g. weight loss, weight gain, BP/sugar lifestyle, 3-day demo)...'
                    : 'अपना लक्ष्य बताएं (जैसे: वजन घटाना, वजन बढ़ाना, BP/शुगर जीवनशैली, 3-दिन डेमो)...'
                }
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="cta-calm-shift inline-flex items-center gap-2 text-white font-semibold text-sm px-6 py-3 rounded-lg cursor-pointer disabled:opacity-60"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>
                {submitting
                  ? lang === 'en'
                    ? 'Sending...'
                    : 'भेज रहे हैं...'
                  : lang === 'en'
                    ? 'Send Message to Coach'
                    : 'कोच को संदेश भेजें'}
              </span>
            </button>

            {status && (
              <p
                role="status"
                className={`text-sm font-medium px-4 py-3 rounded-lg border ${
                  status.ok
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                }`}
              >
                {status.text}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
