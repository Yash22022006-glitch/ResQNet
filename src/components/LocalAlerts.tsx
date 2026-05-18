import { useState, FormEvent, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, 
  Bell, 
  ChevronRight, 
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function LocalAlerts({ showNotification }: { showNotification?: (msg: string) => void }) {
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('resqnet_alerts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved alerts', e);
      }
    }
    return [
      { id: 1, type: 'Flood', severity: 'High', location: 'Zone 4 - River Basin', time: '10m ago', details: 'Water levels rising rapidly. Evacuation recommended for low-lying areas.' },
      { id: 2, type: 'Power', severity: 'Medium', location: 'Sector B', time: '45m ago', details: 'Grid failure detected. Backup generators active in critical zones.' },
      { id: 3, type: 'Comms', severity: 'Low', location: 'Mesh Node 08', time: '1h ago', details: 'Signal degradation detected. Automatic rerouting in progress.' },
      { id: 4, type: 'Supply', severity: 'Medium', location: 'Distribution Point C', time: '2h ago', details: 'Medical supplies restocked. Priority given to vulnerable groups.' },
      { id: 5, type: 'Weather', severity: 'High', location: 'North Ridge', time: '3h ago', details: 'Severe thunderstorm warning. High winds expected.' },
      { id: 6, type: 'Medical', severity: 'Medium', location: 'Field Hospital 2', time: '4h ago', details: 'Additional medical staff requested for night shift.' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('resqnet_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const [newAlert, setNewAlert] = useState({
    type: '',
    severity: 'Medium',
    location: '',
    details: ''
  });

  const handleCreateAlert = (e: FormEvent) => {
    e.preventDefault();
    const alert = {
      ...newAlert,
      id: Date.now(),
      time: 'Just now'
    };
    setAlerts([alert, ...alerts]);
    setShowCreateModal(false);
    setNewAlert({ type: '', severity: 'Medium', location: '', details: '' });
    showNotification?.(`Broadcasted ${alert.type} alert to mesh network`);
  };

  const handleDeleteAlert = (id: number, e: MouseEvent) => {
    e.stopPropagation();
    const alertToDelete = alerts.find((a: any) => a.id === id);
    setAlerts(alerts.filter((a: any) => a.id !== id));
    if (selectedAlert?.id === id) setSelectedAlert(null);
    showNotification?.(`Removed ${alertToDelete?.type || 'alert'} from local list`);
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'High':
        return {
          bg: 'bg-severity-high/20',
          text: 'text-severity-high',
          border: 'border-severity-high/30'
        };
      case 'Medium':
        return {
          bg: 'bg-severity-medium/20',
          text: 'text-severity-medium',
          border: 'border-severity-medium/30'
        };
      case 'Low':
        return {
          bg: 'bg-severity-low/20',
          text: 'text-severity-low',
          border: 'border-severity-low/30'
        };
      default:
        return {
          bg: 'bg-white/10',
          text: 'text-white/70',
          border: 'border-white/10'
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-hardware-bg lg:p-6">
      <div className="hardware-panel flex-1 flex flex-col min-h-0">
        {/* Fixed Header */}
        <div className="hardware-header shrink-0 bg-hardware-bg z-20">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-warning" />
            <span className="lcd-text text-[10px] lg:text-xs">Emergency Alert System</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 px-2 py-0.5 bg-warning/20 text-warning border border-warning/30 rounded hover:bg-warning/30 transition-all active:scale-95"
            >
              <Plus className="w-2.5 h-2.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">New Alert</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[8px] lg:text-[10px] font-mono opacity-50 uppercase tracking-widest">Monitoring...</span>
              <div className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-hide space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedAlert(alert)}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded flex items-center justify-center shrink-0",
                    getSeverityStyles(alert.severity).bg,
                    getSeverityStyles(alert.severity).text
                  )}>
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm lg:text-base truncate">{alert.type} Alert</div>
                    <div className="text-[10px] lg:text-xs text-white/50 truncate">{alert.location}</div>
                  </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-2">
                  <div className="flex flex-col items-end">
                    <div className="text-[10px] font-mono opacity-50 mb-1">{alert.time}</div>
                    <div className={cn(
                      "text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                      getSeverityStyles(alert.severity).bg,
                      getSeverityStyles(alert.severity).text
                    )}>
                      {alert.severity}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteAlert(alert.id, e)}
                    className="p-1.5 text-white/20 hover:text-emergency hover:bg-emergency/10 rounded transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Create Alert Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[110] hardware-panel p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-warning/20 text-warning flex items-center justify-center">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-tight">Broadcast Alert</h3>
                      <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">System Override Active</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateAlert} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 ml-1">Alert Type</label>
                    <input 
                      required
                      type="text"
                      placeholder="e.g. Flood, Fire, Medical"
                      value={newAlert.type}
                      onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                      className="w-full bg-black/40 border border-hardware-line rounded px-4 py-2 text-sm focus:border-warning/50 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 ml-1">Severity</label>
                    <select 
                      value={newAlert.severity}
                      onChange={(e) => setNewAlert({...newAlert, severity: e.target.value})}
                      className="w-full bg-black/40 border border-hardware-line rounded px-4 py-2 text-sm focus:border-warning/50 outline-none transition-all appearance-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 ml-1">Location</label>
                    <input 
                      required
                      type="text"
                      placeholder="e.g. Sector 7, North Gate"
                      value={newAlert.location}
                      onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
                      className="w-full bg-black/40 border border-hardware-line rounded px-4 py-2 text-sm focus:border-warning/50 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 ml-1">Details</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Brief description of the situation..."
                      value={newAlert.details}
                      onChange={(e) => setNewAlert({...newAlert, details: e.target.value})}
                      className="w-full bg-black/40 border border-hardware-line rounded px-4 py-2 text-sm focus:border-warning/50 outline-none transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-warning text-black text-xs font-black uppercase tracking-[0.2em] rounded-lg hover:bg-warning/90 transition-all active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                  >
                    Broadcast to Mesh
                  </button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Alert Detail Modal */}
        <AnimatePresence>
          {selectedAlert && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedAlert(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[110] hardware-panel p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded flex items-center justify-center",
                      getSeverityStyles(selectedAlert.severity).bg,
                      getSeverityStyles(selectedAlert.severity).text
                    )}>
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{selectedAlert.type} Alert</h3>
                      <p className={cn(
                        "text-[10px] font-mono uppercase tracking-widest",
                        getSeverityStyles(selectedAlert.severity).text
                      )}>{selectedAlert.severity} Severity</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedAlert(null)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className={cn(
                    "p-4 bg-white/5 border rounded-lg",
                    getSeverityStyles(selectedAlert.severity).border
                  )}>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {selectedAlert.details}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-black/40 rounded border border-hardware-line">
                      <span className="text-[8px] uppercase opacity-50 block mb-1">Location</span>
                      <span className="text-xs font-bold">{selectedAlert.location}</span>
                    </div>
                    <div className="p-3 bg-black/40 rounded border border-hardware-line">
                      <span className="text-[8px] uppercase opacity-50 block mb-1">Detected</span>
                      <span className="text-xs font-bold">{selectedAlert.time}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedAlert(null)}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
