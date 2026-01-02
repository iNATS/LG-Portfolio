import React, { useRef, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { GlassPane } from './GlassPane';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const tiltRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current) return;

    const rect = tiltRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div 
      ref={tiltRef} 
      style={{ transform, transition: 'transform 0.1s ease-out' }} 
      className="h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        onClick={onClick} 
        className="w-full h-full text-left focus:outline-none rounded-[40px] group"
        aria-label={`View details for ${project.title}`}
      >
        <GlassPane className="p-6 flex flex-col h-full !rounded-[40px] hover:border-white/40 hover:bg-white/10 transition-all duration-300" darker>
          <div className="relative overflow-hidden rounded-2xl mb-5 w-full aspect-[16/9]">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-white/60 text-sm flex-grow mb-6 line-clamp-3">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 mt-auto pt-5 border-t border-white/10 w-full">
            {project.link && (
              <span className="flex items-center text-sm text-white/50 group-hover:text-white transition-colors">
                <ExternalLink className="w-4 h-4 mr-2" />
                Demo
              </span>
            )}
            {project.sourceUrl && (
              <span className="flex items-center text-sm text-white/50 group-hover:text-white transition-colors">
                <Github className="w-4 h-4 mr-2" />
                Code
              </span>
            )}
          </div>
        </GlassPane>
      </button>
    </div>
  );
};
