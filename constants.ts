
import { Project, Skill, PersonalInfo, Testimonial } from './types';

export const OWNER_NAME = {
  en: "Aref",
  ar: "عارف"
};

export const OWNER_ROLE = {
  en: "Senior Web Designer",
  ar: "مصمم مواقع أول"
};

export const OWNER_BIO = {
  en: "I design and build unique digital identities. Specializing in high-end Webflow development and user-centric interfaces that blend aesthetics with performance.",
  ar: "أقوم بتصميم وبناء هويات رقمية فريدة. متخصص في تطوير Webflow عالي المستوى وواجهات تركز على المستخدم تمزج بين الجمالية والأداء."
};

export const PERSONAL_INFO = (lang: 'en' | 'ar'): PersonalInfo => ({
  name: OWNER_NAME[lang],
  title: OWNER_ROLE[lang],
  bio: OWNER_BIO[lang],
  email: "hello@maref.me",
  avatar: "https://ui-avatars.com/api/?name=Aref&background=000&color=fff&size=200",
  socials: {
    github: "https://github.com/maref",
    linkedin: "https://linkedin.com/in/maref",
    email: "mailto:hello@maref.me",
    twitter: "https://twitter.com/maref_design"
  }
});

export const PROJECTS = (lang: 'en' | 'ar'): Project[] => [
  {
    id: '1',
    title: lang === 'en' ? 'Nabatat E-commerce' : 'متجر نباتات',
    description: lang === 'en' 
      ? 'A specialized e-commerce experience for plant lovers, focusing on clean Arabic typography and seamless user flow.'
      : 'تجربة تجارة إلكترونية متخصصة لمحبي النباتات، تركز على الخطوط العربية النظيفة وسلاسة تدفق المستخدم.',
    tags: ['Webflow', 'UI/UX', 'E-commerce', 'Arabic Design'],
    imageUrl: 'https://picsum.photos/seed/nabatat/800/600',
    gallery: [
      'https://picsum.photos/seed/nabatat/800/600',
      'https://picsum.photos/seed/nabatat2/800/600'
    ],
    link: 'https://maref.webflow.io',
    sourceUrl: '#',
    status: 'done'
  },
  {
    id: '2',
    title: lang === 'en' ? 'Ajeer Platform' : 'منصة أجير',
    description: lang === 'en'
      ? 'Complete branding and interface design for a professional service marketplace in Saudi Arabia.'
      : 'تصميم الهوية والواجهة الكاملة لسوق الخدمات المهنية في المملكة العربية السعودية.',
    tags: ['Branding', 'Figma', 'Webflow', 'SaaS'],
    imageUrl: 'https://picsum.photos/seed/ajeer/800/600',
    gallery: [
      'https://picsum.photos/seed/ajeer/800/600'
    ],
    link: 'https://maref.webflow.io',
    status: 'done'
  },
  {
    id: '3',
    title: lang === 'en' ? 'Masar Academy' : 'أكاديمية مسار',
    description: lang === 'en'
      ? 'A modern educational platform landing page designed to maximize conversions through visual hierarchy.'
      : 'صفحة هبوط لمنصة تعليمية حديثة مصممة لزيادة التحويلات من خلال التسلسل الهرمي البصري.',
    tags: ['Marketing', 'Webflow', 'Conversion Rate', 'Lottie'],
    imageUrl: 'https://picsum.photos/seed/masar/800/600',
    gallery: [
      'https://picsum.photos/seed/masar/800/600'
    ],
    sourceUrl: '#',
    status: 'done'
  },
  {
    id: '4',
    title: lang === 'en' ? 'Zid Theme Customization' : 'تخصيص ثيمات زد',
    description: lang === 'en'
      ? 'Bespoke UI customization for high-growth e-commerce stores on the Zid platform.'
      : 'تخصيص واجهة مستخدم مخصص للمتاجر الإلكترونية سريعة النمو على منصة زد.',
    tags: ['E-commerce', 'CSS', 'UI/UX', 'Zid'],
    imageUrl: 'https://picsum.photos/seed/zid/800/600',
    gallery: [
      'https://picsum.photos/seed/zid/800/600'
    ],
    link: 'https://maref.webflow.io',
    status: 'in-progress'
  }
];

export const SKILLS_DATA = (lang: 'en' | 'ar') => [
  { id: '1', name: "Webflow Development", category: lang === 'en' ? "Tools & Platforms" : "الأدوات والمنصات" },
  { id: '2', name: "UI/UX Design", category: lang === 'en' ? "Frameworks & Libraries" : "أطر العمل والمكتبات" },
  { id: '3', name: "Arabic Typography", category: lang === 'en' ? "Design" : "التصميم" },
  { id: '4', name: "Visual Identity", category: lang === 'en' ? "Design" : "التصميم" },
  { id: '5', name: "Figma", category: lang === 'en' ? "Tools & Platforms" : "الأدوات والمنصات" },
  { id: '6', name: "E-commerce Strategy", category: lang === 'en' ? "Strategy" : "الاستراتيجية" },
  { id: '7', name: "Custom CSS/JS", category: lang === 'en' ? "Languages" : "لغات البرمجة" },
  { id: '8', name: "Client Management", category: lang === 'en' ? "Professional" : "المهنية" },
];

export const TESTIMONIALS_DATA = (lang: 'en' | 'ar'): Testimonial[] => [
  {
    id: '1',
    name: lang === 'en' ? "Ahmed Mansour" : "أحمد منصور",
    role: lang === 'en' ? "Founder" : "مؤسس",
    company: "Nabatat",
    content: lang === 'en' 
      ? "Aref transformed our vision into a stunning digital reality. His attention to Arabic typography is unmatched."
      : "حول عارف رؤيتنا إلى واقع رقمي مذهل. اهتمامه بالخطوط العربية لا يعلى عليه.",
    avatar: "https://ui-avatars.com/api/?name=Ahmed+Mansour&background=10ac84&color=fff"
  },
  {
    id: '2',
    name: lang === 'en' ? "Khalid Al-Otaibi" : "خالد العتيبي",
    role: lang === 'en' ? "Marketing Manager" : "مدير تسويق",
    company: "Masar",
    content: lang === 'en'
      ? "Professional, creative, and extremely fast. Our landing page conversion rate increased significantly after Aref's redesign."
      : "محترف، مبدع، وسريع للغاية. زاد معدل تحويل صفحة الهبوط الخاصة بنا بشكل ملحوظ بعد إعادة تصميم عارف.",
    avatar: "https://ui-avatars.com/api/?name=Khalid+Al-Otaibi&background=2e86de&color=fff"
  },
  {
    id: '3',
    name: lang === 'en' ? "Fatima Zahra" : "فاطمة الزهراء",
    role: lang === 'en' ? "Project Lead" : "قائد مشروع",
    company: "CreativeHub",
    content: lang === 'en'
      ? "Working with Aref was a pleasure. He understands the nuances of modern web design perfectly."
      : "كان العمل مع عارف متعة. إنه يفهم فروق التصميم الحديث للويب بشكل مثالي.",
    avatar: "https://ui-avatars.com/api/?name=Fatima+Zahra&background=f368e0&color=fff"
  }
];

export const UI_STRINGS = {
  en: {
    about: "About",
    projects: "Projects",
    skills: "Skills",
    contact: "Contact",
    viewWork: "Explore Projects",
    contactMe: "Work With Me",
    selectedWork: "Curated Work",
    coreCompetencies: "Expertise",
    testimonials: "What Clients Say",
    getInTouch: "Start a Project",
    biography: "My Story",
    name: "Full Name",
    email: "Email Address",
    message: "Project Details",
    sendMessage: "Submit Request",
    adminAccess: "Admin Control",
    chatOnWhatsApp: "WhatsApp Chat",
    selectLanguage: "Switch Language",
    all: "All Work"
  },
  ar: {
    about: "من أنا",
    projects: "أعمالي",
    skills: "خبراتي",
    contact: "تواصل معي",
    viewWork: "استكشف المشاريع",
    contactMe: "لنعمل معاً",
    selectedWork: "أعمال مختارة",
    coreCompetencies: "مجالات الخبرة",
    testimonials: "آراء العملاء",
    getInTouch: "ابدأ مشروعك",
    biography: "قصتي",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    message: "تفاصيل المشروع",
    sendMessage: "إرسال الطلب",
    adminAccess: "لوحة التحكم",
    chatOnWhatsApp: "تحدث عبر واتساب",
    selectLanguage: "تغيير اللغة",
    all: "كل الأعمال"
  }
};
