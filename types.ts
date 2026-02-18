
export type FriendID = '1' | '2' | '3' | null;

export interface Friend {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  emoji: string;
}

export interface Reservation {
  date: string; // YYYY-MM-DD
  friendId: string;
}

export interface AppState {
  selectedFriendId: FriendID;
  reservations: Record<string, string>; // date string -> friendId
}
