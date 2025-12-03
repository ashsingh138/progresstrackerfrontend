import React from "react";
import { Trash2, Pin, Archive, RotateCcw, ListPlus, Activity } from "lucide-react";
import { calculateDaysLeft, getDeadlineStatus, calculateTotalProgress } from "../utils/helpers";

const TargetCard = ({ target, onDelete, onOpenDetail, onTogglePin, onToggleArchive, isArchivedView }) => {
  const totalCompleted = calculateTotalProgress(target.logs);
  const daysLeft = calculateDaysLeft(target.dueDate);
  // Status is now just based on deadline, not "completion" since we have no total
  const status = getDeadlineStatus(daysLeft, false); 
  const StatusIcon = status.icon;

  return (
    <div className={`
      relative flex flex-col h-full p-5 rounded-xl shadow-sm border transition-all duration-200
      ${target.isPinned && !isArchivedView ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}
    `}>
      
      {/* Card Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-2 ${status.color}`}>
            <StatusIcon size={12} />
            {status.label}
          </span>
          <h3 
            className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => onOpenDetail(target)}
          >
            {target.title}
          </h3>
        </div>
        
        {/* Actions Menu */}
        <div className="flex gap-1">
           {!isArchivedView && (
            <button 
              onClick={() => onTogglePin(target.id)}
              className={`p-1.5 rounded-md transition-colors ${target.isPinned ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              title={target.isPinned ? "Unpin" : "Pin to top"}
            >
              <Pin size={16} className={target.isPinned ? "fill-current" : ""} />
            </button>
           )}
           
           <button 
              onClick={() => onToggleArchive(target.id)}
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors"
              title={isArchivedView ? "Unarchive" : "Archive"}
           >
              {isArchivedView ? <RotateCcw size={16}/> : <Archive size={16} />}
           </button>

           <button 
            onClick={() => onDelete(target.id)}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Description / Info */}
      <div className="mb-4 flex-1 cursor-pointer" onClick={() => onOpenDetail(target)}>
         {target.description && (
           <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
             {target.description}
           </p>
         )}
         
         {/* Stats Row */}
         <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
               <Activity size={16} />
            </div>
            <div>
               <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Accumulated</p>
               <p className="text-lg font-bold text-slate-800 dark:text-white leading-none">
                 {totalCompleted} <span className="text-xs font-normal text-slate-500">done</span>
               </p>
            </div>
         </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {target.tags.map((tag, idx) => (
          <span key={idx} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
            #{tag}
          </span>
        ))}
      </div>

      {/* Open Log Button */}
      {!isArchivedView && (
        <button 
          onClick={() => onOpenDetail(target)}
          className="mt-auto w-full py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 group"
        >
          <ListPlus size={16} className="group-hover:text-blue-500"/> View Daily Logs
        </button>
      )}
    </div>
  );
};

export default TargetCard;