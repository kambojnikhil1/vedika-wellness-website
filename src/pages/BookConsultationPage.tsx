import { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, Phone, Send } from 'lucide-react';
import type { Lang } from '../types';
import { getCopy } from '../data/translations';
import { SITE_IMAGES, SITE_LINKS } from '../data/siteAssets';
import { SmartImage } from '../components/SmartImage';
import { submitLead } from '../utils/api';

interface BookConsultationPageProps {
  lang: Lang;
  initialGoal?: string;
}

export function BookConsultationPage({ lang, initialGoal }: BookConsultationPageProps) {
  const t = getCopy(lang);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState(initialGoal || '3-Day Free Demo');
  const [mode, setMode] = useState<'Online (Phone / Video)' | 'Offline (Dehradun Center)'>(
    'Online (Phone / Video)'
  );
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedInfo, setSubmittedInfo] = useState<{
    name: string;
    phone: string;
    email: string;
    goal: string;
  } | null>(null);

  useEffect(() => {
    if (initialGoal) setGoal(initialGoal);
  }, [initialGoal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone.trim() && !email.trim()) {
      setError(
        lang === 'en'
          ? 'Please provide your phone number or email address so our coach can contact you.'
          : 'कृपया अपना फोन नंबर या ईमेल दर्ज करें ताकि हमारे कोच आपसे संपर्क कर सकें।'
      );
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        goal,
        mode,
        source: 'Book Consultation Page',
        message: message.trim(),
      });
      if (res.accepted) {
        setSubmittedInfo({
          name: name.trim() || 'Guest',
          phone: phone.trim(),
          email: email.trim(),
          goal,
        });
      } else {
        setError(res.error || 'Please check your phone number or email.');
      }
    } catch {
      setError(
        lang === 'en'
          ? 'Could not reach the server. Please message us directly on WhatsApp.'
          : 'सर्वर से संपर्क नहीं हो सका। कृपया सीधे व्हाट्सएप पर संदेश भेजें।'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Guidance Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {lang === 'en' ? 'Start Your Transformation' : 'अपने बदलाव की शुरुआत करें'}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50">
              {t.book.title}
            </h1>
            <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              {t.book.subtitle}
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F4F4F1] dark:bg-[#141C18] p-6 space-y-4 text-sm">
            <p className="font-display font-bold text-base text-stone-900 dark:text-stone-50">
              {lang === 'en' ? 'What happens on your free call?' : 'फ्री कॉल में क्या होगा?'}
            </p>
            <ol className="space-y-2.5 text-stone-700 dark:text-stone-300 list-decimal list-inside">
              <li>
                {lang === 'en'
                  ? 'We understand your current routine, food habits, and health goals.'
                  : 'हम आपकी दिनचर्या, खान-पान और स्वास्थ्य लक्ष्य को समझेंगे।'}
              </li>
              <li>
                {lang === 'en'
                  ? 'We explain simple 80% food / 20% movement improvements you can start right away.'
                  : 'हम आपको 80% भोजन और 20% गतिविधि के आसान बदलाव बताएंगे।'}
              </li>
              <li>
                {lang === 'en'
                  ? 'You can join our 3-Day Free Demo before deciding on any paid plan.'
                  : 'किसी भी प्लान से पहले आप 3 दिन का फ्री डेमो ले सकते हैं।'}
              </li>
            </ol>
          </div>

          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-5 space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 shrink-0">
                <SmartImage
                  src={SITE_IMAGES.coachNikhil}
                  alt={SITE_LINKS.coaches.nikhil.nameEn}
                  className="w-11 h-11 rounded-full object-cover object-[50%_24%] ring-2 ring-white dark:ring-[#161D1A]"
                />
                <SmartImage
                  src={SITE_IMAGES.coachAnupamand}
                  alt={SITE_LINKS.coaches.anupamand.nameEn}
                  className="w-11 h-11 rounded-full object-cover object-[50%_30%] ring-2 ring-white dark:ring-[#161D1A]"
                />
              </div>
              <div>
                <p className="font-semibold text-stone-900 dark:text-stone-100">
                  {lang === 'en' ? 'Prefer instant chat or call?' : 'सीधे कॉल या व्हाट्सएप करना चाहते हैं?'}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {lang === 'en' ? 'Nikhil Kamboj & Mahant Anupamand Giri' : 'निखिल कांबोज व महंत अनुपमानंद गिरी'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={SITE_LINKS.bookFreeCallWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                {lang === 'en' ? 'WhatsApp Nikhil' : 'व्हाट्सएप निखिल'}
              </a>
              <a
                href={SITE_LINKS.coaches.nikhil.tel}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs tabular-nums"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {SITE_LINKS.coaches.nikhil.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 sm:p-10">
          {submittedInfo ? (
            <div className="py-6 space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
                    {lang === 'en' ? 'Consultation Request Confirmed!' : 'आपका अनुरोध सफलतापूर्वक दर्ज हो गया!'}
                  </h2>
                  <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                    {lang === 'en'
                      ? `Thank you, ${submittedInfo.name}. Our coach team has received your details for "${submittedInfo.goal}" and will reach out shortly.`
                      : `धन्यवाद, ${submittedInfo.name}। हमारे कोच को "${submittedInfo.goal}" के लिए आपकी जानकारी मिल गई है और वे जल्द ही संपर्क करेंगे।`}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={`https://wa.me/918193989452?text=${encodeURIComponent(
                    `Hi, I want some help related to my health issues.\nName: ${submittedInfo.name}\nPhone: ${submittedInfo.phone}\nGoal: ${submittedInfo.goal}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-calm-shift inline-flex items-center gap-2 text-white font-semibold text-sm px-5 py-3 rounded-lg"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {lang === 'en' ? 'Send Instant Hi on WhatsApp' : 'व्हाट्सएप पर तुरंत संदेश भेजें'}
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedInfo(null);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="px-5 py-3 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-sm font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  {lang === 'en' ? 'Book Another Request' : 'एक और अनुरोध भेजें'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    {lang === 'en' ? 'Full Name' : 'पूरा नाम'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'en' ? 'e.g. Amit Kumar' : 'जैसे: अमित कुमार'}
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
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    {lang === 'en' ? 'Select Program / Health Goal' : 'प्रोग्राम या लक्ष्य चुनें'}
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="3-Day Free Demo">3-Day Free Demo (₹0)</option>
                    <option value="Sustainable Fat Loss & Metabolic Reset (1 Month ₹6,300)">
                      Fat Loss & Metabolic Reset — 1 Month (₹6,300)
                    </option>
                    <option value="Sustainable Fat Loss & Metabolic Reset (3 Months ₹15,000)">
                      Fat Loss & Metabolic Reset — 3 Months (₹15,000)
                    </option>
                    <option value="Healthy Weight Gain & Lean Strength (1 Month ₹6,300)">
                      Healthy Weight Gain — 1 Month (₹6,300)
                    </option>
                    <option value="Healthy Weight Gain & Lean Strength (3 Months ₹15,000)">
                      Healthy Weight Gain — 3 Months (₹15,000)
                    </option>
                    <option value="Gut Healing & Hormonal Balance (BP / Sugar / Thyroid)">
                      Gut Healing & Hormonal Balance (BP / Sugar / Thyroid)
                    </option>
                    <option value="Full Body Assessment & Custom Diet Plan">
                      Full Body Assessment & Custom Diet Plan
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    {lang === 'en' ? 'Preferred Mode' : 'पसंदीदा माध्यम'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      ['Online (Phone / Video)', 'Offline (Dehradun Center)'] as const
                    ).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setMode(opt)}
                        className={`px-3 py-2.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                          mode === opt
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300'
                            : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                        }`}
                      >
                        {opt === 'Online (Phone / Video)'
                          ? lang === 'en'
                            ? 'Online'
                            : 'ऑनलाइन'
                          : lang === 'en'
                            ? 'Dehradun Offline'
                            : 'देहरादून ऑफलाइन'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  {lang === 'en'
                    ? 'Anything else you want to share? (Optional)'
                    : 'कोई और जानकारी? (जैसे वजन, BP, शुगर, थायराइड आदि)'}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    lang === 'en'
                      ? 'Example: Current weight 84 kg, looking to lose 12 kg with simple vegetarian food.'
                      : 'उदाहरण: वर्तमान वजन 84 किलो, सादे शाकाहारी खाने से वजन कम करना है।'
                  }
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 px-4 py-3 rounded-lg"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="cta-calm-shift w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-semibold text-sm px-7 py-3.5 rounded-lg cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>
                  {submitting
                    ? lang === 'en'
                      ? 'Booking Your Call...'
                      : 'बुक किया जा रहा है...'
                    : lang === 'en'
                      ? 'Confirm Free Health Consultation'
                      : 'फ्री हेल्थ कंसल्टेशन कन्फर्म करें'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
