import { Project, Skill, PersonalInfo, Testimonial } from './types';

export const OWNER_NAME = "Alex Rivera";
export const OWNER_ROLE = "Senior Creative Developer";
export const OWNER_BIO = "I build immersive digital experiences at the intersection of design and engineering. Specializing in React, WebGL, and spatial interfaces.";

export const PERSONAL_INFO: PersonalInfo = {
  name: OWNER_NAME,
  title: OWNER_ROLE,
  bio: OWNER_BIO,
  email: "alex@example.com",
  avatar: "https://ui-avatars.com/api/?name=Alex+Rivera&background=0D8ABC&color=fff&size=200",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "mailto:alex@example.com",
    twitter: "https://twitter.com"
  }
};

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Nebula Dashboard',
    description: 'A real-time data visualization platform for tracking satellite telemetry. Built with React and D3.js, featuring a glassmorphic UI.',
    tags: ['React', 'D3.js', 'WebSockets', 'Tailwind'],
    imageUrl: 'https://picsum.photos/seed/nebula/800/600',
    gallery: [
      'https://picsum.photos/seed/nebula/800/600',
      'https://picsum.photos/seed/nebula-detail1/800/600',
      'https://picsum.photos/seed/nebula-detail2/800/600'
    ],
    link: '#',
    sourceUrl: '#'
  },
  {
    id: '2',
    title: 'Ethereal Commerce',
    description: 'An experimental e-commerce interface using 3D product previews and spatial navigation paradigms.',
    tags: ['Three.js', 'React Fiber', 'Shopify API'],
    imageUrl: 'https://picsum.photos/seed/ethereal/800/600',
    gallery: [
      'https://picsum.photos/seed/ethereal/800/600',
      'https://picsum.photos/seed/ethereal-prod/800/600',
      'https://picsum.photos/seed/ethereal-cart/800/600'
    ],
    link: '#'
  },
  {
    id: '3',
    title: 'Chronos Task Manager',
    description: 'AI-powered productivity suite that organizes your day based on energy levels and priority.',
    tags: ['Next.js', 'Gemini API', 'Framer Motion'],
    imageUrl: 'https://picsum.photos/seed/chronos/800/600',
    gallery: [
      'https://picsum.photos/seed/chronos/800/600',
      'https://picsum.photos/seed/chronos-ui/800/600'
    ],
    sourceUrl: '#'
  },
  {
    id: '4',
    title: 'Visionary UI Kit',
    description: 'An open-source React component library mimicking the aesthetics of spatial computing operating systems.',
    tags: ['TypeScript', 'Storybook', 'CSS Modules'],
    imageUrl: 'https://picsum.photos/seed/visionary/800/600',
    gallery: [
      'https://picsum.photos/seed/visionary/800/600',
      'https://picsum.photos/seed/visionary-comp/800/600',
      'https://picsum.photos/seed/visionary-dark/800/600'
    ],
    link: '#',
    sourceUrl: '#'
  }
];

export const SKILLS: Skill[] = [
  { id: '1', name: "React 18+", category: "Frameworks & Libraries" },
  { id: '2', name: "TypeScript", category: "Languages" },
  { id: '3', name: "Tailwind CSS", category: "Frameworks & Libraries" },
  { id: '4', name: "HTML5/CSS3", category: "Languages" },
  { id: '5', name: "Three.js", category: "Frameworks & Libraries" },
  { id: '6', name: "WebGL", category: "Frameworks & Libraries" },
  { id: '7', name: "Framer Motion", category: "Frameworks & Libraries" },
  { id: '8', name: "Node.js", category: "Tools & Platforms" },
  { id: '9', name: "PostgreSQL", category: "Tools & Platforms" },
  { id: '10', name: "Google Cloud", category: "Tools & Platforms" },
  { id: '11', name: "Gemini API", category: "Tools & Platforms" },
  { id: '12', name: "Python", category: "Languages" }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow",
    content: "Alex has an incredible eye for detail. The spatial interface he designed for our dashboard increased user engagement by 40%.",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=ff5e57&color=fff"
  },
  {
    id: '2',
    name: "Marcus Johnson",
    role: "CTO",
    company: "InnovateX",
    content: "One of the few developers who truly understands the bridge between design and engineering. His code is as clean as his designs.",
    avatar: "https://ui-avatars.com/api/?name=Marcus+Johnson&background=0fb9b1&color=fff"
  },
  {
    id: '3',
    name: "Elena Rodriguez",
    role: "Lead Designer",
    company: "Aura Studio",
    content: "Working with Alex was seamless. He took our static Figma designs and brought them to life with animations that felt natural and fluid.",
    avatar: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=4b7bec&color=fff"
  }
];