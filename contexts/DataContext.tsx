
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Skill, PersonalInfo, Testimonial, AppSettings, Meeting, Notification } from '../types';
import { PERSONAL_INFO, PROJECTS, SKILLS_DATA, TESTIMONIALS_DATA } from '../constants';
import { useLanguage } from './LanguageContext';

interface DataContextType {
  personalInfo: PersonalInfo;
  projects: Project[];
  skills: Skill[];
  testimonials: Testimonial[];
  messages: any[]; 
  settings: AppSettings;
  meetings: Meeting[];
  notifications: Notification[];
  
  // Actions
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateSettings: (settings: AppSettings) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addSkill: (skill: Skill) => void;
  deleteSkill: (id: string) => void;
  addTestimonial: (t: Testimonial) => void;
  updateTestimonial: (t: Testimonial) => void;
  deleteTestimonial: (id: string) => void;
  addMeeting: (m: Meeting) => void;
  deleteMeeting: (id: string) => void;
  sendEmail: (to: string, subject: string, body: string) => void;
  markMessageRead: (id: number) => void;
  pushNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  
  // States - Using language-dependent defaults
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(PERSONAL_INFO(language));
  const [projects, setProjects] = useState<Project[]>(PROJECTS(language));
  const [skills, setSkills] = useState<Skill[]>(SKILLS_DATA(language) as any);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS_DATA(language));

  // Sync state when language changes
  useEffect(() => {
    setPersonalInfo(PERSONAL_INFO(language));
    setProjects(PROJECTS(language));
    setSkills(SKILLS_DATA(language) as any);
    setTestimonials(TESTIMONIALS_DATA(language));
  }, [language]);

  const [messages, setMessages] = useState<any[]>([
    { id: 1, from: 'client@google.com', subject: 'Project Inquiry', date: '2023-10-15', read: false, body: "Hi, we love your work. Are you available?" },
  ]);

  const [settings, setSettings] = useState<AppSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    enableNotifications: true,
    siteName: 'VisionFolio'
  });

  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: '1', title: 'Client Sync', date: '2023-11-20', time: '10:00', attendees: 'Alice, Bob', link: 'meet.google.com/abc-defg' }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const pushNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const removeNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const updatePersonalInfo = (info: PersonalInfo) => { setPersonalInfo(info); pushNotification('success', 'Profile updated'); };
  const updateSettings = (newSettings: AppSettings) => { setSettings(newSettings); pushNotification('success', 'Settings saved'); };
  const addProject = (project: Project) => { setProjects([...projects, project]); pushNotification('success', 'Project added'); };
  const updateProject = (updatedProject: Project) => { setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p)); pushNotification('success', 'Project updated'); };
  const deleteProject = (id: string) => { setProjects(projects.filter(p => p.id !== id)); pushNotification('info', 'Project deleted'); };
  const addSkill = (skill: Skill) => setSkills([...skills, skill]);
  const deleteSkill = (id: string) => setSkills(skills.filter(s => s.id !== id));
  const addTestimonial = (t: Testimonial) => { setTestimonials([...testimonials, t]); pushNotification('success', 'Testimonial added'); };
  const updateTestimonial = (updatedT: Testimonial) => { setTestimonials(testimonials.map(t => t.id === updatedT.id ? updatedT : t)); pushNotification('success', 'Testimonial updated'); };
  const deleteTestimonial = (id: string) => { setTestimonials(testimonials.filter(t => t.id !== id)); pushNotification('info', 'Testimonial removed'); };
  const addMeeting = (m: Meeting) => { setMeetings([...meetings, m]); pushNotification('success', 'Meeting scheduled'); };
  const deleteMeeting = (id: string) => { setMeetings(meetings.filter(m => m.id !== id)); pushNotification('info', 'Meeting cancelled'); };
  const sendEmail = (to: string, subject: string, body: string) => { pushNotification('success', `Email simulated to ${to}`); };
  const markMessageRead = (id: number) => { setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m)); };
  const resetToDefaults = () => { pushNotification('info', 'System reset'); };

  return (
    <DataContext.Provider value={{
      personalInfo, projects, skills, testimonials, messages, settings, meetings, notifications,
      updatePersonalInfo, updateSettings, addProject, updateProject, deleteProject,
      addSkill, deleteSkill, addTestimonial, updateTestimonial, deleteTestimonial, addMeeting, deleteMeeting,
      sendEmail, markMessageRead, pushNotification, removeNotification, resetToDefaults
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
