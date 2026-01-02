
import React from 'react';

export const SkillBadge: React.FC<{ skill: string }> = ({ skill }) => (
  <span className="px-3 py-1 bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-white/90 text-sm rounded-full border border-slate-300 dark:border-white/5 font-medium hover:bg-slate-300 dark:hover:bg-white/20 transition-colors cursor-default">
    {skill}
  </span>
);
