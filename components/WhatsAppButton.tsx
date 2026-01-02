import React from 'react';
import { MessageCircle } from 'lucide-react';
import { GlassPane } from './GlassPane';

export const WhatsAppButton: React.FC = () => {
  // Replace with actual phone number
  const phoneNumber = "1234567890"; 
  const message = encodeURIComponent("Hello! I'm interested in your work.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 left-8 z-[90] group"
      aria-label="Chat on WhatsApp"
    >
      <GlassPane className="flex items-center gap-3 px-5 py-3 !rounded-full bg-white/80 dark:bg-black/40 hover:scale-105 transition-all duration-300 shadow-xl border border-white/20" interactive darker>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <MessageCircle size={20} className="text-slate-900 dark:text-white" />
        <span className="text-sm font-medium text-slate-900 dark:text-white">Chat on WhatsApp</span>
      </GlassPane>
    </a>
  );
};