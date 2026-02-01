import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  History, 
  Bell, 
  Settings, 
  Wifi, 
  Thermometer, 
  Droplets, 
  Fish, 
  Menu,
  Battery,
  Signal,
  Sparkles,
  Search,
  Loader,
  CheckCircle,
  XCircle,
  AlertTriangle
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
 * SMART BUOY DASHBOARD (CALUMPIT RIVER MONITOR)
 * ------------------------------------------
 * Context: Monitors river salinity for Freshwater (Tilapia/Hito) and 
 * Brackish (Bangus/Apahap) species.
 */

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Sensor Data State
  // Defaulting to 1.5 ppt (Typical river/estuary mix)
  const [salinity, setSalinity] = useState(1.5); 
  const [temperature, setTemperature] = useState(29.2);
  const [batteryLevel, setBatteryLevel] = useState(92);
  
  // Historic Data for Chart
  const [historyData, setHistoryData] = useState([
    { time: '00:00', value: 0.5 },
    { time: '04:00', value: 0.8 },
    { time: '08:00', value: 1.2 }, // High tide mixing starts
    { time: '12:00', value: 2.5 },
    { time: '16:00', value: 1.8 },
    { time: '20:00', value: 1.1 },
    { time: '24:00', value: 0.9 },
  ]);

  // AI State
  const [speciesQuery, setSpeciesQuery] = useState('');
  const [speciesResult, setSpeciesResult] = useState(null);
  const [isCheckingSpecies, setIsCheckingSpecies] = useState(false);
  
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const [isAnalyzingTrend, setIsAnalyzingTrend] = useState(false);

  // --- GEMINI API CONFIGURATION ---
  const apiKey = "AIzaSyA0RnRy4rNomIjCCVIUQyg0m6Ao2wg9-wo"; 

  // --- GEMINI API INTEGRATION ---

  const callGemini = async (prompt) => {
    if (!apiKey) {
      alert("Please enter your API Key in src/App.jsx code.");
      return "API Key missing.";
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("API Error:", data);
        if (data.error?.code === 429) {
           throw new Error("Quota exceeded. Please wait a minute and try again.");
        }
        throw new Error(data.error?.message || `Error ${response.status}`);
      }
      
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

    } catch (error) {
      console.error("Gemini Connection Error:", error);
      return `Error: ${error.message}`;
    }
  };

  const handleSpeciesCheck = async () => {
    if (!speciesQuery.trim()) return;
    setIsCheckingSpecies(true);
    setSpeciesResult(null);

    const prompt = `
      Act as a fisheries expert in the Philippines (specifically Central Luzon/Calumpit rivers).
      
      CURRENT WATER CONDITIONS:
      - Salinity: ${salinity.toFixed(1)} ppt
      - Temperature: ${temperature.toFixed(1)} °C
      
      The user asks about: "${speciesQuery}".
      
      Is this specific fish/crustacean suitable for the CURRENT salinity?
      Consider common species like Tilapia, Hito, Dalag (Freshwater) vs Bangus, Apahap (Brackish).
      
      Reply with a JSON object strictly in this format (no markdown):
      { "compatible": boolean, "reason": "Tagalog explanation (max 15 words)" }
    `;

    try {
      const text = await callGemini(prompt);
      const jsonStr = text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(jsonStr);
      setSpeciesResult(result);
    } catch (e) {
      console.error("JSON Error:", e);
      setSpeciesResult({ 
        compatible: false, 
        reason: "AI connection error. Please try again." 
      });
    } finally {
      setIsCheckingSpecies(false);
    }
  };

  const handleTrendAnalysis = async () => {
    setIsAnalyzingTrend(true);
    setTrendAnalysis(null);

    const historyStr = historyData.map(d => `${d.time}: ${d.value}ppt`).join(', ');
    const prompt = `
      Analyze this salinity trend for a River/Estuary buoy (Calumpit area): [${historyStr}].
      Current Value: ${salinity.toFixed(1)}ppt.
      
      Is this normal tidal mixing or is there saltwater intrusion? 
      Is it safe for freshwater crops and fish like Tilapia?
      Answer in Taglish, professional but friendly. Max 2 sentences.
    `;

    const text = await callGemini(prompt);
    setTrendAnalysis(text);
    setIsAnalyzingTrend(false);
  };

  // --- LOGIC: FRESHWATER VS BRACKISH VS SALTWATER INTRUSION ---

  const getEnvironmentStatus = (sal) => {
    // 0 - 2 PPT: Pure Freshwater (Ideal for Hito, Dalag, Tilapia)
    if (sal <= 2.0) return { 
      type: 'Freshwater', 
      message: 'FRESHWATER', 
      sub: 'Ideal for Tilapia, Hito, & Dalag.', 
      color: 'from-emerald-400 to-green-600',
      icon: <Fish size={80} className="mb-6 drop-shadow-md opacity-90" />
    };
    
    // 2.1 - 10 PPT: Brackish (Mix - Good for Bangus, Apahap, Hipon)
    if (sal > 2.0 && sal <= 10.0) return { 
      type: 'Brackish', 
      message: 'BRACKISH MIX', 
      sub: 'Good for Bangus, Apahap & Hipon.', 
      color: 'from-blue-400 to-cyan-600',
      icon: <Droplets size={80} className="mb-6 drop-shadow-md opacity-90" />
    };

    // > 10 PPT: High Salinity (Saltwater Intrusion Warning)
    return { 
      type: 'HighSalinity', 
      message: 'SALT INTRUSION', 
      sub: 'Warning: Too salty for pure freshwater fish.', 
      color: 'from-orange-400 to-red-500',
      icon: <AlertTriangle size={80} className="mb-6 drop-shadow-md opacity-90" />
    };
  };

  const status = getEnvironmentStatus(salinity);

  // Simulate River Data (Fluctuating Salinity due to tides)
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate between 0.5 and 5.0 (River mixing)
      setSalinity(prev => {
        const change = (Math.random() - 0.5) * 0.3;
        let newValue = prev + change;
        // Keep within river/brackish limits
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
          {/* Logo Image Placeholder */}
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

        {/* AI Promo */}
        <div className="absolute bottom-8 left-4 right-4 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-yellow-300" />
            <span className="font-bold text-sm">AI Analysis</span>
          </div>
          <p className="text-xs text-sky-100 leading-relaxed">
            Smart Buoy connected for river salinity monitoring.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="lg:hidden h-16 bg-white border-b flex items-center px-4 justify-between z-10">
          <div className="flex items-center gap-2">
            {/* Mobile Logo Image Placeholder */}
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
                
                <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-wide leading-tight z-10 drop-shadow-sm">
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
                
                {/* Salinity Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-500 font-medium text-sm">River Salinity</p>
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

                {/* New AI Widget: Species Checker - Blue Theme */}
                <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={100} className="text-sky-500" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-sky-100 rounded-lg text-sky-600">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="font-bold text-slate-700">Smart Fish Checker</h3>
                  </div>

                  <div className="flex gap-2 z-10">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="e.g. Tilapia, Bangus, Hito..." 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
                        value={speciesQuery}
                        onChange={(e) => setSpeciesQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSpeciesCheck()}
                      />
                    </div>
                    <button 
                      onClick={handleSpeciesCheck}
                      disabled={isCheckingSpecies}
                      className="bg-slate-900 text-white px-4 rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      {isCheckingSpecies ? <Loader className="animate-spin" size={18} /> : 'Check'}
                    </button>
                  </div>

                  {speciesResult && (
                    <div className={`mt-4 p-3 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${speciesResult.compatible ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'}`}>
                      {speciesResult.compatible 
                        ? <CheckCircle className="text-emerald-500 shrink-0" size={20} /> 
                        : <XCircle className="text-red-500 shrink-0" size={20} />
                      }
                      <div>
                        <p className="font-bold text-sm">{speciesResult.compatible ? 'Compatible!' : 'Not Recommended'}</p>
                        <p className="text-xs opacity-80 mt-1">{speciesResult.reason}</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Bottom Chart Area with AI Analysis - Blue Theme */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">River Salinity Trends</h3>
                  <p className="text-sm text-slate-400">Last 24 Hours</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleTrendAnalysis}
                    disabled={isAnalyzingTrend}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-full text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {isAnalyzingTrend ? <Loader size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    {isAnalyzingTrend ? 'Analyzing...' : 'Analyze with Buoy AI'}
                  </button>
                </div>
              </div>

              {trendAnalysis && (
                <div className="mb-6 bg-gradient-to-r from-sky-50 to-white border border-sky-100 p-4 rounded-2xl flex gap-3 animate-in fade-in duration-500">
                  <div className="bg-white p-2 rounded-full h-fit shadow-sm">
                    <Sparkles size={16} className="text-sky-500" />
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-bold text-sky-900 block mb-1">AI Report</span>
                    {trendAnalysis}
                  </div>
                </div>
              )}
              
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
                      domain={[0, 15]} // Adjusted scale for river data (0-15 ppt)
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      label={{ value: 'PPT', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
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

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group
      ${active 
        ? 'bg-sky-100 text-sky-900 shadow-sm font-semibold' 
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