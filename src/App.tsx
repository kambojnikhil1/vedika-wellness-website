import { useCallback, useEffect, useState } from 'react';
import type { Lang, PageId, Theme } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { WellnessStudioPage } from './pages/WellnessStudioPage';
import { BlogPage } from './pages/BlogPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { BookConsultationPage } from './pages/BookConsultationPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { trackPageView } from './utils/api';

const PAGE_PATHS: Record<PageId, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  programs: '/programs',
  studio: '/wellness-studio',
  blog: '/blog',
  faq: '/faq',
  contact: '/contact',
  book: '/book-consultation',
  admin: '/admin',
};

const PAGE_TITLES: Record<PageId, string> = {
  home: 'Vedika Health and Wellness – Simple Indian Nutrition & Weight Coaching',
  about: 'About Our Journey – Vedika Health and Wellness',
  services: 'Our Wellness Services – Vedika Health and Wellness',
  programs: 'Programs & Plans (₹6,300/mo & 3-Day Free Demo) – Vedika Wellness',
  studio: 'Wellness Studio: BMI, BMR & Indian Thali Calorie Calculator – Vedika Wellness',
  blog: 'Nutrition & Weight Loss Blog – Vedika Health and Wellness',
  faq: 'Frequently Asked Questions – Vedika Health and Wellness',
  contact: 'Contact Our Coaches (Dehradun & Online) – Vedika Health and Wellness',
  book: 'Book Your Free Health Consultation – Vedika Health and Wellness',
  admin: 'Visitor & Lead Dashboard – Vedika Health and Wellness',
};

function isStaticSubpathHost(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.location.hostname.endsWith('github.io')) return true;
  // Also handle any non-root base path if the page isn't at a known app route
  const knownPaths = new Set(Object.values(PAGE_PATHS));
  const clean = window.location.pathname.replace(/\/+$/, '') || '/';
  return clean !== '/' && !knownPaths.has(clean);
}

function resolveCurrentPage(): PageId {
  const hash = window.location.hash.replace(/^#/, '').replace(/\/+$/, '');
  if (hash) {
    const hashMatch = (Object.entries(PAGE_PATHS) as [PageId, string][]).find(
      ([, path]) => path === hash || path === `/${hash}`
    );
    if (hashMatch) return hashMatch[0];
  }
  const clean = window.location.pathname.replace(/\/+$/, '') || '/';
  const match = (Object.entries(PAGE_PATHS) as [PageId, string][]).find(
    ([, path]) => path === clean
  );
  return match ? match[0] : 'home';
}

export default function App() {
  const [useHashRouting] = useState<boolean>(() => isStaticSubpathHost());
  const [currentPage, setCurrentPage] = useState<PageId>(() => resolveCurrentPage());
  const [subParam, setSubParam] = useState<string | undefined>(undefined);
  const [lang, setLang] = useState<Lang>('en');
  const [theme, setTheme] = useState<Theme>('light');

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync document language attribute & SEO page title
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = PAGE_TITLES[currentPage];
  }, [lang, currentPage]);

  // Track visitor page views on navigation
  useEffect(() => {
    if (currentPage !== 'admin') {
      void trackPageView(PAGE_PATHS[currentPage], PAGE_TITLES[currentPage], lang, theme);
    }
  }, [currentPage, lang, theme]);

  // Handle browser back/forward buttons & hash changes
  useEffect(() => {
    const onRouteChange = () => {
      setCurrentPage(resolveCurrentPage());
      setSubParam(undefined);
    };
    window.addEventListener('popstate', onRouteChange);
    window.addEventListener('hashchange', onRouteChange);
    return () => {
      window.removeEventListener('popstate', onRouteChange);
      window.removeEventListener('hashchange', onRouteChange);
    };
  }, []);

  const handleNavigate = useCallback(
    (page: PageId, nextSubParam?: string) => {
      setCurrentPage(page);
      setSubParam(nextSubParam);
      const nextPath = PAGE_PATHS[page];
      if (useHashRouting) {
        const nextHash = page === 'home' ? '#/' : `#${nextPath}`;
        if (window.location.hash !== nextHash) {
          window.location.hash = nextHash;
        }
      } else if (window.location.pathname !== nextPath) {
        window.history.pushState({ page }, '', nextPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [useHashRouting]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#181A18] dark:bg-[#0F1412] dark:text-[#F2F5F3] transition-colors duration-200">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
      />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage lang={lang} onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage lang={lang} onNavigate={handleNavigate} />}
        {currentPage === 'services' && <ServicesPage lang={lang} onNavigate={handleNavigate} />}
        {currentPage === 'programs' && <ProgramsPage lang={lang} onNavigate={handleNavigate} />}
        {currentPage === 'studio' && (
          <WellnessStudioPage lang={lang} initialTab={subParam} onNavigate={handleNavigate} />
        )}
        {currentPage === 'blog' && (
          <BlogPage lang={lang} initialPostId={subParam} onNavigate={handleNavigate} />
        )}
        {currentPage === 'faq' && <FaqPage lang={lang} onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactPage lang={lang} />}
        {currentPage === 'book' && <BookConsultationPage lang={lang} initialGoal={subParam} />}
        {currentPage === 'admin' && <AdminDashboardPage lang={lang} />}
      </main>

      <Footer lang={lang} onNavigate={handleNavigate} />
    </div>
  );
}
