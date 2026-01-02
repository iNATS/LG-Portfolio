import React from 'react';

interface GlassPaneProps {
  children: React.ReactNode;
  className?: string;
  darker?: boolean;
  interactive?: boolean; // New prop for hover effects
  onClick?: () => void;
}

export const GlassPane: React.FC<GlassPaneProps> = ({ 
  children, 
  className = '', 
  darker = false,
  interactive = false,
  onClick
}) => {
  // Vision OS style: 
  // - Heavy blur
  // - Light luminosity even in dark mode (simulating glass catching light)
  // - "Platter" feel
  
  // Dark mode: bg-black/30 or bg-white/10
  // Light mode: bg-white/70 or bg-white/40
  const baseBg = darker 
    ? 'bg-white/60 dark:bg-black/30' 
    : 'bg-white/40 dark:bg-white/10';

  const hoverEffects = interactive 
    ? 'hover:bg-white/60 dark:hover:bg-white/20 transition-all duration-300 hover:scale-[1.01] cursor-pointer' 
    : '';

  const textColor = 'text-slate-900 dark:text-white';
  const borderColor = 'border-white/40 dark:border-white/20';

  return (
    <div 
      onClick={onClick}
      className={`
        relative
        backdrop-blur-[80px] 
        backdrop-saturate-[1.5]
        ${borderColor}
        border
        shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]
        rounded-[40px] 
        ${baseBg}
        ${hoverEffects}
        ${textColor}
        overflow-hidden
        ${className}
      `}
      style={{
        WebkitBackdropFilter: 'blur(80px) saturate(150%)',
        backdropFilter: 'blur(80px) saturate(150%)',
      }}
    >
      {/* Specular noise texture for realism */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      
      {/* Top highlight gradient */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-60" />
      
      {children}
    </div>
  );
};