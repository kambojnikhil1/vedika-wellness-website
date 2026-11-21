import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import type { Lang, PageId } from '../types';
import { getCopy } from '../data/translations';
import { SITE_LINKS } from '../data/siteAssets';

interface FooterProps {
  lang: Lang;
  onNavigate: (page: PageId) => void;
}

export function Footer({ lang, onNavigate }: FooterProps) {
  const t = getCopy(lang);

  return (
    <footer className="mt-20 border-t border-stone-200 dark:border-stone-800 bg-[#F4F4F1] dark:bg-[#121815]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-display text-xl font-bold text-stone-900 dark:text-stone-50 cursor-pointer"
            >
              {t.brand}
            </button>
            <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {lang === 'en'
                ? 'Simple, science-backed Indian nutrition coaching (80% food, 20% movement) helping everyday people build sustainable weight and lifestyle habits.'
                : 'सरल, विज्ञान-आधारित भारतीय पोषण कोचिंग (80% भोजन, 20% गतिविधि) जो रोज़मर्रा के जीवन में टिकाऊ स्वास्थ्य आदतें बनाने में मदद करती है।'}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-emerald-800 dark:text-emerald-400">
              <a
                href={SITE_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                YouTube <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a
                href={SITE_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                Instagram <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a
                href={SITE_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                Facebook <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              {lang === 'en' ? 'Explore Pages' : 'मुख्य पेज'}
            </h3>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              {(
                [
                  { id: 'home', label: t.nav.home },
                  { id: 'about', label: t.nav.about },
                  { id: 'services', label: t.nav.services },
                  { id: 'programs', label: t.nav.programs },
                  { id: 'studio', label: t.nav.studio },
                ] as { id: PageId; label: string }[]
              ).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources & Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              {lang === 'en' ? 'Helpful Links' : 'उपयोगी लिंक'}
            </h3>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              {(
                [
                  { id: 'blog', label: t.nav.blog },
                  { id: 'faq', label: t.nav.faq },
                  { id: 'contact', label: t.nav.contact },
                  { id: 'book', label: t.nav.bookCta },
                  { id: 'admin', label: t.nav.admin },
                ] as { id: PageId; label: string }[]
              ).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Direct Contact */}
          <div className="space-y-3 text-sm text-stone-600 dark:text-stone-400">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              {lang === 'en' ? 'Direct Coach Contact' : 'सीधा संपर्क'}
            </h3>
            <div className="space-y-2">
              <a
                href={SITE_LINKS.coaches.nikhil.tel}
                className="flex items-center gap-2 hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="tabular-nums">
                  {SITE_LINKS.coaches.nikhil.phoneDisplay} ({lang === 'en' ? 'Nikhil' : 'निखिल'})
                </span>
              </a>
              <a
                href={SITE_LINKS.coaches.anupamand.tel}
                className="flex items-center gap-2 hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="tabular-nums">
                  {SITE_LINKS.coaches.anupamand.phoneDisplay} ({lang === 'en' ? 'Anupamand Giri' : 'अनुपमानंद गिरी'})
                </span>
              </a>
              <a
                href={`mailto:${SITE_LINKS.email}`}
                className="flex items-center gap-2 hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{SITE_LINKS.email}</span>
              </a>
              <a
                href={SITE_LINKS.gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-emerald-700 dark:hover:text-emerald-400 pt-1"
              >
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{lang === 'en' ? SITE_LINKS.addressEn : SITE_LINKS.addressHi}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Non-Medical Disclaimer */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#171F1B] p-5 space-y-1.5">
          <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
            {t.footer.disclaimerTitle}
          </p>
          <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400">
            {t.footer.disclaimerBody}
          </p>
        </div>

        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
          <p>
            © {new Date().getFullYear()} Vedika Health and Wellness · {t.footer.rights}
          </p>
          <a
            href={SITE_LINKS.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            vedikawellness.com
          </a>
        </div>
      </div>
    </footer>
  );
}
