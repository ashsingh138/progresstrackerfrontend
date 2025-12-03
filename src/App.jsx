import React, { useState, useEffect } from "react";
import { TrendingUp, Plus, Target, Calendar, Clock, BarChart2, Layout, Settings, Menu, X, Moon, Sun, Search, Archive, AlertTriangle, User, LogOut } from "lucide-react";

import TargetCard from "./components/TargetCard";
import AddTargetModal from "./components/AddTargetModal";
import TargetDetailModal from "./components/TargetDetailModal"; 
import PomodoroTimer from "./components/PomodoroTimer";
import AnalyticsView from "./components/AnalyticsView";
import CalendarView from "./components/CalendarView";
import SettingsView from "./components/SettingsView";
import AuthPage from "./components/AuthPage";      
import ProfileView from "./components/ProfileView"; 

// DYNAMIC URL: Uses the Environment variable if available, otherwise falls back to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/targets";
// AUTH URL needs to be dynamic too
const AUTH_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/targets', '/auth') : "http://localhost:5000/api/auth";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setActiveTab('dashboard');
  };

  const handleUpdateUser = (updatedUser) => {
    const newUserState = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(newUserState));
    setUser(newUserState);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setTargets([]);
    setActiveTab('dashboard');
  };

  const fetchTargets = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTargets(data);
      setError(null);
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, [token]);

  const authFetch = async (url, options = {}) => {
    const headers = { ...options.headers, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    return fetch(url, { ...options, headers });
  };

  const addTarget = async (newTargetData) => {
    try {
      const res = await authFetch(API_URL, { method: 'POST', body: JSON.stringify(newTargetData) });
      const savedTarget = await res.json();
      setTargets([...targets, savedTarget]);
    } catch (err) { alert("Error saving"); }
  };

  const deleteTarget = async (id) => {
    if (!window.confirm("Delete this target?")) return;
    try {
      await authFetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTargets(targets.filter(t => (t._id || t.id) !== id));
      if ((selectedTarget?._id || selectedTarget?.id) === id) setIsDetailOpen(false);
    } catch (err) { alert("Error deleting"); }
  };

  const updateTargetField = async (id, field) => {
    const oldTargets = [...targets];
    setTargets(targets.map(t => ((t._id || t.id) === id ? { ...t, ...field } : t)));
    try {
      await authFetch(`${API_URL}/${id}`, { method: 'PATCH', body: JSON.stringify(field) });
    } catch (err) { setTargets(oldTargets); }
  };

  const addLog = async (targetId, logData) => {
    try {
      const res = await authFetch(`${API_URL}/${targetId}/logs`, { method: 'POST', body: JSON.stringify(logData) });
      const updatedTarget = await res.json();
      setTargets(targets.map(t => ((t._id || t.id) === targetId ? updatedTarget : t)));
      if (selectedTarget) setSelectedTarget(updatedTarget);
    } catch (err) { alert("Error adding log"); }
  };

  const editLog = async (targetId, logId, logData) => {
    try {
      const res = await authFetch(`${API_URL}/${targetId}/logs/${logId}`, { method: 'PUT', body: JSON.stringify(logData) });
      const updatedTarget = await res.json();
      setTargets(targets.map(t => ((t._id || t.id) === targetId ? updatedTarget : t)));
      if (selectedTarget) setSelectedTarget(updatedTarget);
    } catch (err) { alert("Error editing log"); }
  };

  const deleteLog = async (targetId, logId) => {
    try {
      const res = await authFetch(`${API_URL}/${targetId}/logs/${logId}`, { method: 'DELETE' });
      const updatedTarget = await res.json();
      setTargets(targets.map(t => ((t._id || t.id) === targetId ? updatedTarget : t)));
      if (selectedTarget) setSelectedTarget(updatedTarget);
    } catch (err) { alert("Error deleting log"); }
  };

  if (!token) {
    // Pass the Dynamic Auth URL to AuthPage
    return <AuthPage onLogin={handleLogin} apiUrl={AUTH_URL} />;
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  const filteredTargets = targets
    .filter(t => activeTab === 'archive' ? t.isArchived : !t.isArchived)
    .filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => (a.isPinned === b.isPinned ? new Date(a.dueDate) - new Date(b.dueDate) : a.isPinned ? -1 : 1));

  const allTags = [...new Set(targets.filter(t => !t.isArchived).flatMap(t => t.tags))];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex flex-col md:flex-row font-sans">
      
      <div className="md:hidden bg-white dark:bg-slate-800 border-b dark:border-slate-700 p-4 flex justify-between items-center sticky top-0 z-30">
        <div className="font-extrabold text-blue-600 flex items-center gap-2"><TrendingUp /> TargetFlow</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 dark:text-slate-300"><Menu /></button>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-700 p-6 flex flex-col gap-6 transition-transform duration-300 md:translate-x-0 md:static md:h-screen ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="hidden md:flex items-center gap-2 text-blue-600 font-extrabold text-xl"><TrendingUp /> TargetFlow</div>
        
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group" onClick={() => setActiveTab('profile')}>
           <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
             {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
           </div>
           <div className="flex-1 min-w-0">
             <p className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
               {user?.name || 'Guest User'}
             </p>
             <p className="text-xs text-slate-500 truncate">View Profile</p>
           </div>
        </div>

        <nav className="space-y-1">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={Layout}>Dashboard</NavButton>
          <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User}>My Profile</NavButton>
          <NavButton active={activeTab === 'archive'} onClick={() => setActiveTab('archive')} icon={Archive}>Archived</NavButton>
          <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
          <NavButton active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon={Calendar}>Planner</NavButton>
          <NavButton active={activeTab === 'timer'} onClick={() => setActiveTab('timer')} icon={Clock}>Focus Timer</NavButton>
          <NavButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={BarChart2}>Analytics</NavButton>
        </nav>

        <div className="mt-auto space-y-3">
           <button onClick={toggleTheme} className="w-full flex items-center justify-between px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              {theme === 'dark' ? <Moon size={16}/> : <Sun size={16}/>}
           </button>
           
           <button onClick={() => setIsModalOpen(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors shadow-lg shadow-blue-500/30">
             <Plus size={18} /> New Target
           </button>

           <button onClick={handleLogout} className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm">
             <LogOut size={16}/> Logout
           </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        {activeTab === 'profile' ? (
           <ProfileView 
             user={user} 
             token={token} 
             onUpdateUser={handleUpdateUser} 
             onLogout={handleLogout} 
             apiUrl={AUTH_URL} // Pass dynamic Auth URL
           />
        ) : (
          <>
             {(activeTab === 'dashboard' || activeTab === 'archive') && (
               <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                   {activeTab === 'archive' ? 'Archived Goals' : `Hi, ${firstName} 👋`}
                 </h2>
                 <div className="relative w-full md:w-64">
                   <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                   <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                     value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                 </div>
               </div>
             )}

             {loading && <div className="text-center py-10">Loading...</div>}
             {error && <div className="text-rose-500 p-4 border border-rose-200 rounded-lg mb-4">{error}</div>}

             {activeTab === 'dashboard' && allTags.length > 0 && !searchQuery && (
               <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
                 {allTags.map(tag => (
                    <button key={tag} onClick={() => setSearchQuery(tag)} className="px-3 py-1 text-xs rounded-full whitespace-nowrap bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">#{tag}</button>
                  ))}
               </div>
             )}

             {(activeTab === 'dashboard' || activeTab === 'archive') && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTargets.map(t => {
                    const uniqueKey = t._id || t.id; 
                    return (
                      <TargetCard 
                        key={uniqueKey} 
                        target={t} 
                        onDelete={() => deleteTarget(uniqueKey)} 
                        onOpenDetail={() => {setSelectedTarget(t); setIsDetailOpen(true);}} 
                        onTogglePin={() => updateTargetField(uniqueKey, { isPinned: !t.isPinned })} 
                        onToggleArchive={() => updateTargetField(uniqueKey, { isArchived: !t.isArchived, isPinned: false })} 
                        isArchivedView={activeTab === 'archive'} 
                      />
                    );
                  })}
                  {!loading && filteredTargets.length === 0 && <div className="text-center col-span-full py-10 text-slate-400">{searchQuery ? 'No matching goals found.' : 'No goals found. Create one to get started!'}</div>}
                </div>
             )}

             {activeTab === 'calendar' && <CalendarView targets={targets.filter(t => !t.isArchived)} />}
             {activeTab === 'analytics' && <AnalyticsView targets={targets.filter(t => !t.isArchived)} />}
             {activeTab === 'timer' && <PomodoroTimer targets={targets.filter(t => !t.isArchived)} onUpdateProgress={(id, val) => addLog(id, { date: new Date().toISOString().split('T')[0], completed: val, note: 'Focus Session' })} />}
             {activeTab === 'settings' && <SettingsView targets={targets} setTargets={setTargets} />}
          </>
        )}
      </main>

      <AddTargetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addTarget} />
      <TargetDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} target={selectedTarget} onAddLog={(id, d) => addLog(id, d)} onEditLog={editLog} onDeleteLog={deleteLog} />
    </div>
  );
}

const NavButton = ({ active, onClick, icon: Icon, children }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
    <Icon size={20} /> {children}
  </button>
);