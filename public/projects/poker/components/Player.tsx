
// components/Player.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Player as PlayerType } from '../types/poker';
import Card from './Card';

interface Props {
  player: PlayerType;
  isCurrentPlayer: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const Player: React.FC<Props> = ({ player, isCurrentPlayer, position }) => {
  return (
    <View style={[
      styles.container,
      styles[`${position}Container`],
      isCurrentPlayer && styles.currentPlayer
    ]}>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.chips}>${player.chips}</Text>
        {player.currentBet > 0 && (
          <Text style={styles.bet}>Bet: ${player.currentBet}</Text>
        )}
      </View>
      
      <View style={styles.cardsContainer}>
        {player.cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            facedown={!isCurrentPlayer && position !== 'bottom'}
          />
        ))}
      </View>
      
      {!player.isActive && (
        <View style={styles.foldedOverlay}>
          <Text style={styles.foldedText}>FOLDED</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 5,
  },
  topContainer: {
    marginBottom: 'auto',
  },
  bottomContainer: {
    marginTop: 'auto',
  },
  leftContainer: {
    marginRight: 'auto',
  },
  rightContainer: {
    marginLeft: 'auto',
  },
  currentPlayer: {
    borderColor: '#FFD700',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  playerInfo: {
    alignItems: 'center',
    marginBottom: 5,
  },
  playerName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chips: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  bet: {
    color: '#ff6b6b',
    fontSize: 10,
  },
  cardsContainer: {
    flexDirection: 'row',
  },
  foldedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foldedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default Player;
