import React, { useState, useEffect, useRef } from 'react';
import { Clock, MapPin, Navigation, Users, Coffee, MessageSquare, AlertTriangle, ChevronRight, ChevronLeft, Calendar, X, Utensils, Car, Phone, Share2, Star, Info, Map as MapIcon, Leaf, AlertCircle, Timer, Eye, EyeOff, PhoneCall, ShieldAlert, Accessibility, Mail, Bell, CheckCircle, Smile, Meh, Frown, Music, Volume2, Activity, History as HistoryIcon, Bus, Warehouse, Flag, ArrowRight, BellRing, Play, Sun, Moon, Pause, Mic, Wind, Thermometer, Fan, Lock, Unlock, Zap, LayoutGrid, Home } from 'lucide-react';

// --- 1. 默认演示数据 ---
const defaultStopsData = [
  { id: 1, name: "Terminal: Train Station", time: "18:15", type: 'stop' },
  { id: 2, name: "People's Square", time: "18:30", type: 'stop' },
  { 
      id: 3, 
      name: "Highway Service Area A", 
      time: "18:38", 
      type: 'rest_stop',
      features: ['wc', 'food'],
      rating: 4.8,
      distance: "1.2km",
      menu: [{ id: 101, name: "Burger", price: "$12", waitTime: 8, isVegan: false, allergens: ["Gluten"], calories: 650, image: "🍔" }]
  },
  { id: 4, name: "Tech Park", time: "18:45", type: 'stop' },
  { id: 5, name: "City Library", time: "19:00", type: 'stop' },
  { id: 6, name: "University Gate", time: "19:15", type: 'stop' },
  { id: 7, name: "End: Coastal Park", time: "19:30", type: 'stop' },
];

// --- 2. 休息站详情弹窗 ---
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

// --- 3. 路线详情页 (Fixed Close Button) ---
const RouteDetailModal = ({ shift, onClose, onStartNavigation }) => {
    if (!shift) return null;
    const shiftDetails = {
        ...shift,
        startLocation: "Central Bus Depot",
        endLocation: "Central Bus Depot",
        vehicleType: "Electric Articulated Bus",
        timeline: [
            { id: 't1', time: "06:45", type: "depot", location: "Central Bus Depot", description: "Sign in & Vehicle Check", icon: <Warehouse className="w-4 h-4"/> },
            { id: 't2', time: "07:00", type: "deadhead", location: "Depot -> Train Station", description: "Deadhead (No passengers)", icon: <ArrowRight className="w-4 h-4"/> },
            { id: 't3', time: "07:30", type: "start", location: "Terminal: Train Station", description: "Start Route 502", icon: <Bus className="w-4 h-4"/> },
            { id: 't4', time: "11:00", type: "break", location: "Highway Service Area", description: "Lunch Break (45 mins)", icon: <Coffee className="w-4 h-4"/>, features: ['wc', 'food'], menu: [{ id: 99, name: "Driver Special Meal", price: "$8", waitTime: 5, isVegan: false, calories: 700, image: "🍱" }] },
            { id: 't5', time: "14:30", type: "end", location: "End: Coastal Park", description: "Route Complete", icon: <Flag className="w-4 h-4"/> },
            { id: 't6', time: "15:00", type: "depot", location: "Central Bus Depot", description: "Return vehicle & Sign out", icon: <CheckCircle className="w-4 h-4"/> },
        ]
    };

    return (
        <div className="absolute inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in-95">
            <div className="bg-white w-full max-w-2xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
                <div className="bg-blue-600 p-6 text-white shrink-0 relative">
                    {/* FIXED CLOSE BUTTON */}
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 bg-blue-700/50 hover:bg-blue-700 text-white p-2 rounded-full transition-colors z-50 active:scale-95 cursor-pointer"
                    >
                        <X className="w-5 h-5"/>
                    </button>

                    <div className="relative z-10 pr-12">
                        <div className="flex items-center space-x-2 text-blue-100 mb-2 font-bold text-sm uppercase tracking-wider"><Calendar className="w-4 h-4" /> <span>{shiftDetails.day}, Nov 24</span></div>
                        <h2 className="text-4xl font-bold mb-1">Route {shiftDetails.route}</h2>
                        <p className="text-xl text-blue-100">Morning Shift • {shiftDetails.start}:00 - {shiftDetails.end}:00</p>
                    </div>
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <div className="w-1/2 p-6 overflow-y-auto bg-slate-50 border-r border-slate-100">
                        <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-6">Shift Timeline</h3>
                        <div className="relative pl-4 space-y-8">
                            <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                            {shiftDetails.timeline.map((item, idx) => (
                                <div key={idx} className="relative flex items-start group">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 border-2 shadow-sm ${item.type === 'depot' ? 'bg-slate-600 border-slate-200 text-white' : 'bg-blue-500 border-blue-200 text-white'}`}>{item.icon}</div>
                                    <div className="ml-4">
                                        <div className="flex items-center"><span className="font-mono font-bold text-slate-500 text-sm mr-2">{item.time}</span><h4 className="font-bold text-sm text-slate-800">{item.location}</h4></div>
                                        <p className="text-xs text-slate-500 mt-1">{item.description}</p>
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
                        <button onClick={() => onStartNavigation(shiftDetails)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center active:scale-[0.98] shadow-lg"><Navigation className="w-5 h-5 mr-2" /> Start Navigation</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. 消息中心 ---
const MessageCenterPage = ({ onClose, darkMode, messages, onMarkRead }) => {
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

// --- 5. 休息模式 (Restore Missing Features) ---
const RestModeView = ({ onClose, darkMode }) => {
    const [mood, setMood] = useState('neutral');
    const [quoteIndex, setQuoteIndex] = useState(0);
    // Restored States
    const [isPlayingMusic, setIsPlayingMusic] = useState(false);
    const [playingVideo, setPlayingVideo] = useState(null); 
    const [showHistory, setShowHistory] = useState(false);
    const [alarmMinutes, setAlarmMinutes] = useState(15);
    const [isAlarmActive, setIsAlarmActive] = useState(false);
    const [moodHistory, setMoodHistory] = useState([
        { id: 1, time: "14:30", mood: "happy", note: "Great traffic flow" },
        { id: 2, time: "12:15", mood: "tired", note: "Busy lunch rush" },
    ]);

    const quotes = { happy: ["Great Job today!", "Keep the energy up!", "Smooth driving!", "You are a star!"], neutral: ["Breathe in...", "Breathe out...", "Clear your mind", "Relax your shoulders"], tired: ["It's okay to rest", "Close your eyes for a bit", "Release the tension", "Safety comes first"] };
    
    useEffect(() => { const interval = setInterval(() => setQuoteIndex(p => (p + 1) % quotes[mood].length), 4000); return () => clearInterval(interval); }, [mood]);

    const handleMoodChange = (newMood) => { 
        setMood(newMood); 
        setQuoteIndex(0); 
        // Add to history
        setMoodHistory([{ id: Date.now(), time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), mood: newMood, note: newMood === 'happy' ? "Feeling good!" : "Taking a break" }, ...moodHistory]); 
    };

    return (
        <div className={`absolute inset-0 w-full h-full shadow-2xl z-50 flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="flex items-center">
                    <button onClick={onClose} className={`px-6 py-2 border-2 rounded-xl font-bold uppercase tracking-wider transition-colors mr-6 ${darkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>Exit</button>
                    <div className="flex items-center">
                        <div className="p-2 bg-indigo-100 rounded-lg mr-3"><Coffee className="w-6 h-6 text-indigo-600"/></div>
                        <div><h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Rest Mode</h2><p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Recharge yourself</p></div>
                    </div>
                </div>
                <div className="w-20"></div>
            </div>
            
            <div className="flex-1 flex gap-8 p-8">
                {/* Left Column: Exercises & Alarm */}
                <div className="w-1/4 flex flex-col gap-4">
                    <button onClick={() => setPlayingVideo('eye')} className={`p-6 rounded-3xl border-2 text-left transition-all hover:shadow-md active:scale-95 ${playingVideo === 'eye' ? 'bg-green-100 border-green-400' : (darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200')}`}>
                        <Eye className={`w-8 h-8 mb-2 ${playingVideo === 'eye' ? 'text-green-600' : 'text-slate-400'}`} /><div className="font-bold text-lg">Eye Care</div><div className="text-xs opacity-70">5 min routine</div>
                    </button>
                    <button onClick={() => setPlayingVideo('body')} className={`p-6 rounded-3xl border-2 text-left transition-all hover:shadow-md active:scale-95 ${playingVideo === 'body' ? 'bg-green-100 border-green-400' : (darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200')}`}>
                        <Activity className={`w-8 h-8 mb-2 ${playingVideo === 'body' ? 'text-green-600' : 'text-slate-400'}`} /><div className="font-bold text-lg">Body Stretch</div><div className="text-xs opacity-70">Relieve back pain</div>
                    </button>
                    
                    {/* Alarm */}
                    <div className={`p-6 rounded-3xl border-2 ${darkMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold">Wake Alarm</span>
                            <button onClick={() => setIsAlarmActive(!isAlarmActive)} className={`w-10 h-6 rounded-full p-1 transition-colors ${isAlarmActive ? 'bg-green-500' : 'bg-slate-300'}`}><div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${isAlarmActive ? 'translate-x-4' : ''}`}></div></button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setAlarmMinutes(m => Math.max(5, m-5))} className={`w-8 h-8 rounded-full font-bold ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>-</button>
                            <span className="font-mono text-xl font-bold">{alarmMinutes}m</span>
                            <button onClick={() => setAlarmMinutes(m => m+5)} className={`w-8 h-8 rounded-full font-bold ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>+</button>
                        </div>
                        {isAlarmActive && <div className="text-xs text-green-600 mt-2 flex items-center"><Clock className="w-3 h-3 mr-1"/> Alarm set</div>}
                    </div>
                </div>

                {/* Center: Breathing Animation */}
                <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className={`absolute w-96 h-96 rounded-full opacity-20 animate-pulse ${mood === 'tired' ? 'bg-blue-400' : mood === 'happy' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                    <div className={`absolute w-64 h-64 rounded-full opacity-30 animate-bounce duration-[3000ms] ${mood === 'tired' ? 'bg-blue-500' : mood === 'happy' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                    <div className="z-10 text-center px-8">
                        <h1 className={`text-4xl font-bold mb-4 transition-colors duration-500 ${mood === 'tired' ? 'text-blue-500' : mood === 'happy' ? 'text-orange-500' : 'text-green-600'}`}>{quotes[mood][quoteIndex]}</h1>
                        <div className={`text-sm tracking-widest uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Current Vibe: {mood}</div>
                    </div>
                </div>

                {/* Right: Controls & History */}
                <div className="w-1/4 flex flex-col justify-end items-end gap-6 relative">
                    <div className="flex items-center gap-4">
                        <span className={`text-xs uppercase font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>White Noise</span>
                        <button onClick={() => setIsPlayingMusic(!isPlayingMusic)} className={`w-12 h-8 rounded-full flex items-center p-1 transition-colors ${isPlayingMusic ? 'bg-green-500 justify-end' : 'bg-slate-300 justify-start'}`}><div className="w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center">{isPlayingMusic ? <Volume2 className="w-3 h-3 text-green-500"/> : <Music className="w-3 h-3 text-slate-400"/>}</div></button>
                    </div>
                    
                    <div className={`w-full h-px my-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

                    <div className="relative">
                        <button onClick={() => setShowHistory(!showHistory)} className={`flex items-center space-x-2 text-xs font-bold px-3 py-2 rounded-full mb-4 transition-all ${showHistory ? (darkMode ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-800') : (darkMode ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100')}`}><HistoryIcon className="w-4 h-4" /><span>View History</span></button>
                        {showHistory && (
                            <div className={`absolute bottom-16 right-0 w-72 rounded-2xl shadow-2xl border p-4 animate-in slide-in-from-bottom-5 fade-in z-50 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                <div className="flex justify-between items-center mb-4 border-b border-slate-500/20 pb-2"><h3 className={`font-bold flex items-center ${darkMode ? 'text-white' : 'text-slate-700'}`}><HistoryIcon className="w-4 h-4 mr-2 text-blue-500"/> Mood Log</h3><button onClick={() => setShowHistory(false)}><X className="w-4 h-4 text-slate-400"/></button></div>
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                    {moodHistory.map((item, idx) => (
                                        <div key={item.id} className="flex items-start gap-3 text-sm">
                                            <div className={`w-2 h-2 rounded-full mt-1.5 ${item.mood === 'happy' ? 'bg-orange-400' : item.mood === 'tired' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                                            <div className="flex-1 pb-3">
                                                <div className="flex justify-between"><span className={`font-bold capitalize ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{item.mood}</span><span className="text-[10px] text-slate-500 font-mono">{item.time}</span></div>
                                                <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.note}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                         <button onClick={() => handleMoodChange('happy')} className={`p-3 rounded-full transition-all hover:scale-110 active:scale-95 ${mood === 'happy' ? 'bg-orange-100 text-orange-600 scale-110 ring-4 ring-orange-200' : (darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-300 shadow-md')}`}><Smile className="w-10 h-10" /></button>
                         <button onClick={() => handleMoodChange('neutral')} className={`p-3 rounded-full transition-all hover:scale-110 active:scale-95 ${mood === 'neutral' ? 'bg-green-100 text-green-600 scale-110 ring-4 ring-green-200' : (darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-300 shadow-md')}`}><Meh className="w-10 h-10" /></button>
                         <button onClick={() => handleMoodChange('tired')} className={`p-3 rounded-full transition-all hover:scale-110 active:scale-95 ${mood === 'tired' ? 'bg-blue-100 text-blue-600 scale-110 ring-4 ring-blue-200' : (darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-300 shadow-md')}`}><Frown className="w-10 h-10" /></button>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
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
                                <div className="h-full bg-green-500 w-1/3"></div>
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

// --- 新增: 车辆状态页面 (Vehicle Status Page - Left Swipe) ---
const VehicleStatusPage = ({ darkMode }) => {
    const [temp, setTemp] = useState(22);
    const [fanSpeed, setFanSpeed] = useState(2);
    
    return (
        <div className={`w-full h-full p-8 overflow-y-auto ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
            <h1 className="text-3xl font-bold mb-6">Vehicle Status</h1>
            <div className="grid grid-cols-2 gap-6 h-full pb-20">
                {/* Climate Control */}
                <div className={`p-6 rounded-3xl flex flex-col ${darkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center"><Thermometer className="w-5 h-5 mr-2 text-red-500"/> Climate Control</h2>
                        <div className="flex bg-slate-700/20 rounded-lg p-1">
                            <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs font-bold">All</button>
                            <button className="px-3 py-1 text-xs font-bold opacity-50">Driver</button>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center mb-6">
                        <div className="text-6xl font-bold text-yellow-400">{temp}°C</div>
                        <div className="text-sm opacity-50 mt-1">Target Temperature</div>
                    </div>
                    <input type="range" min="16" max="30" value={temp} onChange={(e)=>setTemp(e.target.value)} className="w-full h-2 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-lg appearance-none cursor-pointer mb-6" />
                    <div className="grid grid-cols-4 gap-3">
                         <div className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                             <div className="text-blue-400 font-bold mb-1">A/C</div><div className="text-xs font-bold">ON</div>
                         </div>
                         <div className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 opacity-50 ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                             <div className="text-red-400 font-bold mb-1">Heat</div><div className="text-xs font-bold">OFF</div>
                         </div>
                         <div className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                             <Fan className={`w-5 h-5 mb-1 ${fanSpeed > 0 ? 'animate-spin' : ''} text-blue-400`}/><div className="text-xs font-bold">Med</div>
                         </div>
                         <div className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 opacity-50 ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                             <Wind className="w-5 h-5 mb-1"/><div className="text-xs font-bold">Auto</div>
                         </div>
                    </div>
                </div>

                {/* Air & Comfort + Security */}
                <div className="flex flex-col gap-6">
                     <div className={`p-6 rounded-3xl flex-1 ${darkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                         <h2 className="text-xl font-bold mb-4 flex items-center"><Wind className="w-5 h-5 mr-2 text-blue-400"/> Air & Comfort</h2>
                         <div className={`p-4 rounded-2xl mb-4 flex items-center ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                             <div className="w-12 h-12 rounded-full border-4 border-green-500 flex items-center justify-center font-bold text-green-500 mr-4">57</div>
                             <div><div className="font-bold text-green-500">Good Air Quality</div><div className="text-xs opacity-50">CO2: 420ppm</div></div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <button className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}><Lock className="w-6 h-6 mb-2 text-blue-400"/><span className="text-xs font-bold">Doors Locked</span></button>
                             <button className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}><Zap className="w-6 h-6 mb-2 text-yellow-400"/><span className="text-xs font-bold">Interior Lights</span></button>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

// --- 6. 驾驶主页 (Home Page) ---
const DriverHomePage = ({ navigateToSchedule, showRestStops, setShowRestStops, onStopClick, activeRoute, darkMode, toggleDarkMode, onToggleMessages, onToggleRestMode, openRouteDetail, nextStopOverride }) => {
  const [time, setTime] = useState(new Date());
  const [capacity, setCapacity] = useState(45); // 0-100%
  const [isStopRequested, setIsStopRequested] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  // 模拟功能状态
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(1);

  const timelineRef = useRef(null);
  
  let rawStops = activeRoute ? activeRoute.timeline : defaultStopsData;

  const displayedStops = rawStops.map((item, index) => {
      let status = 'future';
      if (index < currentStopIndex) status = 'passed';
      else if (index === currentStopIndex) status = 'current';
      
      const baseStop = activeRoute ? {
          id: item.id || index,
          name: item.location,
          time: item.time,
          type: item.type === 'break' ? 'rest_stop' : 'stop',
          features: item.features,
          menu: item.menu
      } : item;
      return { ...baseStop, status };
  });

  const currentRouteName = activeRoute ? `Route ${activeRoute.route}` : "Route 502";
  const currentBusNo = activeRoute ? `Bus: ${activeRoute.bus}` : "Bus: B-9527";

  // Next Stop Logic: Override takes precedence
  const calculatedNextStop = displayedStops.slice(currentStopIndex + 1).find(s => s.type !== 'deadhead') || displayedStops[currentStopIndex + 1];
  const activeNextStop = nextStopOverride || calculatedNextStop;

  // 自动载客量模拟
  useEffect(() => {
    const interval = setInterval(() => {
        setCapacity(prev => {
            const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
            return Math.min(100, Math.max(0, prev + change));
        });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      let interval;
      if (isSimulating) {
          interval = setInterval(() => {
              setCurrentStopIndex(prev => {
                  if (prev >= rawStops.length - 1) {
                      setIsSimulating(false); return 0;
                  }
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
  
  // Emergency Hold Logic could be added here, simple toggle for demo
  const handleSOS = () => { setIsEmergencyActive(!isEmergencyActive); };

  return (
    <div className={`flex flex-col h-full w-full font-sans overflow-hidden select-none relative transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`h-16 flex items-center justify-between px-6 shadow-sm z-10 shrink-0 transition-colors duration-500 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-b border-slate-200'}`}>
        <div className="flex items-center space-x-6">
            <button onClick={openRouteDetail} className="bg-blue-600 px-3 py-1 rounded text-lg font-bold text-white transition-all active:scale-95">{currentRouteName}</button>
            <div className={`text-sm font-mono transition-all ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{currentBusNo}</div>
        </div>
        
        <div className="flex items-center space-x-8">
            <div className={`text-4xl font-mono font-bold tracking-wider ${darkMode ? 'text-white' : 'text-slate-800'}`}>{formatTime(time)}</div>
            <button onClick={() => setIsVoiceActive(true)} className={`p-2 rounded-full ${darkMode ? 'bg-slate-700 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><Mic className="w-5 h-5"/></button>
        </div>

        <div className="flex items-center space-x-4">
           <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
               {darkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
           </button>
           <div className="text-right">
               <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Drive Time</div>
               <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>3h 15m</div>
           </div>
           <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
             <div className="h-full bg-orange-500 w-3/4"></div>
           </div>
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
                  ? `w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0 z-10 transition-colors ${isCurrent ? 'bg-orange-500 border-orange-300 text-white' : (darkMode ? 'bg-slate-800 border-orange-500 text-orange-500' : 'bg-white border-orange-300 text-orange-500')}` 
                  : `w-10 h-10 rounded-full border-4 flex items-center justify-center shrink-0 z-10 transition-colors ${isCurrent ? 'bg-blue-600 border-blue-200 text-white' : (darkMode ? 'bg-slate-700 border-slate-500 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-500')}`;
              
              return (
                <div key={stop.id} data-current={isCurrent} className={`flex items-start mb-6 relative group cursor-pointer transition-all duration-500 ${isCurrent ? (darkMode ? 'bg-slate-700/50 -mx-2 p-2 rounded-lg' : 'bg-slate-50 -mx-2 p-2 rounded-lg') : ''}`} onClick={() => isRestStop && onStopClick(stop)}>
                  <div className={dotClass}>{isRestStop ? <Coffee className="w-5 h-5" /> : <span className="text-xs font-bold">{index + 1}</span>}</div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                        <div className={`font-bold leading-tight ${isCurrent ? (darkMode ? 'text-blue-400 text-lg' : 'text-blue-700 text-lg') : (darkMode ? 'text-slate-300' : 'text-slate-700')}`}>{stop.name}</div>
                        <div className={`text-xs font-mono mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{stop.time}</div>
                    </div>
                    {isRestStop && stop.features && (<div className="flex space-x-2 mt-1.5">{stop.features.includes('wc') && <div className={`flex items-center text-[10px] px-1.5 rounded font-bold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}><Info className="w-3 h-3 mr-1"/>WC</div>}{stop.features.includes('food') && <div className={`flex items-center text-[10px] px-1.5 rounded font-bold ${darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-50 text-orange-500'}`}><Utensils className="w-3 h-3 mr-1"/>Food</div>}</div>)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`p-4 border-t ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
              <button onClick={() => setShowRestStops(!showRestStops)} className={`w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-xl font-bold transition-all border-2 active:scale-95 ${showRestStops ? 'bg-orange-100 text-orange-700 border-orange-200' : (darkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-white text-slate-500 border-slate-300')}`}>
                  {showRestStops ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}<span>{showRestStops ? 'Hide Rest Stops' : 'Show Rest Stops'}</span>
              </button>
          </div>
        </aside>

        <main className={`flex-1 relative flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
          <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="w-full h-full" style={{backgroundImage: `linear-gradient(${darkMode ? '#475569' : '#94a3b8'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#475569' : '#94a3b8'} 1px, transparent 1px)`, backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(20deg) scale(1.5)', transformOrigin: 'bottom'}}></div>
              <svg className="absolute inset-0 w-full h-full" style={{transform: 'perspective(500px) rotateX(20deg) scale(1.5)', transformOrigin: 'bottom'}}>
                   {/* Map Route with Traffic Coloring */}
                   <path d="M 300 800 C 320 760, 340 720, 360 680" fill="none" stroke="#22c55e" strokeWidth="20" strokeLinecap="round" />
                   <path d="M 360 680 C 380 640, 400 600, 420 560" fill="none" stroke="#ef4444" strokeWidth="20" strokeLinecap="round" /> {/* Traffic */}
                   <path d="M 420 560 C 450 500, 500 400, 500 200 S 800 50, 900 0" fill="none" stroke={darkMode ? "#1e293b" : "#3b82f6"} strokeWidth="20" strokeLinecap="round" />
              </svg>
          </div>
          {/* Map Markers & Bus - same as before... */}
          {displayedStops.map((stop, index) => {
              const pos = index === 0 ? { top: '35%', left: '55%' } : index === 3 ? { top: '15%', left: '75%' } : { top: `${40 + index * 5}%`, left: `${50 + index * 5}%` };
              if (stop.type === 'rest_stop') {
                  if (!showRestStops) return null;
                  return (
                    <div key={stop.id} className="absolute z-30 flex flex-col items-center cursor-pointer group hover:scale-110 transition-transform" style={{ top: pos.top, left: pos.left }} onClick={() => onStopClick(stop)}>
                        <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg mb-2 flex items-center space-x-2 border border-orange-200"><span className="font-bold text-xs text-slate-800 whitespace-nowrap">{stop.name}</span></div>
                        <div className="relative"><MapPin className="w-10 h-10 text-orange-500 fill-current drop-shadow-lg relative z-10" /><div className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-bold text-[10px] z-20"><Coffee className="w-3 h-3"/></div></div>
                    </div>
                  );
              } else {
                  return (
                    <div key={stop.id} className={`absolute z-30 flex flex-col items-center transition-all duration-300`} style={{ top: pos.top, left: pos.left }}>
                         <div className={`flex items-center justify-center rounded-full shadow-lg border-2 ${stop.status === 'current' ? 'w-10 h-10 bg-blue-600 border-white text-white ring-4 ring-blue-500/30' : 'w-8 h-8 bg-white border-blue-600 text-blue-600'}`}>{stop.status === 'current' ? <Bus className="w-5 h-5" /> : <span className="text-xs font-bold">{index + 1}</span>}</div>
                         <div className={`mt-1.5 px-2 py-1 rounded-md text-xs font-bold shadow-sm whitespace-nowrap bg-white/90 text-slate-800`}>{stop.name}</div>
                    </div>
                  );
              }
          })}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-slate-300 px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-4 pointer-events-none z-20"><Navigation className="w-8 h-8 text-blue-600" /><div><div className="text-slate-500 text-xs font-bold uppercase">1.2 km Straight</div><div className="text-2xl font-bold text-slate-900">Next: {activeNextStop?.name || "Destination"}</div></div></div>
        </main>

        <aside className={`w-1/4 border-l p-4 flex flex-col space-y-4 shadow-xl z-20 transition-colors duration-500 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
           {/* 1. Capacity Visualization */}
           <div className={`flex-1 rounded-2xl flex flex-col items-center justify-center p-4 border-2 transition-all ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
             <div className="flex justify-between w-full mb-2 px-2">
                 <Users className={`w-6 h-6 ${capacity > 80 ? 'text-red-500' : 'text-slate-400'}`} />
                 <span className={`text-xl font-bold ${capacity > 80 ? 'text-red-500' : (darkMode ? 'text-white' : 'text-slate-800')}`}>{capacity}%</span>
             </div>
             <div className="w-full h-4 bg-slate-300 rounded-full overflow-hidden relative">
                 <div className={`h-full transition-all duration-500 ${capacity > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${capacity}%`}}></div>
             </div>
             {/* Automated sensor indicator */}
             <div className="flex items-center gap-2 mt-3 text-xs opacity-50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>APC Sensor Active</span>
             </div>
           </div>

           {/* 2. Stop Request */}
           <button onClick={() => setIsStopRequested(!isStopRequested)} className={`flex-1 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all border-2 active:scale-[0.98] ${isStopRequested ? 'bg-red-50 border-red-500 animate-pulse' : (darkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-slate-50 border-slate-200')}`}>
             {isStopRequested ? <BellRing className="w-10 h-10 text-red-600" /> : <Bell className="w-10 h-10 text-slate-400" />}
             <div className="text-center"><div className={`text-lg font-bold ${isStopRequested ? 'text-red-700' : (darkMode ? 'text-slate-200' : 'text-slate-700')}`}>{isStopRequested ? 'Stop Req' : 'No Stop'}</div><div className="text-xs text-slate-400">Passenger Request</div></div>
           </button>
           
           {/* 3. Dispatch */}
           <button onClick={onToggleMessages} className={`flex-1 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all active:scale-[0.98] ${darkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-slate-50 border-slate-200 hover:bg-white shadow-sm'}`}>
              <div className="relative"><MessageSquare className="w-10 h-10 text-blue-500 mb-1" /><div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div></div>
              <div className="text-center"><span className={`text-lg font-bold block ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Messages</span><span className="text-xs text-slate-400">Dispatch & Alerts</span></div>
           </button>

           <div className="flex gap-2 h-24">
               {/* 4. Call Dispatch */}
               <button className={`flex-1 rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-[0.98] ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                   <PhoneCall className="w-6 h-6 text-blue-500 mb-1" />
                   <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-700'}`}>Call Dispatch</span>
               </button>
               {/* 5. SOS (Separate) */}
               <button className="flex-1 rounded-2xl border-2 bg-red-100 border-red-200 flex flex-col items-center justify-center active:scale-95 active:bg-red-200">
                   <ShieldAlert className="w-6 h-6 text-red-600 mb-1" />
                   <span className="text-xs font-bold text-red-700">SOS</span>
               </button>
           </div>

           {/* 6. Rest Mode */}
           <button onClick={onToggleRestMode} className={`h-20 rounded-2xl border-2 flex items-center justify-center space-x-3 shrink-0 bg-indigo-600 border-indigo-400 text-white shadow-md active:scale-95 transition-transform hover:bg-indigo-700`}>
             <Coffee className="w-6 h-6" />
             <span className="text-xl font-bold">Rest Mode</span>
           </button>
        </aside>
      </div>

      {/* Voice Command Modal */}
      {isVoiceActive && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-8 py-4 rounded-full flex items-center gap-4 animate-in slide-in-from-top-4 z-50 shadow-2xl">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              <span className="font-mono">Listening... "Show traffic report"</span>
              <button onClick={() => setIsVoiceActive(false)}><X className="w-5 h-5 opacity-50 hover:opacity-100"/></button>
          </div>
      )}
    </div>
  );
};

/* --- 页面 2: 个人排班表 (Schedule Page) --- */
const SchedulePage = ({ navigateBack, onStartDuty, darkMode, openRouteDetail }) => {
    // ... (Same Schedule Code as before but passing darkMode style)
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const scheduleData = [{ day: 'Mon', shifts: [{ start: 7, end: 15, route: '502', bus: 'B-9527', type: 'work' }] }, { day: 'Tue', shifts: [{ start: 14, end: 22, route: '101', bus: 'B-8821', type: 'work' }] }, { day: 'Wed', shifts: [{ start: 0, end: 24, type: 'rest' }] }, { day: 'Thu', shifts: [{ start: 7, end: 15, route: '502', bus: 'B-9527', type: 'work' }] }, { day: 'Fri', shifts: [{ start: 7, end: 12, route: '502', bus: 'B-9527', type: 'work' }, { start: 18, end: 22, route: 'Night', bus: 'B-9999', type: 'work' }] }, { day: 'Sat', shifts: [{ start: 0, end: 24, type: 'rest' }] }, { day: 'Sun', shifts: [{ start: 9, end: 17, route: 'Tour', bus: 'T-101', type: 'work' }] }];

    return (
        <div className={`flex flex-col h-full w-full font-sans p-8 overflow-hidden relative ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <button onClick={navigateBack} className={`p-2 border rounded-full shadow-sm ${darkMode ? 'bg-slate-800 border-slate-600 hover:bg-slate-700' : 'bg-white border-slate-300 hover:bg-slate-100'}`}><ChevronLeft className="w-8 h-8" /></button>
                    <div><h1 className="text-3xl font-bold">Weekly Schedule</h1><p className="opacity-50">Nov 17 - Nov 23</p></div>
                </div>
            </header>
            <div className={`flex-1 rounded-3xl border shadow-sm p-6 overflow-hidden flex flex-col ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex mb-2 pl-16">{hours.map(h => (<div key={h} className="flex-1 text-center text-xs opacity-40 border-l h-4">{h % 2 === 0 ? h : ''}</div>))}</div>
                <div className="flex-1 flex flex-col justify-between relative">
                   <div className="absolute inset-0 flex pl-16 pointer-events-none">{hours.map(h => (<div key={h} className={`flex-1 border-l ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}></div>))}</div>
                   {scheduleData.map((dayData, index) => (<div key={index} className="flex items-center relative h-12 z-10 group"><div className="w-16 font-bold text-lg shrink-0">{dayData.day}</div><div className={`flex-1 h-10 rounded-lg relative overflow-hidden flex items-center ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>{dayData.shifts.map((shift, sIndex) => {const startPercent = (shift.start / 24) * 100;const durationPercent = ((shift.end - shift.start) / 24) * 100;return shift.type === 'work' ? (<div key={sIndex} onClick={() => openRouteDetail(shift)} className="absolute h-full top-0 bg-blue-500/90 hover:bg-blue-600 cursor-pointer rounded-md border-2 border-white/20 shadow-sm flex items-center justify-center text-white text-xs font-bold transition-all hover:scale-105 z-20" style={{ left: `${startPercent}%`, width: `${durationPercent}%` }}><span className="truncate px-1">Route {shift.route}</span></div>) : (<div key={sIndex} className="absolute h-full top-0 bg-green-500/20 border-2 border-white/10 flex items-center justify-center" style={{ left: '0%', width: '100%' }}><span className="text-green-500 text-xs font-bold tracking-widest uppercase">Rest Day</span></div>);})}</div></div>))}
                </div>
            </div>
        </div>
    );
};

// --- 8. TabButton Component ---
const TabButton = ({ icon, label, active, onClick, darkMode }) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ${active ? 'text-blue-500' : (darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
    >
        <div className={`p-1 rounded-xl mb-1 transition-all ${active ? (darkMode ? 'bg-blue-500/20' : 'bg-blue-50') : ''}`}>
            {React.cloneElement(icon, { className: `w-6 h-6 ${active ? 'stroke-[2.5px]' : 'stroke-2'}` })}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-0 scale-0 h-0'}`}>{label}</span>
    </button>
);

/* --- 9. 根组件 (Main App Container) --- */
const BusDriverApp = () => {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'schedule' | 'vehicle'
  const [startX, setStartX] = useState(null);
  const [showRestStops, setShowRestStops] = useState(true);
  const [selectedStopDetail, setSelectedStopDetail] = useState(null);
  const [activeOverlay, setActiveOverlay] = useState(null); // 'messages' | 'rest' | null
  const [activeRoute, setActiveRoute] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [detailModalShift, setDetailModalShift] = useState(null); // For RouteDetailModal
  const [nextStopOverride, setNextStopOverride] = useState(null); // For Navigation from Rest Stop
  
  // Mock Message State lifted up
  const [messages, setMessages] = useState([
    { id: 1, sender: "Dispatch Center", time: "18:25", subject: "Traffic Alert: Main St.", content: "Heavy traffic reported on Main St due to road work. Please consider alternate route.", priority: "high", read: false },
    { id: 2, sender: "System Admin", time: "14:00", subject: "Shift Schedule Updated", content: "Your shift for next Tuesday (Nov 24) has been updated. You are now assigned to Route 101.", priority: "normal", read: true },
  ]);

  const handleTouchStart = (e) => setStartX(e.touches ? e.touches[0].clientX : e.clientX);
  const handleTouchEnd = (e) => {
    if (!startX) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
        if (diff > 0 && currentPage === 'home') setCurrentPage('schedule'); // Swipe Left -> Schedule (Right Page)
        else if (diff < 0 && currentPage === 'schedule') setCurrentPage('home');
        else if (diff < 0 && currentPage === 'home') setCurrentPage('vehicle'); // Swipe Right -> Vehicle (Left Page)
        else if (diff > 0 && currentPage === 'vehicle') setCurrentPage('home');
    }
    setStartX(null);
  };

  const handleStopClick = (stop) => { if (stop.type === 'rest_stop') setSelectedStopDetail(stop); };
  const handleStartDuty = (shift) => { setActiveRoute(shift); setCurrentPage('home'); };
  const handleMarkRead = (id) => { setMessages(messages.map(m => m.id === id ? {...m, read: true} : m)); };

  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col relative ${darkMode ? 'bg-slate-900' : 'bg-black'}`}>
        {/* Main Content Area (Flex 1) */}
        <div className="relative flex-1 w-full overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onMouseDown={handleTouchStart} onMouseUp={handleTouchEnd}>
              {/* Left Page: Vehicle Status */}
              <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out" style={{ transform: currentPage === 'vehicle' ? 'translateX(0)' : 'translateX(-100%)' }}>
                 <VehicleStatusPage darkMode={darkMode} />
              </div>

              {/* Center Page: Home */}
              <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out" style={{ transform: currentPage === 'home' ? 'translateX(0)' : currentPage === 'schedule' ? 'translateX(-100%)' : 'translateX(100%)' }}>
                 <DriverHomePage 
                    navigateToSchedule={() => setCurrentPage('schedule')} 
                    showRestStops={showRestStops} 
                    setShowRestStops={setShowRestStops} 
                    onStopClick={handleStopClick}
                    onToggleMessages={() => setActiveOverlay('messages')}
                    onToggleRestMode={() => setActiveOverlay('rest')}
                    openRouteDetail={(shift) => setDetailModalShift(shift || { route: '502', bus: 'B-9527', day: 'Today', start: '06', end: '15' })} 
                    activeRoute={activeRoute}
                    darkMode={darkMode}
                    toggleDarkMode={() => setDarkMode(!darkMode)}
                    nextStopOverride={nextStopOverride}
                 />
              </div>

              {/* Right Page: Schedule */}
              <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out" style={{ transform: currentPage === 'schedule' ? 'translateX(0)' : 'translateX(100%)' }}>
                 <SchedulePage 
                    navigateBack={() => setCurrentPage('home')} 
                    onStartDuty={handleStartDuty} 
                    darkMode={darkMode} 
                    openRouteDetail={setDetailModalShift}
                 />
              </div>
              
              {/* Overlays (Messages & Rest Mode) - Slide in from right over Home */}
              <div className={`absolute inset-0 z-40 transition-transform duration-300 ease-out ${activeOverlay === 'messages' ? 'translate-x-0' : 'translate-x-full'}`}>
                  {activeOverlay === 'messages' && <MessageCenterPage onClose={() => setActiveOverlay(null)} darkMode={darkMode} messages={messages} onMarkRead={handleMarkRead} />}
              </div>
              <div className={`absolute inset-0 z-50 transition-transform duration-300 ease-out ${activeOverlay === 'rest' ? 'translate-x-0' : 'translate-x-full'}`}>
                  {activeOverlay === 'rest' && <RestModeView onClose={() => setActiveOverlay(null)} darkMode={darkMode} />}
              </div>

              {/* Modals */}
              <StopDetailModal stop={selectedStopDetail} onClose={() => setSelectedStopDetail(null)} onNavigate={(stop) => setNextStopOverride(stop)} />
              <RouteDetailModal shift={detailModalShift} onClose={() => setDetailModalShift(null)} onStartNavigation={(s) => { handleStartDuty(s); setDetailModalShift(null); }} />
        </div>

        {/* Bottom Tab Bar (Fixed) */}
        <div className={`h-20 flex justify-around items-center shrink-0 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-[60] relative ${darkMode ? 'bg-slate-800 border-t border-slate-700' : 'bg-white border-t border-slate-200'}`}>
            <TabButton 
                icon={<Car />} 
                label="Vehicle" 
                active={currentPage === 'vehicle'} 
                onClick={() => setCurrentPage('vehicle')} 
                darkMode={darkMode}
            />
            <TabButton 
                icon={<Home />} 
                label="Drive" 
                active={currentPage === 'home'} 
                onClick={() => setCurrentPage('home')} 
                darkMode={darkMode}
            />
            <TabButton 
                icon={<LayoutGrid />} 
                label="Schedule" 
                active={currentPage === 'schedule'} 
                onClick={() => setCurrentPage('schedule')} 
                darkMode={darkMode}
            />
        </div>
    </div>
  );
};

export default BusDriverApp;