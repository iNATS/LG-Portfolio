
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { GlassPane } from '../components/GlassPane';
import { 
    LayoutDashboard, Briefcase, Mail, Settings, LogOut, 
    Plus, Trash2, Edit2, Save, X, Calendar, User, 
    MessageSquare, Layers, Search, Send, Bell, CheckCircle, AlertCircle 
} from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
}

// --- Notification Toast Component ---
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
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'pm' | 'messages' | 'meetings' | 'settings'>('overview');
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
  const [portfolioView, setPortfolioView] = useState<'hero'|'skills'|'testimonials'>('hero');
  const [mailView, setMailView] = useState<'inbox'|'compose'>('inbox');
  
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

  // --- Render Logic ---

  const renderOverview = () => (
      <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                  { label: "Active Projects", val: projects.length, color: "text-blue-400", bg: "bg-blue-500/10" },
                  { label: "Unread Messages", val: messages.filter(m => !m.read).length, color: "text-purple-400", bg: "bg-purple-500/10" },
                  { label: "Upcoming Meetings", val: meetings.length, color: "text-green-400", bg: "bg-green-500/10" },
                  { label: "Total Skills", val: skills.length, color: "text-orange-400", bg: "bg-orange-500/10" },
              ].map((stat, i) => (
                  <div key={i} className={`p-6 rounded-2xl border border-white/5 ${stat.bg}`}>
                      <h4 className="text-white/50 text-sm font-medium mb-2">{stat.label}</h4>
                      <p className={`text-4xl font-bold ${stat.color}`}>{stat.val}</p>
                  </div>
              ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="flex gap-4">
                      <button onClick={() => { setActiveTab('pm'); }} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center gap-2 text-white transition-colors">
                          <Plus size={24} className="text-blue-400" />
                          <span className="text-sm">New Project</span>
                      </button>
                      <button onClick={() => { setActiveTab('meetings'); }} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center gap-2 text-white transition-colors">
                          <Calendar size={24} className="text-green-400" />
                          <span className="text-sm">Schedule</span>
                      </button>
                      <button onClick={() => { setActiveTab('messages'); setMailView('compose'); }} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center gap-2 text-white transition-colors">
                          <Mail size={24} className="text-purple-400" />
                          <span className="text-sm">Send Email</span>
                      </button>
                  </div>
              </div>

              {/* System Health */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
                  <div className="space-y-4">
                      <div className="flex justify-between items-center">
                          <span className="text-white/60">SMTP Connection</span>
                          <span className={`px-2 py-1 rounded text-xs ${settings.smtpUser ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {settings.smtpUser ? 'Configured' : 'Missing Config'}
                          </span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-white/60">Portfolio Visibility</span>
                          <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">Public</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-white/60">Last Backup</span>
                          <span className="text-xs text-white/40">Just now</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderPortfolioCMS = () => (
      <div className="h-full flex flex-col animate-[fadeIn_0.5s_ease-out]">
          <div className="flex gap-4 mb-6 border-b border-white/10 pb-1">
              {['hero', 'skills', 'testimonials'].map((v) => (
                  <button 
                      key={v}
                      onClick={() => setPortfolioView(v as any)}
                      className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${portfolioView === v ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/50 hover:text-white'}`}
                  >
                      {v} Content
                  </button>
              ))}
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
              {portfolioView === 'hero' && (
                  <div className="max-w-2xl space-y-5">
                      <h3 className="text-xl font-bold text-white mb-4">Hero Section Details</h3>
                      <div className="space-y-2">
                          <label className="text-xs uppercase text-white/40">Display Name</label>
                          <input value={heroForm.name} onChange={e => setHeroForm({...heroForm, name: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs uppercase text-white/40">Title / Role</label>
                          <input value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs uppercase text-white/40">Bio</label>
                          <textarea rows={4} value={heroForm.bio} onChange={e => setHeroForm({...heroForm, bio: e.target.value})} className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
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

  const renderPM = () => (
      <div className="h-full flex flex-col animate-[fadeIn_0.5s_ease-out]">
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Project Management</h2>
              <button 
                  onClick={() => addProject({ id: Date.now().toString(), title: "New Task", description: "Details...", tags: ["Web"], imageUrl: "https://picsum.photos/800/600", status: 'idea' })}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
              >
                  <Plus size={16} /> Add Task
              </button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
              <div className="flex gap-6 min-w-[800px] h-full pb-4">
                  {['idea', 'in-progress', 'done'].map((status) => (
                      <div key={status} className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="uppercase font-bold text-xs text-white/50 tracking-wider">{status.replace('-', ' ')}</h3>
                              <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full">{projects.filter(p => p.status === status).length}</span>
                          </div>
                          <div className="flex-1 overflow-y-auto space-y-3">
                              {projects.filter(p => p.status === status).map(p => (
                                  <div key={p.id} className="bg-[#111] p-3 rounded-xl border border-white/10 hover:border-white/30 transition-colors group">
                                      <h4 className="text-white font-medium text-sm mb-1">{p.title}</h4>
                                      <div className="flex justify-between items-center mt-3">
                                          <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded">{p.tags[0]}</span>
                                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                              {status !== 'done' && <button onClick={() => updateProject({...p, status: status === 'idea' ? 'in-progress' : 'done'})} className="p-1.5 bg-green-500/20 text-green-400 rounded"><CheckCircle size={12}/></button>}
                                              <button onClick={() => deleteProject(p.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded"><Trash2 size={12}/></button>
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
            <span className="text-xs text-white/30 ml-11">v2.0.0 Pro</span>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 px-4 mt-4">Main</div>
          <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="portfolio" icon={Layers} label="Portfolio Manager" />
          
          <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 px-4 mt-6">Work</div>
          <SidebarItem id="pm" icon={Briefcase} label="Projects & Tasks" />
          <SidebarItem id="meetings" icon={Calendar} label="Meetings" />
          
          <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 px-4 mt-6">System</div>
          <SidebarItem id="messages" icon={Mail} label="Inbox & SMTP" />
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
                <h1 className="text-lg font-semibold capitalize tracking-tight text-white/90">{activeTab.replace('pm', 'Project Management')}</h1>
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
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'portfolio' && renderPortfolioCMS()}
            {activeTab === 'pm' && renderPM()}
            {activeTab === 'messages' && renderMessages()}
            {activeTab === 'meetings' && renderMeetings()}
            {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};
