import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, 
  Droplets, 
  Zap,
  Thermometer,
  Skull,
  CloudRain,
  Cloud,
  Sun,
  CloudLightning,
  Activity,
  X,
  Info,
  TrendingUp,
  History,
  ShieldCheck,
  Download,
  ChevronDown,
  FileSpreadsheet
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Sensor {
  id: string;
  label: string;
  value: string;
  icon: any;
  status: 'critical' | 'warning' | 'normal';
  progress: number;
  color: string;
  textColor: string;
  note: string;
  details: {
    description: string;
    history: { time: string; value: string }[];
    recommendations: string[];
    riskLevel: string;
  };
}

export default function EnvironmentSensors() {
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (range: '24h' | '7d') => {
    // Generate CSV content
    let csvContent = "Sensor ID,Sensor Label,Timestamp,Value,Status,Risk Level\n";
    
    sensors.forEach(sensor => {
      // Use actual history first
      sensor.details.history.forEach(h => {
        csvContent += `${sensor.id},${sensor.label},${h.time},"${h.value}",${sensor.status},${sensor.details.riskLevel}\n`;
      });
      
      // Simulate historical data for the requested range
      const iterations = range === '24h' ? 24 : 168; // 24 hours or 7 days (168 hours)
      const interval = range === '24h' ? 1 : 6; // Every hour for 24h, every 6 hours for 7d
      
      for (let i = 1; i <= iterations; i += interval) {
        const date = new Date();
        date.setHours(date.getHours() - i);
        const timeStr = date.toISOString().replace('T', ' ').substring(0, 16);
        
        // Add some slight variation to the value for realism in the export
        let val = sensor.value;
        if (sensor.id === 'temp') {
          const baseTemp = parseInt(sensor.value);
          val = `${(baseTemp + (Math.random() * 4 - 2)).toFixed(1)}°C`;
        } else if (sensor.id === 'water') {
          const baseLevel = parseFloat(sensor.value);
          val = `${(baseLevel + (Math.random() * 0.4 - 0.2)).toFixed(2)}m`;
        }
        
        csvContent += `${sensor.id},${sensor.label},${timeStr},"${val}",${sensor.status},${sensor.details.riskLevel}\n`;
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `resqnet_sensor_data_${range}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  const sensors: Sensor[] = [
    {
      id: 'water',
      label: 'Water Level',
      value: '+1.2m',
      icon: Droplets,
      status: 'critical',
      progress: 75,
      color: 'bg-emergency',
      textColor: 'text-emergency',
      note: 'Critical threshold: 2.0m',
      details: {
        description: 'Real-time monitoring of local water bodies and drainage systems. Current levels indicate significant rising due to recent precipitation.',
        history: [
          { time: '08:00', value: '+0.8m' },
          { time: '09:00', value: '+1.0m' },
          { time: '10:00', value: '+1.2m' },
        ],
        recommendations: [
          'Move valuable items to higher ground',
          'Avoid low-lying areas and basements',
          'Monitor emergency broadcast channels'
        ],
        riskLevel: 'HIGH - Flood Imminent'
      }
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: '12 km/h',
      icon: Wind,
      status: 'normal',
      progress: 30,
      color: 'bg-safe',
      textColor: 'text-safe',
      note: 'Normal range',
      details: {
        description: 'Anemometer readings from the local mesh node. Current wind speeds are within safe operational parameters for all structures.',
        history: [
          { time: '08:00', value: '10 km/h' },
          { time: '09:00', value: '14 km/h' },
          { time: '10:00', value: '12 km/h' },
        ],
        recommendations: [
          'Secure loose outdoor items if speeds exceed 40 km/h',
          'No immediate action required'
        ],
        riskLevel: 'LOW - Safe'
      }
    },
    {
      id: 'air',
      label: 'Air Quality (AQI)',
      value: '142',
      icon: Skull,
      status: 'warning',
      progress: 65,
      color: 'bg-warning',
      textColor: 'text-warning',
      note: 'Unhealthy for sensitive groups',
      details: {
        description: 'Particulate matter (PM2.5) and ozone levels. Elevated readings likely due to stagnant air and local industrial activity.',
        history: [
          { time: '08:00', value: '110' },
          { time: '09:00', value: '125' },
          { time: '10:00', value: '142' },
        ],
        recommendations: [
          'Sensitive individuals should limit outdoor exertion',
          'Keep windows closed',
          'Use air purifiers if available'
        ],
        riskLevel: 'MODERATE - Health Advisory'
      }
    },
    {
      id: 'radiation',
      label: 'Radiation Level',
      value: '0.12 μSv/h',
      icon: Zap,
      status: 'normal',
      progress: 15,
      color: 'bg-safe',
      textColor: 'text-safe',
      note: 'Background levels',
      details: {
        description: 'Geiger counter readings monitoring ionizing radiation. Current levels are consistent with natural background radiation.',
        history: [
          { time: '08:00', value: '0.11 μSv/h' },
          { time: '09:00', value: '0.12 μSv/h' },
          { time: '10:00', value: '0.12 μSv/h' },
        ],
        recommendations: [
          'No action required',
          'Levels are within safe environmental limits'
        ],
        riskLevel: 'LOW - Normal Background'
      }
    },
    {
      id: 'temp',
      label: 'Temperature',
      value: '32°C',
      icon: Thermometer,
      status: 'warning',
      progress: 80,
      color: 'bg-warning',
      textColor: 'text-warning',
      note: 'High heat warning',
      details: {
        description: 'Ambient air temperature. High heat index increases risk of heat-related illnesses.',
        history: [
          { time: '08:00', value: '28°C' },
          { time: '09:00', value: '30°C' },
          { time: '10:00', value: '32°C' },
        ],
        recommendations: [
          'Stay hydrated',
          'Seek shade or air-conditioned environments',
          'Avoid strenuous activity during peak sun hours'
        ],
        riskLevel: 'MODERATE - Heat Advisory'
      }
    },
    {
      id: 'co2',
      label: 'CO2 Concentration',
      value: '415 ppm',
      icon: CloudRain,
      status: 'normal',
      progress: 45,
      color: 'bg-safe',
      textColor: 'text-safe',
      note: 'Atmospheric baseline',
      details: {
        description: 'Carbon dioxide concentration in the atmosphere. Current levels are typical for outdoor urban environments.',
        history: [
          { time: '08:00', value: '410 ppm' },
          { time: '09:00', value: '412 ppm' },
          { time: '10:00', value: '415 ppm' },
        ],
        recommendations: [
          'Ensure proper ventilation in enclosed spaces',
          'No immediate environmental threat'
        ],
        riskLevel: 'LOW - Stable'
      }
    },
    {
      id: 'gusts',
      label: 'Wind Gusts',
      value: '18 km/h',
      icon: Wind,
      status: 'warning',
      progress: 55,
      color: 'bg-warning',
      textColor: 'text-warning',
      note: 'Max gust: 28 km/h (1h)',
      details: {
        description: 'Measures sudden, brief increases in wind speed. Gusts can indicate changing weather patterns or approaching storm fronts.',
        history: [
          { time: '08:00', value: '15 km/h' },
          { time: '09:00', value: '22 km/h' },
          { time: '10:00', value: '18 km/h' },
        ],
        recommendations: [
          'Secure loose outdoor equipment',
          'Monitor for potential structural stress on temporary shelters',
          'Be aware of flying debris in high gust areas'
        ],
        riskLevel: 'MODERATE - Gusty Conditions'
      }
    }
  ];

  const forecastData = [
    { time: '12:00', temp: '32°C', precip: '10%', wind: '12 km/h', icon: Sun },
    { time: '15:00', temp: '34°C', precip: '15%', wind: '14 km/h', icon: Sun },
    { time: '18:00', temp: '30°C', precip: '40%', wind: '18 km/h', icon: Cloud },
    { time: '21:00', temp: '27°C', precip: '70%', wind: '22 km/h', icon: CloudRain },
    { time: '00:00', temp: '25°C', precip: '85%', wind: '25 km/h', icon: CloudLightning },
    { time: '03:00', temp: '24°C', precip: '60%', wind: '20 km/h', icon: CloudRain },
    { time: '06:00', temp: '23°C', precip: '30%', wind: '15 km/h', icon: Cloud },
    { time: '09:00', temp: '26°C', precip: '10%', wind: '12 km/h', icon: Sun },
  ];

  return (
    <div className="flex flex-col h-full bg-hardware-bg lg:p-6">
      <div className="hardware-panel flex-1 flex flex-col min-h-0">
        {/* Fixed Header */}
        <div className="hardware-header shrink-0 bg-hardware-bg z-20">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-safe" />
            <span className="lcd-text text-[10px] lg:text-xs">Environment Sensor Array</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] lg:text-[10px] font-mono opacity-50 uppercase tracking-widest">Scanning...</span>
            <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
            
            <div className="relative ml-2">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-all active:scale-95"
              >
                <Download className="w-3 h-3 text-safe" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Export</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", showExportMenu && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showExportMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setShowExportMenu(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-hardware-bg border border-hardware-line rounded-lg shadow-2xl z-40 overflow-hidden"
                    >
                      <div className="p-2 border-b border-hardware-line bg-black/20">
                        <span className="text-[9px] font-mono opacity-50 uppercase tracking-widest">Select Range</span>
                      </div>
                      <div className="p-1">
                        <button 
                          onClick={() => handleExport('24h')}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded transition-colors text-left group"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-safe/50 group-hover:text-safe" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold">Last 24 Hours</span>
                            <span className="text-[8px] opacity-40 uppercase">Hourly Resolution</span>
                          </div>
                        </button>
                        <button 
                          onClick={() => handleExport('7d')}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded transition-colors text-left group"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-safe/50 group-hover:text-safe" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold">Last 7 Days</span>
                            <span className="text-[8px] opacity-40 uppercase">6h Resolution</span>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {/* ... Modal code remains the same ... */}
          {selectedSensor && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="hardware-panel w-full max-w-2xl max-h-[90vh] flex flex-col"
              >
                <div className="hardware-header shrink-0 bg-hardware-bg">
                  <div className="flex items-center gap-2">
                    <selectedSensor.icon className={cn("w-4 h-4", selectedSensor.textColor)} />
                    <span className="lcd-text text-[10px]">{selectedSensor.label} Analysis</span>
                  </div>
                  <button 
                    onClick={() => setSelectedSensor(null)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 scrollbar-hide">
                  {/* Header Info */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl lg:text-3xl font-black tracking-tighter uppercase italic">
                        {selectedSensor.label}
                      </h2>
                      <p className={cn("text-xs font-mono font-bold uppercase tracking-widest", selectedSensor.textColor)}>
                        Status: {selectedSensor.riskLevel}
                      </p>
                    </div>
                    <div className="bg-black/40 border border-white/10 p-4 rounded-xl text-center min-w-[140px]">
                      <div className="text-[10px] uppercase opacity-40 mb-1">Current Value</div>
                      <div className={cn("text-2xl font-mono font-bold", selectedSensor.textColor)}>
                        {selectedSensor.value}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/60">
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Sensor Description</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed bg-white/5 p-4 rounded-lg border border-white/5">
                      {selectedSensor.details.description}
                    </p>
                  </div>

                  {/* History & Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <History className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Recent History</span>
                      </div>
                      <div className="space-y-2">
                        {selectedSensor.details.history.map((h, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded border border-white/5">
                            <span className="text-xs font-mono opacity-50">{h.time}</span>
                            <span className="text-xs font-mono font-bold">{h.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Safety Protocols</span>
                      </div>
                      <div className="space-y-2">
                        {selectedSensor.details.recommendations.map((r, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded border border-white/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-safe mt-1.5 shrink-0" />
                            <span className="text-xs text-white/80">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Visual Trend */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/60">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Live Telemetry</span>
                    </div>
                    <div className="h-24 bg-black/40 rounded-xl border border-white/5 p-4 flex items-end gap-1">
                      {[40, 65, 45, 90, 55, 70, 85, 60, 75, 50, 65, 80].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.05 }}
                          className={cn("flex-1 rounded-t-sm", selectedSensor.color, "opacity-40")}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-hide">
          {/* Detailed Analysis Section */}
          <div className="mb-8 lg:mb-12 hardware-panel bg-black/20">
            <div className="hardware-header border-b-0">
              <span className="lcd-text text-[9px]">Atmospheric Analysis Report</span>
            </div>
            <div className="p-4 lg:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/60">Trend Analysis</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Particulate Matter', trend: 'Rising', value: '+4.2%', color: 'text-warning' },
                      { label: 'Humidity Index', trend: 'Stable', value: '0.0%', color: 'text-safe' },
                      { label: 'UV Radiation', trend: 'Falling', value: '-1.5%', color: 'text-safe' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5">
                        <span className="text-[11px]">{item.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] opacity-40 uppercase">{item.trend}</span>
                          <span className={cn("font-mono text-[11px] font-bold", item.color)}>{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/60">System Status</h4>
                  <div className="p-4 bg-white/5 rounded border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px]">Sensor Calibration</span>
                      <span className="text-[10px] font-bold text-safe uppercase">Optimal</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px]">Data Uplink</span>
                      <span className="text-[10px] font-bold text-safe uppercase">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px]">Last Sync</span>
                      <span className="text-[10px] font-mono opacity-50">09:53:13 UTC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Forecast Section */}
          <div className="mb-8 lg:mb-12 hardware-panel bg-black/20">
            <div className="hardware-header border-b-0">
              <span className="lcd-text text-[9px]">24-Hour Weather Forecast</span>
            </div>
            <div className="p-4 lg:p-6 overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 min-w-max">
                {forecastData.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-xl min-w-[120px] space-y-3"
                  >
                    <span className="text-[10px] font-mono opacity-50 uppercase">{item.time}</span>
                    <item.icon className={cn(
                      "w-8 h-8",
                      item.precip > '50%' ? "text-emergency" : item.precip > '20%' ? "text-warning" : "text-safe"
                    )} />
                    <div className="text-center">
                      <div className="text-lg font-mono font-bold">{item.temp}</div>
                      <div className="text-[10px] opacity-60 flex items-center justify-center gap-1">
                        <Droplets className="w-3 h-3" />
                        {item.precip}
                      </div>
                      <div className="text-[10px] opacity-60 flex items-center justify-center gap-1">
                        <Wind className="w-3 h-3" />
                        {item.wind}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {sensors.map((sensor, i) => (
              <motion.div
                key={sensor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedSensor(sensor)}
                className="space-y-4 p-4 lg:p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg bg-black/40 border border-white/10 group-hover:border-white/30 transition-colors",
                      sensor.textColor
                    )}>
                      <sensor.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs lg:text-sm font-bold tracking-tight">{sensor.label}</span>
                  </div>
                  <span className={cn("text-sm lg:text-base font-mono font-bold", sensor.textColor)}>
                    {sensor.value}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${sensor.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full transition-all", sensor.color)}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-white/40 italic">{sensor.note}</p>
                    <span className="text-[8px] font-mono opacity-30 uppercase tracking-tighter">Sensor ID: {sensor.id.toUpperCase()}-04</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
