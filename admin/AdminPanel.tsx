
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { 
    LayoutDashboard, Briefcase, Mail, Settings, LogOut, 
    Plus, Trash2, Edit2, Save, X, Calendar, User, 
    MessageSquare, Layers, Search, Send, Bell, CheckCircle, AlertCircle,
    DollarSign, Clock, TrendingUp, BarChart3, PieChart
} from 'lucide-react';
import { Project } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
}

// --- CSS-only Simple Charts ---
const ProgressBar = ({ value, max, color = "bg-blue-500" }: { value: number, max: number, color?: string }) => (
    <div className="w-full bg-white/10 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }}></div>
    </div>
);

// --- Notification Toast ---
const NotificationToast = () => {
    const { notifications, removeNotification } = useData();
    return (
        <div className="fixed top-6 right-6 z-[300] flex flex-col gap-2 pointer-events-none">
            {notifications.map(n => (
                <div 
                    key={n.id} 
                    className={`
                        pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl border
                        animate-[slideIn_0.3s_ease-out]
                        ${n.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : ''}
                        ${n.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : ''}
                        ${n.type === 'info' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : ''}
                    `}
                >
                    {n.type === 'success' && <CheckCircle size={18} />}
                    {n.type === 'error' && <AlertCircle size={18} />}
                    {n.type === 'info' && <Bell size={18} />}
                    <span className="text-sm font-medium text-white">{n.message}</span>
                    <button onClick={() => removeNotification(n.id)} className="ml-2 hover:text-white"><X size={14}/></button>
                </div>
            ))}
        </div>
    );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'pm' | 'reports' | 'messages' | 'meetings' | 'settings'>('overview');
  const { 
    personalInfo, updatePersonalInfo, 
    projects, addProject, updateProject, deleteProject, 
    skills, addSkill, deleteSkill,
    testimonials, addTestimonial, deleteTestimonial,
    messages, markMessageRead, sendEmail,
    meetings, addMeeting, deleteMeeting,
    settings, updateSettings
  } = useData();

  // --- Sub-View States ---
  const [portfolioView, setPortfolioView] = useState<'hero'|'about'|'socials'|'skills'|'testimonials'>('hero');
  const [mailView, setMailView] = useState<'inbox'|'compose'>('inbox');
  const [projectForm, setProjectForm] = useState<Partial<Project>>({ title: '', status: 'idea', priority: 'medium', budget: 0, tags: [], dueDate: '' });
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // --- Forms ---
  const [heroForm, setHeroForm] = useState(personalInfo);
  const [settingsForm, setSettingsForm] = useState(settings);
  const [composeForm, setComposeForm] = useState({ to: '', subject: '', body: '' });
  const [meetingForm, setMeetingForm] = useState({ title: '', date: '', time: '', attendees: '', link: '' });

  // --- Sidebar Component ---
  const SidebarItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${activeTab === id ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  // --- Calculation Helpers ---
  const totalRevenue = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const activeProjects = projects.filter(p => p.status === 'in-progress' || p.status === 'review');
  const completedProjects = projects.filter(p => p.status === 'done');
  const pendingRevenue = activeProjects.reduce((acc, p) => acc + (p.budget || 0), 0);
  
  const deadlines = projects
    .filter(p => p.dueDate && new Date(p.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // --- Render Functions ---

  const renderOverview = () => (
      <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-3xl font-bold text-white">Freelancer Headquarters</h2>
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-green-500/10 to-transparent">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><DollarSign size={20}/></div>
                      <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">+12%</span>
                  </div>
                  <h4 className="text-white/50 text-sm font-medium">Total Pipeline Value</h4>
                  <p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
              </div>

              <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-blue-500/10 to-transparent">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Briefcase size={20}/></div>
                  </div>
                  <h4 className="text-white/50 text-sm font-medium">Active Projects</h4>
                  <p className="text-3xl font-bold text-white">{activeProjects.length}</p>
              </div>

              <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><MessageSquare size={20}/></div>
                  </div>
                  <h4 className="text-white/50 text-sm font-medium">New Inquiries</h4>
                  <p className="text-3xl font-bold text-white">{messages.filter(m => !m.read).length}</p>
              </div>

              <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-orange-500/10 to-transparent">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400"><Clock size={20}/></div>
                  </div>
                  <h4 className="text-white/50 text-sm font-medium">Upcoming Deadlines</h4>
                  <p className="text-3xl font-bold text-white">{deadlines.length}</p>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Deadline Watch */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><AlertCircle size={20} className="text-red-400"/> Critical Deadlines</h3>
                  <div className="space-y-4">
                      {deadlines.length > 0 ? deadlines.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                              <div>
                                  <h4 className="font-bold text-white">{p.title}</h4>
                                  <span className="text-xs text-white/50">{p.clientName || 'Internal'}</span>
                              </div>
                              <div className="text-right">
                                  <div className="text-red-400 font-bold text-sm">{new Date(p.dueDate).toLocaleDateString()}</div>
                                  <span className="text-xs text-white/30 uppercase">Due Date</span>
                              </div>
                          </div>
                      )) : <p className="text-white/30">No upcoming deadlines.</p>}
                  </div>
              </div>

              {/* Client Pipeline / Quick Actions */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => { setActiveTab('pm'); setIsProjectModalOpen(true); }} className="p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 flex flex-col items-center gap-2 transition-colors">
                          <Plus size={24} />
                          <span>New Project</span>
                      </button>
                      <button onClick={() => { setActiveTab('messages'); setMailView('compose'); }} className="p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 flex flex-col items-center gap-2 transition-colors">
                          <Send size={24} />
                          <span>Send Invoice / Email</span>
                      </button>
                      <button onClick={() => setActiveTab('reports')} className="p-4 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 flex flex-col items-center gap-2 transition-colors">
                          <TrendingUp size={24} />
                          <span>View Reports</span>
                      </button>
                      <button onClick={() => setActiveTab('portfolio')} className="p-4 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 flex flex-col items-center gap-2 transition-colors">
                          <Edit2 size={24} />
                          <span>Edit Portfolio</span>
                      </button>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderPM = () => (
      <div className="h-full flex flex-col animate-[fadeIn_0.5s_ease-out]">
          <div className="flex justify-between items-center mb-6">
              <div>
                  <h2 className="text-2xl font-bold text-white">Project Management</h2>
                  <p className="text-white/40 text-sm">Kanban Board & Tracking</p>
              </div>
              <button 
                  onClick={() => setIsProjectModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
              >
                  <Plus size={16} /> Add Task
              </button>
          </div>
          
          {/* Status Distribution Chart (CSS only) */}
          <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10 flex gap-4 items-center">
               <span className="text-xs font-bold text-white/50 uppercase w-24">Project Load</span>
               <div className="flex-1 flex h-4 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${(projects.filter(p=>p.status==='idea'||p.status==='todo').length / projects.length)*100}%` }} title="Idea/Todo" />
                    <div className="bg-yellow-500 h-full" style={{ width: `${(projects.filter(p=>p.status==='in-progress').length / projects.length)*100}%` }} title="In Progress" />
                    <div className="bg-purple-500 h-full" style={{ width: `${(projects.filter(p=>p.status==='review').length / projects.length)*100}%` }} title="Review" />
                    <div className="bg-green-500 h-full" style={{ width: `${(projects.filter(p=>p.status==='done').length / projects.length)*100}%` }} title="Done" />
               </div>
          </div>

          <div className="flex-1 overflow-x-auto">
              <div className="flex gap-6 min-w-[1000px] h-full pb-4">
                  {['idea', 'todo', 'in-progress', 'review', 'done'].map((status) => (
                      <div key={status} className="flex-1 min-w-[280px] bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="uppercase font-bold text-xs text-white/50 tracking-wider flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full 
                                      ${status==='done'?'bg-green-500':status==='in-progress'?'bg-yellow-500':status==='review'?'bg-purple-500':'bg-blue-500'}`} 
                                  />
                                  {status.replace('-', ' ')}
                              </h3>
                              <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full">{projects.filter(p => p.status === status).length}</span>
                          </div>
                          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                              {projects.filter(p => p.status === status).map(p => (
                                  <div key={p.id} className="bg-[#18181b] p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all group shadow-sm hover:shadow-md">
                                      {p.imageUrl && <div className="h-24 w-full rounded-lg bg-cover bg-center mb-3 opacity-80" style={{backgroundImage: `url(${p.imageUrl})`}} />}
                                      <div className="flex justify-between items-start mb-1">
                                          <h4 className="text-white font-bold text-sm">{p.title}</h4>
                                          <span className={`text-[10px] px-1.5 py-0.5 rounded border 
                                              ${p.priority === 'high' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 
                                                p.priority === 'medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' : 
                                                'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                                              {p.priority}
                                          </span>
                                      </div>
                                      <p className="text-white/40 text-xs mb-3 line-clamp-2">{p.description}</p>
                                      <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                          <div className="text-xs text-white/30">{p.dueDate ? new Date(p.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'No date'}</div>
                                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <button onClick={() => deleteProject(p.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderPortfolioCMS = () => (
      <div className="h-full flex flex-col animate-[fadeIn_0.5s_ease-out]">
          <div className="flex gap-4 mb-6 border-b border-white/10 pb-1 overflow-x-auto">
              {['hero', 'about', 'socials', 'skills', 'testimonials'].map((v) => (
                  <button 
                      key={v}
                      onClick={() => setPortfolioView(v as any)}
                      className={`px-4 py-2 text-sm font-medium capitalize transition-colors whitespace-nowrap ${portfolioView === v ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/50 hover:text-white'}`}
                  >
                      {v} Content
                  </button>
              ))}
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
              {portfolioView === 'hero' && (
                  <div className="max-w-2xl space-y-5">
                      <h3 className="text-xl font-bold text-white mb-4">Hero Section & Branding</h3>
                      <div className="space-y-2">
                          <label className="text-xs uppercase text-white/40">Display Name</label>
                          <input value={heroForm.name} onChange={e => setHeroForm({...heroForm, name: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs uppercase text-white/40">Title / Role</label>
                          <input value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs uppercase text-white/40">Avatar URL</label>
                          <div className="flex gap-4">
                              <img src={heroForm.avatar} className="w-12 h-12 rounded-full border border-white/20" alt="Preview"/>
                              <input value={heroForm.avatar} onChange={e => setHeroForm({...heroForm, avatar: e.target.value})} className="flex-1 bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                          </div>
                      </div>
                      <button onClick={() => updatePersonalInfo(heroForm)} className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200"><Save size={16} /> Save Changes</button>
                  </div>
              )}

              {portfolioView === 'about' && (
                  <div className="max-w-2xl space-y-5">
                       <h3 className="text-xl font-bold text-white mb-4">About Me</h3>
                       <div className="space-y-2">
                          <label className="text-xs uppercase text-white/40">Short Bio (Hero)</label>
                          <textarea rows={3} value={heroForm.bio} onChange={e => setHeroForm({...heroForm, bio: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                      </div>
                      <button onClick={() => updatePersonalInfo(heroForm)} className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200"><Save size={16} /> Save Changes</button>
                  </div>
              )}

              {portfolioView === 'socials' && (
                  <div className="max-w-2xl space-y-5">
                      <h3 className="text-xl font-bold text-white mb-4">Contact & Socials</h3>
                      <div className="space-y-2">
                          <label className="text-xs uppercase text-white/40">Email Address</label>
                          <input value={heroForm.email} onChange={e => setHeroForm({...heroForm, email: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs uppercase text-white/40">GitHub URL</label>
                          <input value={heroForm.socials.github} onChange={e => setHeroForm({...heroForm, socials: {...heroForm.socials, github: e.target.value}})} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs uppercase text-white/40">LinkedIn URL</label>
                          <input value={heroForm.socials.linkedin} onChange={e => setHeroForm({...heroForm, socials: {...heroForm.socials, linkedin: e.target.value}})} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                      </div>
                      <button onClick={() => updatePersonalInfo(heroForm)} className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200"><Save size={16} /> Save Changes</button>
                  </div>
              )}

              {portfolioView === 'skills' && (
                  <div>
                      <div className="flex justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">Skill Set</h3>
                          <button 
                             onClick={() => addSkill({ id: Date.now().toString(), name: 'New Skill', category: 'Tools & Platforms' })}
                             className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
                          >+ Add Skill</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {skills.map(skill => (
                              <div key={skill.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg group">
                                  <span className="text-white">{skill.name}</span>
                                  <button onClick={() => deleteSkill(skill.id)} className="text-white/20 hover:text-red-400"><X size={16}/></button>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

               {portfolioView === 'testimonials' && (
                  <div>
                      <div className="flex justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">Client Testimonials</h3>
                      </div>
                      <div className="grid gap-4">
                          {testimonials.map(t => (
                              <div key={t.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                  <p className="text-white/70 italic mb-3">"{t.content}"</p>
                                  <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                          <img src={t.avatar} className="w-8 h-8 rounded-full" alt="" />
                                          <div>
                                              <div className="text-sm font-bold text-white">{t.name}</div>
                                              <div className="text-xs text-white/40">{t.role}, {t.company}</div>
                                          </div>
                                      </div>
                                      <button onClick={() => deleteTestimonial(t.id)} className="text-red-400 hover:bg-red-500/10 p-2 rounded"><Trash2 size={16}/></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      </div>
  );

  const renderReports = () => (
      <div className="h-full animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-2xl font-bold text-white mb-8">Business Reports</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Financial Report */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><DollarSign size={18} className="text-green-400"/> Financial Summary</h3>
                  <div className="space-y-6">
                      <div>
                          <div className="flex justify-between mb-2">
                              <span className="text-white/60 text-sm">Revenue Realized (Completed)</span>
                              <span className="text-white font-bold">${(totalRevenue - pendingRevenue).toLocaleString()}</span>
                          </div>
                          <ProgressBar value={totalRevenue - pendingRevenue} max={totalRevenue} color="bg-green-500" />
                      </div>
                      <div>
                          <div className="flex justify-between mb-2">
                              <span className="text-white/60 text-sm">Pipeline Value (Active)</span>
                              <span className="text-white font-bold">${pendingRevenue.toLocaleString()}</span>
                          </div>
                          <ProgressBar value={pendingRevenue} max={totalRevenue} color="bg-blue-500" />
                      </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10 flex justify-between">
                      <span className="text-white/40 text-sm">Average Project Value</span>
                      <span className="text-white font-bold">${projects.length > 0 ? Math.round(totalRevenue / projects.length).toLocaleString() : 0}</span>
                  </div>
              </div>

              {/* Workload Report */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Briefcase size={18} className="text-blue-400"/> Workload Distribution</h3>
                   <div className="space-y-4">
                       <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                           <span className="text-white/70">Development</span>
                           <span className="text-white font-bold">65%</span>
                       </div>
                       <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                           <span className="text-white/70">Design</span>
                           <span className="text-white font-bold">25%</span>
                       </div>
                       <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                           <span className="text-white/70">Meetings & Admin</span>
                           <span className="text-white font-bold">10%</span>
                       </div>
                   </div>
              </div>
          </div>
          
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
               <h3 className="text-lg font-bold text-white mb-4">Client Acquisition</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="text-center p-4">
                       <div className="text-4xl font-bold text-white mb-1">{messages.length}</div>
                       <div className="text-xs text-white/40 uppercase">Total Inquiries</div>
                   </div>
                   <div className="text-center p-4 border-l border-white/10">
                       <div className="text-4xl font-bold text-green-400 mb-1">{activeProjects.length + completedProjects.length}</div>
                       <div className="text-xs text-white/40 uppercase">Projects Won</div>
                   </div>
                   <div className="text-center p-4 border-l border-white/10">
                       <div className="text-4xl font-bold text-blue-400 mb-1">
                           {messages.length > 0 ? Math.round(((activeProjects.length + completedProjects.length) / messages.length) * 100) : 0}%
                       </div>
                       <div className="text-xs text-white/40 uppercase">Conversion Rate</div>
                   </div>
               </div>
          </div>
      </div>
  );

  const renderMessages = () => (
      <div className="h-full flex flex-col animate-[fadeIn_0.5s_ease-out]">
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Mail Client</h2>
              <div className="flex bg-white/5 rounded-lg p-1">
                  <button onClick={() => setMailView('inbox')} className={`px-3 py-1 rounded text-sm ${mailView === 'inbox' ? 'bg-white/10 text-white' : 'text-white/50'}`}>Inbox</button>
                  <button onClick={() => setMailView('compose')} className={`px-3 py-1 rounded text-sm ${mailView === 'compose' ? 'bg-white/10 text-white' : 'text-white/50'}`}>Compose</button>
              </div>
          </div>

          {mailView === 'inbox' ? (
              <div className="space-y-2">
                  {messages.map(m => (
                      <div key={m.id} onClick={() => markMessageRead(m.id)} className={`p-4 rounded-xl border cursor-pointer transition-colors ${m.read ? 'bg-transparent border-white/5 text-white/60' : 'bg-blue-500/5 border-blue-500/30 text-white'}`}>
                          <div className="flex justify-between mb-1">
                              <span className="font-bold text-sm">{m.from}</span>
                              <span className="text-xs opacity-50">{m.date}</span>
                          </div>
                          <h4 className="font-medium text-sm mb-1">{m.subject}</h4>
                          <p className="text-xs opacity-70 truncate">{m.body || "No preview available..."}</p>
                      </div>
                  ))}
              </div>
          ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1 flex flex-col gap-4">
                  <div className="text-xs text-white/40 uppercase tracking-widest">Sending via {settings.smtpHost}</div>
                  <input placeholder="To:" className="bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" value={composeForm.to} onChange={e => setComposeForm({...composeForm, to: e.target.value})} />
                  <input placeholder="Subject:" className="bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" value={composeForm.subject} onChange={e => setComposeForm({...composeForm, subject: e.target.value})} />
                  <textarea placeholder="Message..." className="bg-transparent flex-1 p-2 text-white outline-none resize-none" value={composeForm.body} onChange={e => setComposeForm({...composeForm, body: e.target.value})} />
                  <div className="flex justify-end">
                      <button onClick={() => { sendEmail(composeForm.to, composeForm.subject, composeForm.body); setMailView('inbox'); setComposeForm({to:'', subject:'', body:''}); }} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
                          <Send size={16} /> Send Email
                      </button>
                  </div>
              </div>
          )}
      </div>
  );

  const renderMeetings = () => (
      <div className="h-full animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-2xl font-bold text-white mb-6">Schedule Meeting</h2>
          <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Plus size={18}/> New Event</h3>
                  <div className="space-y-3">
                      <input placeholder="Meeting Title" className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" value={meetingForm.title} onChange={e => setMeetingForm({...meetingForm, title: e.target.value})} />
                      <div className="flex gap-3">
                        <input type="date" className="flex-1 bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" value={meetingForm.date} onChange={e => setMeetingForm({...meetingForm, date: e.target.value})} />
                        <input type="time" className="flex-1 bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" value={meetingForm.time} onChange={e => setMeetingForm({...meetingForm, time: e.target.value})} />
                      </div>
                      <input placeholder="Attendees (comma separated)" className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" value={meetingForm.attendees} onChange={e => setMeetingForm({...meetingForm, attendees: e.target.value})} />
                      <button onClick={() => { addMeeting({...meetingForm, id: Date.now().toString()}); setMeetingForm({title:'', date:'', time:'', attendees:'', link:''}); }} className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500">Add to Calendar</button>
                  </div>
              </div>

              <div className="flex-1 space-y-4">
                  {meetings.map(m => (
                      <div key={m.id} className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-xl items-center">
                          <div className="w-12 h-12 bg-white/10 rounded-lg flex flex-col items-center justify-center text-white">
                              <span className="text-xs uppercase font-bold">{new Date(m.date).toLocaleString('default', { month: 'short' })}</span>
                              <span className="text-lg font-bold">{new Date(m.date).getDate()}</span>
                          </div>
                          <div className="flex-1">
                              <h4 className="font-bold text-white">{m.title}</h4>
                              <p className="text-xs text-white/50">{m.time} • {m.attendees}</p>
                          </div>
                          <button onClick={() => deleteMeeting(m.id)} className="text-white/20 hover:text-red-400"><Trash2 size={18}/></button>
                      </div>
                  ))}
                  {meetings.length === 0 && <p className="text-white/30 text-center py-8">No upcoming meetings.</p>}
              </div>
          </div>
      </div>
  );

  const renderSettings = () => (
      <div className="max-w-2xl animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-2xl font-bold text-white mb-2">System Settings</h2>
          <p className="text-white/50 text-sm mb-8">Configure external services and system behavior.</p>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Mail size={18}/> SMTP Configuration (Gmail)</h3>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <label className="text-xs uppercase text-white/40">SMTP Host</label>
                          <input value={settingsForm.smtpHost} onChange={e => setSettingsForm({...settingsForm, smtpHost: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs uppercase text-white/40">Port</label>
                          <input value={settingsForm.smtpPort} onChange={e => setSettingsForm({...settingsForm, smtpPort: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" />
                      </div>
                      <div className="space-y-2 col-span-2">
                          <label className="text-xs uppercase text-white/40">Username / Email</label>
                          <input value={settingsForm.smtpUser} onChange={e => setSettingsForm({...settingsForm, smtpUser: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" placeholder="you@gmail.com" />
                      </div>
                      <div className="space-y-2 col-span-2">
                          <label className="text-xs uppercase text-white/40">App Password</label>
                          <input type="password" value={settingsForm.smtpPass} onChange={e => setSettingsForm({...settingsForm, smtpPass: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" placeholder="xxxx xxxx xxxx xxxx" />
                      </div>
                  </div>
                  <p className="text-xs text-white/30 mt-2">* Use an App Password for Gmail if 2FA is enabled.</p>
              </div>

              <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                      <div>
                          <h4 className="text-white font-bold">Enable Notifications</h4>
                          <p className="text-xs text-white/50">Show system toasts for actions.</p>
                      </div>
                      <button 
                        onClick={() => setSettingsForm({...settingsForm, enableNotifications: !settingsForm.enableNotifications})}
                        className={`w-12 h-6 rounded-full transition-colors relative ${settingsForm.enableNotifications ? 'bg-green-500' : 'bg-white/20'}`}
                      >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settingsForm.enableNotifications ? 'left-7' : 'left-1'}`} />
                      </button>
                  </div>
              </div>

              <div className="pt-6 flex justify-end">
                  <button onClick={() => updateSettings(settingsForm)} className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200">
                      <Save size={18} /> Save Configuration
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 z-[200] bg-[#09090b] flex text-white font-sans selection:bg-blue-500/30">
      <NotificationToast />

      {/* Sidebar */}
      <div className="w-72 border-r border-white/10 bg-[#0c0c0e] flex flex-col">
        <div className="p-6">
            <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">V</div>
                <span className="font-bold text-lg tracking-wide">Vision Admin</span>
            </div>
            <span className="text-xs text-white/30 ml-11">v3.1.0 Freelance OS</span>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 px-4 mt-4">Main</div>
          <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="reports" icon={TrendingUp} label="Reports" />
          
          <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 px-4 mt-6">Work</div>
          <SidebarItem id="pm" icon={Briefcase} label="Projects" />
          <SidebarItem id="meetings" icon={Calendar} label="Meetings" />
          <SidebarItem id="messages" icon={Mail} label="Inbox" />
          
          <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 px-4 mt-6">Site</div>
          <SidebarItem id="portfolio" icon={Layers} label="CMS" />
          <SidebarItem id="settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
              <div>
                  <div className="text-sm font-bold">Admin User</div>
                  <div className="text-xs text-white/40">Super Admin</div>
              </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-medium"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-[#09090b] to-black overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex justify-between items-center px-8 bg-white/[0.02] backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold capitalize tracking-tight text-white/90">{activeTab.replace('pm', 'Projects')}</h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                    <input placeholder="Search..." className="bg-black/20 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white/60 focus:border-white/30 outline-none w-64 transition-all focus:w-80" />
                </div>
                <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                    <Bell size={14} />
                </button>
            </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'portfolio' && renderPortfolioCMS()}
            {activeTab === 'pm' && renderPM()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'messages' && renderMessages()}
            {activeTab === 'meetings' && renderMeetings()}
            {activeTab === 'settings' && renderSettings()}
        </div>
      </div>

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Add New Project</h3>
                    <button onClick={() => setIsProjectModalOpen(false)} className="text-white/50 hover:text-white"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                    <input placeholder="Project Title" className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                    <textarea placeholder="Description" className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" rows={3} value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <select className="bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" value={projectForm.priority} onChange={e => setProjectForm({...projectForm, priority: e.target.value as any})}>
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                         <select className="bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value as any})}>
                            <option value="idea">Idea</option>
                            <option value="todo">Todo</option>
                            <option value="in-progress">In Progress</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-white/40 uppercase">Budget ($)</label>
                            <input type="number" className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" value={projectForm.budget} onChange={e => setProjectForm({...projectForm, budget: parseInt(e.target.value)})} />
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs text-white/40 uppercase">Due Date</label>
                            <input type="date" className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" value={projectForm.dueDate} onChange={e => setProjectForm({...projectForm, dueDate: e.target.value})} />
                        </div>
                    </div>
                     <input placeholder="Image URL (e.g. https://picsum.photos/800/600)" className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none" value={projectForm.imageUrl} onChange={e => setProjectForm({...projectForm, imageUrl: e.target.value})} />
                    <button 
                        onClick={() => {
                            addProject({ ...projectForm, id: Date.now().toString(), tags: ['New'] } as Project);
                            setIsProjectModalOpen(false);
                            setProjectForm({ title: '', status: 'idea', priority: 'medium', budget: 0, tags: [], dueDate: '' });
                        }}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 mt-2"
                    >
                        Create Project
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
