import React from 'react';
import { calculateTotalProgress } from '../utils/helpers';

const AnalyticsView = ({ targets }) => {
  const tagCounts = targets.reduce((acc, t) => {
    t.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});
  
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const maxTagCount = Math.max(...Object.values(tagCounts), 0) || 1;

  const completed = targets.filter(t => calculateTotalProgress(t.logs) >= 100).length; // Rough estimate logic
  const active = targets.length;
  
  return (
    <div className="space-y-6">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">Total Goals</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800 dark:text-white">
              {active}
            </span>
            <span className="text-sm text-slate-400 mb-1">targets</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">Most Active Tag</h3>
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400 truncate">
              {sortedTags[0]?.[0] || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Tag Distribution Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Focus Areas (Tags)</h3>
        <div className="space-y-3">
          {sortedTags.length === 0 ? (
            <p className="text-slate-400 text-sm">No tags used yet.</p>
          ) : (
            sortedTags.map(([tag, count]) => (
              <div key={tag}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">#{tag}</span>
                  <span className="text-slate-400">{count}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full" 
                    style={{ width: `${(count / maxTagCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Detailed Progress Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
           <h3 className="font-bold text-slate-800 dark:text-white">Target Velocity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 font-medium">Target</th>
                <th className="px-6 py-3 font-medium">Total Done</th>
                <th className="px-6 py-3 font-medium">Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {targets.map(t => {
                const total = calculateTotalProgress(t.logs);
                return (
                  <tr key={t._id || t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-800 dark:text-slate-200">{t.title}</td>
                    <td className="px-6 py-3">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{total}</span> units
                    </td>
                    <td className="px-6 py-3 text-slate-500 dark:text-slate-400">
                      {t.logs?.length || 0} entries
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsView;