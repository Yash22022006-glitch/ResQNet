import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, 
  Users, 
  MapPin, 
  Wind, 
  Droplets, 
  Zap,
  ChevronRight,
  Bell,
  X,
  Thermometer,
  Skull,
  CloudRain,
  Waves,
  Wifi,
  Cpu,
  Activity as ActivityIcon
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [showSafeMessage, setShowSafeMessage] = useState(false);

  const handleSOS = () => {
    setIsSOSActive(true);
    setShowSafeMessage(false);
  };

  const handleSafe = () => {
    setIsSOSActive(false);
    setShowSafeMessage(true);
    setTimeout(() => setShowSafeMessage(false), 3000);
  };

  return (
    <div className="space-y-4 lg:space-y-6 relative">
      {/* Hero SOS Section */}
      <div className={cn(
        "hardware-panel p-5 lg:p-8 relative overflow-hidden transition-all duration-500",
        isSOSActive ? "bg-emergency/20 border-emergency" : "bg-gradient-to-br from-emergency/20 to-transparent border-emergency/30"
      )}>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8">
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2 tracking-tight">
              {isSOSActive ? "SOS BROADCASTING" : "Emergency SOS"}
            </h2>
            <p className="text-white/70 text-sm lg:text-base mb-6">
              {isSOSActive 
                ? "Responders have been notified of your precise coordinates. Stay where you are if safe."
                : "Broadcasting your location and status to the local mesh network. Nearby responders will be notified immediately."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center md:justify-start">
              <button 
                onClick={handleSOS}
                disabled={isSOSActive}
                className={cn(
                  "px-6 py-3 text-white text-sm lg:text-base font-bold rounded-lg shadow-[0_0_20px_rgba(255,68,68,0.4)] transition-all active:scale-95",
                  isSOSActive ? "bg-emergency/50 cursor-not-allowed" : "bg-emergency hover:bg-emergency/90"
                )}
              >
                {isSOSActive ? "SOS ACTIVE" : "BROADCAST SOS"}
              </button>
              <button 
                onClick={handleSafe}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white text-sm lg:text-base font-bold rounded-lg hover:bg-white/20 transition-all relative"
              >
                I AM SAFE
                {showSafeMessage && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-8 left-0 right-0 text-[10px] text-safe font-bold"
                  >
                    STATUS UPDATED
                  </motion.span>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 flex items-center justify-center relative transition-colors duration-500",
              isSOSActive ? "border-emergency shadow-[0_0_30px_rgba(255,68,68,0.3)]" : "border-emergency/30"
            )}>
              <motion.div 
                animate={isSOSActive ? { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] } : { scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: isSOSActive ? 1 : 2, repeat: Infinity }}
                className="absolute inset-0 bg-emergency rounded-full"
              />
              <AlertCircle className={cn(
                "w-10 h-10 lg:w-12 lg:h-12 relative z-10 transition-colors",
                isSOSActive ? "text-white" : "text-emergency"
              )} />
            </div>
            <span className={cn(
              "lcd-text text-[10px] lg:text-xs transition-colors",
              isSOSActive ? "text-white animate-pulse" : "text-emergency"
            )}>
              {isSOSActive ? "EMERGENCY SIGNAL ACTIVE" : "Signal Ready"}
            </span>
          </div>
        </div>
      </div>

      {/* Mesh Network Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <div className="hardware-panel p-5">
          <div className="hardware-header border-b-0 mb-4">
            <div className="flex items-center gap-2">
              <ActivityIcon className="w-4 h-4 text-safe" />
              <span className="lcd-text text-[10px]">Mesh Network Status</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-safe" />
                <span className="text-[10px] uppercase font-bold opacity-50">Connected Nodes</span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">24</div>
              <div className="text-[8px] font-mono text-safe uppercase mt-1">All Nodes Online</div>
            </div>
            
            <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <ActivityIcon className="w-4 h-4 text-safe" />
                <span className="text-[10px] uppercase font-bold opacity-50">Network Health</span>
              </div>
              <div className="text-2xl font-mono font-bold text-safe">98%</div>
              <div className="text-[8px] font-mono text-safe uppercase mt-1">Optimal Performance</div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold opacity-50 px-1">
              <span>Traffic Load</span>
              <span>12.4 KB/s</span>
            </div>
            <div className="h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '35%' }}
                className="h-full bg-safe"
              />
            </div>
          </div>
        </div>

        <div className="hardware-panel p-5">
          <div className="hardware-header border-b-0 mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-warning" />
              <span className="lcd-text text-[10px]">System Resources</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Edge Compute', value: '42%', color: 'bg-safe' },
              { label: 'Mesh Storage', value: '18%', color: 'bg-safe' },
              { label: 'Backhaul Latency', value: '12ms', color: 'bg-safe', isBar: false },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold">
                  <span className="opacity-50">{item.label}</span>
                  <span className={cn(item.color.replace('bg-', 'text-'))}>{item.value}</span>
                </div>
                {item.isBar !== false && (
                  <div className="h-1 bg-black/60 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: item.value }}
                      className={cn("h-full", item.color)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
