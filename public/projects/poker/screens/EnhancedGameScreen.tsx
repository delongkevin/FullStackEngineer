
// screens/EnhancedGameScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { playerAction, dealCommunityCards, startGame } from '../store/gameSlice';
import Card from '../components/Card';
import Player from '../components/Player';
import { PokerGameEngine } from '../utils/gameEngine';

const EnhancedGameScreen: React.FC = () => {
  const game = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const [gameEngine, setGameEngine] = useState<PokerGameEngine | null>(null);

  useEffect(() => {
    // Initialize game with sample players
    const samplePlayers = [
      { id: 'player1', name: 'You', chips: 1000, cards: [], isActive: true, currentBet: 0 },
      { id: 'player2', name: 'CPU 1', chips: 1000, cards: [], isActive: true, currentBet: 0 },
      { id: 'player3', name: 'CPU 2', chips: 1000, cards: [], isActive: true, currentBet: 0 },
      { id: 'player4', name: 'CPU 3', chips: 1000, cards: [], isActive: true, currentBet: 0 },
    ];
    
    dispatch(startGame(samplePlayers));
    setGameEngine(new PokerGameEngine(samplePlayers));
  }, [dispatch]);

  const handlePlayerAction = (action: 'fold' | 'check' | 'call' | 'raise', amount?: number) => {
    if (gameEngine) {
      gameEngine.playerAction('player1', action, amount);
      const newState = gameEngine.getGameState();
      // Update Redux state with new game state
      // This would need to be adapted based on your Redux structure
    }
  };

  const renderActionButtons = () => {
    const currentPlayer = game.players.find(p => p.id === game.currentPlayer);
    const isYourTurn = currentPlayer?.id === 'player1';

    if (!isYourTurn) {
      return (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>Waiting for other players...</Text>
        </View>
      );
    }

    return (
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.foldButton]}
          onPress={() => handlePlayerAction('fold')}
        >
          <Text style={styles.buttonText}>Fold</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.checkButton]}
          onPress={() => handlePlayerAction('check')}
        >
          <Text style={styles.buttonText}>Check</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.callButton]}
          onPress={() => handlePlayerAction('call')}
        >
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.raiseButton]}
          onPress={() => handlePlayerAction('raise', 50)}
        >
          <Text style={styles.buttonText}>Raise $50</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Players */}
      <View style={styles.topPlayers}>
        {game.players.slice(1, 3).map((player, index) => (
          <Player
            key={player.id}
            player={player}
            isCurrentPlayer={player.id === game.currentPlayer}
            position={index === 0 ? 'left' : 'right'}
          />
        ))}
      </View>

      {/* Community Cards */}
      <View style={styles.communitySection}>
        <Text style={styles.sectionTitle}>Community Cards</Text>
        <View style={styles.communityCards}>
          {game.communityCards.map((card, index) => (
            <Card key={index} card={card} />
          ))}
        </View>
        <View style={styles.potContainer}>
          <Text style={styles.potText}>Pot: ${game.pot}</Text>
        </View>
      </View>

      {/* Bottom Player (User) */}
      <View style={styles.bottomPlayer}>
        {game.players[0] && (
          <Player
            player={game.players[0]}
            isCurrentPlayer={game.players[0].id === game.currentPlayer}
            position="bottom"
          />
        )}
      </View>

      {/* Action Buttons */}
      {renderActionButtons()}

      {/* Game Info */}
      <View style={styles.gameInfo}>
        <Text style={styles.infoText}>
          Phase: {game.gamePhase.toUpperCase()}
        </Text>
        <Text style={styles.infoText}>
          Blinds: ${game.smallBlind}/${game.bigBlind}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a6b2d',
    padding: 16,
  },
  topPlayers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 120,
  },
  communitySection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  communityCards: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  potContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  potText: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomPlayer: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    margin: 5,
  },
  foldButton: {
    backgroundColor: '#e74c3c',
  },
  checkButton: {
    backgroundColor: '#f39c12',
  },
  callButton: {
    backgroundColor: '#3498db',
  },
  raiseButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  waitingContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 20,
  },
  waitingText: {
    color: 'white',
    fontSize: 16,
    fontStyle: 'italic',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 10,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
  },
});

export default EnhancedGameScreen;
