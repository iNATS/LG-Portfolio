
import React, { useState, useRef, useEffect } from 'react';
import { GlassPane } from './GlassPane';
import { User, Briefcase, Cpu, Mail, Globe, Command, Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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
        ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.4)] px-4 py-2'
        : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 px-3 py-2'
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
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'ES', label: 'Español' },
    { code: 'FR', label: 'Français' },
    { code: 'DE', label: 'Deutsch' },
    { code: 'JP', label: '日本語' },
  ];

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <div className="pointer-events-auto relative z-50">
        <GlassPane className="!rounded-full px-2 py-2 flex items-center gap-2 bg-white/70 dark:bg-black/40 border-white/20 shadow-2xl backdrop-blur-2xl">
          <button
             onClick={scrollToTop}
             className={`
               w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
               ${activeSection === 'home' 
                 ? 'bg-slate-900 text-white dark:bg-white dark:text-black' 
                 : 'text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10'}
             `}
             aria-label="Home"
          >
            <Command size={20} />
          </button>
          
          <div className="h-5 w-[1px] bg-slate-900/10 dark:bg-white/10 mx-1"></div>

          <nav className="flex items-center space-x-1">
            <NavLink href="#about" label="About" isActive={activeSection === 'about'} onClick={scrollTo('#about')} icon={<User size={16} />} />
            <NavLink href="#projects" label="Projects" isActive={activeSection === 'projects'} onClick={scrollTo('#projects')} icon={<Briefcase size={16} />} />
            <NavLink href="#skills" label="Skills" isActive={activeSection === 'skills'} onClick={scrollTo('#skills')} icon={<Cpu size={16} />} />
            <NavLink href="#contact" label="Contact" isActive={activeSection === 'contact'} onClick={scrollTo('#contact')} icon={<Mail size={16} />} />
          </nav>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-slate-900/10 dark:bg-white/10 mx-1"></div>

          {/* Language Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors
                ${langOpen ? 'bg-slate-200 dark:bg-white/20' : 'hover:bg-slate-200 dark:hover:bg-white/10'}
                text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white
              `}
              aria-label="Change Language"
            >
              <Globe size={16} />
            </button>
            
            {langOpen && (
              <div className="absolute top-12 right-0 w-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-xl overflow-hidden shadow-2xl flex flex-col animate-[fadeIn_0.2s_ease-out] p-1 z-[60]">
                 <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-white/40 uppercase tracking-wider border-b border-slate-100 dark:border-white/10 mb-1">
                    Select Language
                 </div>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { 
                      setCurrentLang(lang.code); 
                      setLangOpen(false); 
                    }}
                    className={`
                      px-3 py-2 text-left text-sm rounded-lg flex items-center justify-between
                      ${currentLang === lang.code 
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold' 
                        : 'text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10'}
                    `}
                  >
                    <span>{lang.label}</span>
                    {currentLang === lang.code && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

        </GlassPane>
      </div>
    </header>
  );
};
