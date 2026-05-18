import { 
  Heart, 
  Flame, 
  Droplets, 
  Wind, 
  Zap, 
  Search,
  ChevronRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Toolkit({ showNotification }: { showNotification: (msg: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState('First Aid');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingGuide, setViewingGuide] = useState<any | null>(null);

  const categories = [
    { name: 'First Aid', icon: Heart, color: 'text-emergency' },
    { name: 'Fire Safety', icon: Flame, color: 'text-orange-500' },
    { name: 'Flood Prep', icon: Droplets, color: 'text-blue-500' },
    { name: 'Storm Safety', icon: Wind, color: 'text-slate-400' },
    { name: 'Power/Comms', icon: Zap, color: 'text-warning' },
  ];

  const content: Record<string, any[]> = {
    'First Aid': [
      { title: 'CPR Instructions', description: 'Step-by-step guide for adult and child CPR.', duration: '5 min read', fullContent: '1. Check the scene for safety.\n2. Tap and shout to check responsiveness.\n3. Call 911 or local emergency services.\n4. Place hands in center of chest.\n5. Push hard and fast (100-120 bpm).' },
      { title: 'Bleeding Control', description: 'How to apply pressure and use a tourniquet.', duration: '3 min read', fullContent: '1. Apply direct pressure with clean cloth.\n2. If bleeding doesn\'t stop, use a tourniquet.\n3. Wrap tightly 2-3 inches above the wound.\n4. Note the time of application.' },
      { title: 'Treating Shock', description: 'Immediate actions for trauma victims.', duration: '2 min read', fullContent: '1. Lay the person down and elevate legs.\n2. Keep them warm and comfortable.\n3. Do not give them anything to eat or drink.\n4. Monitor breathing and pulse.' },
    ],
    'Flood Prep': [
      { title: 'Evacuation Plan', description: 'What to pack and when to leave.', duration: '4 min read', fullContent: '1. Know your evacuation routes.\n2. Pack a "Go Bag" with essentials.\n3. Turn off utilities if instructed.\n4. Move to higher ground immediately.' },
      { title: 'Water Safety', description: 'Avoiding hazards in standing water.', duration: '3 min read', fullContent: '1. Do not walk or drive through floodwaters.\n2. Avoid downed power lines.\n3. Be aware of hidden debris and animals.\n4. Wash hands frequently if exposed to water.' },
      { title: 'Emergency Kit', description: 'Essential items for flood survival.', duration: '2 min read', fullContent: '1. 3-day supply of water (1 gal/person/day).\n2. Non-perishable food and manual can opener.\n3. Battery-powered radio and flashlight.\n4. First aid kit and medications.' },
    ]
  };

  const currentGuides = (content[selectedCategory] || content['First Aid']).filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6 h-full">
      {/* Sidebar Categories - Horizontal scroll on mobile */}
      <div className="lg:col-span-1 space-y-2">
        <div className="hardware-panel p-3 lg:p-4 mb-2 lg:mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-hardware-line rounded-lg pl-9 lg:pl-10 pr-4 py-1.5 lg:py-2 text-xs lg:text-sm focus:outline-none focus:border-white/30"
            />
          </div>
        </div>
        
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                setViewingGuide(null);
              }}
              className={cn(
                "flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all border whitespace-nowrap lg:w-full",
                selectedCategory === cat.name 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "bg-hardware-bg border-hardware-line text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <cat.icon className={cn("w-4 h-4 lg:w-5 lg:h-5", selectedCategory === cat.name ? cat.color : "")} />
              <span className="font-medium text-xs lg:text-sm">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-4 lg:space-y-6">
        <div className="hardware-panel flex-1 min-h-[400px]">
          <div className="hardware-header">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-safe" />
              <span className="lcd-text text-[10px] lg:text-xs">
                {viewingGuide ? viewingGuide.title : `${selectedCategory} Guides`}
              </span>
            </div>
            {viewingGuide && (
              <button 
                onClick={() => setViewingGuide(null)}
                className="text-[9px] lg:text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100"
              >
                Back to list
              </button>
            )}
          </div>
          
          <div className="p-4 lg:p-6">
            <AnimatePresence mode="wait">
              {viewingGuide ? (
                <motion.div
                  key="guide-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-white/80 leading-relaxed whitespace-pre-line text-sm lg:text-base">
                      {viewingGuide.fullContent}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => showNotification('Guide saved to local Edge Node storage.')}
                      className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Save Offline
                    </button>
                    <button 
                      onClick={() => showNotification('Sharing guide via local mesh network...')}
                      className="flex-1 py-3 bg-emergency/20 text-emergency border border-emergency/30 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Share Guide
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="guide-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3 lg:space-y-4"
                >
                  {currentGuides.length > 0 ? (
                    currentGuides.map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => setViewingGuide(item)}
                        className="group p-3 lg:p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <h3 className="font-bold text-sm lg:text-lg group-hover:text-emergency transition-colors truncate">{item.title}</h3>
                            <p className="text-[11px] lg:text-sm text-white/60 line-clamp-2">{item.description}</p>
                            <div className="flex items-center gap-2 pt-2">
                              <div className="px-1.5 py-0.5 bg-black/40 rounded text-[8px] lg:text-[10px] font-mono opacity-50">{item.duration}</div>
                              <div className="px-1.5 py-0.5 bg-safe/10 text-safe rounded text-[8px] lg:text-[10px] font-bold uppercase tracking-tighter">Verified</div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 opacity-30">
                      <Search className="w-12 h-12 mx-auto mb-4" />
                      <p>No guides found matching "{searchQuery}"</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
