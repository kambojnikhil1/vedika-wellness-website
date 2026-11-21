import heroThali from '../assets/images/hero_balanced_thali_1795251653262.jpg';
import heroNutrition from '../assets/images/hero_nutrition_coaching_1795251642002.jpg';
import blogProtein from '../assets/images/blog_protein_muscle_1795251642118.jpg';
import blogHydration from '../assets/images/blog_hydration_habits_1795251643365.jpg';

/**
 * Resolves static files stored in /public/assets/aistudio/ safely on both
 * root domains (e.g. vedikawellness.com/contact) and subpath hosts
 * (e.g. kambojnikhil1.github.io/vedika-wellness-website/#/contact).
 */
export function resolvePublicAsset(pathFromPublic: string): string {
  const clean = pathFromPublic.replace(/^\/+/, '');
  if (typeof window !== 'undefined') {
    const isSubpathHost =
      window.location.hostname.endsWith('github.io') ||
      window.location.hash.startsWith('#/');
    if (isSubpathHost) {
      return `./${clean}`;
    }
  }
  return `/${clean}`;
}

export const SITE_IMAGES = {
  heroThali,
  heroNutrition,
  blogProtein,
  blogHydration,
  // Real coach photographs
  coachNikhil: resolvePublicAsset('assets/aistudio/nikhil_kamboj_74a6a7fc.jpg'),
  coachAnupamand: resolvePublicAsset('assets/aistudio/Anupamand_Giri_03656b3b.jpg'),
  // Official Vedika logos
  logoVertical: resolvePublicAsset('assets/aistudio/vedika_logo_7bd190cf.png'),
  logoHorizontal: resolvePublicAsset('assets/aistudio/vedika_logo2_fdece276.png'),
  logoBadge: resolvePublicAsset('assets/aistudio/vedika_temp_5308c79b.png'),
  // Official posters & pamphlets
  flyerPlans: resolvePublicAsset('assets/aistudio/flyer_A5_both_sides_367fdf86.jpg'),
  pamphletAbout: resolvePublicAsset('assets/aistudio/front_side_Phamplet_c04ec86a.jpg'),
  posterBodyNumbers: resolvePublicAsset('assets/aistudio/know_your_body_e934be5d.jpg'),
} as const;

export const BOOK_FREE_CALL_WHATSAPP_URL =
  'https://wa.me/918193989452?text=' +
  encodeURIComponent('Hi, I want some help related to my health issues');

export const SITE_LINKS = {
  website: 'https://vedikawellness.com/',
  youtube: 'https://www.youtube.com/@VedikaHealthandWellness',
  instagram: 'https://www.instagram.com/VedikaHealthandWellness',
  facebook: 'https://www.fb.com/VedikaHealthandWellness',
  email: 'vedikawellness01@gmail.com',
  bookFreeCallWhatsapp: BOOK_FREE_CALL_WHATSAPP_URL,
  gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=7WQ7%2BQG+Karbari+Grant,+Uttarakhand,+India',
  gmapsEmbedUrl:
    'https://maps.google.com/maps?q=7WQ7%2BQG+Karbari+Grant,+Uttarakhand,+India&t=&z=15&ie=UTF8&iwloc=&output=embed',
  gmapCode: '7WQ7+QG Karbari Grant, Uttarakhand, India',
  addressEn: 'Hariom Ashram, Kadwapani, Karbari Grant, Shimla Road, Dehradun, Uttarakhand - 248007',
  addressHi: 'हरिओम आश्रम, कड़वापानी, करबारी ग्रांट, शिमला रोड, देहरादून, उत्तराखंड - 248007',
  coaches: {
    nikhil: {
      nameEn: 'Nikhil Kamboj',
      nameHi: 'निखिल कांबोज',
      roleEn: 'Certified Fitness Trainer (NASM) & Nutrition Coach',
      roleHi: 'सर्टिफाइड फिटनेस ट्रेनर (NASM) एवं पोषण कोच',
      phoneDisplay: '+91 81939 89452',
      tel: 'tel:+918193989452',
      whatsapp: BOOK_FREE_CALL_WHATSAPP_URL,
      telegram: 'https://t.me/+918193989452',
    },
    anupamand: {
      nameEn: 'Mahant Anupamand Giri',
      nameHi: 'महंत अनुपमानंद गिरी',
      roleEn: 'Senior Wellness Coach & Advisor',
      roleHi: 'वरिष्ठ वेलनेस कोच एवं सलाहकार',
      phoneDisplay: '+91 98975 04931',
      tel: 'tel:+919897504931',
      whatsapp:
        'https://wa.me/919897504931?text=' +
        encodeURIComponent('Hi, I want some help related to my health issues'),
      telegram: 'https://t.me/+919897504931',
    },
  },
} as const;
