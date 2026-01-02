import { useState, useEffect } from 'react';

export const useScrollSpy = (sectionIds: string[], offset: number = 150) => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;
      
      // Default to the first section if at the top
      if (window.scrollY < 50 && sectionIds.length > 0) {
        setActiveSection(sectionIds[0]);
        return;
      }

      // Find the current section
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          // Check if the scroll position is within the section
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
            break; 
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
};