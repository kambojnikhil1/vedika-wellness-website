import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookmarkPlus,
  Check,
  Copy,
  Download,
  Minus,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Share2,
  Trash2,
} from 'lucide-react';
import type { FoodCategory, Lang, PageId, PlateEntry, SavedPlate } from '../types';
import { INDIAN_FOODS, PREMADE_PLATES, computePlateTotals } from '../data/indianFoods';
import { SITE_LINKS } from '../data/siteAssets';
import { submitLead } from '../utils/api';

interface WellnessStudioPageProps {
  lang: Lang;
  initialTab?: string;
  onNavigate: (page: PageId, subParam?: string) => void;
}

type StudioTab = 'eval' | 'plate' | 'sheet';

const CATEGORIES: ('All' | FoodCategory)[] = [
  'All',
  'Meals',
  'Vegetables',
  'Dairy',
  'Seeds & Nuts',
  'Drinks',
  'Alcohol',
  'Packaged',
];

export function WellnessStudioPage({ lang, initialTab, onNavigate }: WellnessStudioPageProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>(
    initialTab === 'plate' ? 'plate' : initialTab === 'sheet' ? 'sheet' : 'eval'
  );

  useEffect(() => {
    if (initialTab === 'plate' || initialTab === 'eval' || initialTab === 'sheet') {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // --- TAB 1: SELF HEALTH EVALUATION ---
  const [evalName, setEvalName] = useState('');
  const [evalContact, setEvalContact] = useState('');
  const [weightKg, setWeightKg] = useState('76');
  const [heightCm, setHeightCm] = useState('168');
  const [age, setAge] = useState('34');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [lifestyle, setLifestyle] = useState<'sedentary' | 'light' | 'moderate' | 'active'>('light');
  const [waistCm, setWaistCm] = useState('92');
  const [evalComputed, setEvalComputed] = useState(true);
  const [leadSentNotice, setLeadSentNotice] = useState('');

  const evalResults = useMemo(() => {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);
    const a = parseFloat(age);
    const waist = parseFloat(waistCm);
    if (!w || !h || !a || w <= 20 || h <= 90 || a <= 5) return null;

    const hMeters = h / 100;
    const bmi = Number((w / (hMeters * hMeters)).toFixed(1));

    let bmiStatusEn = 'Healthy Weight';
    let bmiStatusHi = 'स्वस्थ वजन';
    let bmiTone: 'good' | 'warn' | 'alert' = 'good';
    if (bmi < 18.5) {
      bmiStatusEn = 'Underweight';
      bmiStatusHi = 'कम वजन';
      bmiTone = 'warn';
    } else if (bmi >= 23 && bmi < 27.5) {
      // Indian Asian BMI guidance
      bmiStatusEn = 'Overweight (Indian range)';
      bmiStatusHi = 'ज़्यादा वजन (भारतीय मानक)';
      bmiTone = 'warn';
    } else if (bmi >= 27.5) {
      bmiStatusEn = 'High Weight / Fat Loss Needed';
      bmiStatusHi = 'अधिक वजन — फैट लॉस ज़रूरी';
      bmiTone = 'alert';
    }

    // Mifflin-St Jeor BMR
    const bmr = Math.round(
      gender === 'male' ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161
    );

    const activityFactor = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    }[lifestyle];

    const maintainCal = Math.round(bmr * activityFactor);
    const fatLossCal = Math.max(1200, maintainCal - 450);
    const gainCal = maintainCal + 350;

    const idealMin = Math.round(19.5 * hMeters * hMeters);
    const idealMax = Math.round(23.5 * hMeters * hMeters);
    const dailyWater = Number((w * 0.035).toFixed(1));
    const dailyProtein = Math.round(w * (bmi >= 23 ? 1.1 : 1.0));

    let waistRatio: number | null = null;
    let waistNoteEn = '';
    let waistNoteHi = '';
    if (waist && waist > 40) {
      waistRatio = Number((waist / h).toFixed(2));
      if (waistRatio < 0.5) {
        waistNoteEn = 'Healthy waist-to-height ratio (under 0.50). Low belly fat risk.';
        waistNoteHi = 'स्वस्थ कमर-ऊंचाई अनुपात (0.50 से कम)। पेट की चर्बी संतुलित है।';
      } else if (waistRatio < 0.58) {
        waistNoteEn = 'Slightly high belly fat (0.50–0.57). Focus on evening dinner timing and protein.';
        waistNoteHi = 'पेट की चर्बी थोड़ी अधिक है (0.50–0.57)। डिनर हल्का और प्रोटीन-युक्त रखें।';
      } else {
        waistNoteEn = 'High visceral belly fat (0.58+). Strongly recommended to start structured fat loss.';
        waistNoteHi = 'पेट की चर्बी काफी अधिक है (0.58+)। सही गाइडेंस के साथ फैट लॉस शुरू करें।';
      }
    }

    return {
      bmi,
      bmiStatusEn,
      bmiStatusHi,
      bmiTone,
      bmr,
      maintainCal,
      fatLossCal,
      gainCal,
      idealMin,
      idealMax,
      dailyWater,
      dailyProtein,
      waistRatio,
      waistNoteEn,
      waistNoteHi,
    };
  }, [weightKg, heightCm, age, gender, lifestyle, waistCm]);

  const handleEvaluateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvalComputed(true);
    setLeadSentNotice('');

    const contact = evalContact.trim();
    if (contact && evalResults) {
      const isEmail = contact.includes('@');
      const res = await submitLead({
        name: evalName.trim(),
        phone: isEmail ? '' : contact,
        email: isEmail ? contact : '',
        goal: evalResults.bmi >= 23 ? 'Fat Loss Assessment' : evalResults.bmi < 18.5 ? 'Weight Gain Assessment' : 'Health Evaluation',
        source: 'Wellness Studio Self Evaluation',
        metricsSummary: `BMI ${evalResults.bmi} (${evalResults.bmiStatusEn}), BMR ${evalResults.bmr} kcal, Weight ${weightKg}kg, Height ${heightCm}cm${evalResults.waistRatio ? `, WHtR ${evalResults.waistRatio}` : ''}`,
      });
      if (res.accepted) {
        setLeadSentNotice(
          lang === 'en'
            ? 'Your health report summary was also shared with our wellness coach for free tips!'
            : 'आपकी हेल्थ रिपोर्ट हमारे वेलनेस कोच के साथ साझा कर दी गई है!'
        );
      }
    }
  };

  // --- TAB 2: INTERACTIVE PLATE CALORIE CALCULATOR ---
  const [plateEntries, setPlateEntries] = useState<PlateEntry[]>([
    { foodId: 'roti', quantity: 2 },
    { foodId: 'moong-dal', quantity: 1 },
    { foodId: 'fresh-salad', quantity: 1 },
    { foodId: 'plain-curd', quantity: 1 },
  ]);
  const [plateFoodCategory, setPlateFoodCategory] = useState<'All' | FoodCategory>('All');
  const [plateFoodQuery, setPlateFoodQuery] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [plateNameInput, setPlateNameInput] = useState('');
  const [savedPlates, setSavedPlates] = useState<SavedPlate[]>(PREMADE_PLATES);
  const [compareIds, setCompareIds] = useState<string[]>([
    'premade-weight-loss',
    'premade-unhealthy',
  ]);
  const [saveToast, setSaveToast] = useState('');

  const currentTotals = useMemo(() => computePlateTotals(plateEntries), [plateEntries]);

  const plateFeedback = useMemo(() => {
    if (plateEntries.length === 0) {
      return {
        verdictEn: 'Empty Plate — Drag or tap Indian foods to build your meal.',
        verdictHi: 'खाली थाली — भोजन जोड़ने के लिए आइटम खींचें या टैप करें।',
        tipsEn: [],
        tipsHi: [],
        tone: 'neutral' as const,
      };
    }
    const tipsEn: string[] = [];
    const tipsHi: string[] = [];
    if (currentTotals.protein < 18) {
      tipsEn.push('Protein is low. Add Grilled Paneer, Soya Chunks, Moong Dal, Sprouts, or Boiled Eggs.');
      tipsHi.push('प्रोटीन कम है। पनीर, सोया चंक्स, मूंग दाल, स्प्राउट्स या उबले अंडे जोड़ें।');
    }
    if (currentTotals.fibre < 7) {
      tipsEn.push('Fibre is low. Add a full plate of Cucumber-Tomato Salad or Green Leafy Sabzi.');
      tipsHi.push('फाइबर कम है। खीरा-टमाटर सलाद या हरी सब्जी ज़रूर जोड़ें।');
    }
    if (currentTotals.cautionCount > 0) {
      tipsEn.push('Includes deep-fried, sugary, packaged, or alcohol items. Swap for roasted chana, chaas, or sprouts.');
      tipsHi.push('इस थाली में तला-भुना, मीठा या पैकेट वाला आइटम है। इसकी जगह छाछ, भुना चना या स्प्राउट्स लें।');
    }
    if (currentTotals.calories > 750) {
      tipsEn.push('High-calorie meal (good for Weight Gain, heavy for Fat Loss). Reduce extra carbs/oil if losing fat.');
      tipsHi.push('यह हाई-कैलोरी थाली है (वजन बढ़ाने के लिए ठीक, लेकिन फैट लॉस के लिए मात्रा कम करें)।');
    }

    if (tipsEn.length === 0) {
      return {
        verdictEn: 'Well-Balanced Healthy Indian Thali! Good protein, fibre, and steady energy.',
        verdictHi: 'बहुत बढ़िया संतुलित भारतीय थाली! अच्छा प्रोटीन, फाइबर और सही कैलोरी।',
        tipsEn: ['Drink 1 glass of water 25 minutes before this meal for best digestion.'],
        tipsHi: ['बेहतर पाचन के लिए इस भोजन से 25 मिनट पहले 1 गिलास पानी पिएं।'],
        tone: 'good' as const,
      };
    }

    return {
      verdictEn:
        currentTotals.cautionCount > 0 || currentTotals.calories > 800
          ? 'Needs Improvement — High empty calories or imbalance detected'
          : 'Almost Balanced — Small tweaks will make this thali much healthier',
      verdictHi:
        currentTotals.cautionCount > 0 || currentTotals.calories > 800
          ? 'सुधार की ज़रूरत — कैलोरी या अनहेल्दी आइटम अधिक हैं'
          : 'काफ़ी अच्छा — थोड़ा बदलाव इस थाली को और सेहतमंद बना देगा',
      tipsEn,
      tipsHi,
      tone: currentTotals.cautionCount > 0 ? ('alert' as const) : ('warn' as const),
    };
  }, [plateEntries.length, currentTotals]);

  const addFoodToPlate = (foodId: string) => {
    setPlateEntries((prev) => {
      const existing = prev.find((e) => e.foodId === foodId);
      if (existing) {
        return prev.map((e) => (e.foodId === foodId ? { ...e, quantity: e.quantity + 1 } : e));
      }
      return [...prev, { foodId, quantity: 1 }];
    });
  };

  const updateFoodQty = (foodId: string, delta: number) => {
    setPlateEntries((prev) =>
      prev
        .map((e) => (e.foodId === foodId ? { ...e, quantity: e.quantity + delta } : e))
        .filter((e) => e.quantity > 0)
    );
  };

  const handleSaveCurrentPlate = () => {
    if (plateEntries.length === 0) return;
    const customCount = savedPlates.filter((p) => !p.isPremade).length + 1;
    const label = plateNameInput.trim() || `My Thali #${customCount}`;
    const newPlate: SavedPlate = {
      id: `custom-${Date.now()}`,
      name: label,
      entries: plateEntries.map((e) => ({ ...e })),
    };
    setSavedPlates((prev) => [newPlate, ...prev]);
    setCompareIds((prev) => {
      const next = [newPlate.id, ...prev.filter((id) => id !== newPlate.id)];
      return next.slice(0, 3);
    });
    setPlateNameInput('');
    setSaveToast(
      lang === 'en'
        ? `Saved "${label}" and added to plate comparison!`
        : `"${label}" सेव हो गई और तुलना में जुड़ गई!`
    );
    window.setTimeout(() => setSaveToast(''), 3500);
  };

  const toggleComparePlate = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const loadPresetComparison = (pair: 'healthy-unhealthy' | 'loss-gain') => {
    if (pair === 'healthy-unhealthy') {
      setCompareIds(['premade-weight-loss', 'premade-unhealthy', 'premade-healthy-snack']);
    } else {
      setCompareIds(['premade-weight-loss', 'premade-weight-gain']);
    }
  };

  const plateCatalog = useMemo(() => {
    return INDIAN_FOODS.filter((item) => {
      const catOk = plateFoodCategory === 'All' || item.category === plateFoodCategory;
      const q = plateFoodQuery.trim().toLowerCase();
      const qOk =
        !q || item.nameEn.toLowerCase().includes(q) || item.nameHi.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [plateFoodCategory, plateFoodQuery]);

  // --- TAB 3: SELF HELP NUTRITION SHEET ---
  const [sheetCat, setSheetCat] = useState<'All' | FoodCategory>('All');
  const [sheetGoalFilter, setSheetGoalFilter] = useState<
    'all' | 'high-protein' | 'high-fibre' | 'low-cal' | 'caution'
  >('all');
  const [sheetQuery, setSheetQuery] = useState('');
  const [sheetSort, setSheetSort] = useState<'calories' | 'protein' | 'fibre'>('protein');

  const sheetFoods = useMemo(() => {
    return INDIAN_FOODS.filter((item) => {
      const catOk = sheetCat === 'All' || item.category === sheetCat;
      const tagOk = sheetGoalFilter === 'all' || item.tags.includes(sheetGoalFilter);
      const q = sheetQuery.trim().toLowerCase();
      const qOk =
        !q || item.nameEn.toLowerCase().includes(q) || item.nameHi.toLowerCase().includes(q);
      return catOk && tagOk && qOk;
    }).sort((a, b) =>
      sheetSort === 'calories'
        ? a.calories - b.calories
        : sheetSort === 'protein'
          ? b.protein - a.protein
          : b.fibre - a.fibre
    );
  }, [sheetCat, sheetGoalFilter, sheetQuery, sheetSort]);

  // --- EXPORT PDF & SHARE ---
  const [shareToast, setShareToast] = useState('');

  const buildShareText = () => {
    const lines = ['Vedika Health & Wellness Studio Report'];
    if (evalResults) {
      lines.push(
        `Health Check: BMI ${evalResults.bmi} (${evalResults.bmiStatusEn}) | BMR ${evalResults.bmr} kcal | Ideal Weight ${evalResults.idealMin}-${evalResults.idealMax} kg`
      );
      if (evalResults.waistRatio) {
        lines.push(`Waist-to-Height Ratio: ${evalResults.waistRatio}`);
      }
    }
    if (plateEntries.length > 0) {
      const itemNames = plateEntries
        .map((e) => {
          const f = INDIAN_FOODS.find((x) => x.id === e.foodId);
          return f ? `${e.quantity}x ${f.nameEn}` : '';
        })
        .filter(Boolean)
        .join(', ');
      lines.push(
        `My Indian Thali (${itemNames}): ${currentTotals.calories} kcal | Protein ${currentTotals.protein}g | Carbs ${currentTotals.carbs}g | Fat ${currentTotals.fat}g | Fibre ${currentTotals.fibre}g`
      );
    }
    lines.push(`Try free at ${SITE_LINKS.website}`);
    return lines.join('\n');
  };

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText());
      setShareToast(
        lang === 'en' ? 'Report copied! Ready to paste on WhatsApp or social media.' : 'रिपोर्ट कॉपी हो गई! अब व्हाट्सएप या सोशल मीडिया पर शेयर करें।'
      );
      window.setTimeout(() => setShareToast(''), 3500);
    } catch {
      setShareToast('Copy not allowed in this browser.');
    }
  };

  const handleDownloadReport = () => {
    const blob = new Blob([buildShareText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vedika-wellness-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const comparedPlates = compareIds
    .map((id) => savedPlates.find((p) => p.id === id))
    .filter((p): p is SavedPlate => Boolean(p));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Studio Header & Export Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {lang === 'en' ? 'Free Interactive Indian Nutrition Tools' : 'मुफ्त इंटरैक्टिव भारतीय पोषण टूल्स'}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-50">
            {lang === 'en' ? 'Vedika Wellness Studio' : 'वेदिका वेलनेस स्टूडियो'}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300">
            {lang === 'en'
              ? 'Check your BMI & BMR, build & compare Indian thali plates, and discover high-protein & high-fibre everyday foods.'
              : 'अपना BMI व BMR जांचें, भारतीय थाली की कैलोरी जोड़ें व तुलना करें, और हाई-प्रोटीन व हाई-फाइबर विकल्प खोजें।'}
          </p>
        </div>

        {/* Export / Share Buttons */}
        <div className="no-print flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161D1A] text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            <span>{lang === 'en' ? 'Save / Print PDF' : 'PDF सेव / प्रिंट'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161D1A] text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>{lang === 'en' ? 'Download Summary' : 'रिपोर्ट डाउनलोड'}</span>
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(buildShareText())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold whitespace-nowrap"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
            <span>{lang === 'en' ? 'Share on WhatsApp' : 'व्हाट्सएप पर शेयर करें'}</span>
          </a>
          <button
            type="button"
            onClick={handleCopyShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161D1A] text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer whitespace-nowrap"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            <span>{lang === 'en' ? 'Copy' : 'कॉपी'}</span>
          </button>
        </div>
      </div>

      {shareToast && (
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 rounded-lg">
          {shareToast}
        </p>
      )}

      {/* Segmented Module Tabs */}
      <div
        role="tablist"
        aria-label="Wellness Studio Modules"
        className="no-print inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-stone-200/80 dark:bg-stone-800/80"
      >
        {(
          [
            {
              id: 'eval',
              en: '1. Self Health Evaluation (BMI / BMR)',
              hi: '1. सेल्फ हेल्थ चेक (BMI / BMR)',
            },
            {
              id: 'plate',
              en: '2. Indian Thali Calorie Calculator',
              hi: '2. भारतीय थाली कैलोरी कैलकुलेटर',
            },
            {
              id: 'sheet',
              en: '3. Self-Help Nutrition Sheet',
              hi: '3. सेल्फ-हेल्प न्यूट्रिशन शीट',
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white dark:bg-[#161D1A] text-emerald-800 dark:text-emerald-400 shadow-sm'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            {lang === 'en' ? tab.en : tab.hi}
          </button>
        ))}
      </div>

      {/* ================================================================= */}
      {/* TAB 1: SELF HEALTH EVALUATION                                     */}
      {/* ================================================================= */}
      {activeTab === 'eval' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleEvaluateSubmit}
            className="lg:col-span-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 space-y-4"
          >
            <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-50">
              {lang === 'en' ? 'Enter Your Details' : 'अपना विवरण भरें'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'en' ? 'Name (Optional)' : 'नाम (वैकल्पिक)'}
                </label>
                <input
                  type="text"
                  value={evalName}
                  onChange={(e) => setEvalName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'en' ? 'Phone / Email (Optional)' : 'फोन / ईमेल (वैकल्पिक)'}
                </label>
                <input
                  type="text"
                  value={evalContact}
                  onChange={(e) => setEvalContact(e.target.value)}
                  placeholder="+91... / email"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'en' ? 'Weight (kg)*' : 'वजन (kg)*'}
                </label>
                <input
                  type="number"
                  required
                  min={25}
                  max={250}
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'en' ? 'Height (cm)*' : 'ऊंचाई (cm)*'}
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  max={230}
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'en' ? 'Age (years)*' : 'आयु (वर्ष)*'}
                </label>
                <input
                  type="number"
                  required
                  min={10}
                  max={100}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'en' ? 'Gender*' : 'लिंग*'}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm"
                >
                  <option value="male">{lang === 'en' ? 'Male' : 'पुरुष'}</option>
                  <option value="female">{lang === 'en' ? 'Female' : 'महिला'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'en' ? 'Daily Lifestyle*' : 'दैनिक जीवनशैली*'}
              </label>
              <select
                value={lifestyle}
                onChange={(e) =>
                  setLifestyle(e.target.value as 'sedentary' | 'light' | 'moderate' | 'active')
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm"
              >
                <option value="sedentary">
                  {lang === 'en' ? 'Mostly Sitting / Desk Job' : 'ज़्यादातर बैठने का काम'}
                </option>
                <option value="light">
                  {lang === 'en' ? 'Lightly Active (Short walks / Home tasks)' : 'हल्की सक्रियता (टहलना / घर के काम)'}
                </option>
                <option value="moderate">
                  {lang === 'en' ? 'Moderately Active (3–4 workouts/week)' : 'मध्यम सक्रियता (हफ्ते में 3-4 दिन व्यायाम)'}
                </option>
                <option value="active">
                  {lang === 'en' ? 'Very Active (Physical daily work)' : 'अधिक सक्रिय (रोज़ भारी शारीरिक कार्य)'}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'en'
                  ? 'Waist Circumference in cm (Optional — needed for Waist-to-Height Ratio)'
                  : 'कमर का माप cm में (वैकल्पिक — कमर-ऊंचाई अनुपात के लिए)'}
              </label>
              <input
                type="number"
                min={45}
                max={200}
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
                placeholder="e.g. 90"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm font-mono tabular-nums"
              />
            </div>

            <button
              type="submit"
              className="cta-calm-shift w-full py-3 px-4 rounded-lg text-white font-semibold text-sm cursor-pointer"
            >
              {lang === 'en' ? 'Calculate My Health Report' : 'मेरी हेल्थ रिपोर्ट निकालें'}
            </button>

            {leadSentNotice && (
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-3 py-2 rounded-lg">
                {leadSentNotice}
              </p>
            )}
          </form>

          {/* Evaluation Output */}
          <div className="lg:col-span-7 space-y-6">
            {evalComputed && evalResults ? (
              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
                  <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
                    {evalName.trim()
                      ? `${evalName.trim()} — ${lang === 'en' ? 'Health Summary' : 'स्वास्थ्य रिपोर्ट'}`
                      : lang === 'en'
                        ? 'Your Personal Health Summary'
                        : 'आपकी व्यक्तिगत स्वास्थ्य रिपोर्ट'}
                  </h2>
                  <span
                    className={`text-xs font-semibold ${
                      evalResults.bmiTone === 'good'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : evalResults.bmiTone === 'warn'
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-red-700 dark:text-red-400'
                    }`}
                  >
                    {lang === 'en' ? evalResults.bmiStatusEn : evalResults.bmiStatusHi}
                  </span>
                </div>

                {/* 4 Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FAFAF9] dark:bg-[#111714] p-4">
                    <p className="text-xs text-stone-500 dark:text-stone-400">BMI</p>
                    <p className="font-mono text-2xl font-bold text-stone-900 dark:text-stone-50 tabular-nums mt-1">
                      {evalResults.bmi}
                    </p>
                  </div>
                  <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FAFAF9] dark:bg-[#111714] p-4">
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {lang === 'en' ? 'BMR (Rest Burn)' : 'BMR (आराम कैलोरी)'}
                    </p>
                    <p className="font-mono text-2xl font-bold text-stone-900 dark:text-stone-50 tabular-nums mt-1">
                      {evalResults.bmr}
                    </p>
                    <p className="text-[11px] text-stone-500">kcal/day</p>
                  </div>
                  <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FAFAF9] dark:bg-[#111714] p-4">
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {lang === 'en' ? 'Ideal Weight' : 'आदर्श वजन'}
                    </p>
                    <p className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-1">
                      {evalResults.idealMin}–{evalResults.idealMax}
                    </p>
                    <p className="text-[11px] text-stone-500">kg</p>
                  </div>
                  <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FAFAF9] dark:bg-[#111714] p-4">
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {lang === 'en' ? 'Waist / Height' : 'कमर / ऊंचाई'}
                    </p>
                    <p className="font-mono text-2xl font-bold text-stone-900 dark:text-stone-50 tabular-nums mt-1">
                      {evalResults.waistRatio ?? '—'}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {lang === 'en' ? 'Ideal < 0.50' : 'आदर्श < 0.50'}
                    </p>
                  </div>
                </div>

                {/* Daily Targets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-4 space-y-1">
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {lang === 'en' ? 'Fat Loss Target' : 'फैट लॉस कैलोरी'}
                    </p>
                    <p className="font-mono text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      ~{evalResults.fatLossCal} kcal/day
                    </p>
                  </div>
                  <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-4 space-y-1">
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {lang === 'en' ? 'Maintain Weight' : 'सामान्य कैलोरी'}
                    </p>
                    <p className="font-mono text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      ~{evalResults.maintainCal} kcal/day
                    </p>
                  </div>
                  <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-4 space-y-1">
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {lang === 'en' ? 'Weight Gain Target' : 'वजन वृद्धि कैलोरी'}
                    </p>
                    <p className="font-mono text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      ~{evalResults.gainCal} kcal/day
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="rounded-xl bg-[#F4F4F1] dark:bg-[#141C18] p-5 space-y-2.5 text-sm text-stone-700 dark:text-stone-300">
                  <p className="font-display font-bold text-stone-900 dark:text-stone-50">
                    {lang === 'en' ? 'Simple Coach Recommendations for You' : 'आपके लिए सरल कोच सुझाव'}
                  </p>
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li>
                      {lang === 'en'
                        ? `Aim for ~${evalResults.dailyProtein}g daily protein (dal, paneer, curd, sprouts, soya, or eggs) to protect muscle.`
                        : `मांसपेशियों को बचाने के लिए रोज़ लगभग ${evalResults.dailyProtein}g प्रोटीन (दाल, पनीर, दही, स्प्राउट्स, सोया) लें।`}
                    </li>
                    <li>
                      {lang === 'en'
                        ? `Drink around ${evalResults.dailyWater} litres of water evenly across the day.`
                        : `दिन भर में लगभग ${evalResults.dailyWater} लीटर पानी घूंट-घूंट करके पिएं।`}
                    </li>
                    {evalResults.waistRatio && (
                      <li>{lang === 'en' ? evalResults.waistNoteEn : evalResults.waistNoteHi}</li>
                    )}
                    <li>
                      {lang === 'en'
                        ? 'Test your actual lunch in Tab 2 (Thali Calculator) right now to see where hidden calories come from.'
                        : 'अभी टैब 2 (थाली कैलकुलेटर) में अपनी लंच थाली बनाकर देखें कि अतिरिक्त कैलोरी कहां से आ रही है।'}
                    </li>
                  </ul>
                </div>

                <div className="no-print flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('book', 'Personal Diet Chart Based on BMI')}
                    className="cta-calm-shift inline-flex items-center gap-2 text-white font-semibold text-sm px-5 py-3 rounded-lg cursor-pointer"
                  >
                    <span>
                      {lang === 'en' ? 'Get Custom Indian Diet Plan From Coach' : 'कोच से कस्टम भारतीय डाइट प्लान पाएं'}
                    </span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('plate')}
                    className="px-5 py-3 rounded-lg border border-stone-300 dark:border-stone-700 text-sm font-semibold text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    {lang === 'en' ? 'Open Thali Calculator →' : 'थाली कैलकुलेटर खोलें →'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-8 text-sm text-stone-500">
                {lang === 'en' ? 'Enter valid weight, height, and age to view your report.' : 'रिपोर्ट देखने के लिए सही वजन, ऊंचाई और आयु भरें।'}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* TAB 2: INTERACTIVE INDIAN THALI PLATE CALORIE CALCULATOR          */}
      {/* ================================================================= */}
      {activeTab === 'plate' && (
        <section className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Food Picker (Drag or Tap to Add) */}
            <div className="lg:col-span-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-5 space-y-4">
              <div className="space-y-1">
                <h2 className="font-display text-lg font-bold text-stone-900 dark:text-stone-50">
                  {lang === 'en' ? 'Popular Indian Foods' : 'लोकप्रिय भारतीय भोजन'}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {lang === 'en'
                    ? 'Drag any food onto the thali plate OR tap "+ Add".'
                    : 'किसी भी भोजन को थाली पर खींचें (Drag) या "+ जोड़ें" पर टैप करें।'}
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={plateFoodQuery}
                  onChange={(e) => setPlateFoodQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search roti, dal, paneer, chai...' : 'रोटी, दाल, पनीर, चाय खोजें...'}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-xs sm:text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPlateFoodCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                      plateFoodCategory === cat
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="max-h-[440px] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 pr-1">
                {plateCatalog.map((food) => (
                  <div
                    key={food.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', food.id);
                    }}
                    className="py-2.5 flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing hover:bg-stone-50 dark:hover:bg-stone-800/40 px-2 rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {lang === 'en' ? food.nameEn : food.nameHi}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">
                        {lang === 'en' ? food.servingEn : food.servingHi} · {food.calories} kcal · P {food.protein}g
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addFoodToPlate(food.id)}
                      className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-emerald-600/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-xs font-semibold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{lang === 'en' ? 'Add' : 'जोड़ें'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Center & Right: Visual Circular Thali Plate + Live Macros + Save */}
            <div className="lg:col-span-7 space-y-6">
              {/* Visual Interactive Thali Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const id = e.dataTransfer.getData('text/plain');
                  if (id) addFoodToPlate(id);
                }}
                className={`rounded-2xl border-2 transition-colors p-6 sm:p-8 bg-white dark:bg-[#161D1A] space-y-6 ${
                  isDragOver
                    ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 border-dashed'
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-50">
                      {lang === 'en' ? 'Your Interactive Indian Thali' : 'आपकी इंटरैक्टिव भारतीय थाली'}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {lang === 'en'
                        ? 'Drop food items onto the steel thali below or adjust servings.'
                        : 'नीचे दी गई थाली में भोजन जोड़ें या मात्रा घटाएं-बढ़ाएं।'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlateEntries([])}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{lang === 'en' ? 'Clear Plate' : 'थाली खाली करें'}</span>
                  </button>
                </div>

                {/* Circular Steel Thali Representation */}
                <div className="mx-auto max-w-md aspect-square sm:aspect-auto sm:min-h-[260px] rounded-full sm:rounded-[3rem] border-4 border-stone-300 dark:border-stone-700 bg-gradient-to-br from-stone-100 via-stone-50 to-stone-200/70 dark:from-stone-800 dark:via-[#1B2420] dark:to-stone-900 p-6 flex flex-col items-center justify-center shadow-inner">
                  {plateEntries.length === 0 ? (
                    <p className="text-sm text-center text-stone-500 dark:text-stone-400 max-w-[26ch]">
                      {lang === 'en'
                        ? 'Drop foods here or click "+ Add" on the left to build your thali.'
                        : 'थाली बनाने के लिए बाईं ओर से भोजन जोड़ें।'}
                    </p>
                  ) : (
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {plateEntries.map((entry) => {
                        const food = INDIAN_FOODS.find((f) => f.id === entry.foodId);
                        if (!food) return null;
                        return (
                          <div
                            key={entry.foodId}
                            className="rounded-xl bg-white/95 dark:bg-[#141C18] border border-stone-200 dark:border-stone-700 px-3 py-2 flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                                {lang === 'en' ? food.nameEn : food.nameHi}
                              </p>
                              <p className="text-[11px] font-mono text-stone-500 tabular-nums">
                                {Math.round(food.calories * entry.quantity)} kcal
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() => updateFoodQty(entry.foodId, -1)}
                                className="w-6 h-6 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 inline-flex items-center justify-center cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs font-bold w-5 text-center tabular-nums">
                                {entry.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={() => updateFoodQty(entry.foodId, 1)}
                                className="w-6 h-6 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 inline-flex items-center justify-center cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Macro Readout Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  <div className="rounded-xl bg-[#FAFAF9] dark:bg-[#111714] border border-stone-200 dark:border-stone-800 p-3">
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {lang === 'en' ? 'Calories' : 'कैलोरी'}
                    </p>
                    <p className="font-mono text-xl font-bold text-stone-900 dark:text-stone-50 tabular-nums">
                      {currentTotals.calories}
                    </p>
                    <p className="text-[10px] text-stone-500">kcal</p>
                  </div>
                  <div className="rounded-xl bg-[#FAFAF9] dark:bg-[#111714] border border-stone-200 dark:border-stone-800 p-3">
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {lang === 'en' ? 'Protein' : 'प्रोटीन'}
                    </p>
                    <p className="font-mono text-xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {currentTotals.protein}g
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#FAFAF9] dark:bg-[#111714] border border-stone-200 dark:border-stone-800 p-3">
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {lang === 'en' ? 'Carbs' : 'कार्ब्स'}
                    </p>
                    <p className="font-mono text-xl font-bold text-stone-900 dark:text-stone-50 tabular-nums">
                      {currentTotals.carbs}g
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#FAFAF9] dark:bg-[#111714] border border-stone-200 dark:border-stone-800 p-3">
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {lang === 'en' ? 'Fat' : 'फैट'}
                    </p>
                    <p className="font-mono text-xl font-bold text-stone-900 dark:text-stone-50 tabular-nums">
                      {currentTotals.fat}g
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#FAFAF9] dark:bg-[#111714] border border-stone-200 dark:border-stone-800 p-3 col-span-2 sm:col-span-1">
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {lang === 'en' ? 'Fibre' : 'फाइबर'}
                    </p>
                    <p className="font-mono text-xl font-bold text-teal-700 dark:text-teal-400 tabular-nums">
                      {currentTotals.fibre}g
                    </p>
                  </div>
                </div>

                {/* Smart Health Assessment */}
                <div
                  className={`rounded-xl border p-4 space-y-2 text-sm ${
                    plateFeedback.tone === 'good'
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                      : plateFeedback.tone === 'alert'
                        ? 'bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900'
                        : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
                  }`}
                >
                  <p className="font-semibold text-stone-900 dark:text-stone-100">
                    {lang === 'en' ? plateFeedback.verdictEn : plateFeedback.verdictHi}
                  </p>
                  {(lang === 'en' ? plateFeedback.tipsEn : plateFeedback.tipsHi).length > 0 && (
                    <ul className="list-disc list-inside text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-1">
                      {(lang === 'en' ? plateFeedback.tipsEn : plateFeedback.tipsHi).map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Save Current Plate */}
                <div className="no-print flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={plateNameInput}
                    onChange={(e) => setPlateNameInput(e.target.value)}
                    placeholder={
                      lang === 'en'
                        ? 'Name this plate (e.g. My Office Lunch)...'
                        : 'थाली का नाम लिखें (जैसे: मेरा लंच)...'
                    }
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleSaveCurrentPlate}
                    disabled={plateEntries.length === 0}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    <BookmarkPlus className="w-4 h-4" aria-hidden="true" />
                    <span>{lang === 'en' ? 'Save & Compare' : 'सेव और तुलना करें'}</span>
                  </button>
                </div>
                {saveToast && (
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {saveToast}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Compare up to 3 Plates + Premade Comparisons */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
                  {lang === 'en'
                    ? 'Compare Up to 3 Plates Side by Side'
                    : '3 थालियों की आमने-सामने तुलना करें'}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  {lang === 'en'
                    ? 'Select any saved or premade thalis below, or try our instant premade comparisons.'
                    : 'नीचे से अपनी सेव की गई या पहले से बनी थालियां चुनें।'}
                </p>
              </div>
              <div className="no-print flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => loadPresetComparison('healthy-unhealthy')}
                  className="px-3.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  {lang === 'en' ? 'Healthy vs Unhealthy' : 'हेल्दी बनाम अनहेल्दी'}
                </button>
                <button
                  type="button"
                  onClick={() => loadPresetComparison('loss-gain')}
                  className="px-3.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  {lang === 'en' ? 'Weight Loss vs Weight Gain' : 'वेट लॉस बनाम वेट गेन'}
                </button>
              </div>
            </div>

            {/* Plate Selector Buttons */}
            <div className="no-print flex flex-wrap gap-2">
              {savedPlates.map((plate) => {
                const selected = compareIds.includes(plate.id);
                return (
                  <div key={plate.id} className="inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => toggleComparePlate(plate.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        selected
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-[#FAFAF9] dark:bg-[#111714] text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-emerald-600'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                      <span>{plate.name}</span>
                    </button>
                    {!plate.isPremade && (
                      <button
                        type="button"
                        aria-label={`Delete ${plate.name}`}
                        onClick={() => {
                          setSavedPlates((prev) => prev.filter((p) => p.id !== plate.id));
                          setCompareIds((prev) => prev.filter((x) => x !== plate.id));
                        }}
                        className="ml-1 p-1 text-stone-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 3-Column Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {comparedPlates.map((plate) => {
                const totals = computePlateTotals(plate.entries);
                return (
                  <div
                    key={plate.id}
                    className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FAFAF9] dark:bg-[#111714] p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-50">
                          {plate.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setPlateEntries(plate.entries.map((e) => ({ ...e })))}
                          className="no-print text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0 cursor-pointer"
                        >
                          {lang === 'en' ? 'Load' : 'लोड'}
                        </button>
                      </div>
                      <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
                        {plate.entries.map((entry) => {
                          const f = INDIAN_FOODS.find((x) => x.id === entry.foodId);
                          if (!f) return null;
                          return (
                            <li key={entry.foodId}>
                              {entry.quantity} × {lang === 'en' ? f.nameEn : f.nameHi}
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 gap-y-2 text-xs tabular-nums">
                      <span className="text-stone-500">Calories</span>
                      <span className="font-mono font-bold text-right text-stone-900 dark:text-stone-100">
                        {totals.calories} kcal
                      </span>
                      <span className="text-stone-500">Protein</span>
                      <span className="font-mono font-bold text-right text-emerald-700 dark:text-emerald-400">
                        {totals.protein} g
                      </span>
                      <span className="text-stone-500">Carbs</span>
                      <span className="font-mono font-semibold text-right text-stone-800 dark:text-stone-200">
                        {totals.carbs} g
                      </span>
                      <span className="text-stone-500">Fat</span>
                      <span className="font-mono font-semibold text-right text-stone-800 dark:text-stone-200">
                        {totals.fat} g
                      </span>
                      <span className="text-stone-500">Fibre</span>
                      <span className="font-mono font-bold text-right text-teal-700 dark:text-teal-400">
                        {totals.fibre} g
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* TAB 3: SELF-HELP NUTRITION SHEET                                  */}
      {/* ================================================================= */}
      {activeTab === 'sheet' && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-5 sm:p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
                  {lang === 'en'
                    ? 'Self-Help Indian Nutrition Sheet'
                    : 'सेल्फ-हेल्प भारतीय पोषण तालिका'}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  {lang === 'en'
                    ? 'Filter instantly by High Protein, High Fibre, Low Calorie, or browse Veg, Dairy, Seeds, Drinks, Alcohol & Packaged items.'
                    : 'हाई-प्रोटीन, हाई-फाइबर या लो-कैलोरी विकल्प एक क्लिक में देखें — सब्जियां, डेयरी, सीड्स, ड्रिंक्स, अल्कोहल और पैकेट फूड शामिल हैं।'}
                </p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={sheetQuery}
                  onChange={(e) => setSheetQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search any food...' : 'कोई भी भोजन खोजें...'}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm"
                />
              </div>
            </div>

            {/* Quick Goal Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'all', en: 'All Foods', hi: 'सभी भोजन' },
                  { id: 'high-protein', en: 'High Protein Options', hi: 'हाई प्रोटीन विकल्प' },
                  { id: 'high-fibre', en: 'High Fibre Options', hi: 'हाई फाइबर विकल्प' },
                  { id: 'low-cal', en: 'Low Calorie Choices', hi: 'लो कैलोरी विकल्प' },
                  { id: 'caution', en: 'High Calorie / Limit', hi: 'कम मात्रा में लें' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSheetGoalFilter(f.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    sheetGoalFilter === f.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {lang === 'en' ? f.en : f.hi}
                </button>
              ))}
            </div>

            {/* Category & Sort Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSheetCat(cat)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer border ${
                      sheetCat === cat
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500">{lang === 'en' ? 'Sort by:' : 'क्रम:'}</span>
                <select
                  value={sheetSort}
                  onChange={(e) => setSheetSort(e.target.value as 'calories' | 'protein' | 'fibre')}
                  className="px-2.5 py-1.5 rounded-md border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-xs font-medium"
                >
                  <option value="protein">{lang === 'en' ? 'Highest Protein' : 'सबसे ज़्यादा प्रोटीन'}</option>
                  <option value="fibre">{lang === 'en' ? 'Highest Fibre' : 'सबसे ज़्यादा फाइबर'}</option>
                  <option value="calories">{lang === 'en' ? 'Lowest Calories' : 'सबसे कम कैलोरी'}</option>
                </select>
              </div>
            </div>

            {/* Colorful Nutrition Table */}
            <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F4F4F1] dark:bg-[#1C2521] border-b border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-200">
                    <th className="py-3 px-4">{lang === 'en' ? 'Food Item' : 'भोजन'}</th>
                    <th className="py-3 px-4">{lang === 'en' ? 'Category' : 'श्रेणी'}</th>
                    <th className="py-3 px-4 text-right">{lang === 'en' ? 'Calories' : 'कैलोरी'}</th>
                    <th className="py-3 px-4 text-right text-emerald-800 dark:text-emerald-400">
                      {lang === 'en' ? 'Protein' : 'प्रोटीन'}
                    </th>
                    <th className="py-3 px-4 text-right">{lang === 'en' ? 'Carbs' : 'कार्ब्स'}</th>
                    <th className="py-3 px-4 text-right">{lang === 'en' ? 'Fat' : 'फैट'}</th>
                    <th className="py-3 px-4 text-right text-teal-800 dark:text-teal-400">
                      {lang === 'en' ? 'Fibre' : 'फाइबर'}
                    </th>
                    <th className="py-3 px-4">{lang === 'en' ? 'Quick Guide' : 'मार्गदर्शन'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {sheetFoods.map((food) => (
                    <tr
                      key={food.id}
                      className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-semibold text-stone-900 dark:text-stone-100">
                          {lang === 'en' ? food.nameEn : food.nameHi}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {lang === 'en' ? food.servingEn : food.servingHi}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-xs text-stone-600 dark:text-stone-300">
                        {food.category}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                        {food.calories}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                        {food.protein}g
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-700 dark:text-stone-300">
                        {food.carbs}g
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-700 dark:text-stone-300">
                        {food.fat}g
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-teal-700 dark:text-teal-400">
                        {food.fibre}g
                      </td>
                      <td className="py-3 px-4 text-xs font-medium">
                        {food.tags.includes('caution') ? (
                          <span className="text-amber-700 dark:text-amber-400">
                            {lang === 'en' ? 'Occasional / Limit' : 'कम मात्रा में'}
                          </span>
                        ) : food.tags.includes('high-protein') ? (
                          <span className="text-emerald-700 dark:text-emerald-400">
                            {lang === 'en' ? 'Great Protein' : 'अच्छा प्रोटीन'}
                          </span>
                        ) : food.tags.includes('high-fibre') ? (
                          <span className="text-teal-700 dark:text-teal-400">
                            {lang === 'en' ? 'Rich in Fibre' : 'भरपूर फाइबर'}
                          </span>
                        ) : (
                          <span className="text-stone-500 dark:text-stone-400">
                            {lang === 'en' ? 'Everyday Staple' : 'सामान्य भोजन'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
