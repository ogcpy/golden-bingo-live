// Game Session Types
export interface GameSession {
  id: number;
  title: string;
  gameTimeGmt: string;
  scheduledDate: string;
  specialTheme: string | null;
  prize: string | null;
  isActive: boolean;
  lastNumberCalled: number | null;
  calledNumbers: string[];
  gameStatus: "scheduled" | "in-progress" | "completed";
}

// Bingo Card Types
export interface BingoCard {
  id: number;
  cardIdentifier: string;
  numbers: string[];
  qrCode: string;
  isPrinted: boolean;
  isOrdered: boolean;
  printedTime: string | null;
  orderedTime: string | null;
  gameSessionId: number | null;
  userId: number | null;
}

// Winner Types
export interface Winner {
  id: number;
  gameSessionId: number;
  cardIdentifier: string;
  userId: number | null;
  winType: "line" | "full-house";
  verifiedTime: string;
  prize: string | null;
}

// WebSocket Message Types
export type WebSocketMessage = 
  | { type: "call_number"; gameSessionId: number }
  | { type: "number_called"; gameSessionId: number; calledNumber: number; calledNumbers: string[] }
  | { type: "game_over"; gameSessionId: number };
