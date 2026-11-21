import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, MessageCircle } from 'lucide-react';
import type { BlogPost, Lang, PageId } from '../types';
import { BLOG_POSTS } from '../data/blogsData';
import { SITE_LINKS } from '../data/siteAssets';
import { SmartImage } from '../components/SmartImage';

interface BlogPageProps {
  lang: Lang;
  initialPostId?: string;
  onNavigate: (page: PageId, subParam?: string) => void;
}

function InteractiveBlogWidget({ type, lang }: { type: BlogPost['widgetType']; lang: Lang }) {
  // 1. Myth Quiz state
  const [revealedMyth, setRevealedMyth] = useState<Record<number, boolean>>({});
  // 2. Water calc state
  const [waterWeight, setWaterWeight] = useState(72);
  // 3. Protein calc state
  const [proteinWeight, setProteinWeight] = useState(70);
  const [proteinGoal, setProteinGoal] = useState<'maintain' | 'fatloss' | 'gain'>('fatloss');
  // 4. Habit checklist state
  const [habits, setHabits] = useState<boolean[]>([true, false, true, false, false]);
  // 5. Food swap state
  const [swapFocus, setSwapFocus] = useState<'sugar' | 'bp' | 'thyroid'>('sugar');

  if (type === 'myth-quiz') {
    const myths =
      lang === 'en'
        ? [
            {
              myth: 'Myth: Eating roti or rice at night always causes weight gain.',
              truth: 'Truth: Total daily calories and dinner portion size matter most. 1–2 rotis with dal, paneer, and salad by 8 PM fits a healthy weight-loss plan.',
            },
            {
              myth: 'Myth: Vegetarians cannot get enough protein without meat.',
              truth: 'Truth: Combining dal, low-fat paneer, curd, soya chunks, roasted chana, sprouts, and a clean protein shake easily hits 60–80g/day.',
            },
            {
              myth: 'Myth: Cutting all fat and ghee is the healthiest choice.',
              truth: 'Truth: Your body needs small amounts of good fat (1–2 tsp ghee or soaked almonds) for hormones and vitamins. Avoid deep-fried snacks instead.',
            },
          ]
        : [
            {
              myth: 'मिथक: रात में रोटी या चावल खाने से हमेशा मोटापा बढ़ता है।',
              truth: 'सच्चाई: पूरे दिन की कुल कैलोरी और मात्रा मायने रखती है। शाम 8 बजे तक दाल, पनीर और सलाद के साथ 1-2 रोटी पूरी तरह संतुलित है।',
            },
            {
              myth: 'मिथक: शाकाहारी भोजन से पर्याप्त प्रोटीन नहीं मिलता।',
              truth: 'सच्चाई: दाल, पनीर, दही, सोया चंक्स, भुना चना और अंकुरित मूंग मिलाकर आसानी से 60–80g प्रोटीन मिल सकता है।',
            },
            {
              myth: 'मिथक: घी और फैट पूरी तरह बंद कर देना सबसे अच्छा है।',
              truth: 'सच्चाई: 1-2 छोटे चम्मच घर का घी या भीगे बादाम हार्मोन के लिए अच्छे हैं — बस तले-भुने पैकेट स्नैक्स से बचें।',
            },
          ];

    return (
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F4F4F1] dark:bg-[#141C18] p-5 sm:p-6 space-y-4">
        <p className="font-display font-bold text-lg text-stone-900 dark:text-stone-50">
          {lang === 'en' ? 'Interactive Check: Tap Each Myth to See the Truth' : 'इंटरैक्टिव जांच: सच्चाई देखने के लिए टैप करें'}
        </p>
        <div className="space-y-3">
          {myths.map((item, idx) => (
            <button
              key={item.myth}
              type="button"
              onClick={() => setRevealedMyth((prev) => ({ ...prev, [idx]: !prev[idx] }))}
              className="w-full text-left rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A231F] p-4 space-y-2 hover:border-emerald-600 transition-colors cursor-pointer"
            >
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{item.myth}</p>
              {revealedMyth[idx] ? (
                <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  {item.truth}
                </p>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {lang === 'en' ? 'Tap to reveal truth →' : 'सच्चाई जानने के लिए क्लिक करें →'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'water-calc') {
    const litres = Number((waterWeight * 0.035).toFixed(1));
    const glasses = Math.round((litres * 1000) / 250);
    return (
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F4F4F1] dark:bg-[#141C18] p-5 sm:p-6 space-y-4">
        <p className="font-display font-bold text-lg text-stone-900 dark:text-stone-50">
          {lang === 'en' ? 'Interactive Daily Water Calculator' : 'दैनिक पानी कैलकुलेटर'}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-stone-700 dark:text-stone-300">
            <span>{lang === 'en' ? 'Your Body Weight' : 'आपका वजन'}</span>
            <span className="font-mono font-bold text-stone-900 dark:text-stone-50 tabular-nums">
              {waterWeight} kg
            </span>
          </div>
          <input
            type="range"
            min={35}
            max={135}
            value={waterWeight}
            onChange={(e) => setWaterWeight(Number(e.target.value))}
            className="w-full accent-emerald-700 cursor-pointer"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-1">
          <div className="rounded-lg bg-white dark:bg-[#1A231F] border border-stone-200 dark:border-stone-700 p-4">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {lang === 'en' ? 'Recommended Daily Water' : 'रोज़ाना आवश्यक पानी'}
            </p>
            <p className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-1">
              {litres} L
            </p>
          </div>
          <div className="rounded-lg bg-white dark:bg-[#1A231F] border border-stone-200 dark:border-stone-700 p-4">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {lang === 'en' ? '250 ml Glasses / Day' : 'गिलास प्रतिदिन (250 ml)'}
            </p>
            <p className="font-mono text-2xl font-bold text-stone-900 dark:text-stone-50 tabular-nums mt-1">
              ~{glasses}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'protein-calc') {
    const multiplier = proteinGoal === 'maintain' ? 1.0 : proteinGoal === 'fatloss' ? 1.2 : 1.5;
    const grams = Math.round(proteinWeight * multiplier);
    return (
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F4F4F1] dark:bg-[#141C18] p-5 sm:p-6 space-y-4">
        <p className="font-display font-bold text-lg text-stone-900 dark:text-stone-50">
          {lang === 'en' ? 'Interactive Daily Protein Target Checker' : 'दैनिक प्रोटीन लक्ष्य कैलकुलेटर'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'en' ? 'Your Weight (kg)' : 'आपका वजन (kg)'}: <strong className="font-mono tabular-nums">{proteinWeight} kg</strong>
            </label>
            <input
              type="range"
              min={40}
              max={125}
              value={proteinWeight}
              onChange={(e) => setProteinWeight(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {(
              [
                { id: 'maintain', en: 'Maintain', hi: 'सामान्य' },
                { id: 'fatloss', en: 'Fat Loss', hi: 'फैट लॉस' },
                { id: 'gain', en: 'Muscle Gain', hi: 'वजन/मसल' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setProteinGoal(opt.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                  proteinGoal === opt.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white dark:bg-[#1A231F] border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                {lang === 'en' ? opt.en : opt.hi}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-white dark:bg-[#1A231F] border border-stone-200 dark:border-stone-700 p-4 flex items-center justify-between gap-4">
          <span className="text-sm text-stone-700 dark:text-stone-300">
            {lang === 'en' ? 'Suggested Daily Protein Range:' : 'सुझाया गया दैनिक प्रोटीन:'}
          </span>
          <span className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
            {grams - 5}–{grams + 5} g/day
          </span>
        </div>
      </div>
    );
  }

  if (type === 'habit-check') {
    const items =
      lang === 'en'
        ? [
            'I eat 1 bowl of salad or veggies with lunch and dinner.',
            'Every main meal includes a clear protein food (dal, paneer, curd, soya, or eggs).',
            'I drink at least 2.5 litres of water through the day.',
            'I finish dinner at least 2 hours before sleeping.',
            'I avoid sugary tea/biscuits and fried namkeen in the evening.',
          ]
        : [
            'मैं लंच और डिनर के साथ 1 प्लेट सलाद या हरी सब्जी खाता/खाती हूं।',
            'मेरे हर मुख्य भोजन में प्रोटीन (दाल, पनीर, दही, सोया या अंडा) शामिल होता है।',
            'मैं दिन भर में कम से कम 2.5 लीटर पानी पीता/पीती हूं।',
            'मैं सोने से कम से कम 2 घंटे पहले डिनर कर लेता/लेती हूं।',
            'मैं शाम को मीठी चाय-बिस्किट और तली नमकीन से बचता/बचती हूं।',
          ];
    const score = habits.filter(Boolean).length;
    return (
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F4F4F1] dark:bg-[#141C18] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display font-bold text-lg text-stone-900 dark:text-stone-50">
            {lang === 'en' ? '80/20 Weight Loss Habit Check' : '80/20 वेट लॉस आदत जांच'}
          </p>
          <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
            {score} / 5
          </span>
        </div>
        <div className="space-y-2">
          {items.map((label, idx) => (
            <button
              key={label}
              type="button"
              onClick={() =>
                setHabits((prev) => prev.map((v, i) => (i === idx ? !v : v)))
              }
              className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border text-sm transition-colors cursor-pointer ${
                habits[idx]
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-stone-900 dark:text-stone-100'
                  : 'bg-white dark:bg-[#1A231F] border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                  habits[idx]
                    ? 'bg-emerald-700 border-emerald-700 text-white'
                    : 'border-stone-400 dark:border-stone-600'
                }`}
              >
                {habits[idx] && <Check className="w-3.5 h-3.5" />}
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400">
          {score >= 4
            ? lang === 'en'
              ? 'Great consistency! Fine-tuning portions with a coach will accelerate your results.'
              : 'बहुत बढ़िया! कोच के साथ मात्रा संतुलित करने से परिणाम और तेज़ होंगे।'
            : lang === 'en'
              ? 'Pick just 1 unchecked habit above to improve this week — small wins build big results!'
              : 'इस हफ्ते ऊपर की किसी 1 आदत को सुधारने से शुरुआत करें — छोटे बदलाव बड़े परिणाम लाते हैं!'}
        </p>
      </div>
    );
  }

  // food-swap
  const swapData = {
    sugar: {
      avoidEn: 'White bread + sugary chai, heavy white rice alone, sweet biscuits',
      chooseEn: 'Cucumber salad first -> Moong dal chilla / paneer -> 1 multigrain roti',
      avoidHi: 'व्हाइट ब्रेड + मीठी चाय, केवल सादा चावल, मीठे बिस्किट',
      chooseHi: 'पहले खीरा सलाद -> मूंग दाल चीला / पनीर -> 1 मल्टीग्रेन रोटी',
    },
    bp: {
      avoidEn: 'Packaged bhujia/namkeen, extra pickles, instant noodles, salty restaurant gravies',
      chooseEn: 'Roasted chana, dry makhana, homemade lightly spiced dal, fresh fruits & coconut water',
      avoidHi: 'पैकेट वाली नमकीन/भुजिया, ज़्यादा अचार, इंस्टेंट नूडल्स, बाज़ार की ग्रेवी',
      chooseHi: 'भुना चना, सादा मखाना, घर की कम नमक वाली दाल, ताज़ा फल और नारियल पानी',
    },
    thyroid: {
      avoidEn: 'Skipping breakfast, late midnight dinners, ultra-processed sugary snacks',
      chooseEn: 'Warm protein-rich breakfast on time, soaked nuts/seeds, early light dinner + 7.5h sleep',
      avoidHi: 'नाश्ता छोड़ना, देर रात खाना, पैकेट वाले मीठे स्नैक्स',
      chooseHi: 'समय पर प्रोटीन-युक्त गर्म नाश्ता, भीगे बादाम/सीड्स, जल्दी हल्का डिनर और पूरी नींद',
    },
  }[swapFocus];

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F4F4F1] dark:bg-[#141C18] p-5 sm:p-6 space-y-4">
      <p className="font-display font-bold text-lg text-stone-900 dark:text-stone-50">
        {lang === 'en' ? 'Interactive Smart Indian Food Swaps' : 'स्मार्ट भारतीय भोजन बदलाव गाइड'}
      </p>
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'sugar', en: 'Sugar Care', hi: 'शुगर के लिए' },
            { id: 'bp', en: 'BP Care', hi: 'BP के लिए' },
            { id: 'thyroid', en: 'Thyroid Care', hi: 'थायराइड के लिए' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSwapFocus(tab.id)}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold cursor-pointer ${
              swapFocus === tab.id
                ? 'bg-emerald-700 text-white'
                : 'bg-white dark:bg-[#1A231F] border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
            }`}
          >
            {lang === 'en' ? tab.en : tab.hi}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="rounded-lg bg-white dark:bg-[#1A231F] border border-amber-300 dark:border-amber-800 p-4 space-y-1">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">
            {lang === 'en' ? 'Limit / Reduce' : 'कम करें'}
          </p>
          <p className="text-stone-700 dark:text-stone-300">
            {lang === 'en' ? swapData.avoidEn : swapData.avoidHi}
          </p>
        </div>
        <div className="rounded-lg bg-white dark:bg-[#1A231F] border border-emerald-300 dark:border-emerald-800 p-4 space-y-1">
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
            {lang === 'en' ? 'Smart Everyday Swap' : 'बेहतर घर का विकल्प'}
          </p>
          <p className="text-stone-700 dark:text-stone-300">
            {lang === 'en' ? swapData.chooseEn : swapData.chooseHi}
          </p>
        </div>
      </div>
    </div>
  );
}

export function BlogPage({ lang, initialPostId, onNavigate }: BlogPageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialPostId || null);

  useEffect(() => {
    if (initialPostId) {
      setSelectedId(initialPostId);
    }
  }, [initialPostId]);

  const activePost = selectedId ? BLOG_POSTS.find((b) => b.id === selectedId) || null : null;

  if (activePost) {
    const sections = lang === 'en' ? activePost.sectionsEn : activePost.sectionsHi;
    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{lang === 'en' ? 'Back to All Articles' : 'सभी लेखों पर वापस जाएं'}</span>
        </button>

        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span>{lang === 'en' ? activePost.categoryEn : activePost.categoryHi}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'en' ? activePost.readTimeEn : activePost.readTimeHi}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'en' ? activePost.dateEn : activePost.dateHi}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50 leading-tight">
            {lang === 'en' ? activePost.titleEn : activePost.titleHi}
          </h1>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
            {lang === 'en' ? activePost.excerptEn : activePost.excerptHi}
          </p>
        </header>

        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
          <SmartImage
            src={activePost.image}
            alt={lang === 'en' ? activePost.titleEn : activePost.titleHi}
            eager
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-7">
          {sections.map((sec) => (
            <section key={sec.heading} className="space-y-2">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-50">
                {sec.heading}
              </h2>
              <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
                {sec.body}
              </p>
            </section>
          ))}
        </div>

        {/* Interactive Portal Inside Blog */}
        <InteractiveBlogWidget type={activePost.widgetType} lang={lang} />

        {/* Key Takeaway & Coach CTA */}
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 p-6 sm:p-8 space-y-4">
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
            {lang === 'en' ? 'Simple Daily Takeaway' : 'आज की मुख्य सीख'}
          </p>
          <p className="font-display text-xl font-bold text-stone-900 dark:text-stone-50">
            {lang === 'en' ? activePost.takeawayEn : activePost.takeawayHi}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('book', '3-Day Free Demo')}
              className="cta-calm-shift inline-flex items-center gap-2 text-white font-semibold text-sm px-6 py-3 rounded-lg cursor-pointer"
            >
              <span>{lang === 'en' ? 'Get Your Personal Food Plan' : 'अपना पर्सनल डाइट प्लान पाएं'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <a
              href={SITE_LINKS.coaches.nikhil.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161D1A] text-stone-800 dark:text-stone-100 text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              <span>{lang === 'en' ? 'Ask Coach on WhatsApp' : 'व्हाट्सएप पर कोच से पूछें'}</span>
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          {lang === 'en' ? 'Simple Everyday Food Knowledge' : 'आसान भाषा में सही पोषण ज्ञान'}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-50">
          {lang === 'en' ? 'Nutrition & Wellness Blog' : 'पोषण एवं स्वास्थ्य ब्लॉग'}
        </h1>
        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300">
          {lang === 'en'
            ? 'Short, practical articles in simple language — each with its own interactive calculator or food check.'
            : 'सरल भाषा में छोटे और उपयोगी लेख — हर लेख के साथ एक इंटरैक्टिव कैलकुलेटर या गाइड।'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedId(post.id)}
            className="group rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] overflow-hidden cursor-pointer flex flex-col justify-between hover:border-emerald-600 dark:hover:border-emerald-500 transition-colors"
          >
            <div>
              <div className="aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-900">
                <SmartImage
                  src={post.image}
                  alt={lang === 'en' ? post.titleEn : post.titleHi}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <span>{lang === 'en' ? post.categoryEn : post.categoryHi}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lang === 'en' ? post.readTimeEn : post.readTimeHi}</span>
                </div>
                <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {lang === 'en' ? post.titleEn : post.titleHi}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {lang === 'en' ? post.excerptEn : post.excerptHi}
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                {lang === 'en' ? 'Read Article & Open Tool' : 'लेख पढ़ें और टूल खोलें'}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
