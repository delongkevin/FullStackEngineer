import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmptyState, LoadingState } from '../components';

const API_BASE_URL = 'http://localhost:3001';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    initializeScreen();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (token) {
        fetchFavorites();
      }
    });

    return unsubscribe;
  }, [navigation, token]);

  const initializeScreen = async () => {
    const storedToken = await AsyncStorage.getItem('userToken');
    setToken(storedToken);
    if (storedToken) {
      await fetchFavorites(storedToken);
    }
  };

  const fetchFavorites = async (authToken = token) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setFavorites(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const removeFavorite = async (propertyId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/favorites/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(favorites.filter(p => p.propertyId !== propertyId));
      Alert.alert('Success', 'Removed from favorites');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove favorite');
    }
  };

  const renderPropertyItem = ({ item: property }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('FavoriteDetail', { property })}
      style={styles.propertyCard}
    >
      <Image
        source={{ uri: property.images[0] }}
        style={styles.propertyImage}
      />

      <View style={styles.propertyInfo}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.propertyTitle} numberOfLines={2}>
              {property.title}
            </Text>
            <Text style={styles.propertyCity}>
              {property.city}, {property.state}
            </Text>
          </View>
          <Text style={styles.priceText}>
            ${property.forSale ? property.price.toLocaleString() : property.rentPrice}/mo
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statText}>🛏️ {property.bedrooms}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statText}>🛁 {property.bathrooms}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statText}>📐 {(property.sqft / 1000).toFixed(1)}k</Text>
          </View>
        </View>

        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>⭐ {property.ratings}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFavorite(property.propertyId)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingState message="Loading favorites..." />;
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <EmptyState
          title="No Saved Properties"
          message="Browse properties and save your favorites to view them here"
        />
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderPropertyItem}
          keyExtractor={(item) => item.propertyId}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center'
  },
  propertyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  propertyImage: {
    width: 120,
    height: 140,
    backgroundColor: '#e5e7eb'
  },
  propertyInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2
  },
  propertyCity: {
    fontSize: 12,
    color: '#6b7280'
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669'
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8
  },
  stat: {
    flex: 1
  },
  statText: {
    fontSize: 12,
    color: '#6b7280'
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937'
  },
  removeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ef4444'
  },
  removeButtonText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '600'
  }
});
