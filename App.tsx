
import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { useMousePosition } from './hooks/useMousePosition';
import { useScrollSpy } from './hooks/useScrollSpy';
import { Project, Skill, PersonalInfo, Testimonial } from './types';
import { GlassPane } from './components/GlassPane';
import { ProjectCard } from './components/ProjectCard';
import { SkillBadge } from './components/SkillBadge';
import { GitHubIcon, LinkedInIcon, MailIcon } from './components/Icons';
import { AnimatedSection } from './components/AnimatedSection';
import { ProjectModal } from './components/ProjectModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Beams } from './components/Beams';
import { Navbar } from './components/Navbar';
import { ChevronDown, Sparkles, Lock, Cpu, Briefcase, Send, User } from 'lucide-react';

// Contexts & Admin
import { DataProvider, useData } from './contexts/DataContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AdminPanel } from './admin/AdminPanel';
import { UI_STRINGS } from './constants';

const MessageSquareQuote = ({ size = 24, className = "" }: { size?: number | string, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-message-circle ${className}`}
  >
    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>
  </svg>
);

const HeroSection: React.FC = () => {
    const { personalInfo } = useData();
    const { theme } = useTheme();
    const { language } = useLanguage();
    const strings = UI_STRINGS[language];
    
    const scrollToSection = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-20">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-60">
                 <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
                    <Beams
                        beamWidth={2}
                        beamHeight={15}
                        beamNumber={12}
                        lightColor={theme === 'light' ? "#000000" : "#ffffff"}
                        speed={2}
                        noiseIntensity={1.75}
                        scale={0.2}
                        rotation={0}
                    />
                </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/40 dark:bg-purple-900/10 blur-[100px] rounded-full pointer-events-none z-0" />
            
            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto mt-8">
                <div className="mb-8 px-2 py-1.5 rounded-full pr-5 bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md text-sm font-medium text-purple-600 dark:text-purple-100/90 shadow-[0_0_20px_rgba(147,51,234,0.15)] flex items-center gap-3 animate-[fadeIn_1s_ease-out]">
                    <img src={personalInfo.avatar} alt="Avatar" className="w-6 h-6 rounded-full border border-white/20" />
                    <div className="flex items-center gap-2">
                        <span>{personalInfo.title}</span>
                        <Sparkles size={12} className="text-purple-500 dark:text-purple-400" />
                    </div>
                </div>

                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-white dark:to-white/60 mb-8 drop-shadow-2xl animate-[fadeIn_1s_ease-out_0.2s_both]">
                    {personalInfo.name}
                </h1>

                <p className="text-lg md:text-2xl text-slate-600 dark:text-white/60 max-w-2xl mb-12 leading-relaxed font-light animate-[fadeIn_1s_ease-out_0.4s_both]">
                    {personalInfo.bio}
                </p>

                <div className="flex flex-col sm:flex-row gap-5 animate-[fadeIn_1s_ease-out_0.6s_both]">
                    <a href="#projects" onClick={scrollToSection('#projects')} className="px-8 py-4 rounded-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 dark:bg-white dark:border-white text-white dark:text-black font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center">
                      {strings.viewWork}
                    </a>
                    <a href="#contact" onClick={scrollToSection('#contact')} className="px-8 py-4 rounded-full bg-transparent border border-slate-900/10 dark:border-white/10 text-slate-900 dark:text-white font-medium text-lg hover:bg-slate-900/5 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm flex items-center justify-center">
                      {strings.contactMe}
                    </a>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow text-slate-400 dark:text-white/20 z-10">
                <ChevronDown size={32} />
            </div>
        </section>
    );
};

const AboutSection: React.FC = () => {
    const { personalInfo } = useData();
    const { language } = useLanguage();
    const strings = UI_STRINGS[language];

    return (
        <section id="about" className="py-24 relative overflow-hidden">
             <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <AnimatedSection>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/3 flex flex-col gap-6">
                            <GlassPane className="p-6 flex flex-col items-center text-center md:sticky md:top-24" darker interactive>
                                <div className="relative w-48 h-48 mb-6 group">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                                    <img src={personalInfo.avatar} alt={personalInfo.name} className="relative w-full h-full object-cover rounded-full border-2 border-white/20 shadow-2xl" />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{personalInfo.name}</h3>
                                <p className="text-slate-500 dark:text-white/50 text-sm uppercase tracking-widest mb-6 bg-slate-200/50 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5">
                                    {personalInfo.title}
                                </p>
                                <div className="flex gap-4 w-full justify-center">
                                    <a href={personalInfo.socials.github} target="_blank" className="p-3 rounded-full bg-white/40 dark:bg-white/5 border border-white/20 text-slate-800 dark:text-white"><GitHubIcon className="w-5 h-5" /></a>
                                    <a href={personalInfo.socials.linkedin} target="_blank" className="p-3 rounded-full bg-white/40 dark:bg-white/5 border border-white/20 text-slate-800 dark:text-white"><LinkedInIcon className="w-5 h-5" /></a>
                                    <a href={`mailto:${personalInfo.email}`} className="p-3 rounded-full bg-white/40 dark:bg-white/5 border border-white/20 text-slate-800 dark:text-white"><MailIcon className="w-5 h-5" /></a>
                                </div>
                            </GlassPane>
                        </div>

                        <div className="w-full md:w-2/3 flex flex-col gap-6">
                            <GlassPane className="p-8 relative overflow-hidden" darker>
                                <div className="absolute top-0 right-0 p-4 opacity-10"><User size={120} /></div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 relative z-10">
                                    <span className="w-1 h-8 bg-blue-500 rounded-full block"></span>
                                    {strings.biography}
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-white/70 leading-relaxed font-light text-lg relative z-10">
                                    <p>{personalInfo.bio}</p>
                                </div>
                            </GlassPane>
                            <div className="grid grid-cols-3 gap-4">
                                {[{ label: 'Experience', value: '5+' }, { label: 'Projects', value: '25+' }, { label: 'Clients', value: '12' }].map((stat, idx) => (
                                    <GlassPane key={idx} className="p-4 flex flex-col items-center justify-center gap-2" darker>
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                                        <span className="text-[10px] text-slate-500 dark:text-white/50 uppercase tracking-widest text-center">{stat.label}</span>
                                    </GlassPane>
                                ))}
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
             </div>
        </section>
    );
};

const ProjectsSection: React.FC<{ onProjectClick: (p: Project) => void }> = ({ onProjectClick }) => {
    const { projects } = useData();
    const { language } = useLanguage();
    const strings = UI_STRINGS[language];
    const [activeTag, setActiveTag] = useState(strings.all);

    useEffect(() => {
        setActiveTag(strings.all);
    }, [language, strings.all]);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        projects.forEach(project => project.tags.forEach(tag => tags.add(tag)));
        return [strings.all, ...Array.from(tags).sort()];
    }, [projects, strings.all]);

    const filteredProjects = useMemo(() => {
        if (activeTag === strings.all) return projects;
        return projects.filter(project => project.tags.includes(activeTag));
    }, [projects, activeTag, strings.all]);

    return (
        <section id="projects" className="py-20 md:py-32">
            <div className="container mx-auto px-4 max-w-7xl">
                <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-8">{strings.selectedWork}</h2>
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {allTags.map(tag => (
                        <button key={tag} onClick={() => setActiveTag(tag)} className={`px-5 py-2 text-sm font-medium rounded-full border transition-all ${activeTag === tag ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'bg-white/40 dark:bg-white/5 text-slate-600 dark:text-white/60'}`}>{tag}</button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                    <AnimatedSection key={project.id} className="h-full">
                        <ProjectCard project={project} onClick={() => onProjectClick(project)} />
                    </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

const SkillsSection: React.FC = () => {
    const { skills } = useData();
    const { language } = useLanguage();
    const strings = UI_STRINGS[language];

    const skillCategories = useMemo(() => {
        const grouped: Record<string, Skill[]> = {};
        for (const skill of skills) {
            if (!grouped[skill.category]) grouped[skill.category] = [];
            grouped[skill.category].push(skill);
        }
        return Object.entries(grouped);
    }, [skills]);

    return (
        <section id="skills" className="py-20 md:py-32">
            <div className="container mx-auto px-4 max-w-6xl">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-16">{strings.coreCompetencies}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {skillCategories.map(([category, currentSkills]) => (
                            <div key={category} className="h-full">
                                <GlassPane className="p-8 h-full flex flex-col" darker>
                                    <div className="flex items-center gap-3 mb-6">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{category}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        {currentSkills.map(skill => <SkillBadge key={skill.id} skill={skill.name} />)}
                                    </div>
                                </GlassPane>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};

const TestimonialsSection: React.FC = () => {
    const { testimonials } = useData();
    const { language } = useLanguage();
    const strings = UI_STRINGS[language];

    return (
        <section id="testimonials" className="py-20 md:py-32">
            <div className="container mx-auto px-4 max-w-7xl">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-16">{strings.testimonials}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t) => (
                            <GlassPane key={t.id} className="p-8 flex flex-col relative" darker>
                                <div className={`absolute top-6 ${language === 'ar' ? 'left-8' : 'right-8'} text-slate-300 dark:text-white/10`}><MessageSquareQuote size={40} /></div>
                                <p className="text-slate-600 dark:text-white/80 leading-relaxed mb-8 relative z-10 min-h-[80px]">"{t.content}"</p>
                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-200 dark:border-white/10">
                                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border border-white/20" />
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</h4>
                                        <p className="text-xs text-slate-500 dark:text-white/50">{t.role} {language === 'en' ? 'at' : 'في'} {t.company}</p>
                                    </div>
                                </div>
                            </GlassPane>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};

const ContactSection: React.FC = () => {
    const { personalInfo } = useData();
    const { language } = useLanguage();
    const strings = UI_STRINGS[language];

    return (
        <section id="contact" className="py-20 md:py-32">
            <div className="container mx-auto px-4 max-w-4xl">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">{strings.getInTouch}</h2>
                    <GlassPane className="p-8 md:p-12" darker>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{language === 'en' ? "Let's build something together" : "دعونا نبني شيئاً مذهلاً معاً"}</h3>
                                <div className="pt-4 space-y-4">
                                    <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-3 text-slate-700 dark:text-white/80 hover:text-slate-900"><MailIcon className="w-5 h-5" /><span>{personalInfo.email}</span></a>
                                </div>
                            </div>
                            <form className="space-y-4">
                                <div><label className="block text-sm font-medium mb-2">{strings.name}</label><input type="text" className="w-full bg-white/40 dark:bg-black/30 border rounded-xl px-4 py-3 outline-none" required /></div>
                                <div><label className="block text-sm font-medium mb-2">{strings.email}</label><input type="email" className="w-full bg-white/40 dark:bg-black/30 border rounded-xl px-4 py-3 outline-none" required /></div>
                                <div><label className="block text-sm font-medium mb-2">{strings.message}</label><textarea rows={4} className="w-full bg-white/40 dark:bg-black/30 border rounded-xl px-4 py-3 outline-none resize-none" required /></div>
                                <button type="submit" className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2"><Send size={18} /> {strings.sendMessage}</button>
                            </form>
                        </div>
                    </GlassPane>
                </AnimatedSection>
            </div>
        </section>
    );
};

const MainApp: React.FC<{ setAdminMode: (v: boolean) => void }> = ({ setAdminMode }) => {
    const { x, y } = useMousePosition();
    const sectionIds = useMemo(() => ['home', 'about', 'projects', 'skills', 'contact'], []);
    const activeSection = useScrollSpy(sectionIds, 150);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { personalInfo } = useData();
    const { language } = useLanguage();
    const strings = UI_STRINGS[language];

    return (
        <div className="relative min-h-screen w-full font-sans text-slate-900 dark:text-white bg-slate-50 dark:bg-black transition-colors duration-500">
            <div className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-40 mix-blend-screen" style={{ background: `radial-gradient(400px at ${x}px ${y}px, rgba(59, 130, 246, 0.15), transparent 80%)` }}></div>
            <Navbar activeSection={activeSection} />
            <main><HeroSection /><AboutSection /><ProjectsSection onProjectClick={setSelectedProject} /><SkillsSection /><TestimonialsSection /><ContactSection /></main>
            <footer className="py-8 text-center text-slate-400 dark:text-white/30 text-sm flex flex-col items-center gap-2">
                <p>&copy; {new Date().getFullYear()} {personalInfo.name}</p>
                <button onClick={() => setAdminMode(true)} className="flex items-center gap-1 text-xs opacity-50 hover:opacity-100"><Lock size={10} /> {strings.adminAccess}</button>
            </footer>
            {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
            <WhatsAppButton />
        </div>
    );
};

const App: React.FC = () => {
    const [adminMode, setAdminMode] = useState(false);
    return (
      <LanguageProvider>
        <ThemeProvider>
            <DataProvider>
                <MainApp setAdminMode={setAdminMode} />
                {adminMode && <AdminPanel onLogout={() => setAdminMode(false)} />}
            </DataProvider>
        </ThemeProvider>
      </LanguageProvider>
    );
};

export default App;
