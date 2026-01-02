import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { useMousePosition } from './hooks/useMousePosition';
import { useScrollSpy } from './hooks/useScrollSpy';
import { Project, Skill, PersonalInfo, SkillCategory, Testimonial } from './types';
import { GlassPane } from './components/GlassPane';
import { ProjectCard } from './components/ProjectCard';
import { SkillBadge } from './components/SkillBadge';
import { GitHubIcon, LinkedInIcon, MailIcon } from './components/Icons';
import { AnimatedSection } from './components/AnimatedSection';
import { ProjectModal } from './components/ProjectModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Beams } from './components/Beams';
import { Navbar } from './components/Navbar';
import { ChevronDown, ArrowDown, Sparkles, Lock, Cpu, Briefcase, Send } from 'lucide-react';

// Contexts & Admin
import { DataProvider, useData } from './contexts/DataContext';
import { AdminPanel } from './admin/AdminPanel';

// Fix for missing icon export: Local component definition using provided SVG
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

// --- Components wrapped in DataContext logic ---

const HeroSection: React.FC = () => {
    const { personalInfo } = useData();
    
    const scrollToProjects = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.querySelector('#projects');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    const scrollToContact = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.querySelector('#contact');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="about" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-20">
            {/* Beams Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-60">
                 <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
                    <Beams
                        beamWidth={2}
                        beamHeight={15}
                        beamNumber={12}
                        lightColor="#ffffff"
                        speed={2}
                        noiseIntensity={1.75}
                        scale={0.2}
                        rotation={0}
                    />
                </div>
            </div>
            
            {/* Glow effect behind text - static div is faster than blur calculation on large areas */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none z-0" />
            
            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto mt-8">
                
                {/* Pill Badge */}
                <div 
                    className="
                        mb-8 px-2 py-1.5 rounded-full pr-5
                        bg-white/5 border border-white/10 backdrop-blur-md 
                        text-sm font-medium text-purple-100/90 shadow-[0_0_20px_rgba(147,51,234,0.15)]
                        flex items-center gap-3 animate-[fadeIn_1s_ease-out] hover:bg-white/10 transition-colors
                    "
                >
                    <img 
                        src={personalInfo.avatar} 
                        alt="Avatar" 
                        className="w-6 h-6 rounded-full border border-white/20"
                    />
                    <div className="flex items-center gap-2">
                        <span>{personalInfo.title}</span>
                        <Sparkles size={12} className="text-purple-400" />
                    </div>
                </div>

                {/* Main Heading */}
                <h1 
                    className="
                        text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter 
                        text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 
                        mb-8 drop-shadow-2xl animate-[fadeIn_1s_ease-out_0.2s_both]
                    "
                >
                    {personalInfo.name}
                </h1>

                {/* Subtitle */}
                <p 
                    className="
                        text-lg md:text-2xl text-white/60 max-w-2xl mb-12 
                        leading-relaxed font-light animate-[fadeIn_1s_ease-out_0.4s_both]
                    "
                >
                    {personalInfo.bio}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 animate-[fadeIn_1s_ease-out_0.6s_both]">
                    <a 
                      href="#projects"
                      onClick={scrollToProjects}
                      className="
                        px-8 py-4 rounded-full bg-white text-black font-bold text-lg
                        hover:scale-105 active:scale-95 transition-all duration-300
                        shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]
                        flex items-center justify-center
                      "
                    >
                      View Work
                    </a>
                    <a 
                      href="#contact"
                      onClick={scrollToContact}
                      className="
                        px-8 py-4 rounded-full bg-transparent border border-white/10 text-white font-medium text-lg
                        hover:bg-white/5 hover:border-white/30 hover:scale-105 active:scale-95 transition-all duration-300
                        backdrop-blur-sm flex items-center justify-center
                      "
                    >
                      Contact Me
                    </a>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow text-white/20 z-10">
                <ChevronDown size={32} />
            </div>
        </section>
    );
};

const ProjectsSection: React.FC<{ onProjectClick: (p: Project) => void }> = ({ onProjectClick }) => {
    const { projects } = useData();
    const [activeTag, setActiveTag] = useState('All');

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        projects.forEach(project => {
            project.tags.forEach(tag => tags.add(tag));
        });
        return ['All', ...Array.from(tags).sort()];
    }, [projects]);

    const filteredProjects = useMemo(() => {
        if (activeTag === 'All') return projects;
        return projects.filter(project => project.tags.includes(activeTag));
    }, [projects, activeTag]);

    return (
        <section id="projects" className="py-20 md:py-32">
            <div className="container mx-auto px-4 max-w-7xl">
                <h2 className="text-4xl font-bold text-center text-white mb-8">Selected Work</h2>
                
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 backdrop-blur-md border ${
                                activeTag === tag
                                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/30'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                    <AnimatedSection key={project.id} className="h-full">
                        <ProjectCard 
                            project={project}
                            onClick={() => onProjectClick(project)} 
                        />
                    </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

const SkillsSection: React.FC = () => {
    const { skills } = useData();
    const skillCategories = useMemo(() => {
        const grouped: Record<string, Skill[]> = {};
        for (const skill of skills) {
            if (!grouped[skill.category]) {
                grouped[skill.category] = [];
            }
            grouped[skill.category].push(skill);
        }
        
        const orderedCategories: SkillCategory[] = ['Languages', 'Frameworks & Libraries', 'Tools & Platforms'];
        const result: [string, Skill[]][] = [];
        
        for(const category of orderedCategories) {
            if(grouped[category] && grouped[category].length > 0) {
                result.push([category, grouped[category]]);
            }
        }
        return result;
    }, [skills]);

    return (
        <section id="skills" className="py-20 md:py-32 relative">
            <div className="container mx-auto px-4 max-w-6xl">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-center text-white mb-16">Core Competencies</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {skillCategories.map(([category, currentSkills]) => (
                            <div key={category} className="h-full">
                                <GlassPane className="p-8 h-full flex flex-col hover:bg-white/10 transition-colors duration-300" darker>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                            {category === 'Languages' && <MessageSquareQuote size={16} />}
                                            {category === 'Frameworks & Libraries' && <Cpu size={16} />}
                                            {category === 'Tools & Platforms' && <Briefcase size={16} />}
                                        </div>
                                        <h3 className="text-lg font-bold text-white">{category}</h3>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2.5">
                                        {currentSkills.map(skill => (
                                            <SkillBadge key={skill.id} skill={skill.name} />
                                        ))}
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
    return (
        <section id="testimonials" className="py-20 md:py-32">
            <div className="container mx-auto px-4 max-w-7xl">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-center text-white mb-16">What People Say</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t) => (
                            <GlassPane key={t.id} className="p-8 flex flex-col relative" darker>
                                <div className="absolute top-6 right-8 text-white/10">
                                    <MessageSquareQuote size={40} />
                                </div>
                                <p className="text-white/80 leading-relaxed mb-8 relative z-10 min-h-[80px]">
                                    "{t.content}"
                                </p>
                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/10">
                                    <img 
                                        src={t.avatar} 
                                        alt={t.name} 
                                        className="w-12 h-12 rounded-full border border-white/20"
                                    />
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{t.name}</h4>
                                        <p className="text-xs text-white/50">{t.role} at {t.company}</p>
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thanks for reaching out! This is a demo form.");
    };

    return (
        <section id="contact" className="py-20 md:py-32">
            <div className="container mx-auto px-4 max-w-4xl">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-center text-white mb-12">Get In Touch</h2>
                    <GlassPane className="p-8 md:p-12" darker>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-white">Let's build something amazing together.</h3>
                                <p className="text-white/60 leading-relaxed">
                                    I'm currently available for freelance work and open to full-time opportunities.
                                    If you have a project that needs a creative touch, I'd love to hear about it.
                                </p>
                                <div className="pt-4 space-y-4">
                                    <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <MailIcon className="w-5 h-5" />
                                        </div>
                                        <span>{personalInfo.email}</span>
                                    </a>
                                    <a href={personalInfo.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <LinkedInIcon className="w-5 h-5" />
                                        </div>
                                        <span>LinkedIn Profile</span>
                                    </a>
                                    <a href={personalInfo.socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <GitHubIcon className="w-5 h-5" />
                                        </div>
                                        <span>GitHub Profile</span>
                                    </a>
                                </div>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">Name</label>
                                    <input 
                                        type="text" 
                                        id="name"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-white/40 focus:bg-black/50 outline-none transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">Email</label>
                                    <input 
                                        type="email" 
                                        id="email"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-white/40 focus:bg-black/50 outline-none transition-all"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-2">Message</label>
                                    <textarea 
                                        id="message"
                                        rows={4}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-white/40 focus:bg-black/50 outline-none transition-all resize-none"
                                        placeholder="Tell me about your project..."
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-2"
                                >
                                    <Send size={18} /> Send Message
                                </button>
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
    const sectionIds = useMemo(() => ['about', 'projects', 'skills', 'contact'], []);
    const activeSection = useScrollSpy(sectionIds, 150);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { personalInfo } = useData();

    const handleProjectClick = useCallback((project: Project) => {
        setSelectedProject(project);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedProject(null);
    }, []);

    useEffect(() => {
        const body = document.body;
        if (selectedProject) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
        return () => { body.style.overflow = ''; };
    }, [selectedProject]);

    return (
        <div className="relative min-h-screen w-full font-sans text-white selection:bg-white/30 selection:text-white">
             {/* Cursor Light Effect - Optimized: Removed heavy blur calculation on mousemove if causing lag, simple radial gradient is okay */}
            <div
                className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-40 mix-blend-screen"
                style={{
                    background: `radial-gradient(400px at ${x}px ${y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
                }}
            ></div>

            <Navbar activeSection={activeSection} />

            <main>
                <HeroSection />
                <ProjectsSection onProjectClick={handleProjectClick} />
                <SkillsSection />
                <TestimonialsSection />
                <ContactSection />
            </main>

            <footer className="py-8 text-center text-white/30 text-sm flex flex-col items-center gap-2">
                <p>&copy; {new Date().getFullYear()} {personalInfo.name}. All Rights Reserved.</p>
                <button 
                    onClick={() => setAdminMode(true)}
                    className="flex items-center gap-1 text-xs hover:text-white transition-colors opacity-50 hover:opacity-100"
                >
                    <Lock size={10} /> Admin Access
                </button>
            </footer>

            {selectedProject && (
                <ProjectModal project={selectedProject} onClose={handleCloseModal} />
            )}

            <WhatsAppButton />
        </div>
    );
};

const AdminLogin: React.FC<{ onLogin: () => void, onCancel: () => void }> = ({ onLogin, onCancel }) => {
    const [pass, setPass] = useState('');
    const [error, setError] = useState(false);

    const check = (e: React.FormEvent) => {
        e.preventDefault();
        if (pass === 'admin123') { // Simple demo auth
            onLogin();
        } else {
            setError(true);
        }
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl">
            <GlassPane className="p-10 w-full max-w-md flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-6">Admin Verification</h2>
                <form onSubmit={check} className="w-full space-y-4">
                    <input 
                        type="password" 
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        placeholder="Enter secure key (admin123)" 
                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                    />
                    {error && <p className="text-red-400 text-sm">Access Denied</p>}
                    <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200">
                        Unlock Panel
                    </button>
                    <button type="button" onClick={onCancel} className="w-full text-white/50 text-sm hover:text-white">
                        Return to Portfolio
                    </button>
                </form>
            </GlassPane>
        </div>
    )
}

const App: React.FC = () => {
    const [adminMode, setAdminMode] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Simple view routing
    if (adminMode && !isAuthenticated) {
        return <DataProvider><AdminLogin onLogin={() => setIsAuthenticated(true)} onCancel={() => setAdminMode(false)} /></DataProvider>
    }

    if (adminMode && isAuthenticated) {
        return (
            <DataProvider>
                <AdminPanel onLogout={() => { setIsAuthenticated(false); setAdminMode(false); }} />
            </DataProvider>
        );
    }

    return (
        <DataProvider>
            <MainApp setAdminMode={setAdminMode} />
        </DataProvider>
    );
};

export default App;