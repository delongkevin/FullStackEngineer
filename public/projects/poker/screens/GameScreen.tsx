
// screens/GameScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import Card from '../components/Card';
import { playerAction } from '../store/gameSlice';

const GameScreen: React.FC = () => {
  const game = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  const handlePlayerAction = (action: 'fold' | 'check' | 'call' | 'raise', amount?: number) => {
    dispatch(playerAction({ playerId: 'player1', action, amount }));
  };

  return (
    <View style={styles.container}>
      {/* Community Cards */}
      <View style={styles.communityCards}>
        {game.communityCards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </View>

      {/* Pot Display */}
      <View style={styles.potContainer}>
        <Text style={styles.potText}>Pot: ${game.pot}</Text>
      </View>

      {/* Player Cards */}
      <View style={styles.playerCards}>
        {game.players[0]?.cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </View>

      {/* Action Buttons */}
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
          style={[styles.button, styles.raiseButton]}
          onPress={() => handlePlayerAction('raise', 20)}
        >
          <Text style={styles.buttonText}>Raise $20</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e8b57',
    padding: 16,
  },
  communityCards: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  potContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  potText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  playerCards: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 'auto',
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  foldButton: {
    backgroundColor: '#e74c3c',
  },
  checkButton: {
    backgroundColor: '#f39c12',
  },
  raiseButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GameScreen;
