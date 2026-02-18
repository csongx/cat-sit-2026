
import React from 'react';
import { Friend } from '../types';

interface CalendarProps {
  month: number;
  year: number;
  vacationStart: string;
  vacationEnd: string;
  reservations: Record<string, string>;
  onDateClick: (dateStr: string) => void;
  friends: Friend[];
}

const Calendar: React.FC<CalendarProps> = ({ 
  month, 
  year, 
  vacationStart, 
  vacationEnd, 
  reservations, 
  onDateClick,
  friends
}) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month));
  
  // Create dates at midnight for stable comparison
  const vStart = new Date(vacationStart + 'T00:00:00');
  const vEnd = new Date(vacationEnd + 'T00:00:00');

  const days = [];
  // Padding for start of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`pad-${i}`} className="h-16 w-full"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const currentDate = new Date(year, month, d, 0, 0, 0);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    
    const isVacation = currentDate >= vStart && currentDate <= vEnd;
    const reservedBy = reservations[dateStr];
    const friend = friends.find(f => f.id === reservedBy);

    days.push(
      <div 
        key={dateStr}
        onClick={() => isVacation && onDateClick(dateStr)}
        className={`
          relative h-16 w-full flex flex-col items-center justify-center rounded-2xl transition-all duration-200 border-2
          ${isVacation 
            ? 'cursor-pointer active:scale-95 shadow-sm' 
            : 'opacity-20 pointer-events-none border-transparent'}
          ${friend 
            ? `${friend.bgColor} ${friend.borderColor} ${friend.color}` 
            : isVacation 
              ? 'bg-white border-orange-200/50' 
              : ''}
        `}
      >
        {/* Day Number - Explicitly set to a dark, visible color */}
        <span className={`text-lg font-bold text-slate-800 ${friend ? 'mt-[-8px]' : ''}`}>
          {d}
        </span>
        
        {friend ? (
          <div className="flex flex-col items-center -mt-0.5">
             <span className="text-[9px] font-black uppercase tracking-tighter leading-none opacity-80">
              {friend.name.split(' ')[0]}
            </span>
            <span className="text-xs mt-0.5">{friend.emoji}</span>
          </div>
        ) : isVacation ? (
          <div className="absolute bottom-2 w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
        ) : null}

        {/* Highlight inner border for vacation days */}
        {isVacation && !friend && (
          <div className="absolute inset-0 rounded-2xl border border-orange-100/30 pointer-events-none"></div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-orange-100/50">
      <div className="flex items-center justify-between mb-6 px-1">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{monthName}</h3>
        <span className="text-[10px] font-bold text-orange-300 uppercase tracking-[0.2em]">{year}</span>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center text-[10px] font-black text-slate-300 mb-2">{day}</div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default Calendar;
