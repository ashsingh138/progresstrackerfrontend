import { CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

export const calculateDaysLeft = (dateString) => {
  if (!dateString) return 0;
  const due = new Date(dateString);
  const now = new Date();
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
};

// New: Calculate total progress from the logs array
export const calculateTotalProgress = (logs = []) => {
  return logs.reduce((acc, log) => acc + (parseInt(log.completed) || 0), 0);
};

export const getProgressColor = (percent) => {
  if (percent >= 100) return 'bg-emerald-500';
  if (percent >= 70) return 'bg-blue-500';
  if (percent >= 40) return 'bg-yellow-500';
  return 'bg-rose-500';
};

export const getDeadlineStatus = (daysLeft, isComplete) => {
  if (isComplete) 
    return { label: 'Completed', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2 };

  if (daysLeft < 0) 
    return { label: 'Overdue', color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400', icon: AlertCircle };

  if (daysLeft <= 3) 
    return { label: `${daysLeft} Days Left`, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertCircle };

  return { label: `${daysLeft} Days Left`, color: 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300', icon: Calendar };
};