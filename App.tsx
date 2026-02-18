
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FRIENDS, VACATION_START, VACATION_END, MONTHS } from './constants';
import { FriendID, Reservation } from './types';
import FriendSelector from './components/FriendSelector';
import Calendar from './components/Calendar';
import AISummary from './components/AISummary';

const App: React.FC = () => {
  const [selectedFriendId, setSelectedFriendId] = useState<FriendID>(null);
  
  // Initialize state from URL hash (for sharing) or LocalStorage
  const [reservations, setReservations] = useState<Record<string, string>>(() => {
    try {
      const hash = window.location.hash.substring(1);
      if (hash) {
        return JSON.parse(decodeURIComponent(atob(hash)));
      }
    } catch (e) {
      console.error("Failed to parse share link", e);
    }
    const saved = localStorage.getItem('cat_reservations');
    return saved ? JSON.parse(saved) : {};
  });

  const [showAiNote, setShowAiNote] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync state to URL and LocalStorage whenever it changes
  useEffect(() => {
    const data = JSON.stringify(reservations);
    localStorage.setItem('cat_reservations', data);
    
    // Update URL hash so friends can share the state
    const hash = btoa(encodeURIComponent(data));
    window.history.replaceState(null, '', `#${hash}`);
  }, [reservations]);

  const handleDateClick = useCallback((dateStr: string) => {
    if (!selectedFriendId) {
      alert("Please choose who you are first! 🐾");
      return;
    }

    setReservations(prev => {
      const next = { ...prev };
      if (next[dateStr] === selectedFriendId) {
        delete next[dateStr];
      } else {
        next[dateStr] = selectedFriendId;
      }
      return next;
    });
  }, [selectedFriendId]);

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleAI = () => setShowAiNote(!showAiNote);

  const bookedCount = Object.keys(reservations).length;
  const isComplete = bookedCount === 12;

  return (
    <div className="min-h-screen pb-40 relative max-w-md mx-auto shadow-2xl bg-white selection:bg-orange-100">
      {/* Header Section */}
      <header className="pt-8 pb-6 px-6 sticky top-0 bg-white/90 backdrop-blur-xl z-30 border-b border-orange-50">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-left">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">CatSit 2026</h1>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">
                July 25 – August 5
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-0.5 border border-orange-50 overflow-hidden transform transition-transform active:scale-95 duration-300">
              {!logoError ? (
                <img 
                  src="cats.png" 
                  alt="My Cats" 
                  className="w-full h-full object-cover scale-105"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-full h-full bg-orange-50 flex items-center justify-center text-3xl">
                  🐱
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 mt-8 space-y-10">
        {/* Step 1: Friend Selection */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">1. Identify yourself</h2>
            {!selectedFriendId && (
              <span className="text-[10px] font-bold text-orange-400 animate-pulse italic">Pick a profile</span>
            )}
          </div>
          <FriendSelector 
            friends={FRIENDS} 
            selectedId={selectedFriendId} 
            onSelect={setSelectedFriendId} 
          />
        </section>

        {/* Step 2: Calendar Interaction */}
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">2. Select Dates</h2>
            {bookedCount > 0 && (
               <button 
                onClick={toggleAI}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full transition-all duration-300 ${showAiNote ? 'bg-slate-900 text-white' : 'bg-orange-50 text-orange-600'}`}
               >
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {showAiNote ? 'Hide Note' : 'Assistant'}
                </span>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${showAiNote ? 'bg-white' : 'bg-orange-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${showAiNote ? 'bg-white' : 'bg-orange-500'}`}></span>
                </span>
               </button>
            )}
          </div>
          
          <div className="space-y-12">
            {MONTHS.map(month => (
              <Calendar 
                key={`${month.monthIndex}-${month.year}`}
                month={month.monthIndex}
                year={month.year}
                vacationStart={VACATION_START}
                vacationEnd={VACATION_END}
                reservations={reservations}
                onDateClick={handleDateClick}
                friends={FRIENDS}
              />
            ))}
          </div>
        </section>

        {/* AI Insight Section */}
        {showAiNote && bookedCount > 0 && (
          <div className="animate-in zoom-in-95 duration-300 pb-20">
            <AISummary reservations={reservations} friends={FRIENDS} />
          </div>
        )}
      </main>

      {/* Persistent Status & Sync Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-0.5">Progress</span>
              <span className="text-sm font-bold tracking-tight">
                {bookedCount} / 12 Days Booked
              </span>
            </div>
            
            <div className="flex items-center">
              {isComplete ? (
                <div className="bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-full flex items-center shadow-lg">
                  <span className="text-[10px] text-emerald-300 font-black uppercase tracking-widest">Complete! ✨</span>
                </div>
              ) : (
                <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-rose-400 transition-all duration-1000 ease-out" 
                    style={{ width: `${(bookedCount / 12) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>

          {/* Share Button (Actionable Footer) */}
          <button 
            onClick={copyShareLink}
            className={`w-full py-3 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 font-bold text-xs uppercase tracking-widest ${copied ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
          >
            {copied ? (
              <><span>Link Copied!</span> <span>✅</span></>
            ) : (
              <><span>Share with friends</span> <span>🔗</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
