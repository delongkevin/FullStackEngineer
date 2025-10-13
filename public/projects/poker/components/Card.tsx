
// components/Card.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card as CardType } from '../types/poker';

interface Props {
  card: CardType;
  facedown?: boolean;
}

const Card: React.FC<Props> = ({ card, facedown = false }) => {
  if (facedown) {
    return (
      <View style={[styles.card, styles.facedown]}>
        <Text style={styles.cardBack}>🂠</Text>
      </View>
    );
  }

  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getColor = (suit: string) => {
    return suit === 'hearts' || suit === 'diamonds' ? '#ff0000' : '#000000';
  };

  return (
    <View style={styles.card}>
      <Text style={[styles.rank, { color: getColor(card.suit) }]}>
        {card.rank}
      </Text>
      <Text style={[styles.suit, { color: getColor(card.suit) }]}>
        {getSuitSymbol(card.suit)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 60,
    height: 90,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  facedown: {
    backgroundColor: '#2c3e50',
  },
  cardBack: {
    fontSize: 24,
    color: 'white',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  suit: {
    fontSize: 24,
  },
});

export default Card;
