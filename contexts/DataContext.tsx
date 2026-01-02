import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Skill, PersonalInfo, Testimonial } from '../types';
import { PROJECTS, SKILLS, TESTIMONIALS, PERSONAL_INFO } from '../constants';

interface DataContextType {
  personalInfo: PersonalInfo;
  projects: Project[];
  skills: Skill[];
  testimonials: Testimonial[];
  messages: any[]; // For demo mail
  updatePersonalInfo: (info: PersonalInfo) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addSkill: (skill: Skill) => void;
  deleteSkill: (id: string) => void;
  addTestimonial: (t: Testimonial) => void;
  deleteTestimonial: (id: string) => void;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from constants (Simulating Database Fetch)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(PERSONAL_INFO);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [skills, setSkills] = useState<Skill[]>(SKILLS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [messages, setMessages] = useState<any[]>([
    { id: 1, from: 'client@google.com', subject: 'Project Inquiry', date: '2023-10-15', read: false },
    { id: 2, from: 'recruiter@meta.com', subject: 'Job Opportunity', date: '2023-10-14', read: true },
  ]);

  const updatePersonalInfo = (info: PersonalInfo) => setPersonalInfo(info);

  const addProject = (project: Project) => setProjects([...projects, project]);
  
  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteProject = (id: string) => setProjects(projects.filter(p => p.id !== id));

  const addSkill = (skill: Skill) => setSkills([...skills, skill]);
  
  const deleteSkill = (id: string) => setSkills(skills.filter(s => s.id !== id));

  const addTestimonial = (t: Testimonial) => setTestimonials([...testimonials, t]);
  
  const deleteTestimonial = (id: string) => setTestimonials(testimonials.filter(t => t.id !== id));

  const resetToDefaults = () => {
    setPersonalInfo(PERSONAL_INFO);
    setProjects(PROJECTS);
    setSkills(SKILLS);
    setTestimonials(TESTIMONIALS);
  };

  return (
    <DataContext.Provider value={{
      personalInfo, projects, skills, testimonials, messages,
      updatePersonalInfo, addProject, updateProject, deleteProject,
      addSkill, deleteSkill, addTestimonial, deleteTestimonial, resetToDefaults
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};