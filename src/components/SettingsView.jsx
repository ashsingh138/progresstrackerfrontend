import React from 'react';
import { Download, Upload, FileJson } from 'lucide-react';

const SettingsView = ({ targets, setTargets }) => {
  
  // Export Data to JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(targets, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `targetflow_backup_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import Data from JSON
  const handleImport = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    
    if (!file) return;

    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        if (Array.isArray(parsedData)) {
          if (window.confirm(`Found ${parsedData.length} targets. This will overwrite current data. Continue?`)) {
            setTargets(parsedData);
          }
        } else {
          alert("Invalid file format. Expected an array of targets.");
        }
      } catch (err) {
        alert("Error parsing JSON file.");
      }
    };
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <FileJson size={24} className="text-blue-500"/> Data Management
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
          Backup your targets to a file or restore them on another device.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Export Button */}
          <button 
            onClick={handleExport}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all group"
          >
            <Download size={32} className="text-slate-400 group-hover:text-blue-500 mb-3" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Export JSON</span>
            <span className="text-xs text-slate-400 mt-1">Save backup to device</span>
          </button>

          {/* Import Button Wrapper */}
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all cursor-pointer group">
            <Upload size={32} className="text-slate-400 group-hover:text-emerald-500 mb-3" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Import JSON</span>
            <span className="text-xs text-slate-400 mt-1">Restore from backup</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

        </div>
      </div>
    </div>
  );
};

export default SettingsView;