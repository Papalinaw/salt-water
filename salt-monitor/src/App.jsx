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
  Wifi,
  MessageSquare, // New icon for SMS
  Smartphone,    // New icon for Push
  Check
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
 * SALINITY MONITORING DASHBOARD (Alerts & SMS Feature)
 * ------------------------------------------
 * Updates:
 * - Removed "Trends" from Sidebar.
 * - Added "Alerts" View with SMS (4G) and Push Notification toggles.
 * - Optimized for keypad phone users via SMS logic.
 */

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Notification States
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('0917xxxxxxx');
  
  // Sensor Data State
  const [salinity, setSalinity] = useState(1.5); 
  const [temperature, setTemperature] = useState(29.2);
  
  // Historic Data for Chart
  const [historyData, setHistoryData] = useState([
    { time: '10:00 AM', value: 0.5 },
    { time: '10:30 AM', value: 0.8 },
    { time: '11:00 AM', value: 1.2 },
    { time: '11:30 AM', value: 2.5 },
    { time: '12:00 PM', value: 1.8 },
    { time: '12:30 PM', value: 1.1 },
    { time: '01:00 PM', value: 0.9 },
  ]);

  // --- LOGIC: FRESHWATER VS BRACKISH FISH LIST ---
  const getEnvironmentStatus = (sal) => {
    if (sal <= 2.0) {
      const fishList = "Tilapia, Hito, Dalag, Gurami, Ayungin, Martiniko, Biya, Carpa";
      return { 
        type: 'Freshwater', 
        message: 'LOW SALT CONTENT', 
        sub: `Available: ${fishList}`, 
        color: 'from-emerald-400 to-green-600',
        icon: <Fish size={90} className="mb-6 drop-shadow-md opacity-90 text-white" />
      };
    }
    
    if (sal > 2.0 && sal <= 10.0) {
      const fishList = "Bangus, Apahap, Kanduli, Hipon, Sugpo, Talangka";
      return { 
        type: 'Brackish', 
        message: 'MODERATE SALT', 
        sub: `Available: ${fishList}`, 
        color: 'from-sky-400 to-cyan-600',
        icon: <Fish size={90} className="mb-6 drop-shadow-md opacity-90 text-white" />
      };
    }

    return { 
      type: 'HighSalinity', 
      message: 'HIGH SALT CONTENT', 
      sub: 'Warning: Saltwater Intrusion (Risk of Fish Kill)', 
      color: 'from-orange-400 to-red-500',
      icon: <AlertTriangle size={80} className="mb-6 drop-shadow-md opacity-90 text-white" />
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
        const lastEntry = prev[prev.length - 1];
        const lastTime = new Date(`1/1/2024 ${lastEntry.time}`);
        lastTime.setMinutes(lastTime.getMinutes() + 30);
        const newTimeStr = lastTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });

        const newData = [...prev.slice(1), { 
          time: newTimeStr, 
          value: salinity 
        }];
        return newData;
      });
    }, 3000); 

    return () => clearInterval(interval);
  }, [salinity, temperature]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden selection:bg-blue-100">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 flex items-center justify-center border-b border-slate-50">
          <img 
            src="image.png" 
            alt="Aqualiv Logo" 
            className="h-24 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300" 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.style.display = 'none'; 
              e.target.parentNode.innerHTML = '<span class="text-sky-900 font-bold text-2xl tracking-tighter">Aqualiv</span>';
            }}
          />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
          <SidebarItem 
            icon={<Activity size={20} />} 
            label="Monitor" 
            active={activeTab === 'Dashboard'} 
            onClick={() => setActiveTab('Dashboard')}
          />
          {/* Removed Trends as requested */}
          <SidebarItem 
            icon={<Bell size={20} />} 
            label="Alerts" 
            active={activeTab === 'Alerts'} 
            onClick={() => setActiveTab('Alerts')}
          />
        </nav>

        {/* System Status */}
        <div className="p-6 border-t border-slate-50">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1 text-emerald-700">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute top-0 left-0"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full relative z-10"></div>
              </div>
              <span className="font-bold text-sm tracking-wide">SYSTEM ONLINE</span>
            </div>
            <p className="text-xs text-emerald-600/70 font-medium pl-4">
              4G Module Active
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50/50">
        <header className="lg:hidden h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center px-4 justify-between z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <img 
              src="image.png" 
              alt="Aqualiv Logo" 
              className="h-10 w-auto object-contain" 
            />
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Menu />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* --- DASHBOARD VIEW --- */}
            {activeTab === 'Dashboard' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Advisory Card */}
                  <div className={`
                    lg:col-span-5 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center text-white shadow-xl shadow-slate-200 transition-all duration-500 hover:shadow-2xl
                    bg-gradient-to-br ${status.color} relative overflow-hidden group border border-white/20
                  `}>
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="z-10 animate-float transform group-hover:scale-110 transition-transform duration-500">
                      {status.icon}
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight z-10 drop-shadow-md mt-6">
                      {status.message}
                    </h2>
                    <div className="mt-6 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 z-10 border border-white/30 shadow-lg">
                      <p className="font-semibold text-sm lg:text-base text-white tracking-wide">
                        {status.sub}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Salt Content */}
                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Salt Content (TDS)</p>
                          <div className="flex items-baseline mt-2">
                            <h3 className="text-5xl font-black text-slate-800 tracking-tight">{salinity.toFixed(1)}</h3>
                            <span className="text-lg text-slate-400 font-semibold ml-1">ppt</span>
                          </div>
                        </div>
                        <div className="p-3 bg-white shadow-sm rounded-2xl text-sky-500 group-hover:scale-110 transition-transform duration-300">
                          <Droplets size={28} />
                        </div>
                      </div>
                      <div className="mt-8 h-20 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={historyData.slice(-5)}>
                            <defs>
                              <linearGradient id="colorSalinity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={4} fill="url(#colorSalinity)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Water Temperature</p>
                          <div className="flex items-baseline mt-2">
                            <h3 className="text-5xl font-black text-slate-800 tracking-tight">{temperature.toFixed(1)}</h3>
                            <span className="text-lg text-slate-400 font-semibold ml-1">°C</span>
                          </div>
                        </div>
                        <div className="p-3 bg-white shadow-sm rounded-2xl text-rose-500 group-hover:scale-110 transition-transform duration-300">
                          <Thermometer size={28} />
                        </div>
                      </div>
                      <div className="mt-6 relative z-10">
                         <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                            <span>0°C</span>
                            <span className="text-slate-800">Ideal: 26-32°C</span>
                            <span>40°C</span>
                         </div>
                         <div className="w-full bg-slate-200/50 h-3 rounded-full overflow-hidden shadow-inner">
                            <div className="bg-gradient-to-r from-orange-400 to-rose-500 h-full rounded-full shadow-sm transition-all duration-1000 ease-out" style={{ width: `${(temperature / 40) * 100}%` }}></div>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Chart Area */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">Salt Content Trends</h3>
                      <p className="text-sm text-slate-400 font-medium">Last 24 Hours History</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">Daily</span>
                    </div>
                  </div>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={10} />
                        <YAxis domain={[0, 15]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} label={{ value: 'Salt (ppt)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontFamily: 'sans-serif' }} itemStyle={{ color: '#1e293b', fontWeight: 700 }} />
                        <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorMain)" animationDuration={1500} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {/* --- ALERTS VIEW --- */}
            {activeTab === 'Alerts' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="mb-8">
                  <h1 className="text-3xl font-black text-slate-800 tracking-tight">Alert Settings</h1>
                  <p className="text-slate-500 mt-2">Manage how you receive water quality updates.</p>
                </div>

                {/* SMS Notification Card */}
                <div className={`
                  bg-white rounded-[2rem] p-8 shadow-sm border transition-all duration-300
                  ${smsEnabled ? 'border-sky-200 shadow-sky-100' : 'border-slate-100'}
                `}>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-6">
                      <div className={`p-4 rounded-2xl ${smsEnabled ? 'bg-sky-50 text-sky-600' : 'bg-slate-50 text-slate-400'}`}>
                        <MessageSquare size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">SMS Notifications</h3>
                        <div className="flex items-center gap-2 mt-1 mb-2">
                           <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-md tracking-wider">4G Module Enabled</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                          Para sa mga gumagamit ng <strong>keypad phone</strong>. Makakatanggap kayo ng text message gamit ang aming 4G module kapag tumaas ang salt content.
                        </p>
                      </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <button 
                      onClick={() => setSmsEnabled(!smsEnabled)}
                      className={`
                        w-16 h-9 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-sky-100
                        ${smsEnabled ? 'bg-sky-500' : 'bg-slate-200'}
                      `}
                    >
                      <div className={`
                        w-7 h-7 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm flex items-center justify-center
                        ${smsEnabled ? 'left-8' : 'left-1'}
                      `}>
                        {smsEnabled && <Check size={14} className="text-sky-500 stroke-[3]" />}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Push Notification Card */}
                <div className={`
                  bg-white rounded-[2rem] p-8 shadow-sm border transition-all duration-300
                  ${pushEnabled ? 'border-indigo-200 shadow-indigo-100' : 'border-slate-100'}
                `}>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-6">
                      <div className={`p-4 rounded-2xl ${pushEnabled ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                        <Smartphone size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">Push Notifications</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mt-2">
                          Makatanggap ng notifications sa smartphone o laptop kung kayo ay online.
                        </p>
                      </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <button 
                      onClick={() => setPushEnabled(!pushEnabled)}
                      className={`
                        w-16 h-9 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-100
                        ${pushEnabled ? 'bg-indigo-500' : 'bg-slate-200'}
                      `}
                    >
                      <div className={`
                        w-7 h-7 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm flex items-center justify-center
                        ${pushEnabled ? 'left-8' : 'left-1'}
                      `}>
                         {pushEnabled && <Check size={14} className="text-indigo-500 stroke-[3]" />}
                      </div>
                    </button>
                  </div>
                </div>

              </div>
            )}

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
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group font-medium
      ${active 
        ? 'bg-sky-100 text-sky-700 shadow-sm' 
        : 'text-slate-500 hover:bg-white hover:text-sky-600 hover:shadow-sm'
      }
    `}
  >
    <div className={`
      ${active ? 'text-sky-600' : 'text-slate-400 group-hover:text-sky-600'}
    `}>
      {icon}
    </div>
    <span>{label}</span>
  </button>
);

export default App;