import React, { useState, useEffect, useRef } from 'react';
import { Clock, MapPin, Navigation, Users, Coffee, MessageSquare, AlertTriangle, ChevronRight, ChevronLeft, Calendar, X, Utensils, Car, Phone, Share2, Star, Info, Map as MapIcon, Leaf, AlertCircle, Timer, Eye, EyeOff, PhoneCall, ShieldAlert, Accessibility, Mail, Bell, CheckCircle, Smile, Meh, Frown, Music, Volume2, Activity, History as HistoryIcon, Bus, Warehouse, Flag, ArrowRight, BellRing, Play, Sun, Moon, Pause, Mic, Wind, Thermometer, Fan, Lock, Unlock, Zap, LayoutGrid, Home, Radio } from 'lucide-react';

// --- 1. 真实线路数据 ---
const route4Stops = [
    { name: "Gullmarsplan", time: "00:00" },
    { name: "Skanstull", time: "00:05" },
    { name: "Eriksdal", time: "00:08" },
    { name: "Rosenlund", time: "00:12" },
    { name: "Södra station", time: "00:15" },
    { name: "Zinkensdamm", time: "00:20" },
    { name: "Hornstull", time: "00:25", type: 'rest_stop', features: ['wc', 'food'], menu: [{ id: 1, name: "Coffee & Bun", price: "45kr", isVegan: true, image: "☕️" }] },
    { name: "Västerbroplan", time: "00:32" },
    { name: "Fridhemsplan", time: "00:38" },
    { name: "Fleminggatan", time: "00:42" },
    { name: "S:t Eriksplan", time: "00:48" },
    { name: "Odenplan", time: "00:55" },
    { name: "Stadsbiblioteket", time: "00:58" },
    { name: "Valhallavägen", time: "01:05" },
    { name: "Östra station", time: "01:10" },
    { name: "Stadion", time: "01:13" },
    { name: "Musikhögskolan", time: "01:16" },
    { name: "Garnisonen", time: "01:22" },
    { name: "Radiohuset", time: "01:25" }
];

const route6Stops = [
    { name: "Ropsten", time: "00:00" },
    { name: "Drevergatan", time: "00:04" },
    { name: "Jaktgatan", time: "00:07" },
    { name: "Storängsvägen", time: "00:10" },
    { name: "Östermalms IP", time: "00:14" },
    { name: "Stadion", time: "00:18" },
    { name: "Östra Station", time: "00:22" },
    { name: "Odengatan", time: "00:26" },
    { name: "Roslagsgatan", time: "00:29" },
    { name: "Stadsbiblioteket", time: "00:33" },
    { name: "Odenplan", time: "00:36", type: 'rest_stop', features: ['wc', 'food'], menu: [{ id: 2, name: "Salad Bowl", price: "85kr", isVegan: true, image: "🥗" }] },
    { name: "Dalagatan", time: "00:40" },
    { name: "Karlbergsvägen", time: "00:44" },
    { name: "Torsplan", time: "00:48" },
    { name: "Karolinska Sjukhuset", time: "00:52" },
    { name: "Karolinska Institutet", time: "00:55" }
];

const generateTimeline = (stops, startHour, startMinute) => {
    return stops.map((s, i) => {
        const baseMinutes = parseInt(s.time.split(':')[1]) + parseInt(s.time.split(':')[0]) * 60;
        const totalMinutes = startHour * 60 + startMinute + baseMinutes;
        const h = Math.floor(totalMinutes / 60) % 24;
        const m = totalMinutes % 60;
        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        
        return {
            id: i,
            name: s.name,
            time: timeStr,
            type: s.type || 'stop',
            features: s.features,
            menu: s.menu,
            status: 'future'
        };
    });
};

// --- 2. 车辆状态页面 ---
const VehicleStatusPage = ({ darkMode }) => {
    const [temp, setTemp] = useState(22);
    const [fanSpeed, setFanSpeed] = useState(2);
    const [climateZone, setClimateZone] = useState('all');
    const [acActive, setAcActive] = useState(true);
    const [heatActive, setHeatActive] = useState(false);
    const [autoMode, setAutoMode] = useState(false);
    const [doorsLocked, setDoorsLocked] = useState(true);
    const [interiorLights, setInteriorLights] = useState(false);

    const toggleAc = () => { if (!acActive) { setHeatActive(false); setAutoMode(false); } setAcActive(!acActive); };
    const toggleHeat = () => { if (!heatActive) { setAcActive(false); setAutoMode(false); } setHeatActive(!heatActive); };
    const toggleAuto = () => { if (!autoMode) { setAcActive(true); setHeatActive(false); setFanSpeed(2); } setAutoMode(!autoMode); };
    
    return (
        <div className={`w-full h-full p-8 overflow-y-auto ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
            <h1 className="text-3xl font-bold mb-2">Vehicle Status</h1>
            <p className="text-sm opacity-60 mb-6">Monitor Only - Use Physical Dashboard for Controls</p>
            <div className="grid grid-cols-2 gap-6 h-full pb-20">
                <div className={`p-6 rounded-3xl flex flex-col ${darkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center"><Thermometer className="w-5 h-5 mr-2 text-red-500"/> Climate Control</h2>
                        <div className={`flex rounded-lg p-1 ${darkMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
                            <button onClick={() => setClimateZone('all')} className={`px-4 py-1 rounded-md text-xs font-bold transition-all ${climateZone === 'all' ? 'bg-blue-500 text-white shadow-sm' : 'opacity-50'}`}>All</button>
                            <button onClick={() => setClimateZone('driver')} className={`px-4 py-1 rounded-md text-xs font-bold transition-all ${climateZone === 'driver' ? 'bg-blue-500 text-white shadow-sm' : 'opacity-50'}`}>Driver</button>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center mb-6">
                        <div className="text-6xl font-bold text-yellow-400">{temp}°C</div>
                        <div className="text-sm opacity-50 mt-1">Target Temperature</div>
                    </div>
                    <input type="range" min="16" max="30" value={temp} onChange={(e)=>setTemp(e.target.value)} className="w-full h-2 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-lg appearance-none cursor-pointer mb-6" />
                    <div className="grid grid-cols-4 gap-3">
                         <button onClick={toggleAc} className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all active:scale-95 ${acActive ? (darkMode ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-blue-500 bg-blue-50 text-blue-600') : (darkMode ? 'border-slate-600 bg-slate-700 text-slate-400' : 'border-slate-200 bg-white text-slate-400')}`}><div className="font-bold mb-1"><Fan className="w-5 h-5"/></div><div className="text-xs font-bold">A/C {acActive ? 'ON' : 'OFF'}</div></button>
                         <button onClick={toggleHeat} className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all active:scale-95 ${heatActive ? (darkMode ? 'border-red-500 bg-red-500/20 text-red-400' : 'border-red-500 bg-red-50 text-red-600') : (darkMode ? 'border-slate-600 bg-slate-700 text-slate-400' : 'border-slate-200 bg-white text-slate-400')}`}><div className="font-bold mb-1"><Thermometer className="w-5 h-5"/></div><div className="text-xs font-bold">Heat {heatActive ? 'ON' : 'OFF'}</div></button>
                         <button onClick={() => { setFanSpeed((s)=>(s+1)%4); setAutoMode(false); }} className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all active:scale-95 ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-white'}`}><Fan className={`w-5 h-5 mb-1 text-blue-400 ${fanSpeed > 0 ? 'animate-spin' : ''}`} style={{animationDuration: `${1/(fanSpeed || 1)}s`}} /><div className="text-xs font-bold text-slate-500">Fan {fanSpeed === 0 ? 'Off' : fanSpeed}</div></button>
                         <button onClick={toggleAuto} className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all active:scale-95 ${autoMode ? (darkMode ? 'border-green-500 bg-green-500/20 text-green-400' : 'border-green-500 bg-green-50 text-green-600') : (darkMode ? 'border-slate-600 bg-slate-700 text-slate-400' : 'border-slate-200 bg-white text-slate-400')}`}><div className="font-bold mb-1"><Wind className="w-5 h-5"/></div><div className="text-xs font-bold">Auto</div></button>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                     <div className={`p-6 rounded-3xl flex-1 ${darkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                         <h2 className="text-xl font-bold mb-4 flex items-center"><Wind className="w-5 h-5 mr-2 text-blue-400"/> Air & Comfort</h2>
                         <div className={`p-4 rounded-2xl mb-4 flex items-center ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                             <div className="w-12 h-12 rounded-full border-4 border-green-500 flex items-center justify-center font-bold text-green-500 mr-4">57</div>
                             <div><div className="font-bold text-green-500">Good Air Quality</div><div className="text-xs opacity-50">CO2: 420ppm</div></div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <button 
                                onClick={() => setDoorsLocked(!doorsLocked)}
                                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 ${doorsLocked ? (darkMode ? 'border-blue-500/50 bg-blue-500/10' : 'border-blue-200 bg-blue-50') : (darkMode ? 'border-orange-500/50 bg-orange-500/10' : 'border-orange-200 bg-orange-50')}`}
                             >
                                 {doorsLocked ? <Lock className="w-8 h-8 mb-2 text-blue-500"/> : <Unlock className="w-8 h-8 mb-2 text-orange-500"/>}
                                 <span className={`text-xs font-bold ${doorsLocked ? 'text-blue-500' : 'text-orange-500'}`}>
                                     {doorsLocked ? 'Doors Locked' : 'Doors Unlocked'}
                                 </span>
                             </button>
                             <button onClick={() => setInteriorLights(!interiorLights)} className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 ${interiorLights ? (darkMode ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-yellow-200 bg-yellow-50') : (darkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-white')}`}><Zap className={`w-8 h-8 mb-2 ${interiorLights ? 'text-yellow-500 fill-current' : 'text-slate-400'}`}/><span className={`text-xs font-bold ${interiorLights ? 'text-yellow-600' : 'text-slate-500'}`}>Lights {interiorLights ? 'ON' : 'OFF'}</span></button>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

// --- 3. 休息站详情弹窗 ---
const StopDetailModal = ({ stop, onClose, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('menu');
    const [veganFilter, setVeganFilter] = useState(false);
    if (!stop) return null;
    const menuData = stop.menu || []; 
    const filteredMenu = menuData.filter(item => !veganFilter || item.isVegan);

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md h-[80vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 z-20 backdrop-blur-md active:scale-95"><X className="w-6 h-6" /></button>
                <div className="h-40 shrink-0 bg-slate-800 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-blue-900 to-slate-900"></div>
                    <Coffee className="w-16 h-16 text-white/20" />
                    <div className="absolute bottom-0 inset-x-0 p-6 pt-12 bg-gradient-to-t from-black/80 to-transparent">
                        <h2 className="text-xl font-bold text-white truncate">{stop.name}</h2>
                        <div className="flex space-x-2 text-white/90 text-sm mt-1">
                             {stop.features?.includes('wc') && <span className="flex items-center bg-white/20 px-2 rounded"><Info className="w-3 h-3 mr-1"/> WC</span>}
                             {stop.features?.includes('food') && <span className="flex items-center bg-white/20 px-2 rounded"><Utensils className="w-3 h-3 mr-1"/> Food</span>}
                        </div>
                    </div>
                </div>
                <div className="flex border-b border-slate-100 shrink-0">
                    <button onClick={() => setActiveTab('menu')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center space-x-2 ${activeTab === 'menu' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}><Utensils className="w-4 h-4" /><span>Menu</span></button>
                    <button onClick={() => setActiveTab('info')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center space-x-2 ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}><Info className="w-4 h-4" /><span>Info</span></button>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
                    {activeTab === 'menu' && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">Available Items</span>
                                <button onClick={() => setVeganFilter(!veganFilter)} className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold border transition-colors ${veganFilter ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white border-slate-200 text-slate-500'}`}><Leaf className="w-3 h-3" /><span>Vegan</span></button>
                            </div>
                            {filteredMenu.length > 0 ? filteredMenu.map(item => (
                                <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex space-x-3">
                                    <div className="text-3xl bg-slate-100 w-16 h-16 rounded-lg flex items-center justify-center">{item.image}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between"><h3 className="font-bold text-slate-800">{item.name}</h3><span className="font-mono font-bold">{item.price}</span></div>
                                        <div className="flex gap-1 mt-1">{item.isVegan && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">Vegan</span>}</div>
                                        <div className={`text-xs font-bold mt-2 flex items-center ${item.waitTime > 10 ? 'text-red-500' : 'text-green-600'}`}><Timer className="w-3 h-3 mr-1"/>{item.waitTime} min wait</div>
                                    </div>
                                    <button className="self-end bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold active:scale-95 transition-transform">Order</button>
                                </div>
                            )) : <div className="text-center py-8 text-slate-400">No items available</div>}
                        </div>
                    )}
                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => { onNavigate(stop); onClose(); }}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all"
                                >
                                    <Navigation className="w-4 h-4 mr-2"/> Navigate
                                </button>
                                <button className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg font-bold flex items-center justify-center hover:bg-slate-300 active:scale-95 transition-all"><Phone className="w-4 h-4 mr-2"/> Call</button>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100"><div className="font-bold text-sm mb-1">Latest Review</div><p className="text-slate-500 text-xs italic">"Great parking space. Quick service." - Driver Mike</p></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 3. 路线详情弹窗 (Fixed Close Button) ---
const RouteDetailModal = ({ shift, onClose, onStartNavigation }) => {
    if (!shift) return null;

    const baseStops = shift.route === '4' ? route4Stops : route6Stops;
    const routeTimeline = generateTimeline(baseStops, parseInt(shift.start), 15);

    const fullTimeline = [
        { time: routeTimeline[0].time, type: 'depot', location: `Depot: ${routeTimeline[0].name}`, icon: <Warehouse className="w-4 h-4"/> },
        ...routeTimeline.slice(1, -1).map(s => ({ time: s.time, location: s.name, icon: <MapIcon className="w-4 h-4"/> })),
        { time: routeTimeline[routeTimeline.length-1].time, type: 'end', location: `End: ${routeTimeline[routeTimeline.length-1].name}`, icon: <Flag className="w-4 h-4"/> },
    ];

    const navigationData = {
        ...shift,
        timeline: routeTimeline
    };

    return (
        <div className="absolute inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in-95">
            <div className="bg-white w-full max-w-2xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-[81]">
                <div className="bg-blue-600 p-6 text-white shrink-0 relative">
                    {/* FIXED CLOSE BUTTON */}
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 bg-blue-700/50 hover:bg-blue-700 text-white p-2 rounded-full transition-colors z-50 active:scale-95 cursor-pointer"
                    >
                        <X className="w-5 h-5"/>
                    </button>

                    <div className="relative z-10 pr-12">
                        <div className="flex items-center space-x-2 text-blue-100 mb-2 font-bold text-sm uppercase tracking-wider"><Calendar className="w-4 h-4" /> <span>{shift.day}, {shift.date || 'N/A'}</span></div>
                        <h2 className="text-4xl font-bold mb-1">Bus {shift.route}</h2>
                        <p className="text-xl text-blue-100">{shift.route === '4' ? "Gullmarsplan ➔ Radiohuset" : "Ropsten ➔ Karolinska"}</p>
                        <p className="text-sm mt-1 opacity-80">Shift: {shift.start}:00 - {shift.end}:00</p>
                    </div>
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <div className="w-1/2 p-6 overflow-y-auto bg-slate-50 border-r border-slate-100">
                        <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-6">Shift Timeline</h3>
                        <div className="relative pl-4 space-y-8">
                            <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                            {fullTimeline.map((item, idx) => (
                                <div key={idx} className="relative flex items-start group">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 border-2 shadow-sm ${item.type === 'depot' ? 'bg-slate-600 border-slate-200 text-white' : 'bg-blue-500 border-blue-200 text-white'}`}>{item.icon}</div>
                                    <div className="ml-4">
                                        <div className="flex items-center"><span className="font-mono font-bold text-slate-500 text-sm mr-2">{item.time}</span><h4 className="font-bold text-sm text-slate-800">{item.location}</h4></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col p-6">
                        <div className="flex-1 bg-slate-100 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-200 mb-4">
                             <MapIcon className="w-8 h-8 text-slate-300" />
                             <span className="text-slate-400 font-bold ml-2">Map Preview</span>
                        </div>
                        <button onClick={() => onStartNavigation(navigationData)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center active:scale-[0.98] shadow-lg"><Navigation className="w-5 h-5 mr-2" /> Start Navigation</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. 消息中心 ---
const MessageCenterPage = ({ onClose, messages, onMarkRead, darkMode }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => { if (!selectedMessage && messages.length > 0) setSelectedMessage(messages[0]); }, [messages]);

  const handleMarkAsRead = (msg) => {
      setSelectedMessage(msg);
      if (!msg.read) {
          onMarkRead(msg.id);
      }
  };

  return (
    <div className={`absolute inset-0 w-full h-full shadow-2xl z-50 flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'} ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex items-center">
             <button onClick={onClose} className={`p-2 rounded-full transition-colors mr-4 ${darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-500'}`}>
                 <ChevronLeft className="w-8 h-8" />
             </button>
             <div className="p-2 bg-blue-100 rounded-lg mr-3"><MessageSquare className="w-6 h-6 text-blue-600"/></div>
             <div>
                 <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Messages</h1>
                 <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Dispatch & Alerts</p>
             </div>
        </div>
        <div className="w-8"></div> 
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`w-1/3 border-r overflow-y-auto ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'}`}>
           {messages.map(msg => (
             <div key={msg.id} onClick={() => handleMarkAsRead(msg)} className={`p-4 border-b cursor-pointer transition-all ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-100 hover:bg-white'} ${selectedMessage?.id === msg.id ? (darkMode ? 'bg-slate-800 border-l-4 border-l-blue-500' : 'bg-blue-50 border-l-4 border-l-blue-500') : 'border-l-4 border-l-transparent'}`}>
                <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                        {!msg.read && <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>}
                        <span className={`text-xs font-bold uppercase tracking-wider ${msg.priority === 'high' ? 'text-red-500' : (darkMode ? 'text-slate-400' : 'text-slate-500')}`}>{msg.sender}</span>
                    </div>
                    <span className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{msg.time}</span>
                </div>
                <div className={`font-bold text-sm mb-1 truncate ${!msg.read ? (darkMode ? 'text-white' : 'text-slate-900') : (darkMode ? 'text-slate-400' : 'text-slate-600')}`}>{msg.subject}</div>
             </div>
           ))}
        </div>
        <div className={`flex-1 p-8 flex flex-col overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
           {selectedMessage ? (
             <div className={`flex flex-col h-full rounded-2xl shadow-sm border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
               <div className={`p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                 <div className="flex justify-between items-start mb-4"><h2 className={`text-2xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>{selectedMessage.subject}</h2>{selectedMessage.priority === 'high' && (<span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold flex items-center shrink-0 ml-4 border border-red-500/20"><AlertCircle className="w-4 h-4 mr-1" /> High Priority</span>)}</div>
                 <div className={`flex items-center text-sm space-x-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}><div className="flex items-center"><Users className="w-4 h-4 mr-2 opacity-70" /> <span className="font-bold">{selectedMessage.sender}</span></div><div className="flex items-center"><Clock className="w-4 h-4 mr-2 opacity-70" /> <span>{selectedMessage.time}</span></div></div>
               </div>
               <div className="p-8 flex-1 overflow-y-auto"><p className={`text-lg leading-relaxed whitespace-pre-line ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{selectedMessage.content}</p></div>
               <div className={`p-4 border-t ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
                   <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                       {["Received", "On my way", "Traffic heavy", "Need assistance"].map(reply => (
                           <button key={reply} className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-colors ${darkMode ? 'border-slate-600 hover:bg-slate-700 text-slate-300' : 'border-slate-300 hover:bg-white text-slate-600'}`}>{reply}</button>
                       ))}
                   </div>
                   <div className={`flex gap-3 p-2 rounded-xl border ${darkMode ? 'border-slate-600 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                        <button className={`p-3 rounded-lg transition-colors ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}><Mic className="w-5 h-5"/></button>
                        <input type="text" placeholder="Type a reply..." className={`flex-1 bg-transparent outline-none px-2 ${darkMode ? 'text-white placeholder-slate-500' : 'text-slate-800'}`} />
                        <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><ArrowRight className="w-5 h-5"/></button>
                   </div>
               </div>
             </div>
           ) : (<div className="flex-1 flex flex-col items-center justify-center text-slate-400"><Mail className="w-20 h-20 mb-4 opacity-10" /><p className="text-lg font-medium">Select a message</p></div>)}
        </div>
      </div>
    </div>
  );
};

// --- 5. 休息模式 (Merged: Functional Features + New Animation) ---
const RestModeView = ({ onClose, darkMode }) => {
    // --- 1. State Management (保留原有功能状态) ---
    const [mood, setMood] = useState('neutral');
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [isPlayingMusic, setIsPlayingMusic] = useState(false);
    const [playingVideo, setPlayingVideo] = useState(null); // 保留：视频播放状态
    const [showHistory, setShowHistory] = useState(false);  // 保留：历史记录显示状态
    
    // 保留：历史记录数据
    const [moodHistory, setMoodHistory] = useState([
        { id: 1, time: "14:30", mood: "happy", note: "Great traffic flow" },
        { id: 2, time: "12:15", mood: "tired", note: "Busy lunch rush" },
    ]);

    // 新增：呼吸动画文字状态
    const [breathingText, setBreathingText] = useState("Breathe In");

    // --- 2. Configuration & Helpers ---
    
    // 新增：情绪主题配置 (用于背景色和动画颜色)
    const moodThemes = {
        happy: {
            bg: darkMode ? 'bg-orange-950' : 'bg-orange-50',
            accent: 'text-orange-500',
            circle: 'bg-orange-400',
            border: 'border-orange-200',
            lightBg: 'bg-orange-100',
            quote: ["Great Job today!", "Keep the energy up!", "You are a star!"],
            icon: <Sun className="w-32 h-32 text-orange-400 opacity-10 absolute top-10 right-10 animate-spin-slow" style={{animationDuration: '20s'}} />
        },
        neutral: {
            bg: darkMode ? 'bg-emerald-950' : 'bg-emerald-50',
            accent: 'text-emerald-500',
            circle: 'bg-emerald-400',
            border: 'border-emerald-200',
            lightBg: 'bg-emerald-100',
            quote: ["Breathe in...", "Clear your mind", "Relax your shoulders"],
            icon: <Leaf className="w-32 h-32 text-emerald-400 opacity-10 absolute bottom-10 left-10 animate-bounce" style={{animationDuration: '4s'}} />
        },
        tired: {
            bg: darkMode ? 'bg-indigo-950' : 'bg-indigo-50',
            accent: 'text-indigo-500',
            circle: 'bg-indigo-400',
            border: 'border-indigo-200',
            lightBg: 'bg-indigo-100',
            quote: ["It's okay to rest", "Close your eyes for a bit", "Safety comes first"],
            icon: <Moon className="w-32 h-32 text-indigo-400 opacity-10 absolute top-10 right-10" />
        }
    };

    const currentTheme = moodThemes[mood];

    // Effect: 呼吸文字轮播
    useEffect(() => {
        const interval = setInterval(() => {
            setBreathingText(prev => prev === "Breathe In" ? "Breathe Out" : "Breathe In");
        }, 4000); // 4秒一换
        return () => clearInterval(interval);
    }, []);

    // Effect: 语录轮播 (保留原有逻辑)
    useEffect(() => { 
        const interval = setInterval(() => setQuoteIndex(p => (p + 1) % currentTheme.quote.length), 4000); 
        return () => clearInterval(interval); 
    }, [mood, currentTheme.quote.length]);

    // Handler: 切换情绪并记录历史 (保留原有逻辑)
    const handleMoodChange = (newMood) => { 
        setMood(newMood); 
        setQuoteIndex(0); 
        setMoodHistory([{ 
            id: Date.now(), 
            time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), 
            mood: newMood, 
            note: newMood === 'happy' ? "Feeling good!" : "Taking a break" 
        }, ...moodHistory]); 
    };

    return (
        <div className={`absolute inset-0 w-full h-full shadow-2xl z-50 flex flex-col transition-all duration-1000 ${currentTheme.bg}`}>
            {/* 背景装饰 */}
            <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-black/5 opacity-50`}></div>
            {currentTheme.icon}

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/5 relative z-10">
                <div className="flex items-center">
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors mr-4 hover:bg-black/10 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 shadow-sm ${darkMode ? 'bg-white/10' : 'bg-white'}`}>
                            <Coffee className={`w-6 h-6 ${currentTheme.accent}`}/>
                        </div>
                        <div>
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Rest Mode</h2>
                            <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>Recharge yourself</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 flex gap-8 p-8 relative z-10">
                {/* --- 左侧：功能区 (样式更新，功能保留) --- */}
                <div className="w-1/4 flex flex-col gap-4">
                    <button 
                        onClick={() => setPlayingVideo('eye')} // 触发原有视频逻辑
                        className={`p-6 rounded-3xl border-2 text-left transition-all hover:shadow-lg active:scale-95 backdrop-blur-sm ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white/60 border-white text-slate-800'}`}
                    >
                        <Eye className={`w-8 h-8 mb-2 ${currentTheme.accent}`} />
                        <div className="font-bold text-lg">Eye Care</div>
                        <div className="text-xs opacity-70">5 min routine</div>
                    </button>
                    
                    <button 
                        onClick={() => setPlayingVideo('body')} // 触发原有视频逻辑
                        className={`p-6 rounded-3xl border-2 text-left transition-all hover:shadow-lg active:scale-95 backdrop-blur-sm ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white/60 border-white text-slate-800'}`}
                    >
                        <Activity className={`w-8 h-8 mb-2 ${currentTheme.accent}`} />
                        <div className="font-bold text-lg">Body Stretch</div>
                        <div className="text-xs opacity-70">Relieve back pain</div>
                    </button>
                </div>

                {/* --- 中间：呼吸动画 (完全更新为呼吸效果) --- */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                    {/* 呼吸圆环组 */}
                    <div className="relative flex items-center justify-center">
                        {/* 1. 外扩散圈 (Ping) */}
                        <div className={`absolute rounded-full opacity-30 animate-ping ${currentTheme.circle}`} style={{width: '300px', height: '300px', animationDuration: '4s'}}></div>
                        
                        {/* 2. 呼吸圈 (Scale) - 核心动画 */}
                        <div className={`w-64 h-64 rounded-full opacity-40 transition-all duration-[4000ms] ease-in-out ${currentTheme.circle} ${breathingText === "Breathe In" ? 'scale-110' : 'scale-75'}`}></div>
                        
                        {/* 3. 中心静态圈 & 文字 */}
                        <div className={`absolute w-48 h-48 rounded-full shadow-2xl flex items-center justify-center backdrop-blur-md transition-colors duration-500 ${darkMode ? 'bg-slate-800/80 text-white' : 'bg-white/80 text-slate-800'}`}>
                            <div className="text-center">
                                <div className={`text-2xl font-bold transition-all duration-1000 ${breathingText === "Breathe In" ? 'tracking-widest' : 'tracking-normal'}`}>
                                    {breathingText}
                                </div>
                                <div className="text-xs opacity-50 mt-1 uppercase tracking-wider">Guide</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* 动态语录 */}
                    <h1 className={`text-2xl font-bold mt-12 transition-colors duration-500 text-center px-8 ${currentTheme.accent}`}>
                        "{currentTheme.quote[quoteIndex]}"
                    </h1>
                </div>

                {/* --- 右侧：控制与历史 (样式更新，功能保留) --- */}
                <div className="w-1/4 flex flex-col justify-end items-end gap-6 relative">
                    {/* 1. 白噪音开关 (保留) */}
                    <div className="flex items-center gap-4">
                        <span className={`text-xs uppercase font-bold ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>White Noise</span>
                        <button onClick={() => setIsPlayingMusic(!isPlayingMusic)} className={`w-12 h-8 rounded-full flex items-center p-1 transition-colors ${isPlayingMusic ? 'bg-green-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                            <div className="w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center">
                                {isPlayingMusic ? <Volume2 className="w-3 h-3 text-green-500"/> : <Music className="w-3 h-3 text-slate-400"/>}
                            </div>
                        </button>
                    </div>
                    
                    <div className={`w-full h-px my-2 ${darkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>

                    {/* 2. 历史记录 (保留逻辑，适配样式) */}
                    <div className="relative">
                        <button onClick={() => setShowHistory(!showHistory)} className={`flex items-center space-x-2 text-xs font-bold px-3 py-2 rounded-full mb-4 transition-all ${showHistory ? (darkMode ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800') : (darkMode ? 'text-white/50 hover:bg-white/10' : 'text-slate-400 hover:bg-slate-100')}`}>
                            <HistoryIcon className="w-4 h-4" /><span>View History</span>
                        </button>
                        
                        {/* 历史下拉框 */}
                        {showHistory && (
                            <div className={`absolute bottom-16 right-0 w-72 rounded-2xl shadow-2xl border p-4 animate-in slide-in-from-bottom-5 fade-in z-50 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'}`}>
                                <div className="flex justify-between items-center mb-4 border-b border-slate-500/20 pb-2">
                                    <h3 className="font-bold flex items-center"><HistoryIcon className={`w-4 h-4 mr-2 ${currentTheme.accent}`}/> Mood Log</h3>
                                    <button onClick={() => setShowHistory(false)}><X className="w-4 h-4 opacity-50"/></button>
                                </div>
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                    {moodHistory.map((item) => (
                                        <div key={item.id} className="flex items-start gap-3 text-sm">
                                            <div className={`w-2 h-2 rounded-full mt-1.5 ${item.mood === 'happy' ? 'bg-orange-400' : item.mood === 'tired' ? 'bg-indigo-400' : 'bg-emerald-400'}`}></div>
                                            <div className="flex-1 pb-3 border-b border-slate-500/10">
                                                <div className="flex justify-between"><span className="font-bold capitalize">{item.mood}</span><span className="text-[10px] opacity-50 font-mono">{item.time}</span></div>
                                                <div className="text-xs opacity-70 mt-0.5 line-clamp-2">{item.note}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. 情绪切换按钮 (保留) */}
                    <div className={`p-4 rounded-3xl backdrop-blur-md border ${darkMode ? 'bg-black/20 border-white/10' : 'bg-white/40 border-white/50'}`}>
                        <div className="flex flex-col gap-4">
                             <button onClick={() => handleMoodChange('happy')} className={`p-3 rounded-full transition-all hover:scale-110 active:scale-95 ${mood === 'happy' ? 'bg-orange-100 text-orange-600 ring-4 ring-orange-200' : (darkMode ? 'bg-white/10 text-white/50' : 'bg-white text-slate-300 shadow-sm')}`}><Smile className="w-8 h-8" /></button>
                             <button onClick={() => handleMoodChange('neutral')} className={`p-3 rounded-full transition-all hover:scale-110 active:scale-95 ${mood === 'neutral' ? 'bg-emerald-100 text-emerald-600 ring-4 ring-emerald-200' : (darkMode ? 'bg-white/10 text-white/50' : 'bg-white text-slate-300 shadow-sm')}`}><Meh className="w-8 h-8" /></button>
                             <button onClick={() => handleMoodChange('tired')} className={`p-3 rounded-full transition-all hover:scale-110 active:scale-95 ${mood === 'tired' ? 'bg-indigo-100 text-indigo-600 ring-4 ring-indigo-200' : (darkMode ? 'bg-white/10 text-white/50' : 'bg-white text-slate-300 shadow-sm')}`}><Frown className="w-8 h-8" /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Video Modal (保留原有视频弹窗功能) --- */}
            {playingVideo && (
                <div className="absolute inset-0 z-[60] bg-black/80 flex items-center justify-center p-8 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden relative shadow-2xl flex flex-col animate-in zoom-in-95">
                        <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                {playingVideo === 'eye' ? <Eye className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                                {playingVideo === 'eye' ? "Eye Care Routine" : "Body Stretch Guide"}
                            </h3>
                            <button onClick={() => setPlayingVideo(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="aspect-video bg-black flex items-center justify-center relative">
                            <div className="text-white text-center opacity-50">
                                <Play className="w-20 h-20 mx-auto mb-4" />
                                <p className="text-xl font-medium">Video Player Placeholder</p>
                                <p className="text-sm mt-2">{playingVideo === 'eye' ? "Playing: 5-Min Eye Relaxation" : "Playing: Seated Back Stretch"}</p>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/20">
                                <div className={`h-full w-1/3 ${currentTheme.circle.replace('bg-', 'bg-')}`}></div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-200">
                            <h4 className="font-bold text-slate-800 mb-2">Instructions:</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {playingVideo === 'eye' 
                                    ? "Follow the dot on the screen with your eyes without moving your head. Blink naturally. If you feel any discomfort, close your eyes and rest."
                                    : "Sit upright with your feet flat on the floor. Follow the movements slowly. Do not overstretch. Breathe deeply and rhythmically throughout the exercise."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 6. 驾驶主页 (Home Page) ---
const DriverHomePage = ({ navigateToSchedule, showRestStops, setShowRestStops, onStopClick, activeRoute, darkMode, toggleDarkMode, onToggleMessages, onToggleRestMode, openRouteDetail, nextStopOverride }) => {
  const [time, setTime] = useState(new Date());
  const [capacity, setCapacity] = useState(45);
  const [isStopRequested, setIsStopRequested] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const timelineRef = useRef(null);
  const [isApproaching, setIsApproaching] = useState(false);
  
  // 使用真实路由或默认路由
  let rawStops = activeRoute ? activeRoute.timeline : generateTimeline(route4Stops, 18, 0);

  

  const displayedStops = rawStops.map((item, index) => {
      let status = 'future';
      if (index < currentStopIndex) status = 'passed';
      else if (index === currentStopIndex) status = 'current';
      return { ...item, status };
  });
// --- 修改：调整坐标计算 (整体向左平移) ---
const getStopPosition = (index) => {
    // 起始站：原 left: 55 -> 改为 35
    if (index === 0) return { top: 35, left: 35 };
    
    // 第4站(弯道)：原 left: 75 -> 改为 55
    if (index === 3) return { top: 15, left: 55 };
    
    // 其他站点：原 50 + index*5 -> 改为 30 + index*5
    // 这样随着 index 增加，站点也不会太快跑出屏幕右侧
    return { top: 40 + index * 5, left: 30 + index * 5 };
};

  const currentRouteName = activeRoute ? `Bus ${activeRoute.route}` : "Bus 4";
  const currentBusNo = activeRoute ? `Vehicle: ${activeRoute.bus}` : "Vehicle: B-9527";
  const nextStop = displayedStops.slice(currentStopIndex + 1).find(s => s.type !== 'deadhead') || displayedStops[currentStopIndex + 1];
  const activeNextStop = nextStopOverride || nextStop;

  useEffect(() => {
    let interval;
    if (isSimulating) {
        // 缩短时间间隔，让状态切换更流畅
        interval = setInterval(() => {
            if (!isApproaching) {
                // 阶段 1：先进入“接近模式” (Zoom In)
                setIsApproaching(true);
            } else {
                // 阶段 2：到达站点，切下一站，并重置缩放 (Zoom Out)
                setCurrentStopIndex(prev => {
                    if (prev >= rawStops.length - 1) { 
                        setIsSimulating(false); 
                        setIsApproaching(false);
                        return 0; 
                    }
                    return prev + 1;
                });
                setIsApproaching(false); // 到站后恢复全景
            }
        }, 2500); // 每 2.5秒切换一次状态
    }
    return () => clearInterval(interval);
    }, [isSimulating, isApproaching, rawStops.length]);

  useEffect(() => {
      let interval;
      if (isSimulating) {
          interval = setInterval(() => {
              setCurrentStopIndex(prev => {
                  if (prev >= rawStops.length - 1) { setIsSimulating(false); return 0; }
                  return prev + 1;
              });
          }, 3000);
      }
      return () => clearInterval(interval);
  }, [isSimulating, rawStops.length]);

  useEffect(() => {
      if (timelineRef.current) {
          const currentElement = timelineRef.current.querySelector('[data-current="true"]');
          if (currentElement) {
              const container = timelineRef.current;
              const elementTop = currentElement.offsetTop;
              const elementHeight = currentElement.offsetHeight;
              const containerHeight = container.clientHeight;
              const scrollTo = elementTop - (containerHeight / 2) + (elementHeight / 2);
              container.scrollTo({ top: scrollTo, behavior: 'smooth' });
          }
      }
  }, [currentStopIndex]);

  useEffect(() => { const timer = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timer); }, []);
  const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [sosState, setSosState] = useState('idle');

  const handleSOS = () => {
      if (sosState === 'idle') {
          // 阶段 1: 进入待确认模式
          setSosState('confirm');
          // 3秒后如果没有确认，自动恢复，防止误触后一直卡在确认状态
          setTimeout(() => {
              setSosState(prev => prev === 'active' ? 'active' : 'idle');
          }, 3000);
      } else if (sosState === 'confirm') {
          // 阶段 2: 确认发送
          setSosState('active');
          setIsEmergencyActive(true); // 触发原有的全屏红色警报
          // 3秒后重置所有状态
          setTimeout(() => {
              setIsEmergencyActive(false);
              setSosState('idle');
          }, 3000);
      }
  };
  const handleEmergency = () => { setIsEmergencyActive(true); setTimeout(() => setIsEmergencyActive(false), 3000); };

  const [callStatus, setCallStatus] = useState('idle'); // 'idle' | 'calling' | 'connected'

  const handleCallDispatch = () => {
      if (callStatus !== 'idle') return; // 防止重复点击

      // 阶段 1: 呼叫中
      setCallStatus('calling');
      
      // 模拟 2秒后接通
      setTimeout(() => {
          setCallStatus('connected');
          
          // 模拟 接通显示 1秒后恢复待机
          setTimeout(() => {
              setCallStatus('idle');
          }, 1500);
      }, 2000);
  };

  const nextStopPos = getStopPosition(currentStopIndex + 1);

    // 4. 定义动态样式
  const mapContainerStyle = {
    // 如果正在接近，放大 1.6 倍，否则保持原状
    transform: isApproaching ? 'scale(1.6)' : 'scale(1)',
    // 关键：将缩放的中心点设置为“下一站”的坐标，实现“聚焦”效果
    transformOrigin: isApproaching ? `${nextStopPos.left}% ${nextStopPos.top}%` : 'center center',
    transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)', // 平滑过渡动画
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0 
  };

  // --- 新增：动态延误模拟 ---
  const [delayMinutes, setDelayMinutes] = useState(0);

  // 模拟路况变化：每 5 秒随机更新一次延误时间 (-4 到 +8 分钟之间)
  useEffect(() => {
      const interval = setInterval(() => {
          const randomDelay = Math.floor(Math.random() * 13) - 4; 
          setDelayMinutes(randomDelay);
      }, 5000);
      return () => clearInterval(interval);
  }, []);

  // 颜色与文案辅助函数 (保持逻辑，优化样式类)
  const getDelayColor = (min) => { 
      if (min < -2) return 'text-orange-500'; // 早点 (Early)
      if (min <= 2) return 'text-green-500';  // 准点 (On Time)
      if (min < 5) return 'text-yellow-500';  // 轻微延误 (Delay)
      return 'text-red-500';                  // 严重晚点 (Late)
  };
  
  const getDelayText = (min) => { 
      if (min < -2) return "Early"; 
      if (min <= 2) return "On Time"; 
      if (min < 5) return "Delay"; 
      return "Late"; 
  };

  useEffect(() => {
      // 每 6 秒进行一次判定：30% 的概率切换状态（模拟有人按铃/车门打开重置）
      const interval = setInterval(() => {
          if (Math.random() > 0.7) {
              setIsStopRequested(prev => !prev); 
          }
      }, 6000);
      return () => clearInterval(interval);
  }, []);

  // --- 新增：模拟载客量动态变化 (Capacity Simulation) ---
  useEffect(() => {
      const interval = setInterval(() => {
          setCapacity(prev => {
              // 模拟上下车：随机变化 -5% 到 +10% 之间
              const change = Math.floor(Math.random() * 16) - 5;
              let newCap = prev + change;
              
              // 边界限制：不能小于 0% 也不能大于 100%
              if (newCap > 100) newCap = 100;
              if (newCap < 0) newCap = 0;
              
              return newCap;
          });
      }, 3000); // 每 3 秒更新一次
      return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col h-full w-full font-sans overflow-hidden select-none relative transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`h-16 flex items-center justify-between px-6 shadow-sm z-10 shrink-0 transition-colors duration-500 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-b border-slate-200'}`}>
        <div className="flex items-center space-x-6">
            <button onClick={() => openRouteDetail(null)} className="bg-blue-600 px-3 py-1 rounded text-lg font-bold text-white transition-all active:scale-95">{currentRouteName}</button>
            <div className={`text-sm font-mono transition-all ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{currentBusNo}</div>
        </div>
        
        {/* --- Header Right Section: Voice, Time, Delay --- */}
        <div className="flex items-center space-x-6">
            
            {/* 1. 语音按钮 (移至左侧，尺寸放大) */}
            <button 
                onClick={() => setIsVoiceActive(true)} 
                className={`p-4 rounded-full transition-all active:scale-95 hover:shadow-lg ${darkMode ? 'bg-slate-700 text-blue-400 hover:bg-slate-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
            >
                {/* 图标尺寸从 w-5 h-5 改为 w-7 h-7 */}
                <Mic className="w-7 h-7"/>
            </button>

            {/* 2. 时间显示 */}
            <div className={`text-5xl font-mono font-bold tracking-wider ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {formatTime(time)}
            </div>

            {/* 3. 动态延误状态条 */}
            <div className={`flex items-center space-x-3 px-5 py-2 rounded-2xl border transition-colors duration-500 ${darkMode ? 'bg-slate-900 border-slate-600' : 'bg-white border-slate-300'}`}>
                {/* 状态指示条可视化 */}
                <div className="flex items-center space-x-1">
                    {/* 早点指示条 (Orange) */}
                    <div className={`w-2 h-5 rounded-sm transition-colors duration-500 ${delayMinutes < -2 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-slate-300 opacity-20'}`}></div>
                    
                    {/* 准点指示条 (Green) */}
                    <div className={`w-2 h-5 rounded-sm transition-colors duration-500 ${delayMinutes >= -2 && delayMinutes <= 2 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-300 opacity-20'}`}></div>
                    
                    {/* 分隔线 */}
                    <div className="w-0.5 h-6 bg-slate-400/30 mx-1"></div>
                    
                    {/* 晚点指示条 (Yellow/Red) */}
                    <div className={`w-2 h-5 rounded-sm transition-colors duration-500 ${delayMinutes > 2 ? (delayMinutes >= 5 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-yellow-500') : 'bg-slate-300 opacity-20'}`}></div>
                </div>

                {/* 文字数值显示 */}
                <div className="flex flex-col leading-none text-right min-w-[60px]">
                    <span className={`text-xl font-bold font-mono transition-colors duration-500 ${getDelayColor(delayMinutes)}`}>
                        {delayMinutes > 0 ? `+${delayMinutes}` : delayMinutes}:00
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors duration-500 ${getDelayColor(delayMinutes)}`}>
                        {getDelayText(delayMinutes)}
                    </span>
                </div>
            </div>
        </div>

        <div className="flex items-center space-x-4">
           <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{darkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}</button>
           <div className="text-right"><div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Drive Time</div><div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>3h 15m</div></div>
           <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-orange-500 w-3/4"></div></div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className={`w-1/4 border-r flex flex-col z-20 shadow-lg transition-colors duration-500 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
              <h3 className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Timeline</h3>
              <button onClick={() => setIsSimulating(!isSimulating)} className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold border transition-all ${isSimulating ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{isSimulating ? <Pause className="w-3 h-3"/> : <Play className="w-3 h-3"/>}<span>{isSimulating ? 'Pause' : 'Simulate'}</span></button>
          </div>
          <div ref={timelineRef} className="flex-1 overflow-y-auto scrollbar-hide p-4 relative">
            <div className={`absolute left-[23px] top-4 bottom-4 w-1 z-0 ${darkMode ? 'bg-slate-600' : 'bg-slate-200'}`}></div>
            {displayedStops.map((stop, index) => {
              if (stop.type === 'rest_stop' && !showRestStops) return null;
              const isRestStop = stop.type === 'rest_stop';
              const isCurrent = stop.status === 'current';
              let dotClass = isRestStop 
                ? `w-10 h-10 rounded-xl ... (Rest Stop 保持不变)` 
                : `w-10 h-10 rounded-full border-4 flex items-center justify-center shrink-0 z-10 transition-colors 
                ${isCurrent 
                    ? (darkMode 
                        ? 'bg-blue-600 border-white text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' // Dark Mode 高亮增强
                        : 'bg-blue-600 border-blue-200 text-white shadow-lg') 
                    : (darkMode 
                        ? 'bg-slate-800 border-slate-600 text-slate-500' // 普通站点加深背景
              : 'bg-slate-100 border-slate-300 text-slate-500')}`;
              return (
                <div key={stop.id} data-current={isCurrent} className={`flex items-start mb-6 relative group cursor-pointer transition-all duration-500 ${isCurrent ? (darkMode ? 'bg-slate-700/50 -mx-2 p-2 rounded-lg' : 'bg-slate-50 -mx-2 p-2 rounded-lg') : ''}`} onClick={() => isRestStop && onStopClick(stop)}>
                  <div className={dotClass}>{isRestStop ? <Coffee className="w-5 h-5" /> : <span className="text-xs font-bold">{index + 1}</span>}</div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start"><div className={`font-bold leading-tight ${isCurrent ? (darkMode ? 'text-white text-xl' : 'text-blue-800 text-xl') : (darkMode ? 'text-slate-400' : 'text-slate-700')}`}>
                    {stop.name}
                </div><div className={`text-xs font-mono mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{stop.time}</div></div>
                    {isRestStop && stop.features && (<div className="flex space-x-2 mt-1.5">{stop.features.includes('wc') && <div className={`flex items-center text-[10px] px-1.5 rounded font-bold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}><Info className="w-3 h-3 mr-1"/>WC</div>}{stop.features.includes('food') && <div className={`flex items-center text-[10px] px-1.5 rounded font-bold ${darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-50 text-orange-500'}`}><Utensils className="w-3 h-3 mr-1"/>Food</div>}</div>)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`p-4 border-t ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
              <button onClick={() => setShowRestStops(!showRestStops)} className={`w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-xl font-bold transition-all border-2 active:scale-95 ${showRestStops ? 'bg-orange-100 text-orange-700 border-orange-200' : (darkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-white text-slate-500 border-slate-300')}`}>{showRestStops ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}<span>{showRestStops ? 'Hide Rest Stops' : 'Show Rest Stops'}</span></button>
          </div>
        </aside>

        <main className={`flex-1 relative flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
          
          {/* --- 缩放容器：包裹地图背景和站点图标 --- */}
          <div style={mapContainerStyle}>
              {/* 背景网格 */}
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                  <div className="w-full h-full" style={{backgroundImage: `linear-gradient(${darkMode ? '#475569' : '#94a3b8'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#475569' : '#94a3b8'} 1px, transparent 1px)`, backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(20deg) scale(1.5)', transformOrigin: 'bottom'}}></div>
                  <svg className="absolute inset-0 w-full h-full" style={{transform: 'perspective(500px) rotateX(20deg) scale(1.5)', transformOrigin: 'bottom'}}>
                      <path d="M 300 800 C 320 760, 340 720, 360 680" fill="none" stroke="#22c55e" strokeWidth="20" strokeLinecap="round" />
                      <path d="M 360 680 C 380 640, 400 600, 420 560" fill="none" stroke="#ef4444" strokeWidth="20" strokeLinecap="round" />
                      <path d="M 420 560 C 450 500, 500 400, 500 200 S 800 50, 900 0" fill="none" stroke={darkMode ? "#1e293b" : "#3b82f6"} strokeWidth="20" strokeLinecap="round" />
                  </svg>
              </div>

              {/* 站点渲染循环 */}
              {displayedStops.map((stop, index) => {
                  const pos = getStopPosition(index); // 使用新的辅助函数
                  // 这里的样式要加上 % 单位
                  const posStyle = { top: `${pos.top}%`, left: `${pos.left}%` };
                  
                  // 判断是否为下一站且正在接近 (用于显示高亮光环)
                  const isNextAndApproaching = index === currentStopIndex + 1 && isApproaching;

                  if (stop.type === 'rest_stop') {
                      if (!showRestStops) return null;
                      return (
                          <div key={stop.id} className="absolute z-30 flex flex-col items-center cursor-pointer group hover:scale-110 transition-transform" style={posStyle} onClick={() => onStopClick(stop)}>
                              <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg mb-2 flex items-center space-x-2 border border-orange-200">
                                  <span className="font-bold text-xs text-slate-800 whitespace-nowrap">{stop.name}</span>
                              </div>
                              <div className="relative">
                                  <MapPin className="w-10 h-10 text-orange-500 fill-current drop-shadow-lg relative z-10" />
                                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-bold text-[10px] z-20">
                                      <Coffee className="w-3 h-3"/>
                                  </div>
                              </div>
                          </div>
                      );
                  } else { 
                      return (
                          <div key={stop.id} className={`absolute z-30 flex flex-col items-center transition-all duration-300`} style={posStyle}>
                              {/* 圆点图标：增加了 isNextAndApproaching 的高亮样式逻辑 */}
                              <div className={`flex items-center justify-center rounded-full shadow-lg border-2 transition-all duration-500 
                                  ${stop.status === 'current' ? 'w-10 h-10 bg-blue-600 border-white text-white ring-4 ring-blue-500/30' : 'w-8 h-8 bg-white border-blue-600 text-blue-600'}
                                  ${isNextAndApproaching ? 'scale-125 ring-4 ring-green-400 shadow-[0_0_20px_rgba(74,222,128,0.6)]' : ''}
                              `}>
                                  {stop.status === 'current' ? <Bus className="w-5 h-5" /> : <span className="text-xs font-bold">{index + 1}</span>}
                              </div>
                              <div className={`mt-1.5 px-2 py-1 rounded-md text-xs font-bold shadow-sm whitespace-nowrap bg-white/90 text-slate-800`}>
                                  {stop.name}
                              </div>
                          </div>
                      ); 
                  }
              })}
          </div>

          {/* --- 顶部导航指示条 (不随地图缩放，固定在上方) --- */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-slate-300 px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-4 pointer-events-none z-20">
              <Navigation className={`w-8 h-8 ${isApproaching ? 'text-green-500 animate-pulse' : 'text-blue-600'}`} />
              <div>
                  {/* 动态显示的距离提示文字 */}
                  <div className={`text-xs font-bold uppercase transition-colors duration-300 ${isApproaching ? 'text-green-600' : 'text-slate-500'}`}>
                      {isApproaching ? 'Approaching Stop (200m)' : '1.2 km Straight'}
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                      Next: {activeNextStop?.name || "Destination"}
                  </div>
              </div>
          </div>
        </main>

    <aside className={`w-1/4 border-l flex flex-col z-20 shadow-xl transition-colors duration-500 p-5 gap-5 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
           
           {/* --- 分区 1: 状态监控 (Status Monitor) --- */}
           {/* 占比调整为 flex-[1.5]，更紧凑 */}
           <div className={`flex-[1.5] rounded-3xl p-3 flex flex-col gap-3 border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-100/80 border-slate-200'}`}>
               <div className={`text-[10px] font-bold uppercase tracking-widest px-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Vehicle Status</div>
               
               {/* 1. 载客量 (Capacity) - 整个Block都是进度条 */}
               <div className={`flex-1 rounded-xl border relative overflow-hidden flex items-center justify-between px-4 z-0 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                   {/* 动态背景条: 宽度随 capacity 变化 */}
                   <div 
                       className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out opacity-20 z-0 ${capacity > 80 ? 'bg-red-500' : 'bg-green-500'}`} 
                       style={{ width: `${capacity}%` }} // 这里绑定了动态数据
                   ></div>
                   
                   {/* 内容层 */}
                   <div className="flex items-center gap-3 relative z-10">
                       <Users className={`w-5 h-5 ${capacity > 80 ? 'text-red-500' : 'text-slate-400'}`} />
                       <div>
                           <div className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Capacity</div>
                           <div className="text-[10px] opacity-50">APC Active</div>
                       </div>
                   </div>
                   <div className="text-right relative z-10">
                       <span className={`text-xl font-bold ${capacity > 80 ? 'text-red-500' : (darkMode ? 'text-white' : 'text-slate-800')}`}>{capacity}%</span>
                   </div>
               </div>

               {/* 2. 下车请求 (Stop Request) */}
               <div className={`flex-1 rounded-xl flex items-center justify-between px-4 border transition-colors duration-500
                   ${isStopRequested 
                       ? 'bg-red-500/10 border-red-500/50' 
                       : (darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200')
                   }`}
               >
                   <div className="flex items-center gap-3">
                       {isStopRequested 
                           ? <BellRing className="w-5 h-5 text-red-500 animate-[wiggle_1s_ease-in-out_infinite]" /> 
                           : <Bell className="w-5 h-5 text-slate-400" />
                       }
                       <div>
                           <div className={`text-sm font-bold transition-colors ${isStopRequested ? 'text-red-500' : (darkMode ? 'text-slate-300' : 'text-slate-600')}`}>
                               {isStopRequested ? 'STOP REQ' : 'No Stop'}
                           </div>
                       </div>
                   </div>
                   <div className={`w-3 h-3 rounded-full ${isStopRequested ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-slate-300/30'}`}></div>
               </div>
           </div>

           {/* --- 分区 2: 操作控制 (Control Grid) - 2x2 布局 --- */}
           {/* 占比大 (flex-[4]) */}
           <div className="flex-[4] flex flex-col gap-4">
               
               {/* 第一排：消息 (左) + 休息模式 (右) */}
               <div className="flex-1 flex gap-4">
                   {/* 3. 消息中心 */}
                   <button onClick={onToggleMessages} className={`flex-1 rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all active:scale-[0.98] shadow-sm hover:shadow-md group ${darkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-white border-slate-200 hover:bg-blue-50/50'}`}>
                        <div className="relative mb-1">
                            <MessageSquare className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                            {/* 红点提醒 */}
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-white"></span>
                            </div>
                        </div>
                        <span className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Messages</span>
                   </button>

                   {/* 4. 休息模式 (Rest Mode) - 改为淡雅色调 */}
                   <button onClick={onToggleRestMode} className={`flex-1 rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-[0.98] shadow-sm hover:shadow-md group ${darkMode ? 'bg-slate-800 border-slate-600 hover:bg-slate-700' : 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100'}`}>
                       <Coffee className={`w-8 h-8 mb-1 transition-transform group-hover:rotate-12 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                       <span className={`text-sm font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>Rest Mode</span>
                   </button>
               </div>

               {/* 第二排：呼叫 (左) + SOS (右) */}
               <div className="flex-1 flex gap-4">
                   {/* 5. 呼叫调度 */}
                   <button 
                       onClick={handleCallDispatch}
                       disabled={callStatus !== 'idle'}
                       className={`flex-1 rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-[0.95] shadow-sm
                       ${callStatus === 'idle' 
                           ? (darkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-white border-slate-200 hover:bg-slate-50') 
                           : callStatus === 'calling' ? 'bg-blue-100 border-blue-300' : 'bg-green-100 border-green-300'
                       }`}
                   >
                       <PhoneCall className={`w-7 h-7 mb-1 transition-all ${callStatus === 'calling' ? 'text-blue-600 animate-bounce' : (callStatus === 'connected' ? 'text-green-600' : 'text-blue-500')}`} />
                       <span className={`text-xs font-bold ${callStatus === 'calling' ? 'text-blue-700' : (callStatus === 'connected' ? 'text-green-700' : (darkMode ? 'text-slate-300' : 'text-slate-600'))}`}>
                           {callStatus === 'idle' ? 'Dispatch' : (callStatus === 'calling' ? 'Calling...' : 'Connected')}
                       </span>
                   </button>
                   
                   {/* 6. SOS 按钮 */}
                   <button 
                       onClick={handleSOS} 
                       className={`flex-1 rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-[0.95] shadow-sm
                       ${sosState === 'confirm' 
                           ? 'bg-red-600 border-red-700 animate-pulse' 
                           : sosState === 'active' ? 'bg-red-800 border-red-900' : 'bg-red-50 border-red-100 hover:bg-red-100'
                       }`}
                   >
                       <ShieldAlert className={`w-7 h-7 mb-1 transition-colors ${sosState === 'idle' ? 'text-red-600' : 'text-white'}`} />
                       <span className={`text-xs font-bold ${sosState === 'idle' ? 'text-red-600' : 'text-white'}`}>
                           {sosState === 'idle' ? 'SOS' : (sosState === 'confirm' ? 'CONFIRM?' : 'SENT')}
                       </span>
                   </button>
               </div>

           </div>
        </aside>
      </div>
      {isVoiceActive && (<div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-8 py-4 rounded-full flex items-center gap-4 animate-in slide-in-from-top-4 z-50 shadow-2xl"><div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div><span className="font-mono">Listening... "Show traffic report"</span><button onClick={() => setIsVoiceActive(false)}><X className="w-5 h-5 opacity-50 hover:opacity-100"/></button></div>)}
    </div>
  );
};

// --- 7. 排班表页面 ---
const SchedulePage = ({ darkMode, openRouteDetail }) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    // 计算当前星期每一天的日期
    const getCurrentWeekDates = () => {
        const now = new Date();
        const day = now.getDay(); // 0 = 周日, 1 = 周一, ..., 6 = 周六
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // 调整到周一
        const monday = new Date(now.setDate(diff));
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            weekDates.push(date);
        }
        return weekDates;
    };

    const weekDates = getCurrentWeekDates();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const baseScheduleData = [
        { day: 'Mon', shifts: [{ start: 7, end: 15, route: '4', bus: 'B-9527', type: 'work' }] }, 
        { day: 'Tue', shifts: [{ start: 14, end: 22, route: '6', bus: 'B-8821', type: 'work' }] }, 
        { day: 'Wed', shifts: [{ start: 0, end: 24, type: 'rest' }] }, 
        { day: 'Thu', shifts: [{ start: 7, end: 15, route: '4', bus: 'B-9527', type: 'work' }] }, 
        { day: 'Fri', shifts: [{ start: 7, end: 12, route: '4', bus: 'B-9527', type: 'work' }, { start: 18, end: 22, route: '4', bus: 'B-9999', type: 'work' }] }, 
        { day: 'Sat', shifts: [{ start: 9, end: 17, route: '6', bus: 'T-101', type: 'work' }] }, 
        { day: 'Sun', shifts: [{ start: 0, end: 24, type: 'rest' }] }];
    
    // 为每个 shift 添加日期属性
    const scheduleData = baseScheduleData.map((dayData, index) => {
        const date = weekDates[index];
        const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}`;
        return {
            ...dayData,
            shifts: dayData.shifts.map(shift => ({
                ...shift,
                day: dayData.day,
                date: formattedDate,
                dateObj: date
            }))
        };
    });

    // 计算当前星期的日期范围（周一到周日）
    const getCurrentWeekRange = () => {
        const monday = weekDates[0];
        const sunday = weekDates[6];
        const formatDate = (date) => `${monthNames[date.getMonth()]} ${date.getDate()}`;
        return `${formatDate(monday)} - ${formatDate(sunday)}`;
    };

    return (
        <div className={`flex flex-col h-full w-full font-sans p-8 overflow-hidden relative ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Weekly Schedule</h1>
                    <p className="opacity-50 mt-1">Week 42 • {monthNames[weekDates[0].getMonth()]} {weekDates[0].getDate()} - {monthNames[weekDates[6].getMonth()]} {weekDates[6].getDate()}</p>
                </div>
                <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white/20">
                        JD
                    </div>
                    <div>
                        <div className="font-bold text-lg leading-none">Jack Driver</div>
                        <div className="text-xs font-mono opacity-60 mt-1 flex items-center gap-2">
                            <span>ID: 9527</span>
                            <span className="w-1 h-1 bg-current rounded-full"></span>
                            <span>Senior Level</span>
                        </div>
                    </div>
                    <div className={`w-px h-8 mx-2 ${darkMode ? 'bg-slate-600' : 'bg-slate-200'}`}></div>
                    <div className="text-right">
                         <div className="text-xs opacity-50 font-bold uppercase">Total Hours</div>
                         <div className="font-mono font-bold text-blue-500">38.5h</div>
                    </div>
                </div>
            </header>
            <div className={`flex-1 rounded-3xl border shadow-sm p-6 overflow-hidden flex flex-col ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex mb-2 pl-16">{hours.map(h => (<div key={h} className="flex-1 text-center text-xs opacity-40 border-l h-4">{h % 2 === 0 ? h : ''}</div>))}</div>
                <div className="flex-1 flex flex-col justify-between relative">
                   <div className="absolute inset-0 flex pl-16 pointer-events-none">{hours.map(h => (<div key={h} className={`flex-1 border-l ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}></div>))}</div>
                   {scheduleData.map((dayData, index) => (<div key={index} className="flex items-center relative h-12 z-10 group">
                    <div className="w-16 font-bold text-lg shrink-0">{dayData.day}</div>

                    <div className={`flex-1 h-10 rounded-lg relative overflow-hidden flex items-center ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                        {dayData.shifts.map((shift, sIndex) => {
                            const startPercent = (shift.start / 24) * 100;
                            const durationPercent = ((shift.end - shift.start) / 24) * 100;
                            
                            return shift.type === 'work' ? (
                                <div 
                                    key={sIndex} 
                                    onClick={() => openRouteDetail(shift)} 
                                    className="absolute h-full top-0 bg-blue-500/90 hover:bg-blue-600 cursor-pointer rounded-md border-2 border-white/20 shadow-sm flex items-center justify-center text-white text-xs font-bold transition-all hover:scale-105 z-20" 
                                    style={{ left: `${startPercent}%`, width: `${durationPercent}%` }}
                                >
                                    <span className="truncate px-1">Bus {shift.route}</span>
                                </div>
                            ) : (
                                <div 
                                    key={sIndex} 
                                    className="absolute h-full top-0 bg-green-500/20 border-2 border-white/10 flex items-center justify-center" 
                                    style={{ left: '0%', width: '100%' }}
                                >
                                    <span className="text-green-500 text-xs font-bold tracking-widest uppercase">Rest Day</span>
                                </div>
                            );
                        })}
                    </div>
                </div>))}
                </div>
            </div>
        </div>
    );
};

const LoginPage = ({ onLoginSuccess }) => {
    const [loginStep, setLoginStep] = useState('idle'); // idle, processing, welcome

    const handleSwipe = () => {
        setLoginStep('processing');
        // 模拟读取卡片数据
        setTimeout(() => {
            setLoginStep('welcome');
            // 显示欢迎动画后进入主页
            setTimeout(() => {
                onLoginSuccess();
            }, 2500);
        }, 1000);
    };

    return (
        <div className="absolute inset-0 z-[100] bg-slate-900 text-white flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
            </div>

            {loginStep === 'idle' && (
                <div className="z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="mb-8 p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl flex flex-col items-center">
                        <div className="w-64 h-40 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl mb-6 relative border-t border-white/10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                            <div className="w-full h-8 bg-black/50 absolute top-4"></div>
                            <div className="text-xs text-slate-400 absolute bottom-4 left-4">ID CARD</div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Driver Login</h2>
                        <p className="text-slate-400 text-sm mb-6 text-center max-w-xs">
                            Please swipe your Employee ID card on the reader to start your shift.
                        </p>
                        
                        {/* 模拟刷卡动作的按钮 */}
                        <button 
                            onClick={handleSwipe}
                            className="group relative flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                        >
                            <div className="w-2 h-8 bg-white/20 rounded-full absolute left-4 group-hover:h-full transition-all duration-300"></div>
                            <span>Tap here to Swipe Card</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="text-slate-500 text-xs mt-8">System v2.4.0 | BusOS</div>
                </div>
            )}

            {loginStep === 'processing' && (
                <div className="z-10 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-blue-400 font-mono animate-pulse">Authenticating...</p>
                </div>
            )}

            {loginStep === 'welcome' && (
                <div className="z-10 text-center animate-in slide-in-from-bottom-10 fade-in duration-700">
                    <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                        <Users className="w-12 h-12 text-slate-400" /> {/* 这里可以用头像图片 */}
                    </div>
                    <h1 className="text-5xl font-bold mb-2">Welcome, Jack</h1>
                    <p className="text-xl text-slate-400">ID: 9527 • Senior Driver</p>
                    <div className="mt-8 flex gap-2 justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 8. TabButton Component ---
const TabButton = ({ icon, label, active, onClick, darkMode }) => (
    <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ${active ? 'text-blue-500' : (darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}><div className={`p-1 rounded-xl mb-1 transition-all ${active ? (darkMode ? 'bg-blue-500/20' : 'bg-blue-50') : ''}`}>{React.cloneElement(icon, { className: `w-6 h-6 ${active ? 'stroke-[2.5px]' : 'stroke-2'}` })}</div><span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-0 scale-0 h-0'}`}>{label}</span></button>
);

/* --- 9. 根组件 (Main App Container) --- */
const BusDriverApp = () => {
  //Page variables
  const [currentPage, setCurrentPage] = useState('home'); // current page
  const [activeOverlay, setActiveOverlay] = useState(null); // active overlay
  const [startX, setStartX] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // dark mode

  //Status variables
  const [showRestStops, setShowRestStops] = useState(true); // show/hide rest stops
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Modal variables
  const [selectedStopDetail, setSelectedStopDetail] = useState(null); // selected stop detail
  const [activeRoute, setActiveRoute] = useState(null); // active route
  const [detailModalShift, setDetailModalShift] = useState(null); // detail modal shift
  const [nextStopOverride, setNextStopOverride] = useState(null); // next stop override
  const [messages, setMessages] = useState([
    { id: 1, sender: "Dispatch Center", time: "18:25", subject: "Traffic Alert: Main St.", content: "Heavy traffic reported on Main St due to road work. Please consider alternate route.", priority: "high", read: false },
    { id: 2, sender: "System Admin", time: "14:00", subject: "Shift Schedule Updated", content: "Your shift for next Tuesday (Nov 24) has been updated. You are now assigned to Route 101.", priority: "normal", read: true }
  ]); 

  const handleTouchStart = (e) => setStartX(e.touches ? e.touches[0].clientX : e.clientX);
  const handleTouchEnd = (e) => {
    if (!startX) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
        if (diff > 0 && currentPage === 'home') setCurrentPage('schedule');
        else if (diff < 0 && currentPage === 'schedule') setCurrentPage('home');
        else if (diff < 0 && currentPage === 'home') setCurrentPage('vehicle'); 
        else if (diff > 0 && currentPage === 'vehicle') setCurrentPage('home');
    }
    setStartX(null);
  };

  const handleStopClick = (stop) => { if (stop.type === 'rest_stop') setSelectedStopDetail(stop); };
  //TODO:shift 
  const handleStartDuty = (shift) => { setActiveRoute(shift); setCurrentPage('home'); };
  //TODO:mark read
  const handleMarkRead = (id) => { setMessages(messages.map(m => m.id === id ? {...m, read: true} : m)); };

  if (!isLoggedIn) {
      return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col relative ${darkMode ? 'bg-slate-900' : 'bg-black'}`}>
        {/* main content */}
        <div className="relative flex-1 w-full overflow-hidden" 
        onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onMouseDown={handleTouchStart} onMouseUp={handleTouchEnd}> 
            <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out" 
            style={{ transform: currentPage === 'vehicle' ? 'translateX(0)' : 'translateX(-100%)' }}>
                <VehicleStatusPage 
                darkMode={darkMode} />
            </div>

            <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out" 
            style={{ transform: currentPage === 'home' ? 'translateX(0)' : currentPage === 'schedule' ? 'translateX(-100%)' : 'translateX(100%)' }}>
                <DriverHomePage 
                darkMode={darkMode} 
                showRestStops={showRestStops} 
                setShowRestStops={setShowRestStops} 
                onStopClick={handleStopClick} 
                navigateToSchedule={() => setCurrentPage('schedule')}
                onToggleMessages={() => setActiveOverlay('messages')} 
                onToggleRestMode={() => setActiveOverlay('rest')} 
                openRouteDetail={(shift) => setDetailModalShift(shift || { route: '4', bus: 'B-9527', day: 'Today', start: '06', end: '15' })} 
                activeRoute={activeRoute} 
                toggleDarkMode={() => setDarkMode(!darkMode)} 
                nextStopOverride={nextStopOverride} />
            </div>

            <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out" 
            style={{ transform: currentPage === 'schedule' ? 'translateX(0)' : 'translateX(100%)' }}>
                <SchedulePage 
                darkMode={darkMode} 
                openRouteDetail={setDetailModalShift}
                 />
            </div>
              
            <div className={`absolute inset-0 z-40 transition-transform duration-300 ease-out ${activeOverlay === 'messages' ? 'translate-x-0' : 'translate-x-full'}`}>
                {activeOverlay === 'messages' && <MessageCenterPage onClose={() => setActiveOverlay(null)} 
                darkMode={darkMode} messages={messages} onMarkRead={handleMarkRead} />}
            </div>

            <div className={`absolute inset-0 z-50 transition-transform duration-300 ease-out ${activeOverlay === 'rest' ? 'translate-x-0' : 'translate-x-full'}`}>
                {activeOverlay === 'rest' && <RestModeView onClose={() => setActiveOverlay(null)} darkMode={darkMode} />}
            </div>

            <StopDetailModal stop={selectedStopDetail} 
            onClose={() => setSelectedStopDetail(null)} 
            onNavigate={(stop) => setNextStopOverride(stop)} />

            <RouteDetailModal shift={detailModalShift} 
            onClose={() => setDetailModalShift(null)} 
            onStartNavigation={(s) => { handleStartDuty(s); setDetailModalShift(null); }} />

        </div>

        {/* bottom navigation */}
        <div className={`h-20 flex justify-around items-center shrink-0 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-[60] relative ${darkMode ? 'bg-slate-800 border-t border-slate-700' : 'bg-white border-t border-slate-200'}`}>
            <TabButton icon={<Car />} label="Vehicle" active={currentPage === 'vehicle'} onClick={() => setCurrentPage('vehicle')} darkMode={darkMode} />
            <TabButton icon={<Home />} label="Drive" active={currentPage === 'home'} onClick={() => setCurrentPage('home')} darkMode={darkMode} />
            <TabButton icon={<Calendar />} label="Schedule" active={currentPage === 'schedule'} onClick={() => setCurrentPage('schedule')} darkMode={darkMode} />
        </div>
    </div>
  );
};

export default BusDriverApp;