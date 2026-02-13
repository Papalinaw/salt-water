import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Bell, 
  Thermometer, 
  Droplets, 
  Fish, 
  Menu,
  AlertTriangle,
  Wifi,
  MessageSquare,
  Smartphone,
  Check,
  Save,
  Phone,
  XCircle,
  Lock,
  User,
  LogOut 
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
 * SALINITY MONITORING DASHBOARD (Red Logout Bar)
 * ------------------------------------------
 * Updates:
 * - Styled "Sign Out" button to look like a Red Bar (Button) for better visibility.
 */

// --- LOGIN / REGISTER COMPONENT ---
const LoginScreen = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // Get stored user
    const storedUser = localStorage.getItem('aqualiv_user');
    
    if (!storedUser) {
      setError('No account found. Please register first.');
      return;
    }

    const user = JSON.parse(storedUser);

    if (username === user.username && password === user.password) {
      onLogin();
    } else {
      setError('Invalid Username or Password.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Save to Local Storage (Real Data Persistence)
    const newUser = { username, password };
    localStorage.setItem('aqualiv_user', JSON.stringify(newUser));
    
    setSuccessMsg('Account created successfully! You can now login.');
    setIsRegistering(false);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
      <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-sky-100 border border-slate-100 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="image.png" 
            alt="Aqualiv Logo" 
            className="h-20 w-auto object-contain mb-4" 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.style.display = 'none'; 
              e.target.parentNode.innerHTML = '<span class="text-sky-600 font-bold text-3xl tracking-tighter">Aqualiv</span>';
            }}
          />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-500 text-sm">
            {isRegistering ? 'Set up your secure access' : 'Sign in to monitor water quality'}
          </p>
        </div>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Choose username"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-700 font-medium transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-700 font-medium transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {isRegistering && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-700 font-medium transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm animate-pulse">
              <XCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && !isRegistering && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-600 text-sm">
              <Check size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-sky-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            {isRegistering ? "Already have an account? " : "Don't have an account? "}
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccessMsg('');
              }}
              className="text-sky-600 font-bold hover:underline"
            >
              {isRegistering ? 'Sign In' : 'Create One'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Alert Settings State
  const [smsEnabled, setSmsEnabled] = useState(false); 
  const [pushEnabled, setPushEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  // Custom Alert Modal State
  const [alertModal, setAlertModal] = useState({ show: false, title: '', message: '', type: 'default' });

  // Sensor Data State
  const [salinity, setSalinity] = useState(1.5); 
  const [temperature, setTemperature] = useState(29.2);
  
  // Check for existing session
  useEffect(() => {
    const session = sessionStorage.getItem('aqualiv_session');
    if (session === 'active') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    sessionStorage.setItem('aqualiv_session', 'active');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aqualiv_session');
    setIsAuthenticated(false);
  };
  
  // Historic Data for Chart
  const [historyData, setHistoryData] = useState(() => {
    const data = [];
    const now = new Date();
    const initialValues = [0.5, 0.8, 1.2, 1.4, 1.6, 1.5, 1.5];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - (i * 60 * 1000));
      data.push({
        time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        value: initialValues[6 - i] || 1.5
      });
    }
    return data;
  });

  // --- HELPER: CUSTOM ALERT ---
  const showCustomAlert = (title, message, type = 'default') => {
    setAlertModal({ show: true, title, message, type });
  };
  
  const closeAlert = () => setAlertModal(prev => ({ ...prev, show: false }));

  // --- LOGIC: TOGGLE HANDLER ---
  const handleSmsToggle = () => {
    if (smsEnabled) {
      setSmsEnabled(false);
    } else {
      if (isRegistered) {
        setSmsEnabled(true);
      } else {
        showCustomAlert(
          "Paalala", 
          "I-register muna ang phone number bago makatanggap ng text message", 
          "warning"
        );
      }
    }
  };

  const handleRegisterPhone = () => {
    if (phoneNumber.length === 10) {
      setIsRegistered(true);
      showCustomAlert("Success", `Registered +63${phoneNumber} for SMS Alerts`, "success");
      setSmsEnabled(true);
    } else {
      showCustomAlert("Error", "Ilagay ang valid 10-digit number", "error");
    }
  };

  // --- LOGIC: FRESHWATER VS BRACKISH FISH LIST ---
  const getEnvironmentStatus = (sal) => {
    if (sal <= 2.0) {
      return { 
        type: 'Freshwater', 
        message: 'LOW SALT CONTENT', 
        sub: `Available: Tilapia, Hito, Dalag, Gurami, Ayungin, Martiniko, Biya, Carpa`, 
        color: 'from-emerald-400 via-emerald-500 to-teal-600',
        icon: <Fish size={90} className="mb-6 drop-shadow-lg opacity-90 text-white" />
      };
    }
    
    if (sal > 2.0 && sal <= 10.0) {
      return { 
        type: 'Brackish', 
        message: 'MODERATE SALT', 
        sub: `Available: Bangus, Apahap, Kanduli, Hipon, Sugpo, Talangka`, 
        color: 'from-sky-400 via-blue-500 to-sky-600',
        icon: <Fish size={90} className="mb-6 drop-shadow-lg opacity-90 text-white" />
      };
    }

    return { 
      type: 'HighSalinity', 
      message: 'HIGH SALT CONTENT', 
      sub: 'Warning: Saltwater Intrusion (Risk of Fish Kill)', 
      color: 'from-orange-400 via-red-500 to-pink-600',
      icon: <AlertTriangle size={80} className="mb-6 drop-shadow-lg opacity-90 text-white" />
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
        const now = new Date(); 
        const newTimeStr = now.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });

        return [...prev.slice(1), { time: newTimeStr, value: salinity }];
      });
    }, 3000); 

    return () => clearInterval(interval);
  }, [salinity, temperature]);

  // --- RENDER LOGIN OR DASHBOARD ---
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden selection:bg-blue-100 relative">
      
      {/* CUSTOM MODAL ALERT OVERLAY */}
      {alertModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl p-6 max-w-sm w-full transform transition-all scale-100 animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="flex flex-col items-center text-center gap-4">
              {/* Dynamic Icon based on type */}
              <div className={`p-4 rounded-full shadow-sm ${
                alertModal.type === 'warning' ? 'bg-orange-50 text-orange-500' :
                alertModal.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                alertModal.type === 'error' ? 'bg-red-50 text-red-500' :
                'bg-blue-50 text-blue-500'
              }`}>
                {alertModal.type === 'warning' && <AlertTriangle size={32} strokeWidth={2} />}
                {alertModal.type === 'success' && <Check size={32} strokeWidth={3} />}
                {alertModal.type === 'error' && <XCircle size={32} strokeWidth={2} />}
                {alertModal.type === 'default' && <Bell size={32} strokeWidth={2} />}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-800">{alertModal.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {alertModal.message}
                </p>
              </div>

              <button 
                onClick={closeAlert}
                className="w-full py-3.5 bg-sky-500 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 mt-2"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

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
            onClick={() => { setActiveTab('Dashboard'); setSidebarOpen(false); }}
          />
          <SidebarItem 
            icon={<Bell size={20} />} 
            label="Alerts" 
            active={activeTab === 'Alerts'} 
            onClick={() => { setActiveTab('Alerts'); setSidebarOpen(false); }}
          />
        </nav>

        {/* LOGOUT BUTTON - WITH RED BAR STYLE */}
        <div className="p-4 border-t border-slate-50">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-3 p-3.5 bg-red-50 text-red-600 rounded-2xl transition-all hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-200 font-bold text-sm"
           >
             <LogOut size={18} strokeWidth={2.5} />
             Sign Out
           </button>
        </div>

        {/* System Status */}
        <div className="p-6 pt-2">
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
            
            {/* === DASHBOARD TAB === */}
            {activeTab === 'Dashboard' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Main Advisory Card */}
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

                {/* Bottom Chart */}
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
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontFamily: 'sans-serif' }} 
                          itemStyle={{ color: '#1e293b', fontWeight: 700 }} 
                        />
                        <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorMain)" animationDuration={1500} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {/* === ALERTS TAB === */}
            {activeTab === 'Alerts' && (
              <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h1 className="text-3xl font-black text-slate-800 tracking-tight">Alert Settings</h1>
                  <p className="text-slate-500 mt-2">Manage how you receive water quality updates.</p>
                </div>

                {/* SMS Notification Card */}
                <div className={`
                  bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border transition-all duration-300 relative overflow-hidden
                  ${smsEnabled ? 'border-sky-500 shadow-sky-100' : 'border-slate-100'}
                `}>
                  <div className="flex flex-col gap-6 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex gap-5 items-start">
                        <div className={`p-4 rounded-2xl shrink-0 transition-colors duration-300 ${smsEnabled ? 'bg-sky-50 text-sky-600' : 'bg-slate-50 text-slate-400'}`}>
                          <MessageSquare size={28} />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-800">SMS Notifications</h3>
                            {smsEnabled && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-md tracking-wider shadow-sm">
                                4G Module Enabled
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                            Para sa mga gumagamit ng <strong>keypad phone</strong>. Makakatanggap kayo ng text message gamit ang aming 4G module kapag tumaas ang salt content.
                          </p>
                        </div>
                      </div>
                      
                      {/* Toggle Switch */}
                      <div className="flex justify-end w-full sm:w-auto">
                        <button 
                          onClick={handleSmsToggle}
                          className={`
                            w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-sky-100 shrink-0
                            ${smsEnabled ? 'bg-sky-500' : 'bg-slate-200'}
                          `}
                        >
                          <div className={`
                            w-6 h-6 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm flex items-center justify-center
                            ${smsEnabled ? 'translate-x-7' : 'translate-x-1'}
                          `}>
                            {smsEnabled && <Check size={12} className="text-sky-500 stroke-[3]" />}
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Registration Section */}
                    <div className="mt-4 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                      <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Phone size={14} /> Register Phone Number
                      </h4>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium select-none">+63</span>
                          <input 
                            type="tel" 
                            maxLength="10"
                            placeholder="9171234567"
                            value={phoneNumber}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, ''); 
                              if(val.length <= 10) setPhoneNumber(val);
                            }}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-700 font-medium tracking-wide transition-all"
                          />
                        </div>
                        <button 
                          onClick={handleRegisterPhone}
                          className={`
                            px-6 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2
                            ${isRegistered 
                              ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                              : 'bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-200 hover:shadow-sky-300 active:scale-95'
                            }
                          `}
                        >
                          {isRegistered ? (
                            <>
                              <Check size={16} /> Registered
                            </>
                          ) : (
                            <>
                              <Save size={16} /> Save
                            </>
                          )}
                        </button>
                      </div>
                      {isRegistered ? (
                        <p className="text-emerald-600 text-xs mt-2 font-medium flex items-center gap-1">
                          <Check size={12} strokeWidth={3} /> You will receive alerts on +63{phoneNumber}
                        </p>
                      ) : (
                        <p className="text-slate-400 text-xs mt-2 italic">
                          Please register your number to enable SMS alerts.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Push Notification Card */}
                <div className={`
                  bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border transition-all duration-300
                  ${pushEnabled ? 'border-sky-500 shadow-sky-100' : 'border-slate-100'}
                `}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex gap-5 items-start">
                      <div className={`p-4 rounded-2xl shrink-0 transition-colors duration-300 ${pushEnabled ? 'bg-sky-50 text-sky-600' : 'bg-slate-50 text-slate-400'}`}>
                        <Smartphone size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">Push Notifications</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-md mt-2">
                          Makatanggap ng notifications sa smartphone o laptop kung kayo ay online.
                        </p>
                      </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <div className="flex justify-end w-full sm:w-auto">
                      <button 
                        onClick={() => setPushEnabled(!pushEnabled)}
                        className={`
                          w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-sky-100 shrink-0
                          ${pushEnabled ? 'bg-sky-500' : 'bg-slate-200'}
                        `}
                      >
                        <div className={`
                          w-6 h-6 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm flex items-center justify-center
                          ${pushEnabled ? 'translate-x-7' : 'translate-x-1'}
                        `}>
                           {pushEnabled && <Check size={12} className="text-sky-500 stroke-[3]" />}
                        </div>
                      </button>
                    </div>
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
        : 'text-slate-500 hover:bg-slate-50 hover:text-sky-600 font-medium'
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