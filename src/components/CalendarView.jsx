import React from 'react';

const CalendarView = ({ targets }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const targetsByDay = targets.reduce((acc, t) => {
    const d = new Date(t.dueDate);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      const dayNum = d.getDate();
      if (!acc[dayNum]) acc[dayNum] = [];
      acc[dayNum].push(t);
    }
    return acc;
  }, {});

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-800 dark:text-white">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium px-2 py-1 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded">Deadlines View</span>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700">
         {days.map(day => {
           const dayTargets = targetsByDay[day] || [];
           const isToday = day === today.getDate();
           
           return (
             <div key={day} className={`bg-white dark:bg-slate-800 min-h-[100px] p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex flex-col ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
               <span className={`text-sm font-semibold mb-1 ${isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-700 dark:text-slate-300'}`}>
                 {day}
               </span>
               
               <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[80px]">
                 {dayTargets.map(t => (
                   <div 
                     // CRITICAL FIX: Use _id OR id
                     key={t._id || t.id} 
                     className={`text-[10px] px-1.5 py-1 rounded truncate border-l-2 border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300`}
                   >
                     {t.title}
                   </div>
                 ))}
               </div>
             </div>
           );
         })}
      </div>
    </div>
  );
};

export default CalendarView;