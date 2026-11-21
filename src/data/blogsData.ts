import type { BlogPost } from '../types';
import { SITE_IMAGES } from './siteAssets';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'myths-carbs-protein-fat-fibre',
    slug: 'carbs-protein-fat-fibre-myths',
    categoryEn: 'Food Basics',
    categoryHi: 'भोजन के मूल नियम',
    readTimeEn: '4 min read',
    readTimeHi: '4 मिनट पढ़ें',
    dateEn: 'November 2026',
    dateHi: 'नवंबर 2026',
    image: SITE_IMAGES.heroThali,
    titleEn: 'Carbs, Protein, Fat & Fibre: Simple Truths vs Common Myths',
    titleHi: 'कार्ब्स, प्रोटीन, फैट और फाइबर: आम गलतफहमियां और सरल सच्चाई',
    excerptEn:
      'Should you stop eating roti and rice? Does ghee always make you fat? Let us clear the biggest food myths in plain language.',
    excerptHi:
      'क्या रोटी-चावल छोड़ना ज़रूरी है? क्या घी से हमेशा मोटापा बढ़ता है? आइए रोज़ के खाने से जुड़ी गलतफहमियों को आसान भाषा में समझें।',
    sectionsEn: [
      {
        heading: '1. Carbs are not your enemy — portion size is',
        body: 'Many people quit roti and rice completely to lose weight, then feel tired and give up in two weeks. Whole wheat roti, dal, oats, and fruits give your brain steady energy. The real problem is eating double servings of refined flour, sugar, and biscuits with almost no protein or vegetables on the plate.',
      },
      {
        heading: '2. Protein is not only for gym bodybuilders',
        body: 'Every Indian adult — homemakers, office workers, seniors — needs daily protein to protect muscles, hair, skin, and steady blood sugar. Dal alone has some protein, so pairing it with paneer, curd, soya, sprouts, or eggs makes your thali truly balanced.',
      },
      {
        heading: '3. Good fat helps hormones; hidden fried oil hurts',
        body: 'One small spoon of homemade desi ghee or a handful of soaked almonds supports joint and hormone health. Deep-fried namkeen, bakery puffs, and reused restaurant oil are the fats that silently add belly weight.',
      },
      {
        heading: '4. Fibre is the secret hero of gut & weight control',
        body: 'Eating one full plate of fresh cucumber, carrot, and green vegetables before your main meal slows down sugar spikes and keeps your stomach full for hours.',
      },
    ],
    sectionsHi: [
      {
        heading: '1. कार्ब्स आपके दुश्मन नहीं हैं — मात्रा सही होनी चाहिए',
        body: 'बहुत लोग वजन घटाने के लिए रोटी-चावल बिल्कुल बंद कर देते हैं और दो हफ्ते में थककर छोड़ देते हैं। गेहूं की रोटी, दाल और फल शरीर को सही ऊर्जा देते हैं। असली समस्या मैदा, चीनी, बिस्किट और बहुत ज़्यादा मात्रा में खाना है।',
      },
      {
        heading: '2. प्रोटीन सिर्फ़ जिम जाने वालों के लिए नहीं है',
        body: 'हर व्यक्ति को अपनी मांसपेशियों, बालों, त्वचा और ब्लड शुगर को संतुलित रखने के लिए रोज़ प्रोटीन चाहिए। दाल के साथ पनीर, दही, सोया, अंकुरित मूंग या अंडे जोड़ने से आपकी थाली पूरी तरह संतुलित बनती है।',
      },
      {
        heading: '3. सही फैट ज़रूरी है, तला-भुना तेल नुकसानदायक',
        body: 'दिन में 1-2 छोटे चम्मच घर का घी या भीगे बादाम शरीर के लिए अच्छे हैं। बाज़ार की नमकीन, समोसे और बार-बार तले तेल से पेट की चर्बी बढ़ती है।',
      },
      {
        heading: '4. फाइबर पाचन और वजन कंट्रोल का सबसे आसान तरीका है',
        body: 'मुख्य भोजन से पहले एक प्लेट ताज़ा खीरा, गाजर और टमाटर सलाद खाने से पेट देर तक भरा रहता है और शुगर अचानक नहीं बढ़ती।',
      },
    ],
    takeawayEn: 'Build every meal around 1 portion protein + 1 big portion veggies + 1 controlled portion grains.',
    takeawayHi: 'हर थाली में सही प्रोटीन, भरपूर सलाद-सब्जी और संतुलित मात्रा में रोटी या चावल रखें।',
    widgetType: 'myth-quiz',
  },
  {
    id: 'water-weight-energy',
    slug: 'why-water-changes-weight-and-energy',
    categoryEn: 'Daily Habits',
    categoryHi: 'रोज़ की आदतें',
    readTimeEn: '3 min read',
    readTimeHi: '3 मिनट पढ़ें',
    dateEn: 'November 2026',
    dateHi: 'नवंबर 2026',
    image: SITE_IMAGES.blogHydration,
    titleEn: 'Why Drinking Enough Water Changes Your Weight & Energy',
    titleHi: 'सही मात्रा में पानी पीने से वजन और ऊर्जा पर क्या असर पड़ता है',
    excerptEn:
      'Half the time we feel hungry in the afternoon, our body is simply thirsty. Learn how much water your body actually needs.',
    excerptHi:
      'दोपहर में कई बार हमें भूख नहीं, बल्कि प्यास लगी होती है। जानें आपके वजन के हिसाब से आपको रोज़ कितना पानी पीना चाहिए।',
    sectionsEn: [
      {
        heading: 'Thirst often disguises itself as snack cravings',
        body: 'When you drink less than 1.5 litres of water a day, your brain sends weak fatigue signals that feel just like hunger. Drinking one glass of plain water before reaching for tea and biscuits can save 200 to 300 extra calories daily.',
      },
      {
        heading: 'Water keeps digestion and metabolism moving',
        body: 'Without enough water, fibre cannot move smoothly through your stomach, leading to bloating, constipation, and sluggish mornings. Your cells also need water to burn stored fat properly.',
      },
      {
        heading: 'Simple timing beats chugging at night',
        body: 'Start your morning with 1–2 glasses of normal or lukewarm water. Sip steadily through the day, drink a glass 25 minutes before meals, and avoid gulping huge bottles right before bed so your sleep stays peaceful.',
      },
    ],
    sectionsHi: [
      {
        heading: 'प्यास को अक्सर हम भूख समझ लेते हैं',
        body: 'जब शरीर में पानी की कमी होती है, तो थकान और हल्की भूख जैसा महसूस होता है। शाम को चाय-बिस्किट लेने से पहले एक गिलास पानी पीकर देखें — आपकी बेवजह की क्रेविंग कम हो जाएगी।',
      },
      {
        heading: 'पानी पाचन और मेटाबॉलिज़्म को तेज़ रखता है',
        body: 'कम पानी पीने से गैस, कब्ज़ और भारीपन होता है। शरीर में जमा फैट को ऊर्जा में बदलने के लिए भी पर्याप्त पानी ज़रूरी है।',
      },
      {
        heading: 'सही समय पर घूंट-घूंट करके पिएं',
        body: 'सुबह उठकर 1-2 गिलास सामान्य या गुनगुना पानी पिएं। दिन भर थोड़ा-थोड़ा पानी पीते रहें और खाने से 25 मिनट पहले एक गिलास पानी लें।',
      },
    ],
    takeawayEn: 'A simple rule of thumb: about 1 litre of water per 20 kg of body weight (usually 2.5 to 3.5 litres daily).',
    takeawayHi: 'आसान नियम: हर 20 किलो वजन पर लगभग 1 लीटर पानी (आम तौर पर दिन में 2.5 से 3.5 लीटर)।',
    widgetType: 'water-calc',
  },
  {
    id: 'importance-of-muscles',
    slug: 'why-muscles-matter-for-everyone',
    categoryEn: 'Strength & Metabolism',
    categoryHi: 'मांसपेशियां और मेटाबॉलिज़्म',
    readTimeEn: '4 min read',
    readTimeHi: '4 मिनट पढ़ें',
    dateEn: 'November 2026',
    dateHi: 'नवंबर 2026',
    image: SITE_IMAGES.blogProtein,
    titleEn: 'Why Muscles Matter More Than Just Looking Fit',
    titleHi: 'मांसपेशियों (मसल) की मजबूती हर उम्र में क्यों ज़रूरी है',
    excerptEn:
      'Strong muscles protect your knees, back, and blood sugar — and help your body burn more calories even while resting.',
    excerptHi:
      'मज़बूत मांसपेशियां आपके घुटनों, कमर और ब्लड शुगर की रक्षा करती हैं — और आराम करते समय भी ज़्यादा कैलोरी बर्न करती हैं।',
    sectionsEn: [
      {
        heading: 'Crash diets burn muscle instead of fat',
        body: 'When you eat very little food with low protein, the weighing scale drops quickly — but you lose precious muscle and water. That makes your body weak, slows your metabolism, and causes double weight regain later.',
      },
      {
        heading: 'Muscles act like a natural sugar sponge',
        body: 'Your leg and back muscles use glucose from your meals for energy. Having healthy muscle mass makes it much easier for your body to keep daily blood sugar steady and joints pain-free as you cross 35, 45, or 60.',
      },
      {
        heading: '80% daily protein food + 20% simple movement',
        body: 'You do not need heavy gym weights. Eating enough protein every day along with 20–30 minutes of brisk walking, wall push-ups, squats, or light home resistance keeps muscles strong for life.',
      },
    ],
    sectionsHi: [
      {
        heading: 'भूखे रहने वाली डाइट से फैट नहीं, मसल घटता है',
        body: 'बहुत कम खाने से तराज़ू पर वजन जल्दी कम दिखता है, लेकिन असल में शरीर की ताकत और मसल कम हो जाते हैं। इससे कमज़ोरी आती है और बाद में वजन फिर बढ़ जाता है।',
      },
      {
        heading: 'मसल शरीर की शुगर और जोड़ों की रक्षा करते हैं',
        body: 'हमारे पैरों और कमर की मांसपेशियां खाने से मिलने वाली शुगर का सही उपयोग करती हैं। 35-40 की उम्र के बाद घुटनों और कमर दर्द से बचने के लिए मसल बचाना बहुत ज़रूरी है।',
      },
      {
        heading: '80% सही प्रोटीन भोजन + 20% आसान व्यायाम',
        body: 'इसके लिए भारी जिम की ज़रूरत नहीं। रोज़ सही प्रोटीन वाला घर का खाना और 20-30 मिनट की तेज़ चाल या हल्का घरेलू व्यायाम काफी है।',
      },
    ],
    takeawayEn: 'Goal is never just "weight loss" — it is fat loss while keeping your muscles strong.',
    takeawayHi: 'लक्ष्य सिर्फ़ "वजन कम करना" नहीं, बल्कि मांसपेशियों को मज़बूत रखते हुए चर्बी कम करना है।',
    widgetType: 'protein-calc',
  },
  {
    id: 'best-ways-to-lose-weight',
    slug: 'best-simple-ways-to-lose-weight',
    categoryEn: 'Weight Management',
    categoryHi: 'वजन प्रबंधन',
    readTimeEn: '5 min read',
    readTimeHi: '5 मिनट पढ़ें',
    dateEn: 'November 2026',
    dateHi: 'नवंबर 2026',
    image: SITE_IMAGES.heroNutrition,
    titleEn: 'The Best, Simplest Ways to Lose Weight Without Starving',
    titleHi: 'बिना भूखे रहे वजन कम करने के सबसे आसान और कारगर तरीके',
    excerptEn:
      'Forget fancy foreign diets. Real fat loss comes from 80% everyday Indian nutrition and 20% simple daily movement.',
    excerptHi:
      'महंगी विदेशी डाइट भूल जाइए। असली और टिकाऊ फैट लॉस 80% सही भारतीय भोजन और 20% रोज़ की सक्रियता से होता है।',
    sectionsEn: [
      {
        heading: 'Follow the 80% Food, 20% Movement rule',
        body: 'You can walk for one full hour and burn around 250 calories — yet one plate of samosa and sweet tea adds 400 calories in five minutes. That is why fixing your thali comes first, and light daily movement supports it.',
      },
      {
        heading: 'Fix meal timings and dinner lightness',
        body: 'Eating a heavy meal at 10:30 PM and going straight to sleep makes your body store fat around the waist. Finishing a lighter, protein-rich dinner by 7:30–8:00 PM improves sleep and morning lightness within days.',
      },
      {
        heading: 'Measure progress beyond just the weighing scale',
        body: 'Track your waist inches, energy levels, afternoon sleepiness, and hunger control. A coach who checks in with you every day helps you stay consistent when motivation dips.',
      },
    ],
    sectionsHi: [
      {
        heading: '80% भोजन और 20% व्यायाम का नियम अपनाएं',
        body: 'एक घंटा चलने से करीब 250 कैलोरी बर्न होती है, जबकि एक समोसा और मीठी चाय 5 मिनट में 400 कैलोरी जोड़ देते हैं। इसलिए पहले थाली सुधारें, फिर हल्का व्यायाम जोड़ें।',
      },
      {
        heading: 'रात का खाना हल्का और समय पर रखें',
        body: 'रात 10:30 बजे भारी खाना खाकर तुरंत सोने से पेट की चर्बी बढ़ती है। शाम 7:30–8:00 बजे तक हल्का और प्रोटीन-युक्त डिनर करने से नींद और पाचन दोनों बेहतर होते हैं।',
      },
      {
        heading: 'सही मार्गदर्शन से नियमितता आसान बनती है',
        body: 'अकेले शुरुआत करना आसान है, लेकिन टिके रहना मुश्किल। जब कोई कोच रोज़ आपकी थाली और आदतों पर ध्यान देता है, तो परिणाम स्थायी होते हैं।',
      },
    ],
    takeawayEn: 'Small changes repeated daily beat strict diets that last only 10 days.',
    takeawayHi: '10 दिन की सख्त डाइट से बेहतर है रोज़ की छोटी और टिकाऊ अच्छी आदतें।',
    widgetType: 'habit-check',
  },
  {
    id: 'bp-sugar-thyroid-food-habits',
    slug: 'daily-food-habits-bp-sugar-thyroid',
    categoryEn: 'Lifestyle Support',
    categoryHi: 'जीवनशैली सहायता',
    readTimeEn: '4 min read',
    readTimeHi: '4 मिनट पढ़ें',
    dateEn: 'November 2026',
    dateHi: 'नवंबर 2026',
    image: SITE_IMAGES.heroThali,
    titleEn: 'Everyday Food Habits for People Managing BP, Sugar & Thyroid',
    titleHi: 'BP, शुगर और थायराइड में मददगार रोज़ की आसान खान-पान आदतें',
    excerptEn:
      'While you always follow your doctor for medicines, smart food swaps at home can help you feel lighter, calmer, and more energetic.',
    excerptHi:
      'दवाइयों के लिए हमेशा अपने डॉक्टर की सलाह मानें — साथ ही घर के खाने में छोटे बदलाव आपको ज़्यादा हल्का और ऊर्जावान महसूस करा सकते हैं।',
    sectionsEn: [
      {
        heading: 'Eat salad and protein before carbohydrates',
        body: 'Simply changing the order in which you eat — starting with fresh cucumber/salad, then dal/paneer/sabzi, and then roti — helps avoid sharp post-meal sugar spikes and afternoon heaviness.',
      },
      {
        heading: 'Cut hidden salt and packaged snacks',
        body: 'Pickles, packaged namkeen, instant noodles, and restaurant gravies carry far more hidden sodium than home food. Switching to fresh home spices, roasted chana, and makhana supports calmer blood pressure.',
      },
      {
        heading: 'Never skip breakfast or sleep late',
        body: 'Irregular meals and poor sleep put extra stress on hormones and thyroid rhythm. Simple, warm, protein-rich home meals eaten on time keep your metabolism steady.',
      },
    ],
    sectionsHi: [
      {
        heading: 'सलाद और प्रोटीन पहले, रोटी-चावल बाद में',
        body: 'भोजन का क्रम बदलने भर से बड़ा फ़र्क़ पड़ता है। पहले खीरा-सलाद, फिर दाल-पनीर-सब्जी और अंत में रोटी खाने से भोजन के बाद शुगर तेज़ी से नहीं बढ़ती और आलस नहीं आता।',
      },
      {
        heading: 'पैकेट वाले खाने और छिपे नमक से बचें',
        body: 'अचार, पैकेट वाली नमकीन और बाहर की ग्रेवी में बहुत ज़्यादा नमक होता है। भुना चना, मखाना और घर के ताज़ा मसाले BP के लिए बेहतर विकल्प हैं।',
      },
      {
        heading: 'सुबह का नाश्ता और समय पर नींद न छोड़ें',
        body: 'असमय खाना और कम नींद हार्मोन व थायराइड के संतुलन को बिगाड़ते हैं। समय पर पौष्टिक नाश्ता और 7-8 घंटे की नींद शरीर को सही लय में रखती है।',
      },
    ],
    takeawayEn: 'Food habits work hand-in-hand with your doctor’s care to help you live an active, energetic life.',
    takeawayHi: 'डॉक्टर के परामर्श के साथ सही भोजन की आदतें आपको स्वस्थ और सक्रिय जीवन जीने में मदद करती हैं।',
    widgetType: 'food-swap',
  },
];
