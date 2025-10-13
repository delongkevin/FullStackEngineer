
// src/store/gameSlice.ts
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
      state.currentPlayer = action.payload[0]?.id || '';
    },
    playerAction: (state, action: PayloadAction<{
      playerId: string;
      action: 'fold' | 'check' | 'call' | 'raise';
      amount?: number
    }>) => {
      const { playerId, action: playerAction, amount } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      if (player) {
        switch (playerAction) {
          case 'fold':
            player.isActive = false;
            break;
          case 'raise':
            if (amount && amount > 0) {
              const raiseAmount = amount - player.currentBet;
              player.chips -= raiseAmount;
              player.currentBet = amount;
              state.pot += raiseAmount;
            }
            break;
          case 'call':
            const maxBet = Math.max(...state.players.map(p => p.currentBet));
            const callAmount = maxBet - player.currentBet;
            if (callAmount > 0 && player.chips >= callAmount) {
              player.chips -= callAmount;
              player.currentBet += callAmount;
              state.pot += callAmount;
            }
            break;
          case 'check':
            // No action needed for check
            break;
        }
      }
    },
    dealCommunityCards: (state, action: PayloadAction<Card[]>) => {
      state.communityCards = [...state.communityCards, ...action.payload];
    },
    advanceGamePhase: (state, action: PayloadAction<GameState['gamePhase']>) => {
      state.gamePhase = action.payload;
    },
    resetBets: (state) => {
      state.players.forEach(player => {
        player.currentBet = 0;
      });
    },
  },
});

export const {
  startGame,
  playerAction,
  dealCommunityCards,
  advanceGamePhase,
  resetBets
} = gameSlice.actions;
export default gameSlice.reducer;
