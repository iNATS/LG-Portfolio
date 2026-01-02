import React, { useState, useEffect, useCallback } from 'react';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassPane } from './GlassPane';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const images = project.gallery && project.gallery.length > 0 ? project.gallery : [project.imageUrl];

  useEffect(() => {
    setCurrentIndex(0);
  }, [project]);

  const changeImage = useCallback((newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 300);
  }, [isAnimating]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    changeImage((currentIndex + 1) % images.length);
  }, [images.length, currentIndex, changeImage]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    changeImage((currentIndex - 1 + images.length) % images.length);
  }, [images.length, currentIndex, changeImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 animate-[fadeIn_0.3s_ease-out]">
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <GlassPane className="w-full h-full md:h-[95vh] md:max-w-7xl flex flex-col relative !rounded-none md:!rounded-[32px] overflow-hidden shadow-2xl bg-white/80 dark:bg-black/40" darker>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/50 dark:bg-black/40 text-slate-900 dark:text-white hover:bg-white hover:text-black transition-colors backdrop-blur-md border border-white/10 shadow-lg"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col h-full lg:flex-row">
            {/* Carousel Section - Removed separate background */}
            <div className="relative w-full lg:w-[65%] h-[40vh] lg:h-full flex items-center justify-center overflow-hidden group select-none p-4 md:p-8">
                <div className="relative w-full h-full rounded-[24px] overflow-hidden shadow-2xl border border-white/20 dark:border-white/5 bg-slate-200 dark:bg-black/50">
                    <img 
                        key={currentIndex}
                        src={images[currentIndex]} 
                        alt={`${project.title} view ${currentIndex + 1}`} 
                        className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                        style={{ opacity: isAnimating ? 0.8 : 1 }}
                    />
                    {/* Image overlay gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>
                
                {images.length > 1 && (
                    <>
                        <button 
                            onClick={handlePrev}
                            className="absolute left-6 md:left-10 p-3 rounded-full bg-white/20 dark:bg-black/40 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md border border-white/20 dark:border-white/10"
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={handleNext}
                            className="absolute right-6 md:right-10 p-3 rounded-full bg-white/20 dark:bg-black/40 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md border border-white/20 dark:border-white/10"
                            aria-label="Next image"
                        >
                            <ChevronRight size={24} />
                        </button>
                        
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); changeImage(idx); }}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60'}`}
                                    aria-label={`Go to image ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Details Section - Removed separate background */}
            <div className="flex-1 flex flex-col overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/10">
                 <div className="p-6 md:p-10 flex-grow">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">{project.title}</h2>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                        {project.tags.map(tag => (
                        <span key={tag} className="px-4 py-1.5 bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full text-xs font-medium text-slate-700 dark:text-white/90">
                            {tag}
                        </span>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">Overview</h3>
                            <p className="text-slate-600 dark:text-white/70 leading-relaxed text-base font-light">
                                {project.description}
                            </p>
                        </div>
                    </div>
                 </div>

                 <div className="p-6 md:p-10 border-t border-slate-200 dark:border-white/10 mt-auto">
                    <div className="flex flex-row gap-4">
                        {project.link && (
                        <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="
                              flex items-center justify-center gap-2 px-6 py-3 rounded-full 
                              bg-slate-900 dark:bg-white text-white dark:text-black font-medium text-sm border border-transparent
                              hover:bg-slate-700 dark:hover:bg-gray-200 transition-colors shadow-lg
                            "
                        >
                            <ExternalLink size={18} />
                            Live Demo
                        </a>
                        )}
                        {project.sourceUrl && (
                        <a 
                            href={project.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="
                              flex items-center justify-center gap-2 px-6 py-3 rounded-full 
                              bg-white/50 dark:bg-transparent text-slate-900 dark:text-white border border-slate-300 dark:border-white/30 font-medium text-sm
                              hover:bg-white dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white transition-colors
                            "
                        >
                            <Github size={18} />
                            Source Code
                        </a>
                        )}
                    </div>
                 </div>
            </div>
        </div>
      </GlassPane>
    </div>
  );
};