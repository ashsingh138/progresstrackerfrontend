import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Edit2, Calendar, CheckCircle2, CircleDashed, AlertCircle } from 'lucide-react';
// Note: removed calculateTotalProgress import as we are changing the metric logic

const TargetDetailModal = ({ isOpen, onClose, target, onAddLog, onDeleteLog, onEditLog }) => {
  if (!isOpen || !target) return null;

  const [editingLogId, setEditingLogId] = useState(null);
  
  // Form State
  const [logData, setLogData] = useState({
    date: new Date().toISOString().split('T')[0],
    planned: '',
    completed: '0', // Default to 0 string for percentage
    note: ''
  });

  // Helper to get the correct ID
  const getTargetId = () => target._id || target.id;

  // Calculate detailed stats for the header
  const stats = (target.logs || []).reduce((acc, log) => {
    const val = parseInt(log.completed) || 0;
    if (val >= 100) acc.achieved++;
    else acc.missed++;
    return acc;
  }, { achieved: 0, missed: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    const tId = getTargetId();
    
    if (!tId) {
      alert("Error: Target ID is missing. Please refresh the page.");
      return;
    }
    
    // Ensure completed is stored as a stringified number for consistency
    const payload = { ...logData, completed: logData.completed.toString() };

    if (editingLogId) {
      onEditLog(tId, editingLogId, payload);
      setEditingLogId(null);
    } else {
      onAddLog(tId, payload);
    }
    // Reset form
    setLogData({ 
        date: new Date().toISOString().split('T')[0], 
        planned: '', 
        completed: '0', 
        note: '' 
    });
  };

  const startEdit = (log) => {
    setLogData({
      date: log.date,
      planned: log.planned,
      // Ensure we handle old text data gracefully, default to 0 if not a number
      completed: parseInt(log.completed) || 0,
      note: log.note
    });
    setEditingLogId(log._id || log.id);
  };

  const handleDelete = (logId) => {
    const tId = getTargetId();
    if(window.confirm('Delete this log entry?')) {
      onDeleteLog(tId, logId);
    }
  };

  // Helper for color coding the slider
  const getProgressColor = (val) => {
    if (val < 30) return 'text-rose-500';
    if (val < 70) return 'text-amber-500';
    return 'text-emerald-500';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex justify-between items-start mb-2">
             <h2 className="text-2xl font-bold text-slate-800 dark:text-white leading-none">{target.title}</h2>
             <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                <X size={24} />
             </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              {target.description || "No description provided."}
            </p>
            {/* Quick Stats in Header */}
            <div className="flex gap-3 text-xs font-semibold">
               <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                 {stats.achieved} Days Achieved
               </span>
               <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full">
                 {stats.missed} Days Missed
               </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Panel: Input Form */}
          <div className="p-6 md:w-5/12 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
             <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
               {editingLogId ? <Edit2 size={16} className="text-amber-500"/> : <CircleDashed size={16} className="text-blue-500"/>}
               {editingLogId ? 'Edit Daily Log' : 'Log Today\'s Progress'}
             </h3>
             
             <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Date</label>
                 <input 
                   type="date" 
                   required
                   className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                   value={logData.date}
                   onChange={e => setLogData({...logData, date: e.target.value})}
                 />
               </div>

               <div>
                 <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Target (Planned)</label>
                 <input 
                   type="text" 
                   placeholder="e.g. Read 20 pages"
                   className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                   value={logData.planned}
                   onChange={e => setLogData({...logData, planned: e.target.value})}
                 />
               </div>

               {/* New Percentage Selector */}
               <div>
                 <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Achieved %</label>
                    <span className={`text-sm font-bold ${getProgressColor(logData.completed)}`}>{logData.completed}%</span>
                 </div>
                 <input 
                   type="range" 
                   min="0" 
                   max="100" 
                   step="5"
                   className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
                   value={logData.completed}
                   onChange={e => setLogData({...logData, completed: e.target.value})}
                 />
                 <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Remarks (What's left & Why?)</label>
                 <textarea 
                   rows="3"
                   placeholder="e.g. Could only do 10 pages because..."
                   className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                   value={logData.note}
                   onChange={e => setLogData({...logData, note: e.target.value})}
                 ></textarea>
               </div>

               <div className="flex gap-2 pt-2">
                 {editingLogId && (
                   <button 
                     type="button" 
                     onClick={() => { setEditingLogId(null); setLogData({date: new Date().toISOString().split('T')[0], planned: '', completed: '0', note: ''}); }}
                     className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-lg"
                   >
                     Cancel
                   </button>
                 )}
                 <button 
                   type="submit"
                   className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                 >
                   <Save size={18} /> {editingLogId ? 'Update' : 'Save Log'}
                 </button>
               </div>
             </form>
          </div>

          {/* Right Panel: History List */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/30 overflow-y-auto p-0">
            <div className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 backdrop-blur p-4 border-b border-slate-200 dark:border-slate-700 z-10 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 dark:text-slate-200">Activity Log</h3>
              <span className="text-xs font-medium bg-white dark:bg-slate-700 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400">
                {target.logs?.length || 0} Entries
              </span>
            </div>

            <div className="p-4 space-y-3">
              {(!target.logs || target.logs.length === 0) ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                  <Calendar size={48} className="mx-auto mb-3 opacity-20"/>
                  <p>No activity recorded.</p>
                </div>
              ) : (
                [...target.logs].sort((a, b) => new Date(b.date) - new Date(a.date)).map((log) => {
                  const percent = parseInt(log.completed) || 0;
                  const isSuccess = percent >= 100;
                  
                  return (
                    <div key={log._id || log.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                      {/* Left border color indicator */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isSuccess ? 'bg-emerald-500' : 'bg-rose-400'}`}></div>
                      
                      <div className="pl-2">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                              {log.date}
                            </span>
                            {/* Percentage Badge */}
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {percent}% Done
                            </span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(log)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Edit2 size={14}/></button>
                            <button onClick={() => handleDelete(log._id || log.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded"><Trash2 size={14}/></button>
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Planned</span>
                          <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{log.planned || '-'}</span>
                        </div>

                        {log.note && (
                          <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded text-xs text-slate-600 dark:text-slate-300 mt-2">
                            <span className="font-bold text-slate-400 block mb-0.5">Remark:</span>
                            {log.note}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetDetailModal;