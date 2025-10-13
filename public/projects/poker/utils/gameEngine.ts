
// utils/gameEngine.ts
import { Deck, evaluateHand } from './pokerLogic';
import { GameState, Player, Card } from '../types/poker';

export class PokerGameEngine {
  private deck: Deck;
  private state: GameState;

  constructor(players: Player[], smallBlind: number = 10, bigBlind: number = 20) {
    this.deck = new Deck();
    this.state = {
      players,
      communityCards: [],
      pot: 0,
      currentPlayer: players[0].id,
      gamePhase: 'preflop',
      smallBlind,
      bigBlind,
      dealerPosition: 0,
    };
  }

  startNewHand(): void {
    this.deck = new Deck();
    this.state.communityCards = [];
    this.state.pot = 0;
    this.state.gamePhase = 'preflop';

    // Reset player states
    this.state.players.forEach(player => {
      player.cards = [];
      player.currentBet = 0;
      player.isActive = true;
    });

    this.dealCards();
    this.postBlinds();
  }

  private dealCards(): void {
    // Deal 2 cards to each player
    for (let i = 0; i < 2; i++) {
      this.state.players.forEach(player => {
        const card = this.deck.dealCard();
        if (card) {
          player.cards.push(card);
        }
      });
    }
  }

  private postBlinds(): void {
    const smallBlindPlayer = this.state.players[this.state.dealerPosition + 1];
    const bigBlindPlayer = this.state.players[this.state.dealerPosition + 2];

    if (smallBlindPlayer) {
      smallBlindPlayer.chips -= this.state.smallBlind;
      smallBlindPlayer.currentBet = this.state.smallBlind;
      this.state.pot += this.state.smallBlind;
    }

    if (bigBlindPlayer) {
      bigBlindPlayer.chips -= this.state.bigBlind;
      bigBlindPlayer.currentBet = this.state.bigBlind;
      this.state.pot += this.state.bigBlind;
    }
  }

  playerAction(playerId: string, action: 'fold' | 'check' | 'call' | 'raise', amount?: number): void {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player || !player.isActive) return;

    switch (action) {
      case 'fold':
        player.isActive = false;
        break;
      case 'check':
        // Can only check if no bet to call
        break;
      case 'call':
        this.handleCall(player);
        break;
      case 'raise':
        if (amount && amount > 0) {
          this.handleRaise(player, amount);
        }
        break;
    }

    this.moveToNextPlayer();
    this.checkRoundCompletion();
  }

  private handleCall(player: Player): void {
    const currentMaxBet = Math.max(...this.state.players.map(p => p.currentBet));
    const callAmount = currentMaxBet - player.currentBet;
    
    if (callAmount > 0 && player.chips >= callAmount) {
      player.chips -= callAmount;
      player.currentBet += callAmount;
      this.state.pot += callAmount;
    }
  }

  private handleRaise(player: Player, amount: number): void {
    if (player.chips >= amount) {
      player.chips -= amount;
      player.currentBet += amount;
      this.state.pot += amount;
    }
  }

  private moveToNextPlayer(): void {
    const currentIndex = this.state.players.findIndex(p => p.id === this.state.currentPlayer);
    let nextIndex = (currentIndex + 1) % this.state.players.length;
    
    // Find next active player
    while (!this.state.players[nextIndex].isActive && nextIndex !== currentIndex) {
      nextIndex = (nextIndex + 1) % this.state.players.length;
    }
    
    this.state.currentPlayer = this.state.players[nextIndex].id;
  }

  private checkRoundCompletion(): void {
    const activePlayers = this.state.players.filter(p => p.isActive);
    
    if (activePlayers.length <= 1) {
      this.awardPot();
      return;
    }

    const allBetsEqual = activePlayers.every(p =>
      p.currentBet === activePlayers[0].currentBet
    );

    if (allBetsEqual) {
      this.advanceGamePhase();
    }
  }

  private advanceGamePhase(): void {
    switch (this.state.gamePhase) {
      case 'preflop':
        this.dealFlop();
        this.state.gamePhase = 'flop';
        break;
      case 'flop':
        this.dealTurn();
        this.state.gamePhase = 'turn';
        break;
      case 'turn':
        this.dealRiver();
        this.state.gamePhase = 'river';
        break;
      case 'river':
        this.showdown();
        this.state.gamePhase = 'showdown';
        break;
    }

    // Reset current bets for new round
    this.state.players.forEach(player => {
      player.currentBet = 0;
    });
  }

  private dealFlop(): void {
    for (let i = 0; i < 3; i++) {
      const card = this.deck.dealCard();
      if (card) {
        this.state.communityCards.push(card);
      }
    }
  }

  private dealTurn(): void {
    const card = this.deck.dealCard();
    if (card) {
      this.state.communityCards.push(card);
    }
  }

  private dealRiver(): void {
    const card = this.deck.dealCard();
    if (card) {
      this.state.communityCards.push(card);
    }
  }

  private showdown(): void {
    const activePlayers = this.state.players.filter(p => p.isActive);
    
    if (activePlayers.length === 1) {
      this.awardPot(activePlayers[0]);
    } else {
      // Evaluate hands and determine winner
      const playerHands = activePlayers.map(player => ({
        player,
        hand: evaluateHand(player.cards, this.state.communityCards)
      }));

      // Sort by hand strength (highest first)
      playerHands.sort((a, b) => b.hand.rank - a.hand.rank);
      
      // Award pot to winner(s)
      const winners = playerHands.filter(ph => ph.hand.rank === playerHands[0].hand.rank);
      const prize = this.state.pot / winners.length;
      
      winners.forEach(winner => {
        winner.player.chips += prize;
      });
    }

    // Move dealer button
    this.state.dealerPosition = (this.state.dealerPosition + 1) % this.state.players.length;
  }

  private awardPot(winner?: Player): void {
    if (winner) {
      winner.chips += this.state.pot;
    } else {
      // Split pot logic would go here
    }
    this.state.pot = 0;
  }

  getGameState(): GameState {
    return { ...this.state };
  }
}
