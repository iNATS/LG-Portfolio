import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { GlassPane } from '../components/GlassPane';
import { LayoutDashboard, FileText, Briefcase, Users, Mail, Settings, LogOut, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'hero' | 'skills' | 'messages'>('overview');
  const { 
    personalInfo, updatePersonalInfo, 
    projects, addProject, deleteProject, 
    skills, addSkill, deleteSkill,
    messages
  } = useData();

  // Simple local state for forms
  const [heroForm, setHeroForm] = useState(personalInfo);

  // --- SUB-COMPONENTS ---

  const SidebarItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === id ? 'bg-white text-black font-semibold' : 'text-white/70 hover:bg-white/10'}`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-white/50 text-sm mb-2">Total Projects</h3>
                        <p className="text-4xl font-bold text-white">{projects.length}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-white/50 text-sm mb-2">Unread Messages</h3>
                        <p className="text-4xl font-bold text-blue-400">{messages.filter(m => !m.read).length}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-white/50 text-sm mb-2">System Status</h3>
                        <p className="text-4xl font-bold text-green-400">Online</p>
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mt-8 mb-4">Recent Inquiries (CRM)</h3>
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-white/50 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4">From</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-sm text-white/80">
                            {messages.map((msg) => (
                                <tr key={msg.id} className="hover:bg-white/5">
                                    <td className="px-6 py-4">{msg.from}</td>
                                    <td className="px-6 py-4">{msg.subject}</td>
                                    <td className="px-6 py-4">{msg.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${msg.read ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                            {msg.read ? 'Processed' : 'New'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );

      case 'hero':
        return (
            <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Hero Section</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-white/50 mb-2">Display Name</label>
                        <input 
                            value={heroForm.name} 
                            onChange={(e) => setHeroForm({...heroForm, name: e.target.value})}
                            className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-white/50 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-white/50 mb-2">Job Title</label>
                        <input 
                            value={heroForm.title} 
                            onChange={(e) => setHeroForm({...heroForm, title: e.target.value})}
                            className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-white/50 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-white/50 mb-2">Bio</label>
                        <textarea 
                            value={heroForm.bio} 
                            onChange={(e) => setHeroForm({...heroForm, bio: e.target.value})}
                            rows={4}
                            className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-white/50 outline-none"
                        />
                    </div>
                    <button 
                        onClick={() => { updatePersonalInfo(heroForm); alert('Saved!'); }}
                        className="px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        );

      case 'projects':
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Manage Projects</h2>
                    <button 
                        onClick={() => {
                            const newP = { 
                                id: Date.now().toString(), 
                                title: "New Project", 
                                description: "Description here...", 
                                tags: ["New"], 
                                imageUrl: "https://picsum.photos/800/600" 
                            };
                            addProject(newP);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                        <Plus size={16} /> Add Project
                    </button>
                </div>
                <div className="grid gap-4">
                    {projects.map(p => (
                        <div key={p.id} className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl">
                            <div className="flex items-center gap-4">
                                <img src={p.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                <div>
                                    <h4 className="font-bold text-white">{p.title}</h4>
                                    <p className="text-xs text-white/50">{p.tags.join(', ')}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-white/50 hover:text-white bg-white/5 rounded-lg"><Edit2 size={16} /></button>
                                <button onClick={() => deleteProject(p.id)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );

      case 'messages':
        return (
            <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-white mb-6">SMTP / Mail Inbox (Demo)</h2>
                 <p className="text-white/50 text-sm mb-6">Connects to your SMTP server to read/reply to emails. Currently in Demo Mode.</p>
                 <div className="space-y-4">
                    {messages.map(m => (
                        <div key={m.id} className={`p-4 rounded-xl border ${m.read ? 'bg-white/5 border-white/5' : 'bg-blue-500/10 border-blue-500/30'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-white">{m.subject}</h4>
                                <span className="text-xs text-white/40">{m.date}</span>
                            </div>
                            <p className="text-sm text-white/70">From: {m.from}</p>
                        </div>
                    ))}
                 </div>
            </div>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] flex text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/50 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">A</div>
            <span className="font-bold text-lg tracking-wide">Admin Panel</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <SidebarItem id="overview" icon={LayoutDashboard} label="Overview" />
          <SidebarItem id="hero" icon={FileText} label="Hero Content" />
          <SidebarItem id="projects" icon={Briefcase} label="Projects" />
          <SidebarItem id="skills" icon={Users} label="Skills & Testimonials" />
          <SidebarItem id="messages" icon={Mail} label="Messages (SMTP)" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-black to-[#0a0a0a]">
        <header className="px-8 py-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-xl z-10">
            <h1 className="text-xl font-bold capitalize">{activeTab}</h1>
            <div className="flex items-center gap-4">
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/30">Secure Connection</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">A</div>
            </div>
        </header>
        <div className="p-8">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};