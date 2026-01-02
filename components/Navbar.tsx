import React, { useState } from 'react';
import { GlassPane } from './GlassPane';
import { User, Briefcase, Cpu, Mail, Globe } from 'lucide-react';

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  icon?: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, isActive, icon, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className={`
      text-sm font-medium transition-all duration-300 rounded-full flex items-center gap-2
      ${isActive
        ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] px-4 py-2'
        : 'text-white/70 hover:text-white hover:bg-white/10 px-3 py-2'
      }
    `}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </a>
);

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'FR', label: 'Français' },
    { code: 'AR', label: 'العربية' },
  ];

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <div className="pointer-events-auto">
        <GlassPane className="!rounded-full px-2 py-2 flex items-center gap-2 bg-black/40 border-white/10 shadow-2xl backdrop-blur-2xl">
          <nav className="flex items-center space-x-1">
            <NavLink href="#about" label="About" isActive={activeSection === 'about'} onClick={scrollTo('#about')} icon={<User size={16} />} />
            <NavLink href="#projects" label="Projects" isActive={activeSection === 'projects'} onClick={scrollTo('#projects')} icon={<Briefcase size={16} />} />
            <NavLink href="#skills" label="Skills" isActive={activeSection === 'skills'} onClick={scrollTo('#skills')} icon={<Cpu size={16} />} />
            <NavLink href="#contact" label="Contact" isActive={activeSection === 'contact'} onClick={scrollTo('#contact')} icon={<Mail size={16} />} />
          </nav>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-white/10 mx-1"></div>

          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <Globe size={16} />
              <span className="sr-only">Change Language</span>
            </button>
            
            {langOpen && (
              <div className="absolute top-12 right-0 w-32 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col animate-[fadeIn_0.2s_ease-out]">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setCurrentLang(lang.code); setLangOpen(false); }}
                    className={`px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${currentLang === lang.code ? 'text-white font-bold' : 'text-white/70'}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </GlassPane>
      </div>
    </header>
  );
};