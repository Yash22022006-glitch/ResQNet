/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  MessageSquare, 
  Map as MapIcon, 
  Briefcase, 
  Radio, 
  WifiOff,
  Activity,
  Bell
} from 'lucide-react';
import { cn } from './lib/utils';
import Dashboard from './components/Dashboard';
import ChatAssistant from './components/ChatAssistant';
import MeshMap from './components/MeshMap';
import Toolkit from './components/Toolkit';
import EnvironmentSensors from './components/EnvironmentSensors';
import LocalAlerts from './components/LocalAlerts';
import CrisisIntel from './components/CrisisIntel';
import UserProfileMenu from './components/UserProfileMenu';

type Tab = 'dashboard' | 'chat' | 'map' | 'sensors' | 'toolkit' | 'alerts' | 'intel';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [notification, setNotification] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Shield },
    { id: 'intel', label: 'Intel', icon: Activity },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'toolkit', label: 'Tools', icon: Briefcase },
    { id: 'map', label: 'Map', icon: MapIcon },
    { id: 'sensors', label: 'Sensors', icon: Activity },
    { id: 'chat', label: 'AI', icon: MessageSquare },
  ];

  return (
    <div className={cn(
      "flex h-screen overflow-hidden flex-col lg:flex-row transition-colors duration-500",
      theme === 'dark' ? "bg-[#0a0a0a] text-white" : "bg-white text-black light"
    )}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-hardware-bg border-r border-hardware-line flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-emergency/20 rounded-lg">
            <Radio className="w-6 h-6 text-emergency" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter">RESQNET AI</h1>
            <p className="lcd-text text-[10px]">Edge Survival Node v4.0</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-white/10 text-white border border-white/20" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                activeTab === item.id ? "text-emergency" : "group-hover:text-emergency"
              )} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-hardware-line">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn("status-dot", isOffline ? "bg-emergency" : "status-dot-active")} />
              <span className="lcd-text">{isOffline ? 'Offline Mode' : 'Connected'}</span>
            </div>
            {isOffline && <WifiOff className="w-4 h-4 text-emergency" />}
          </div>
          <div className="p-3 bg-black/40 rounded border border-hardware-line">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3 h-3 text-safe" />
              <span className="lcd-text text-[10px]">Mesh Strength</span>
            </div>
            <div className="h-1 bg-hardware-line rounded-full overflow-hidden">
              <div className="h-full bg-safe w-3/4" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-20 lg:h-28 border-b border-hardware-line flex items-center justify-between px-4 lg:px-8 bg-hardware-bg/50 backdrop-blur-md z-40">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="p-2 lg:p-3 bg-emergency/20 rounded-xl">
              <Radio className="w-6 h-6 lg:w-8 lg:h-8 text-emergency" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-3xl font-black tracking-tighter uppercase italic leading-none">RESQNET AI</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all active:scale-90 shadow-xl relative"
            >
              <span className="text-xs lg:text-lg font-black tracking-tighter">YM</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-safe rounded-full border-2 border-hardware-bg" />
            </button>
          </div>
        </header>

        {/* Notifications */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="absolute top-24 lg:top-32 left-1/2 z-[100] w-[260px] bg-safe text-black p-3 rounded-xl shadow-[0_20px_50px_rgba(0,255,157,0.3)] flex items-start gap-3 border border-black/10"
            >
              <div className="p-1.5 bg-black/10 rounded-lg shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50 leading-none mb-1">System Intel</span>
                <span className="text-[11px] font-bold leading-tight line-clamp-2">{notification}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className={cn(
          "flex-1 relative",
          (activeTab === 'map' || activeTab === 'sensors' || activeTab === 'alerts') ? "p-0 overflow-hidden" : "p-4 lg:p-6 overflow-y-auto"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'intel' && <CrisisIntel showNotification={showNotification} />}
              {activeTab === 'alerts' && <LocalAlerts showNotification={showNotification} />}
              {activeTab === 'chat' && <ChatAssistant />}
              {activeTab === 'map' && <MeshMap showNotification={showNotification} />}
              {activeTab === 'sensors' && <EnvironmentSensors />}
              {activeTab === 'toolkit' && <Toolkit showNotification={showNotification} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden h-16 bg-hardware-bg/95 backdrop-blur-lg border-t border-hardware-line flex items-center justify-around px-2 shrink-0 z-50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all duration-200",
                activeTab === item.id ? "text-emergency" : "text-white/40"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium uppercase tracking-tighter">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-emergency rounded-full"
                />
              )}
            </button>
          ))}
        </nav>
      </main>

      {/* User Profile Menu Moved to Root */}
      <UserProfileMenu 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        showNotification={showNotification}
      />
    </div>
  );
}

