
import { Project, Skill, PersonalInfo, Testimonial } from './types';

export const OWNER_NAME = {
  en: "Alex Rivera",
  ar: "أليكس ريفيرا"
};

export const OWNER_ROLE = {
  en: "Senior Creative Developer",
  ar: "مطور إبداعي أول"
};

export const OWNER_BIO = {
  en: "I build immersive digital experiences at the intersection of design and engineering. Specializing in React, WebGL, and spatial interfaces.",
  ar: "أقوم ببناء تجارب رقمية غامرة في نقطة التقاء التصميم والهندسة. متخصص في React و WebGL والواجهات المكانية."
};

export const PERSONAL_INFO = (lang: 'en' | 'ar'): PersonalInfo => ({
  name: OWNER_NAME[lang],
  title: OWNER_ROLE[lang],
  bio: OWNER_BIO[lang],
  email: "alex@example.com",
  avatar: "https://ui-avatars.com/api/?name=Alex+Rivera&background=0D8ABC&color=fff&size=200",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "mailto:alex@example.com",
    twitter: "https://twitter.com"
  }
});

export const PROJECTS = (lang: 'en' | 'ar'): Project[] => [
  {
    id: '1',
    title: lang === 'en' ? 'Nebula Dashboard' : 'لوحة تحكم نيبولا',
    description: lang === 'en' 
      ? 'A real-time data visualization platform for tracking satellite telemetry. Built with React and D3.js, featuring a glassmorphic UI.'
      : 'منصة لتصور البيانات في الوقت الفعلي لتتبع القياسات عن بعد للأقمار الصناعية. بنيت باستخدام React و D3.js.',
    tags: ['React', 'D3.js', 'WebSockets', 'Tailwind'],
    imageUrl: 'https://picsum.photos/seed/nebula/800/600',
    gallery: [
      'https://picsum.photos/seed/nebula/800/600',
    ],
    link: '#',
    sourceUrl: '#',
    status: 'done'
  },
  {
    id: '2',
    title: lang === 'en' ? 'Ethereal Commerce' : 'تجارة إثيريال',
    description: lang === 'en'
      ? 'An experimental e-commerce interface using 3D product previews and spatial navigation paradigms.'
      : 'واجهة تجارة إلكترونية تجريبية تستخدم معاينات المنتجات ثلاثية الأبعاد ونماذج الملاحة المكانية.',
    tags: ['Three.js', 'React Fiber', 'Shopify API'],
    imageUrl: 'https://picsum.photos/seed/ethereal/800/600',
    status: 'in-progress'
  },
  {
    id: '3',
    title: lang === 'en' ? 'Chronos Task Manager' : 'مدير مهام كرونوس',
    description: lang === 'en'
      ? 'AI-powered productivity suite that organizes your day based on energy levels and priority.'
      : 'جناح إنتاجية مدعوم بالذكاء الاصطناعي ينظم يومك بناءً على مستويات الطاقة والأولوية.',
    tags: ['Next.js', 'Gemini API', 'Framer Motion'],
    imageUrl: 'https://picsum.photos/seed/chronos/800/600',
    status: 'done'
  }
];

export const SKILLS_DATA = (lang: 'en' | 'ar') => [
  { id: '1', name: "React 18+", category: lang === 'en' ? "Frameworks & Libraries" : "أطر العمل والمكتبات" },
  { id: '2', name: "TypeScript", category: lang === 'en' ? "Languages" : "لغات البرمجة" },
  { id: '3', name: "Tailwind CSS", category: lang === 'en' ? "Frameworks & Libraries" : "أطر العمل والمكتبات" },
  { id: '5', name: "Three.js", category: lang === 'en' ? "Frameworks & Libraries" : "أطر العمل والمكتبات" },
  { id: '8', name: "Node.js", category: lang === 'en' ? "Tools & Platforms" : "الأدوات والمنصات" },
  { id: '11', name: "Gemini API", category: lang === 'en' ? "Tools & Platforms" : "الأدوات والمنصات" },
];

export const TESTIMONIALS_DATA = (lang: 'en' | 'ar'): Testimonial[] => [
  {
    id: '1',
    name: lang === 'en' ? "Sarah Chen" : "سارة تشين",
    role: lang === 'en' ? "Product Manager" : "مديرة منتج",
    company: "TechFlow",
    content: lang === 'en' 
      ? "Alex has an incredible eye for detail. The spatial interface he designed increased user engagement by 40%."
      : "أليكس لديه دقة مذهلة في التفاصيل. الواجهة المكانية التي صممها زادت من تفاعل المستخدمين بنسبة 40%.",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=ff5e57&color=fff"
  },
  {
    id: '2',
    name: lang === 'en' ? "Marcus Johnson" : "ماركوس جونسون",
    role: lang === 'en' ? "CTO" : "المدير التقني",
    company: "InnovateX",
    content: lang === 'en'
      ? "One of the few developers who truly understands the bridge between design and engineering."
      : "واحد من المطورين القلائل الذين يفهمون حقاً الجسر بين التصميم والهندسة.",
    avatar: "https://ui-avatars.com/api/?name=Marcus+Johnson&background=0fb9b1&color=fff"
  }
];

export const UI_STRINGS = {
  en: {
    about: "About",
    projects: "Projects",
    skills: "Skills",
    contact: "Contact",
    viewWork: "View Work",
    contactMe: "Contact Me",
    selectedWork: "Selected Work",
    coreCompetencies: "Core Competencies",
    testimonials: "What People Say",
    getInTouch: "Get In Touch",
    biography: "Biography",
    name: "Name",
    email: "Email",
    message: "Message",
    sendMessage: "Send Message",
    adminAccess: "Admin Access",
    chatOnWhatsApp: "Chat on WhatsApp",
    selectLanguage: "Select Language",
    all: "All"
  },
  ar: {
    about: "عني",
    projects: "المشاريع",
    skills: "المهارات",
    contact: "تواصل معي",
    viewWork: "عرض أعمالي",
    contactMe: "تواصل معي",
    selectedWork: "أعمال مختارة",
    coreCompetencies: "الكفاءات الأساسية",
    testimonials: "ماذا يقول الناس",
    getInTouch: "ابقى على تواصل",
    biography: "السيرة الذاتية",
    name: "الاسم",
    email: "البريد الإلكتروني",
    message: "الرسالة",
    sendMessage: "إرسال الرسالة",
    adminAccess: "دخول المسؤول",
    chatOnWhatsApp: "تحدث عبر واتساب",
    selectLanguage: "اختر اللغة",
    all: "الكل"
  }
};
