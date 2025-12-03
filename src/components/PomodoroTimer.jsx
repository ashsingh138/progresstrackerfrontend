import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Save, Settings } from 'lucide-react';

const PomodoroTimer = ({ targets, onUpdateProgress }) => {
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [duration, setDuration] = useState(25); 
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('focus');

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isActive]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, sessionType, selectedTargetId]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setSessionType('focus');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 max-w-lg mx-auto text-center transition-colors">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`}></div>
          Focus Session
        </h2>
        <div className="flex gap-1">
          {[15, 25, 45, 60].map(mins => (
            <button 
              key={mins}
              onClick={() => { setDuration(mins); setIsActive(false); }}
              className={`text-xs px-2 py-1 rounded border ${duration === mins ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 px-4">
        <input 
          type="range" 
          min="1" 
          max="120" 
          value={duration} 
          onChange={(e) => { setDuration(parseInt(e.target.value)); setIsActive(false); }}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <p className="text-xs text-slate-400 mt-2">Session Length: {duration} minutes</p>
      </div>

      <div className="mb-8">
        <select 
          className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTargetId}
          onChange={(e) => setSelectedTargetId(e.target.value)}
        >
          <option value="">-- No specific target --</option>
          {targets.map(t => (
            // CRITICAL FIX: Use _id for Mongo, id for Local fallback
            <option key={t._id || t.id} value={t._id || t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8 relative">
        <div className="text-7xl font-mono font-bold text-slate-800 dark:text-white tracking-tighter">
          {formatTime(timeLeft)}
        </div>
        <p className="text-slate-400 text-sm mt-2 uppercase tracking-widest font-medium">
          {sessionType === 'focus' ? 'Work Time' : 'Break Time'}
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={toggleTimer}
          className={`flex-1 max-w-[200px] py-4 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 text-lg
            ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isActive ? <><Pause size={24}/> Pause</> : <><Play size={24}/> Start</>}
        </button>

        <button 
          onClick={resetTimer}
          className="px-6 py-4 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      {selectedTargetId && (
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
           <button 
             onClick={() => {
                const amount = prompt("How much did you complete?");
                if(amount) onUpdateProgress(selectedTargetId, parseInt(amount));
             }}
             className="w-full py-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
           >
             <Save size={18}/> Log Progress Manually
           </button>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;