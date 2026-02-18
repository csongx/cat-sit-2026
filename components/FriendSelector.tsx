
import React from 'react';
import { Friend, FriendID } from '../types';

interface FriendSelectorProps {
  friends: Friend[];
  selectedId: FriendID;
  onSelect: (id: FriendID) => void;
}

const FriendSelector: React.FC<FriendSelectorProps> = ({ friends, selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {friends.map((friend) => {
        const isActive = selectedId === friend.id;
        return (
          <div
            key={friend.id}
            onClick={() => onSelect(isActive ? null : friend.id as FriendID)}
            className={`
              relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer
              ${isActive 
                ? `${friend.bgColor} ${friend.borderColor} scale-105 shadow-md` 
                : 'bg-gray-50 border-transparent text-gray-400 grayscale opacity-60'
              }
            `}
          >
            <span className="text-3xl mb-1">{friend.emoji}</span>
            <span className={`text-[10px] font-bold text-center leading-tight ${isActive ? friend.color : 'text-gray-400'}`}>
              {friend.name}
            </span>
            {isActive && (
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${friend.bgColor} ${friend.borderColor} border`}>
                <div className={`w-1.5 h-1.5 rounded-full ${friend.color.replace('text-', 'bg-')}`}></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FriendSelector;
