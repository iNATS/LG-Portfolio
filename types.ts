export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  gallery?: string[];
  link?: string;
  sourceUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  twitter?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  socials: SocialLinks;
  avatar: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export type SkillCategory = 'Languages' | 'Frameworks & Libraries' | 'Tools & Platforms';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}