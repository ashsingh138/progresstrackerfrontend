import React, { useState } from 'react';
import { User, MapPin, School, BookOpen, LogOut, Mail, Edit2, Save, X } from 'lucide-react';

// Added apiUrl prop
const ProfileView = ({ user, token, onUpdateUser, onLogout, apiUrl }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    place: user?.place || '',
    gender: user?.gender || 'Male',
    studentClass: user?.studentClass || '',
    collegeName: user?.collegeName || ''
  });

  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    // Use dynamic URL or fallback
    const endpoint = apiUrl ? apiUrl.replace('/login', '/profile').replace('/signup', '/profile') : 'http://localhost:5000/api/auth/profile';
    
    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update profile");
      }
      
      const updatedUser = await res.json();
      onUpdateUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      alert(`Error: ${err.message}. Ensure backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      age: user.age,
      place: user.place,
      gender: user.gender,
      studentClass: user.studentClass,
      collegeName: user.collegeName
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
        
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
           <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        <div className="px-8 pb-8">
          
          {/* Avatar & Top Actions */}
          <div className="relative -mt-12 mb-6 flex justify-between items-end">
             <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-lg">
                <div className="w-full h-full bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-3xl font-bold text-slate-500 dark:text-slate-400">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
             </div>
             
             {isEditing ? (
               <div className="flex gap-2">
                 <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold transition-colors">
                   <X size={16} /> Cancel
                 </button>
                 <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                   <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
                 </button>
               </div>
             ) : (
               <div className="flex gap-2">
                 <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                   <Edit2 size={16} /> Edit Profile
                 </button>
                 <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors">
                   <LogOut size={16} /> Logout
                 </button>
               </div>
             )}
          </div>

          {/* Profile Content */}
          <div className="mb-8">
            {isEditing ? (
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded-lg border dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                </div>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
            )}
            
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mt-1">
               <Mail size={14} /> {user.email}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <InfoCard 
              icon={User} 
              label="Age & Gender" 
              isEditing={isEditing}
              editContent={
                <div className="flex gap-2">
                  <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-1/3 p-1.5 text-sm rounded border dark:border-slate-600 dark:bg-slate-700 dark:text-white"/>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-2/3 p-1.5 text-sm rounded border dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              }
              value={`${user.age || 'N/A'} • ${user.gender || 'N/A'}`} 
            />

            <InfoCard 
              icon={MapPin} 
              label="Location"
              isEditing={isEditing}
              editContent={<input name="place" value={formData.place} onChange={handleChange} className="w-full p-1.5 text-sm rounded border dark:border-slate-600 dark:bg-slate-700 dark:text-white"/>} 
              value={user.place || 'Not set'} 
            />

            <InfoCard 
              icon={School} 
              label="College"
              isEditing={isEditing}
              editContent={<input name="collegeName" value={formData.collegeName} onChange={handleChange} className="w-full p-1.5 text-sm rounded border dark:border-slate-600 dark:bg-slate-700 dark:text-white"/>}
              value={user.collegeName || 'Not set'} 
            />

            <InfoCard 
              icon={BookOpen} 
              label="Class / Year" 
              isEditing={isEditing}
              editContent={<input name="studentClass" value={formData.studentClass} onChange={handleChange} className="w-full p-1.5 text-sm rounded border dark:border-slate-600 dark:bg-slate-700 dark:text-white"/>}
              value={user.studentClass || 'Not set'} 
            />

          </div>

        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, isEditing, editContent }) => (
  <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-start gap-4">
    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-blue-600 dark:text-blue-400 shadow-sm mt-1">
      <Icon size={18} />
    </div>
    <div className="flex-1">
      <p className="text-xs font-bold text-slate-400 uppercase mb-1">{label}</p>
      {isEditing ? editContent : <p className="font-semibold text-slate-800 dark:text-slate-200">{value}</p>}
    </div>
  </div>
);

export default ProfileView;