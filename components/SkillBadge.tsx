import React from 'react';

export const SkillBadge: React.FC<{ skill: string }> = ({ skill }) => (
  <span className="px-3 py-1 bg-white/10 text-white/90 text-sm rounded-full border border-white/5 font-medium hover:bg-white/20 transition-colors cursor-default">
    {skill}
  </span>
);
