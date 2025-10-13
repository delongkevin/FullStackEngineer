
// store/gameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Card, Player } from '../types/poker';

const initialState: GameState = {
  players: [],
  communityCards: [],
  pot: 0,
  currentPlayer: '',
  gamePhase: 'preflop',
  smallBlind: 10,
  bigBlind: 20,
  dealerPosition: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
      state.pot = state.smallBlind + state.bigBlind;
    },
    playerAction: (state, action: PayloadAction<{ playerId: string; action: 'fold' | 'check' | 'call' | 'raise'; amount?: number }>) => {
      const { playerId, action: playerAction, amount } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      if (player) {
        switch (playerAction) {
          case 'fold':
            player.isActive = false;
            break;
          case 'raise':
            if (amount) {
              player.chips -= amount;
              player.currentBet += amount;
              state.pot += amount;
            }
            break;
          case 'call':
            // Implementation for call action
            break;
        }
      }
    },
    dealCommunityCards: (state, action: PayloadAction<Card[]>) => {
      state.communityCards = [...state.communityCards, ...action.payload];
    },
  },
});

export const { startGame, playerAction, dealCommunityCards } = gameSlice.actions;
export default gameSlice.reducer;
