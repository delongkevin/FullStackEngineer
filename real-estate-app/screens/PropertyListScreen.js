import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3001';

export default function PropertyListScreen({ route, navigation }) {
  const { properties: initialProperties = [] } = route.params || {};
  const [properties] = useState(initialProperties);
  const [loading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    const storedToken = await AsyncStorage.getItem('userToken');
    setToken(storedToken);
    await fetchFavorites(storedToken);
  };

  const fetchFavorites = async (authToken = token) => {
    try {
      if (authToken) {
        const response = await axios.get(`${API_BASE_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setFavorites(response.data.map(p => p.propertyId));
      }
    } catch (error) {
      console.log('Error fetching favorites');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const toggleFavorite = async (propertyId) => {
    if (!token) {
      Alert.alert('Error', 'Please login first');
      return;
    }

    try {
      if (favorites.includes(propertyId)) {
        await axios.delete(`${API_BASE_URL}/api/favorites/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(favorites.filter(id => id !== propertyId));
      } else {
        await axios.post(`${API_BASE_URL}/api/favorites/${propertyId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites([...favorites, propertyId]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const renderPropertyItem = ({ item: property }) => {
    const isFavorited = favorites.includes(property.propertyId);
    const price = property.forSale ? `$${property.price.toLocaleString()}` : `$${property.rentPrice}/mo`;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('PropertyDetail', { property })}
        style={styles.propertyCard}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: property.images[0] || 'https://via.placeholder.com/400x300' }}
            style={styles.propertyImage}
          />
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{price}</Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(property.propertyId)}
          >
            <Text style={styles.favoriteIcon}>{isFavorited ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle} numberOfLines={2}>
            {property.title}
          </Text>
          <Text style={styles.propertyAddress} numberOfLines={1}>
            {property.city}, {property.state}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>🛏️</Text>
              <Text style={styles.statText}>{property.bedrooms}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>🛁</Text>
              <Text style={styles.statText}>{property.bathrooms}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>📐</Text>
              <Text style={styles.statText}>{(property.sqft / 1000).toFixed(1)}k</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStars}>⭐ {property.ratings || 0}</Text>
            <Text style={styles.reviewCount}>({property.reviewCount || 0} reviews)</Text>
          </View>

          <View style={styles.agentContainer}>
            <Text style={styles.agentLabel}>Agent: {property.agentName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && properties.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={properties}
        renderItem={renderPropertyItem}
        keyExtractor={(item) => item.propertyId}
        numColumns={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No properties found</Text>
          </View>
        }
      />
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
  emptyText: {
    fontSize: 16,
    color: '#6b7280'
  },
  propertyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 240
  },
  propertyImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6'
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  priceText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700'
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  favoriteIcon: {
    fontSize: 20
  },
  propertyInfo: {
    padding: 16
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4
  },
  propertyAddress: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statIcon: {
    fontSize: 16,
    marginRight: 6
  },
  statText: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '500'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  ratingStars: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 4
  },
  reviewCount: {
    fontSize: 12,
    color: '#9ca3af'
  },
  agentContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  agentLabel: {
    fontSize: 12,
    color: '#6b7280'
  }
});
