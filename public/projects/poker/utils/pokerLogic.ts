
// utils/pokerLogic.ts
import { Card } from '../types/poker';

export class Deck {
  private cards: Card[];

  constructor() {
    this.cards = this.createDeck();
    this.shuffle();
  }

  private createDeck(): Card[] {
    const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Card['rank'][] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    const deck: Card[] = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }
    return deck;
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  dealCard(): Card | undefined {
    return this.cards.pop();
  }

  getRemainingCards(): number {
    return this.cards.length;
  }
}

export const evaluateHand = (hand: Card[], communityCards: Card[]): { rank: number; description: string } => {
  const allCards = [...hand, ...communityCards];
  // Implement hand evaluation logic here
  // This is a simplified version - you'd want a full poker hand evaluator
  
  return {
    rank: 1,
    description: 'High Card'
  };
};
