import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { GlassPane } from '../components/GlassPane';
import { 
    LayoutDashboard, Briefcase, Mail, Settings, LogOut, 
    Plus, Trash2, Edit2, Save, X, Calendar, User, 
    MessageSquare, Layers, Search, Send, Bell, CheckCircle, AlertCircle,
    DollarSign, Clock, TrendingUp, MoreVertical, ExternalLink, ChevronRight
} from 'lucide-react';
import { Project, Testimonial, Meeting } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
}

// --- Vision OS Design Components ---

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// Fixed children to be optional to resolve JSX type errors when children evaluate to null/false conditionally
const VisionModal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <GlassPane className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-white/40 dark:border-white/10 !rounded-[40px]" darker>
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </div>
            </GlassPane>
        </div>
    );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'messages' | 'testimonials' | 'calendar' | 'settings'>('dashboard');
  
  const { 
    personalInfo, projects, messages, meetings, testimonials, notifications,
    updateProject, addProject, deleteProject, markMessageRead, sendEmail, 
    addMeeting, deleteMeeting, addTestimonial, updateTestimonial, deleteTestimonial,
    removeNotification
  } = useData();

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});

  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingForm, setMeetingForm] = useState<Partial<Meeting>>({});

  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>({});

  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);

  // --- Handlers ---

  const handleStatusChange = (p: Project, newStatus: Project['status']) => {
      updateProject({ ...p, status: newStatus });
  };

  const handleSaveProject = () => {
      if (editingProject) {
          updateProject({ ...editingProject, ...projectForm } as Project);
      } else {
          addProject({ ...projectForm, id: Date.now().toString(), tags: ['New'] } as Project);
      }
      setIsProjectModalOpen(false);
  };

  const handleSaveMeeting = () => {
      addMeeting({ ...meetingForm, id: Date.now().toString() } as Meeting);
      setIsMeetingModalOpen(false);
      setMeetingForm({});
  };

  const handleSaveTestimonial = () => {
      if (editingTestimonial) {
          updateTestimonial({ ...editingTestimonial, ...testimonialForm } as Testimonial);
      } else {
          addTestimonial({ ...testimonialForm, id: Date.now().toString(), avatar: `https://ui-avatars.com/api/?name=${testimonialForm.name}` } as Testimonial);
      }
      setIsTestimonialModalOpen(false);
      setEditingTestimonial(null);
      setTestimonialForm({});
  };

  // --- Render Functions ---

  const renderSidebarItem = (id: typeof activeTab, icon: any, label: string) => (
      <button
        onClick={() => setActiveTab(id)}
        className={cn(
            "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
            activeTab === id 
                ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-xl" 
                : "text-slate-500 dark:text-white/60 hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
        )}
      >
          {React.createElement(icon, { size: 20, className: "group-hover:scale-110 transition-transform" })}
          <span className="font-medium hidden lg:inline">{label}</span>
      </button>
  );

  return (
    <div className="fixed inset-0 z-[200] flex font-sans text-slate-900 dark:text-white bg-slate-100 dark:bg-black overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Sidebar */}
      <GlassPane className="w-20 lg:w-72 m-6 !rounded-[40px] flex flex-col border-white/20 dark:border-white/10 shadow-2xl z-10" darker>
          <div className="p-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">V</div>
              <span className="text-xl font-bold hidden lg:inline">Admin</span>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
              {renderSidebarItem('dashboard', LayoutDashboard, 'Dashboard')}
              {renderSidebarItem('projects', Briefcase, 'Projects')}
              {renderSidebarItem('messages', Mail, 'Inbox')}
              {renderSidebarItem('testimonials', MessageSquare, 'Testimonials')}
              {renderSidebarItem('calendar', Calendar, 'Events')}
              {renderSidebarItem('settings', Settings, 'Settings')}
          </nav>

          <div className="p-6">
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-colors"
              >
                  <LogOut size={20} />
                  <span className="font-medium hidden lg:inline">Sign Out</span>
              </button>
          </div>
      </GlassPane>

      {/* Content Area */}
      <main className="flex-1 m-6 ml-0 overflow-y-auto custom-scrollbar relative z-10">
          <header className="flex justify-between items-center mb-8 px-4">
              <h2 className="text-3xl font-bold capitalize">{activeTab}</h2>
              <div className="flex items-center gap-4">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input className="bg-white/50 dark:bg-white/5 border border-white/20 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:w-64 transition-all" placeholder="Search..." />
                  </div>
                  <button className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-white/60">
                      <Bell size={20} />
                  </button>
                  <img src={personalInfo.avatar} className="w-10 h-10 rounded-full border-2 border-white/40 shadow-lg" alt="" />
              </div>
          </header>

          <div className="px-4 pb-12">
              {/* Tabs Content */}
              {activeTab === 'dashboard' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                          { label: 'Total Revenue', value: '$24,500', icon: DollarSign, color: 'text-green-500' },
                          { label: 'Active Projects', value: projects.filter(p => p.status === 'in-progress').length, icon: Briefcase, color: 'text-blue-500' },
                          { label: 'Unread Mail', value: messages.filter(m => !m.read).length, icon: Mail, color: 'text-purple-500' },
                          { label: 'Client Satisfaction', value: '4.9/5', icon: TrendingUp, color: 'text-orange-500' },
                      ].map((stat, i) => (
                          <GlassPane key={i} className="p-6 flex flex-col justify-between h-32" darker interactive>
                              <div className="flex justify-between items-start">
                                  <span className="text-sm font-medium text-slate-500 dark:text-white/40">{stat.label}</span>
                                  <stat.icon size={20} className={stat.color} />
                              </div>
                              <span className="text-3xl font-bold">{stat.value}</span>
                          </GlassPane>
                      ))}
                  </div>
              )}

              {activeTab === 'projects' && (
                  <div className="space-y-6">
                      <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold">Manage Portfolio</h3>
                          <button onClick={() => { setEditingProject(null); setProjectForm({}); setIsProjectModalOpen(true); }} className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold flex items-center gap-2">
                              <Plus size={18} /> Add New
                          </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {projects.map(p => (
                              <GlassPane key={p.id} className="p-6 flex flex-col gap-4" darker interactive>
                                  <div className="flex justify-between items-start">
                                      <h4 className="text-lg font-bold">{p.title}</h4>
                                      <div className="flex gap-2">
                                          <button onClick={() => { setEditingProject(p); setProjectForm(p); setIsProjectModalOpen(true); }} className="p-2 rounded-lg hover:bg-white/10"><Edit2 size={16}/></button>
                                          <button onClick={() => deleteProject(p.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-500"><Trash2 size={16}/></button>
                                      </div>
                                  </div>
                                  <p className="text-sm text-slate-500 dark:text-white/50 line-clamp-2">{p.description}</p>
                                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                                      <select 
                                        className="bg-white/10 dark:bg-black/20 text-xs px-3 py-1.5 rounded-full border-none outline-none"
                                        value={p.status}
                                        onChange={(e) => handleStatusChange(p, e.target.value as Project['status'])}
                                      >
                                          <option value="idea">Idea</option>
                                          <option value="todo">Todo</option>
                                          <option value="in-progress">In Progress</option>
                                          <option value="done">Done</option>
                                      </select>
                                      <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{p.priority || 'Medium'}</span>
                                  </div>
                              </GlassPane>
                          ))}
                      </div>
                  </div>
              )}

              {activeTab === 'messages' && (
                  <GlassPane className="overflow-hidden" darker>
                      <div className="divide-y divide-white/5">
                          {messages.map(m => (
                              <button 
                                key={m.id} 
                                onClick={() => { setSelectedEmail(m); markMessageRead(m.id); }}
                                className={`w-full p-6 text-left hover:bg-white/5 transition-colors flex items-center gap-4 ${!m.read ? 'bg-blue-500/5' : ''}`}
                              >
                                  <div className={`w-2 h-2 rounded-full ${!m.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center font-bold">{m.from[0].toUpperCase()}</div>
                                  <div className="flex-1 min-w-0">
                                      <div className="flex justify-between mb-1">
                                          <span className="font-bold text-sm truncate">{m.from}</span>
                                          <span className="text-xs text-slate-500">{m.date}</span>
                                      </div>
                                      <p className="text-xs text-slate-500 truncate">{m.subject}</p>
                                  </div>
                                  <ChevronRight size={16} className="text-slate-500" />
                              </button>
                          ))}
                      </div>
                  </GlassPane>
              )}

              {activeTab === 'testimonials' && (
                  <div className="space-y-6">
                      <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold">Social Proof</h3>
                          <button onClick={() => { setEditingTestimonial(null); setTestimonialForm({}); setIsTestimonialModalOpen(true); }} className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold flex items-center gap-2">
                              <Plus size={18} /> New Review
                          </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {testimonials.map(t => (
                              <GlassPane key={t.id} className="p-8 flex flex-col gap-4 relative group" darker>
                                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => { setEditingTestimonial(t); setTestimonialForm(t); setIsTestimonialModalOpen(true); }} className="p-2 rounded-lg bg-white/10 hover:text-blue-500"><Edit2 size={16}/></button>
                                      <button onClick={() => deleteTestimonial(t.id)} className="p-2 rounded-lg bg-white/10 hover:text-red-500"><Trash2 size={16}/></button>
                                  </div>
                                  <p className="italic text-slate-600 dark:text-white/80">"{t.content}"</p>
                                  <div className="flex items-center gap-4 mt-4">
                                      <img src={t.avatar} className="w-12 h-12 rounded-full border border-white/20" alt="" />
                                      <div>
                                          <div className="font-bold text-sm">{t.name}</div>
                                          <div className="text-xs text-slate-500">{t.role} at {t.company}</div>
                                      </div>
                                  </div>
                              </GlassPane>
                          ))}
                      </div>
                  </div>
              )}

              {activeTab === 'calendar' && (
                  <div className="space-y-6">
                      <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold">Upcoming Meetings</h3>
                          <button onClick={() => { setIsMeetingModalOpen(true); }} className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold flex items-center gap-2">
                              <Plus size={18} /> Schedule
                          </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {meetings.map(m => (
                              <GlassPane key={m.id} className="p-6 flex flex-col gap-4" darker interactive>
                                  <div className="flex justify-between items-center">
                                      <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                                          <Calendar size={24} />
                                      </div>
                                      <button onClick={() => deleteMeeting(m.id)} className="text-red-500/50 hover:text-red-500"><Trash2 size={18} /></button>
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-lg">{m.title}</h4>
                                      <p className="text-sm text-slate-500">{m.date} at {m.time}</p>
                                  </div>
                                  <div className="text-xs text-slate-400 bg-black/10 dark:bg-white/5 p-2 rounded-lg">
                                      {m.attendees}
                                  </div>
                              </GlassPane>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      </main>

      {/* --- MODALS --- */}

      <VisionModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title={editingProject ? 'Edit Project' : 'New Project'}>
          <div className="space-y-6">
              <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Project Title</label>
                  <input className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl p-4 outline-none" value={projectForm.title || ''} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                  <textarea rows={4} className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl p-4 outline-none resize-none" value={projectForm.description || ''} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                      <select className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl p-4 outline-none" value={projectForm.status || 'idea'} onChange={e => setProjectForm({...projectForm, status: e.target.value as any})}>
                          <option value="idea">Idea</option>
                          <option value="todo">Todo</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                      </select>
                  </div>
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Priority</label>
                      <select className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl p-4 outline-none" value={projectForm.priority || 'medium'} onChange={e => setProjectForm({...projectForm, priority: e.target.value as any})}>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                      </select>
                  </div>
              </div>
              <button onClick={handleSaveProject} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold">Save Project</button>
          </div>
      </VisionModal>

      <VisionModal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} title="Schedule Meeting">
          <div className="space-y-6">
              <input placeholder="Meeting Title" className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl p-4 outline-none" value={meetingForm.title || ''} onChange={e => setMeetingForm({...meetingForm, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                  <input type="date" className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl p-4 outline-none" value={meetingForm.date || ''} onChange={e => setMeetingForm({...meetingForm, date: e.target.value})} />
                  <input type="time" className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl p-4 outline-none" value={meetingForm.time || ''} onChange={e => setMeetingForm({...meetingForm, time: e.target.value})} />
              </div>
              <input placeholder="Attendees (Comma separated)" className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl p-4 outline-none" value={meetingForm.attendees || ''} onChange={e => setMeetingForm({...meetingForm, attendees: e.target.value})} />
              <button onClick={handleSaveMeeting} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Confirm Schedule</button>
          </div>
      </VisionModal>

      <VisionModal isOpen={isTestimonialModalOpen} onClose={() => setIsTestimonialModalOpen(false)} title={editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'}>
          <div className="space-y-6">
              <input placeholder="Client Name" className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl p-4 outline-none" value={testimonialForm.name || ''} onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Role" className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl p-4 outline-none" value={testimonialForm.role || ''} onChange={e => setTestimonialForm({...testimonialForm, role: e.target.value})} />
                  <input placeholder="Company" className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl p-4 outline-none" value={testimonialForm.company || ''} onChange={e => setTestimonialForm({...testimonialForm, company: e.target.value})} />
              </div>
              <textarea placeholder="The Review Content" rows={4} className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl p-4 outline-none resize-none" value={testimonialForm.content || ''} onChange={e => setTestimonialForm({...testimonialForm, content: e.target.value})} />
              <button onClick={handleSaveTestimonial} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold">Publish Review</button>
          </div>
      </VisionModal>

      {/* Email Popup Reader */}
      <VisionModal isOpen={!!selectedEmail} onClose={() => setSelectedEmail(null)} title="Read Message">
          {selectedEmail && (
              <div className="space-y-8">
                  <div className="flex justify-between items-start border-b border-white/10 pb-6">
                      <div>
                          <h4 className="text-2xl font-bold mb-1">{selectedEmail.subject}</h4>
                          <p className="text-slate-500">From: <span className="text-blue-500">{selectedEmail.from}</span></p>
                      </div>
                      <span className="text-xs text-slate-500">{selectedEmail.date}</span>
                  </div>
                  <div className="text-lg leading-relaxed whitespace-pre-wrap min-h-[200px]">
                      {selectedEmail.body}
                  </div>
                  <div className="flex gap-4 pt-4">
                      <button className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold flex items-center justify-center gap-2">
                          <Send size={18}/> Reply
                      </button>
                      <button onClick={() => setSelectedEmail(null)} className="flex-1 py-4 bg-white/10 rounded-2xl font-bold">Close</button>
                  </div>
              </div>
          )}
      </VisionModal>

      {/* Notifications Toasts */}
      <div className="fixed top-6 right-6 z-[400] flex flex-col gap-3 pointer-events-none">
          {notifications.map(n => (
              <GlassPane key={n.id} className="pointer-events-auto px-6 py-4 flex items-center gap-3 !rounded-2xl border-white/20 shadow-2xl animate-in slide-in-from-right duration-300" darker>
                  {n.type === 'success' ? <CheckCircle className="text-green-500" size={18} /> : <AlertCircle className="text-red-500" size={18} />}
                  <span className="text-sm font-medium">{n.message}</span>
                  <button onClick={() => removeNotification(n.id)} className="ml-4 opacity-50"><X size={14}/></button>
              </GlassPane>
          ))}
      </div>

    </div>
  );
};