export type Lang = 'en' | 'hi';
export type Theme = 'light' | 'dark';

export type PageId =
  | 'home'
  | 'about'
  | 'services'
  | 'programs'
  | 'studio'
  | 'blog'
  | 'faq'
  | 'contact'
  | 'book'
  | 'admin';

export type FoodCategory =
  | 'Meals'
  | 'Vegetables'
  | 'Dairy'
  | 'Seeds & Nuts'
  | 'Drinks'
  | 'Alcohol'
  | 'Packaged';

export interface IndianFoodItem {
  id: string;
  nameEn: string;
  nameHi: string;
  servingEn: string;
  servingHi: string;
  category: FoodCategory;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  tags: ('high-protein' | 'high-fibre' | 'low-cal' | 'caution')[];
}

export interface PlateEntry {
  foodId: string;
  quantity: number;
}

export interface SavedPlate {
  id: string;
  name: string;
  entries: PlateEntry[];
  isPremade?: boolean;
  premadeType?: 'healthy' | 'unhealthy' | 'weight-loss' | 'weight-gain';
}

export interface BlogPost {
  id: string;
  slug: string;
  categoryEn: string;
  categoryHi: string;
  readTimeEn: string;
  readTimeHi: string;
  dateEn: string;
  dateHi: string;
  image: string;
  titleEn: string;
  titleHi: string;
  excerptEn: string;
  excerptHi: string;
  sectionsEn: { heading: string; body: string }[];
  sectionsHi: { heading: string; body: string }[];
  takeawayEn: string;
  takeawayHi: string;
  widgetType: 'myth-quiz' | 'water-calc' | 'protein-calc' | 'habit-check' | 'food-swap';
}
