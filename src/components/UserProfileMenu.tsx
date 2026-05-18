import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Settings, 
  Palette, 
  Moon, 
  Sun, 
  Shield, 
  LogOut, 
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Bell,
  Cpu,
  Database,
  Lock,
  Eye,
  Smartphone,
  Volume2,
  Radio,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

interface UserProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onThemeChange: (theme: 'dark' | 'light') => void;
  showNotification: (msg: string) => void;
}

export default function UserProfileMenu({ 
  isOpen, 
  onClose, 
  theme, 
  onThemeChange,
  showNotification 
}: UserProfileMenuProps) {
  const [activeSubView, setActiveSubView] = useState<'system' | 'security' | 'notifications' | null>(null);

  const handleBack = () => setActiveSubView(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              onClose();
              setActiveSubView(null);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-hardware-bg border-l border-hardware-line z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="hardware-header shrink-0">
              <div className="flex items-center gap-3">
                {activeSubView ? (
                  <button 
                    onClick={handleBack}
                    className="p-1 hover:bg-white/5 rounded transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-safe" />
                  </button>
                ) : (
                  <User className="w-4 h-4 text-safe" />
                )}
                <span className="lcd-text">
                  {activeSubView === 'system' && 'System Configuration'}
                  {activeSubView === 'security' && 'Security & Privacy'}
                  {activeSubView === 'notifications' && 'Notifications'}
                  {!activeSubView && 'User Profile'}
                </span>
              </div>
              <button 
                onClick={() => {
                  onClose();
                  setActiveSubView(null);
                }}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 opacity-50" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide relative min-h-0">
              {!activeSubView ? (
                <div className="space-y-8">
                  {/* Profile Overview */}
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-safe/30 flex items-center justify-center relative">
                      <span className="text-3xl font-black tracking-tighter">YM</span>
                      <div className="absolute bottom-1 right-1 w-5 h-5 bg-safe rounded-full border-4 border-hardware-bg" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-tighter">Yash Murugan</h2>
                      <p className="text-[10px] font-mono text-safe uppercase tracking-widest">Lead Emergency Responder</p>
                    </div>
                  </div>

                  {/* Personal Details Section */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 px-2">Personal Details</h3>
                    <div className="space-y-2">
                      {[
                        { icon: Mail, label: 'Email', value: 'yash.m@resqnet.ai' },
                        { icon: Phone, label: 'Emergency Contact', value: '+91 98765 43210' },
                        { icon: MapPin, label: 'Assigned Sector', value: 'Sector 4 (North)' },
                        { icon: Shield, label: 'Clearance Level', value: 'Level 4 (Admin)' },
                      ].map((detail, i) => (
                        <div key={i} className="p-3 bg-black/40 border border-hardware-line rounded-xl flex items-center gap-4">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <detail.icon className="w-4 h-4 text-white/40" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px] uppercase opacity-40 leading-none mb-1">{detail.label}</span>
                            <span className="text-xs font-bold">{detail.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Appearance Section */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 px-2">Appearance</h3>
                    <div className="p-4 bg-black/40 border border-hardware-line rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Palette className="w-4 h-4 text-white/40" />
                          <span className="text-xs font-bold uppercase tracking-widest">Interface Theme</span>
                        </div>
                        <div className="flex bg-hardware-bg p-1 rounded-lg border border-hardware-line">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onThemeChange('light');
                              showNotification('Light mode simulation active.');
                            }}
                            className={cn(
                              "p-1.5 rounded transition-all active:scale-90",
                              theme === 'light' ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white"
                            )}
                          >
                            <Sun className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onThemeChange('dark');
                              showNotification('Dark mode restored.');
                            }}
                            className={cn(
                              "p-1.5 rounded transition-all active:scale-90",
                              theme === 'dark' ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white"
                            )}
                          >
                            <Moon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Section */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 px-2">Settings</h3>
                    <div className="space-y-2">
                      {[
                        { icon: Settings, label: 'System Configuration', id: 'system' },
                        { icon: Shield, label: 'Security & Privacy', id: 'security' },
                        { icon: Bell, label: 'Notification Preferences', id: 'notifications' },
                      ].map((item, i) => (
                        <button 
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSubView(item.id as any);
                          }}
                          className="w-full p-4 bg-black/40 border border-hardware-line rounded-xl flex items-center justify-between hover:bg-white/5 transition-all group active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-4 h-4 text-white/40 group-hover:text-safe transition-colors" />
                            <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logout */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      showNotification('Logout restricted in demo mode.');
                    }}
                    className="w-full p-4 bg-emergency/10 border border-emergency/20 rounded-xl flex items-center justify-center gap-3 text-emergency hover:bg-emergency/20 transition-all mt-4 active:scale-95"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Emergency Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeSubView === 'system' && (
                    <div className="space-y-4">
                      {[
                        { icon: Cpu, label: 'Processor Load', value: '14%', detail: 'AI Engine Active' },
                        { icon: Database, label: 'Local Storage', value: '2.4 GB', detail: 'Offline Maps Cached' },
                        { icon: Radio, label: 'Mesh Protocol', value: 'v4.2', detail: 'Secure Channel' },
                        { icon: Activity, label: 'Uptime', value: '142h 12m', detail: 'Stable' },
                      ].map((item, i) => (
                        <div key={i} className="p-4 bg-black/40 border border-hardware-line rounded-xl flex items-center gap-4">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <item.icon className="w-5 h-5 text-safe" />
                          </div>
                          <div>
                            <div className="text-[10px] uppercase opacity-40 font-bold">{item.label}</div>
                            <div className="text-sm font-bold">{item.value}</div>
                            <div className="text-[8px] font-mono opacity-30 uppercase">{item.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSubView === 'security' && (
                    <div className="space-y-4">
                      {[
                        { icon: Lock, label: 'Encryption', value: 'AES-256', detail: 'End-to-End Active' },
                        { icon: Eye, label: 'Privacy Mode', value: 'Stealth', detail: 'Location Obfuscated' },
                        { icon: Shield, label: 'Auth Level', value: 'Biometric', detail: 'Verified' },
                      ].map((item, i) => (
                        <div key={i} className="p-4 bg-black/40 border border-hardware-line rounded-xl flex items-center gap-4">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <item.icon className="w-5 h-5 text-emergency" />
                          </div>
                          <div>
                            <div className="text-[10px] uppercase opacity-40 font-bold">{item.label}</div>
                            <div className="text-sm font-bold">{item.value}</div>
                            <div className="text-[8px] font-mono opacity-30 uppercase">{item.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSubView === 'notifications' && (
                    <div className="space-y-4">
                      {[
                        { icon: Bell, label: 'Critical Alerts', value: 'Enabled', detail: 'Override DND' },
                        { icon: Volume2, label: 'Audio Feedback', value: '70%', detail: 'Tactical Tones' },
                        { icon: Smartphone, label: 'Haptic Pulse', value: 'High', detail: 'SOS Vibration' },
                      ].map((item, i) => (
                        <div key={i} className="p-4 bg-black/40 border border-hardware-line rounded-xl flex items-center gap-4">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <item.icon className="w-5 h-5 text-warning" />
                          </div>
                          <div>
                            <div className="text-[10px] uppercase opacity-40 font-bold">{item.label}</div>
                            <div className="text-sm font-bold">{item.value}</div>
                            <div className="text-[8px] font-mono opacity-30 uppercase">{item.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-black/20 border-t border-hardware-line text-center">
              <p className="text-[8px] font-mono opacity-30 uppercase tracking-[0.4em]">RESQNET Edge Node v4.0.2-stable</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
