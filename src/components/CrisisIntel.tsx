import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Brain, 
  Plane, 
  Compass, 
  Users, 
  History, 
  Heart, 
  ShieldCheck, 
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Plus,
  Trash2,
  Wind,
  Volume2,
  Pause,
  Play
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Report {
  id: string;
  type: string;
  location: string;
  trustScore: number;
  timestamp: Date;
  status: 'verified' | 'unverified';
}

interface Victim {
  id: string;
  name: string;
  injury: 'Critical' | 'High' | 'Medium';
  risk: 'High' | 'Medium' | 'Low';
  timeSinceSOS: string;
  priorityScore: number;
}

interface FamilyMember {
  id: string;
  name: string;
  status: 'Safe' | 'Missing' | 'Injured';
  lastLocation: string;
}

export default function CrisisIntel({ showNotification }: { showNotification: (msg: string) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<'ground' | 'allocation' | 'psych' | 'family' | 'recovery'>('ground');
  
  // 1. Ground Truth Data
  const [reports, setReports] = useState<Report[]>([
    { id: '1', type: 'Water level rising', location: 'Sector 4', trustScore: 92, timestamp: new Date(), status: 'verified' },
    { id: '2', type: 'Bridge collapsed', location: 'North Gate', trustScore: 85, timestamp: new Date(), status: 'verified' },
    { id: '3', type: 'Power lines down', location: 'Zone B', trustScore: 45, timestamp: new Date(), status: 'unverified' },
  ]);

  // 2. AI Resource Allocation
  const [victims] = useState<Victim[]>([
    { id: 'V1', name: 'Unknown A', injury: 'Critical', risk: 'High', timeSinceSOS: '12m', priorityScore: 98 },
    { id: 'V2', name: 'Unknown B', injury: 'High', risk: 'High', timeSinceSOS: '5m', priorityScore: 85 },
    { id: 'V3', name: 'Unknown C', injury: 'Medium', risk: 'Medium', timeSinceSOS: '25m', priorityScore: 60 },
  ]);

  // 5. Family Tracking
  const [family, setFamily] = useState<FamilyMember[]>([
    { id: 'F1', name: 'Sarah (Wife)', status: 'Safe', lastLocation: 'Safe Zone 2' },
    { id: 'F2', name: 'Leo (Son)', status: 'Safe', lastLocation: 'Safe Zone 2' },
  ]);

  // 10. Psychological Support
  const [isCalmMode, setIsCalmMode] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'In' | 'Hold' | 'Out'>('In');

  useEffect(() => {
    if (!isCalmMode) return;
    const interval = setInterval(() => {
      setBreathPhase(prev => {
        if (prev === 'In') return 'Hold';
        if (prev === 'Hold') return 'Out';
        return 'In';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isCalmMode]);

  return (
    <div className="flex flex-col h-full bg-hardware-bg lg:p-6">
      <div className="hardware-panel flex-1 flex flex-col min-h-0">
        {/* Header with Sub-Tabs */}
        <div className="hardware-header shrink-0 bg-hardware-bg z-20 flex-wrap gap-y-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-emergency" />
            <span className="lcd-text text-[10px] lg:text-xs uppercase tracking-widest">Crisis Intelligence Core</span>
          </div>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'ground', label: 'Ground Truth', icon: Eye },
              { id: 'allocation', label: 'Allocation', icon: Brain },
              { id: 'family', label: 'Family', icon: Users },
              { id: 'psych', label: 'Calm Mode', icon: Heart },
              { id: 'recovery', label: 'Recovery', icon: RefreshCw },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded text-[9px] font-bold uppercase tracking-tighter transition-all",
                  activeSubTab === tab.id 
                    ? "bg-emergency text-white" 
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                )}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeSubTab === 'ground' && (
              <motion.div 
                key="ground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Report Form Simulation */}
                  <div className="md:col-span-1 hardware-panel p-5 bg-black/20">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      Submit Report
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase opacity-50">Incident Type</label>
                        <input className="w-full bg-black/40 border border-hardware-line rounded p-2 text-xs" placeholder="e.g. Flood rising" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase opacity-50">Location</label>
                        <input className="w-full bg-black/40 border border-hardware-line rounded p-2 text-xs" placeholder="e.g. Sector 7" />
                      </div>
                      <button 
                        onClick={() => showNotification('Report submitted. AI verifying trust score...')}
                        className="w-full py-2 bg-warning text-black text-[10px] font-black uppercase tracking-widest rounded"
                      >
                        Broadcast Intel
                      </button>
                    </div>
                  </div>

                  {/* Live Feed */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-widest opacity-50">Aggregated Intelligence</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
                        <span className="text-[8px] font-mono opacity-50 uppercase">Live Sync</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {reports.map(report => (
                        <div key={report.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded flex items-center justify-center",
                              report.status === 'verified' ? "bg-safe/20 text-safe" : "bg-warning/20 text-warning"
                            )}>
                              {report.status === 'verified' ? <ShieldCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="font-bold text-sm">{report.type}</div>
                              <div className="text-[10px] opacity-50 flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> {report.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-mono font-bold">Trust: {report.trustScore}%</div>
                            <div className={cn(
                              "text-[8px] uppercase font-bold tracking-widest",
                              report.status === 'verified' ? "text-safe" : "text-warning"
                            )}>{report.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Drone Integration Simulation */}
                <div className="hardware-panel p-6 bg-emergency/5 border-emergency/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Plane className="w-6 h-6 text-emergency animate-bounce" />
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest">Drone Recon Active</h3>
                        <p className="text-[10px] opacity-50">Unit: RESQ-DRONE-04 | Status: Scanning Sector 9</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-emergency text-white text-[8px] font-bold uppercase rounded-full">Live Feed</div>
                  </div>
                  <div className="aspect-video bg-black/60 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-px bg-emergency animate-scan" />
                      <div className="grid grid-cols-10 grid-rows-10 w-full h-full border border-white/5" />
                    </div>
                    <div className="text-center space-y-2">
                      <Wind className="w-8 h-8 text-emergency mx-auto animate-pulse" />
                      <p className="text-[10px] font-mono text-emergency uppercase tracking-[0.3em]">Thermal Imaging Active</p>
                      <p className="text-[8px] opacity-40">Detected: 2 Heat Signatures | Water Surge: +0.4m/min</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'allocation' && (
              <motion.div 
                key="allocation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tighter">AI Resource Allocation</h3>
                    <p className="text-[10px] opacity-50 uppercase tracking-widest">Prioritizing Victims by Urgency Score</p>
                  </div>
                  <Brain className="w-8 h-8 text-emergency opacity-20" />
                </div>

                <div className="space-y-4">
                  {victims.map((victim, i) => (
                    <div key={victim.id} className="hardware-panel p-5 bg-black/40 border-white/5 relative overflow-hidden">
                      <div className={cn(
                        "absolute top-0 left-0 w-1 h-full",
                        victim.injury === 'Critical' ? "bg-emergency" : victim.injury === 'High' ? "bg-warning" : "bg-safe"
                      )} />
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-black opacity-10 font-mono">#{i+1}</div>
                          <div>
                            <div className="font-bold text-base">{victim.name}</div>
                            <div className="flex gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] uppercase font-bold opacity-60">Injury: {victim.injury}</span>
                              <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] uppercase font-bold opacity-60">Risk: {victim.risk}</span>
                              <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] uppercase font-bold opacity-60">SOS: {victim.timeSinceSOS} ago</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-[8px] uppercase opacity-40 mb-1">Priority Score</div>
                            <div className={cn(
                              "text-2xl font-black font-mono",
                              victim.priorityScore > 90 ? "text-emergency" : "text-warning"
                            )}>{victim.priorityScore}</div>
                          </div>
                          <button 
                            onClick={() => showNotification(`Rescue unit assigned to ${victim.name}. ETA: 4m.`)}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded border border-white/10 text-[10px] font-bold uppercase tracking-widest transition-all"
                          >
                            Assign Unit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Evacuation Strategy Generator */}
                <div className="hardware-panel p-6 bg-safe/5 border-safe/20">
                  <div className="flex items-center gap-3 mb-6">
                    <Compass className="w-6 h-6 text-safe" />
                    <h3 className="text-sm font-black uppercase tracking-widest">AI Evacuation Strategy</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { step: 1, text: "Wait 5 minutes for water surge to stabilize.", time: "09:45" },
                      { step: 2, text: "Move North-East towards Sector 4 High Ground.", time: "09:50" },
                      { step: 3, text: "Avoid Bridge 04 - Structural integrity compromised.", time: "10:15" },
                    ].map(step => (
                      <div key={step.step} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-safe text-black text-[10px] font-bold flex items-center justify-center shrink-0">
                            {step.step}
                          </div>
                          {step.step < 3 && <div className="w-px h-full bg-safe/20 my-1" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="text-xs font-bold text-safe mb-1">{step.time}</div>
                          <p className="text-sm text-white/70">{step.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'family' && (
              <motion.div 
                key="family"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black uppercase tracking-tighter">Family Safety Tracking</h3>
                  <button 
                    onClick={() => showNotification('Family member registration restricted in demo mode.')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">Add Member</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {family.map(member => (
                    <div key={member.id} className="hardware-panel p-5 bg-black/40 border-white/5 group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-white/50" />
                          </div>
                          <div>
                            <div className="font-bold">{member.name}</div>
                            <div className="text-[10px] opacity-50">{member.lastLocation}</div>
                          </div>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest",
                          member.status === 'Safe' ? "bg-safe/20 text-safe" : "bg-emergency/20 text-emergency"
                        )}>
                          {member.status}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="text-[8px] font-mono opacity-30 uppercase">Last Sync: 2m ago</div>
                        <button 
                          onClick={() => showNotification(`Removing ${member.name} from tracking...`)}
                          className="text-[8px] uppercase font-bold text-emergency opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSubTab === 'psych' && (
              <motion.div 
                key="psych"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-12 space-y-12"
              >
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Psychological Support Mode</h3>
                  <p className="text-sm text-white/50 max-w-md mx-auto">
                    Take a moment to breathe. The AI is here to help you stay calm and focused.
                  </p>
                </div>

                <div className="relative flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      scale: isCalmMode ? [1, 1.5, 1] : 1,
                      opacity: isCalmMode ? [0.2, 0.5, 0.2] : 0.2
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-64 h-64 bg-safe rounded-full blur-3xl"
                  />
                  
                  <motion.div 
                    animate={{ 
                      scale: isCalmMode ? (breathPhase === 'In' ? 1.4 : breathPhase === 'Hold' ? 1.4 : 1) : 1
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="w-48 h-48 rounded-full border-2 border-safe/30 flex flex-col items-center justify-center relative z-10 bg-black/40 backdrop-blur-md"
                  >
                    <Heart className={cn(
                      "w-12 h-12 text-safe transition-all duration-1000",
                      isCalmMode && "animate-pulse"
                    )} />
                    {isCalmMode && (
                      <motion.div 
                        key={breathPhase}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-safe"
                      >
                        {breathPhase === 'In' ? 'Breathe In' : breathPhase === 'Hold' ? 'Hold' : 'Breathe Out'}
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                <button 
                  onClick={() => setIsCalmMode(!isCalmMode)}
                  className={cn(
                    "px-8 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3",
                    isCalmMode ? "bg-white text-black" : "bg-safe text-black shadow-[0_0_30px_rgba(0,255,157,0.3)]"
                  )}
                >
                  {isCalmMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isCalmMode ? 'Stop Calm Mode' : 'Start Calm Mode'}
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  {[
                    { icon: Volume2, text: "Calm Voice Guidance" },
                    { icon: ShieldCheck, text: "Panic Reduction" },
                    { icon: CheckCircle2, text: "Step-by-Step Focus" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-safe" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSubTab === 'recovery' && (
              <motion.div 
                key="recovery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="hardware-panel p-8 bg-gradient-to-br from-safe/10 to-transparent border-safe/20 text-center">
                  <RefreshCw className="w-12 h-12 text-safe mx-auto mb-6 animate-spin-slow" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Post-Disaster Recovery</h3>
                  <p className="text-sm text-white/50 max-w-md mx-auto">
                    The immediate threat has passed. Transitioning to community reconnection and resource sharing mode.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest opacity-50">Local Resources</h4>
                    {[
                      { type: 'Food', location: 'Community Center', status: 'Available' },
                      { type: 'Clean Water', location: 'Sector 4 Pump', status: 'Limited' },
                      { type: 'Medical', location: 'Field Hospital 1', status: 'Active' },
                    ].map((res, i) => (
                      <div 
                        key={i} 
                        onClick={() => showNotification(`Requesting ${res.type} at ${res.location}...`)}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all"
                      >
                        <div>
                          <div className="font-bold text-sm">{res.type}</div>
                          <div className="text-[10px] opacity-50">{res.location}</div>
                        </div>
                        <span className="text-[10px] font-bold text-safe uppercase">{res.status}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest opacity-50">Disaster Replay & Analysis</h4>
                    <div className="hardware-panel p-5 bg-black/40 border-white/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-white/30" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Risk Evolution Timeline</span>
                      </div>
                      <div className="h-32 flex items-end gap-1">
                        {[20, 45, 90, 100, 85, 60, 40, 30, 20, 15].map((h, i) => (
                          <div key={i} className="flex-1 bg-emergency/20 rounded-t-sm relative group">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              className="w-full bg-emergency/40 rounded-t-sm"
                            />
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[8px] font-mono transition-opacity">
                              T-{10-i}h
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-[9px] opacity-40 leading-relaxed italic">
                        AI Analysis: Peak risk occurred at T-7h. Successful evacuation of 84% of residents in high-risk zones detected.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
