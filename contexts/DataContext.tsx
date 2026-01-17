
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Skill, PersonalInfo, Testimonial, AppSettings, Meeting, Notification } from '../types';
import { PROJECTS, SKILLS, TESTIMONIALS, PERSONAL_INFO } from '../constants';

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
  
  sendEmail: (to: string, subject: string, body: string) => void; // Simulation
  markMessageRead: (id: number) => void;
  
  pushNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
  
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(PERSONAL_INFO);
  
  // Map projects to have a default status and new PM fields if missing
  const [projects, setProjects] = useState<Project[]>(PROJECTS.map(p => ({
    ...p, 
    status: p.status || 'done',
    priority: p.priority || 'medium',
    budget: p.budget || 0,
    dueDate: p.dueDate || ''
  })));
  
  const [skills, setSkills] = useState<Skill[]>(SKILLS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  
  const [messages, setMessages] = useState<any[]>([
    { id: 1, from: 'client@google.com', subject: 'Project Inquiry', date: '2023-10-15', read: false, body: "Hi, we love your work. Are you available?" },
    { id: 2, from: 'recruiter@meta.com', subject: 'Job Opportunity', date: '2023-10-14', read: true, body: "We have an opening for a Senior Dev." },
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

  // --- Actions ---

  const pushNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    // Auto remove after 3 seconds
    setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updatePersonalInfo = (info: PersonalInfo) => {
    setPersonalInfo(info);
    pushNotification('success', 'Profile updated successfully');
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    pushNotification('success', 'System settings saved');
  };

  const addProject = (project: Project) => {
    setProjects([...projects, project]);
    pushNotification('success', 'New project created');
  };
  
  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    pushNotification('success', 'Project updated');
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    pushNotification('info', 'Project deleted');
  };

  const addSkill = (skill: Skill) => setSkills([...skills, skill]);
  const deleteSkill = (id: string) => setSkills(skills.filter(s => s.id !== id));

  const addTestimonial = (t: Testimonial) => {
      setTestimonials([...testimonials, t]);
      pushNotification('success', 'Testimonial added');
  }
  
  const updateTestimonial = (updatedT: Testimonial) => {
      setTestimonials(testimonials.map(t => t.id === updatedT.id ? updatedT : t));
      pushNotification('success', 'Testimonial updated');
  };

  const deleteTestimonial = (id: string) => {
      setTestimonials(testimonials.filter(t => t.id !== id));
      pushNotification('info', 'Testimonial removed');
  }

  const addMeeting = (m: Meeting) => {
      setMeetings([...meetings, m]);
      pushNotification('success', 'Meeting scheduled');
  };
  
  const deleteMeeting = (id: string) => {
      setMeetings(meetings.filter(m => m.id !== id));
      pushNotification('info', 'Meeting cancelled');
  };

  const sendEmail = (to: string, subject: string, body: string) => {
      // Simulate SMTP check
      if(!settings.smtpUser || !settings.smtpPass) {
          pushNotification('error', 'SMTP Credentials missing in Settings');
          return;
      }
      
      // Simulate sending delay
      setTimeout(() => {
          // Add to sent messages (mock)
          pushNotification('success', `Email sent to ${to} via ${settings.smtpHost}`);
      }, 1000);
  };

  const markMessageRead = (id: number) => {
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const resetToDefaults = () => {
    setPersonalInfo(PERSONAL_INFO);
    setProjects(PROJECTS.map(p => ({
        ...p, 
        status: 'done',
        priority: 'medium',
        budget: 0,
        dueDate: ''
    })));
    setSkills(SKILLS);
    setTestimonials(TESTIMONIALS);
    pushNotification('info', 'System reset to defaults');
  };

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
