import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  History, 
  Bell, 
  Thermometer, 
  Droplets, 
  Fish, 
  Menu,
  AlertTriangle,
  Wifi 
} from 'lucide-react';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

/**
 * SALINITY MONITORING DASHBOARD (Clean Version - Fixed)
 * ------------------------------------------
 * Updates:
 * - Updated Fish List display logic to be accurate and comma-separated.
 * - Lists specific Calumpit species based on Salt Content (TDS).
 */

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Sensor Data State
  const [salinity, setSalinity] = useState(1.5); 
  const [temperature, setTemperature] = useState(29.2);
  
  // Historic Data for Chart
  const [historyData, setHistoryData] = useState([
    { time: '00:00', value: 0.5 },
    { time: '04:00', value: 0.8 },
    { time: '08:00', value: 1.2 },
    { time: '12:00', value: 2.5 },
    { time: '16:00', value: 1.8 },
    { time: '20:00', value: 1.1 },
    { time: '24:00', value: 0.9 },
  ]);

  // --- LOGIC: FRESHWATER VS BRACKISH FISH LIST ---
  const getEnvironmentStatus = (sal) => {
    // 0 - 2 PPT: Pure Freshwater (Ilog Condition)
    if (sal <= 2.0) {
      // Listahan ng isdang pang-tabang
      const fishList = "Tilapia, Hito, Dalag, Gurami, Ayungin, Martiniko, Biya, Carpa";
      return { 
        type: 'Freshwater', 
        message: 'LOW SALT CONTENT', 
        sub: `Available: ${fishList}`, // Comma-separated list
        color: 'from-emerald-400 to-green-600',
        icon: <Fish size={90} className="mb-6 drop-shadow-md opacity-90" />
      };
    }
    
    // 2.1 - 10 PPT: Brackish (May halong alat/dagat)
    if (sal > 2.0 && sal <= 10.0) {
      // Listahan ng isdang kaya ang alat
      const fishList = "Bangus, Apahap, Kanduli, Hipon, Sugpo, Talangka";
      return { 
        type: 'Brackish', 
        message: 'MODERATE SALT', 
        sub: `Available: ${fishList}`, // Comma-separated list
        color: 'from-sky-400 to-cyan-600',
        icon: <Fish size={90} className="mb-6 drop-shadow-md opacity-90" />
      };
    }

    // > 10 PPT: High Salinity (Delikado na sa freshwater species)
    return { 
      type: 'HighSalinity', 
      message: 'HIGH SALT CONTENT', 
      sub: 'Warning: Saltwater Intrusion (Risk of Fish Kill)', 
      color: 'from-orange-400 to-red-500',
      icon: <AlertTriangle size={80} className="mb-6 drop-shadow-md opacity-90" />
    };
  };

  const status = getEnvironmentStatus(salinity);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setSalinity(prev => {
        const change = (Math.random() - 0.5) * 0.3;
        let newValue = prev + change;
        return Math.max(0.1, Math.min(12.0, newValue)); 
      });
      
      setTemperature(prev => Math.max(26, Math.min(32, prev + (Math.random() - 0.5) * 0.1)));
      
      setHistoryData(prev => {
        const newData = [...prev.slice(1), { 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          value: salinity 
        }];
        return newData;
      });
    }, 3000); 

    return () => clearInterval(interval);
  }, [salinity]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-800 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-sky-50 border-r border-sky-100 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 flex items-center gap-3">
          <img 
            src="image.png" 
            alt="Aqualiv Logo" 
            className="h-20 w-auto object-contain" 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.style.display = 'none'; 
              e.target.parentNode.innerHTML = '<span class="text-sky-900 font-bold">Logo Missing</span>';
            }}
          />
        </div>

        <nav className="mt-8 px-4 space-y-2">
          <SidebarItem 
            icon={<Activity size={20} />} 
            label="Monitor" 
            active={activeTab === 'Dashboard'} 
            onClick={() => setActiveTab('Dashboard')}
          />
          <SidebarItem 
            icon={<History size={20} />} 
            label="Trends" 
            active={activeTab === 'History'} 
            onClick={() => setActiveTab('History')}
          />
          <SidebarItem 
            icon={<Bell size={20} />} 
            label="Alerts" 
            active={activeTab === 'Alerts'} 
            onClick={() => setActiveTab('Alerts')}
          />
        </nav>

        {/* System Status */}
        <div className="absolute bottom-8 left-4 right-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1 text-emerald-700">
            <Wifi size={16} />
            <span className="font-bold text-sm">System Online</span>
          </div>
          <p className="text-xs text-emerald-600/80">
            Connected to Smart Buoy
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="lg:hidden h-16 bg-white border-b flex items-center px-4 justify-between z-10">
          <div className="flex items-center gap-2">
            <img 
              src="image.png" 
              alt="Aqualiv Logo" 
              className="h-12 w-auto object-contain" 
            />
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-500">
            <Menu />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-hide">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Top Grid Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Main Advisory Card */}
              <div className={`
                lg:col-span-5 rounded-3xl p-8 flex flex-col justify-center items-center text-center text-white shadow-xl shadow-blue-200 transition-all duration-500
                bg-gradient-to-br ${status.color} relative overflow-hidden group
              `}>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="z-10 animate-float">
                  {status.icon}
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-wide leading-tight z-10 drop-shadow-sm mt-4">
                  {status.message}
                </h2>
                
                <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 z-10 border border-white/30">
                  <p className="font-medium text-sm lg:text-base text-blue-50">
                    {status.sub}
                  </p>
                </div>
              </div>

              {/* Right Side Stats Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Salt Content Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-500 font-medium text-sm">Salt Content (TDS)</p>
                      <div className="flex items-baseline mt-1">
                        <h3 className="text-4xl font-bold text-sky-600">{salinity.toFixed(1)}</h3>
                        <span className="text-lg text-slate-400 font-medium ml-1">ppt</span>
                      </div>
                    </div>
                    <div className="p-2 bg-sky-50 rounded-xl text-sky-500">
                      <Droplets size={24} />
                    </div>
                  </div>
                  
                  <div className="mt-6 h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historyData.slice(-5)}>
                        <defs>
                          <linearGradient id="colorSalinity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#0ea5e9" 
                          strokeWidth={3} 
                          fill="url(#colorSalinity)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Temperature Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-500 font-medium text-sm">Water Temperature</p>
                      <div className="flex items-baseline mt-1">
                        <h3 className="text-4xl font-bold text-slate-800">{temperature.toFixed(1)}</h3>
                        <span className="text-lg text-slate-400 font-medium ml-1">°C</span>
                      </div>
                    </div>
                    <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
                      <Thermometer size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                     <div className="w-full bg-slate-100 h-2 rounded-full mt-8 overflow-hidden">
                        <div className="bg-rose-400 h-full rounded-full" style={{ width: `${(temperature / 40) * 100}%` }}></div>
                     </div>
                     <p className="text-xs text-slate-400 mt-2 text-right">Max 32°C recommended</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Chart Area */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Salt Content Trends</h3>
                  <p className="text-sm text-slate-400">Last 24 Hours</p>
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      domain={[0, 15]} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      label={{ value: 'Salt (ppt)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0ea5e9" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorMain)" 
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group
      ${active 
        ? 'bg-sky-50 text-sky-900 shadow-sm font-semibold' 
        : 'text-slate-500 hover:bg-white hover:text-sky-600 hover:shadow-sm'
      }
    `}
  >
    <div className={`
      ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}
    `}>
      {icon}
    </div>
    <span>{label}</span>
  </button>
);

export default App;