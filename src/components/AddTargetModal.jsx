import React, { useState } from "react";
import { Target, Hash, Save, X, Trophy, Video, BookOpen, PenTool, ClipboardList } from "lucide-react";

// Study-Centric Presets
const TEMPLATES = [
  { name: "Give Contest", icon: Trophy, data: { title: "Codeforces Contest", description: "Participate in weekly rounds and upsolve.", tags: "CP, Contest" } },
  { name: "Watch Lectures", icon: Video, data: { title: "OS Lectures", description: "Watch Operating System playlist by Love Babbar.", tags: "CS, Theory" } },
  { name: "Solve Questions", icon: PenTool, data: { title: "Leetcode Grind", description: "Solve daily DSA problems.", tags: "DSA, Coding" } },
  { name: "Assignment", icon: ClipboardList, data: { title: "Math Assignment", description: "Complete linear algebra tutorial sheet.", tags: "College, Math" } },
  { name: "Read/Revise", icon: BookOpen, data: { title: "Revise Notes", description: "Go through short notes for exams.", tags: "Revision" } },
];

const AddTargetModal = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    title: '', description: '', dueDate: '', tags: ''
  });

  const loadTemplate = (template) => {
    setFormData({
      ...formData,
      ...template.data,
      dueDate: formData.dueDate // Preserve date if set
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      id: Date.now().toString(),
      logs: []
    });
    onClose();
    setFormData({ title: '', description: '', dueDate: '', tags: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl md:rounded-2xl shadow-xl w-full max-w-md animate-in slide-in-from-bottom md:slide-in-from-bottom-5">
        
        <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-between items-center border-b dark:border-slate-700 rounded-t-2xl">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
            <Target className="text-blue-600" size={20} /> New Study Goal
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          
          {/* Templates Section */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Quick Presets</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {TEMPLATES.map((t, i) => (
                <button 
                  key={i} 
                  onClick={() => loadTemplate(t)}
                  className="flex flex-col items-center justify-center min-w-[85px] p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  <t.icon size={18} className="mb-1 text-slate-500 dark:text-slate-400" />
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 text-center leading-tight">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Target Name</label>
              <input 
                required type="text" placeholder="e.g., Complete DSA"
                className="w-full px-3 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Description / Goal</label>
              <textarea 
                rows="2"
                placeholder="e.g., Solve 5 questions daily from Striver's Sheet"
                className="w-full px-3 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Deadline</label>
              <input 
                required type="date"
                className="w-full px-3 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">Tags</label>
              <div className="relative">
                <Hash className="absolute left-3 top-3.5 text-slate-400" size={14} />
                <input 
                  type="text" placeholder="CP, DSA, College"
                  className="w-full pl-8 pr-3 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 mt-2">
              <Save size={18} /> Create Goal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTargetModal;