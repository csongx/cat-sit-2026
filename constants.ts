
import { Friend } from './types';

export const FRIENDS: Friend[] = [
  { 
    id: '1', 
    name: 'Laura and Igor', 
    color: 'text-rose-600', 
    bgColor: 'bg-rose-100', 
    borderColor: 'border-rose-400',
    emoji: '👫'
  },
  { 
    id: '2', 
    name: 'Oliver', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100', 
    borderColor: 'border-blue-400',
    emoji: '👤'
  },
  { 
    id: '3', 
    name: 'Lidi', 
    color: 'text-emerald-600', 
    bgColor: 'bg-emerald-100', 
    borderColor: 'border-emerald-400',
    emoji: '👩'
  }
];

export const VACATION_START = '2026-07-25';
export const VACATION_END = '2026-08-05';

export const MONTHS = [
  { name: 'July', year: 2026, monthIndex: 6 },
  { name: 'August', year: 2026, monthIndex: 7 }
];
