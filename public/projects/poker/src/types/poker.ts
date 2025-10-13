
// src/types/poker.ts
export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
}

export interface Player {
  id: string;
  name: string;
  chips: number;
  cards: Card[];
  isActive: boolean;
  currentBet: number;
}

export interface GameState {
  players: Player[];
  communityCards: Card[];
  pot: number;
  currentPlayer: string;
  gamePhase: 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';
  smallBlind: number;
  bigBlind: number;
  dealerPosition: number;
}
