import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TabButtonProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ label, icon: Icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 ease-out
        ${isActive 
          ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105 font-semibold' 
          : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-105 font-medium'
        }
      `}
    >
      <Icon size={18} strokeWidth={2.5} className={isActive ? 'text-black' : 'text-current'} />
      
      {/* Label - hidden on very small screens if needed, but keeping for now */}
      <span className="text-sm tracking-wide hidden md:inline-block">
        {label}
      </span>
      
      {/* Mobile-only dot for active state if text is hidden (optional logic, but simple here) */}
      {isActive && <div className="md:hidden w-1 h-1 bg-black rounded-full absolute bottom-1 left-1/2 -translate-x-1/2" />}
    </button>
  );
};