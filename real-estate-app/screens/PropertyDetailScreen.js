import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
  Modal,
  TextInput,
  FlatList
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const API_BASE_URL = 'http://localhost:3001';

export default function PropertyDetailScreen({ route, navigation }) {
  const { property } = route.params;
  const [isFavorited, setIsFavorited] = useState(false);
  const [token, setToken] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    const storedToken = await AsyncStorage.getItem('userToken');
    setToken(storedToken);
    await checkIfFavorited();
    await fetchReviews();
  };

  const checkIfFavorited = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        const response = await axios.get(`${API_BASE_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        setIsFavorited(response.data.some(p => p.propertyId === property.propertyId));
      }
    } catch (error) {
      console.log('Error checking favorites');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reviews/${property.propertyId}`);
      setReviews(response.data);
    } catch (error) {
      console.log('Error fetching reviews');
    }
  };

  const toggleFavorite = async () => {
    if (!token) {
      Alert.alert('Error', 'Please login first');
      return;
    }

    try {
      if (isFavorited) {
        await axios.delete(`${API_BASE_URL}/api/favorites/${property.propertyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/favorites/${property.propertyId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleBookTour = async () => {
    if (!bookingDate || !bookingTime) {
      Alert.alert('Error', 'Please select date and time');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/bookings`,
        {
          propertyId: property.propertyId,
          tourDate: bookingDate,
          tourTime: bookingTime,
          notes: bookingNotes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', 'Tour booked successfully!');
      setShowBookingModal(false);
      setBookingDate('');
      setBookingTime('');
      setBookingNotes('');
    } catch (error) {
      Alert.alert('Error', 'Failed to book tour');
    }
  };

  const handleContactAgent = () => {
    Alert.alert(
      'Contact Agent',
      `Name: ${property.agentName}\nPhone: ${property.agentPhone}\nEmail: ${property.agentEmail}`,
      [
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${property.agentPhone}`),
          style: 'default'
        },
        {
          text: 'Email',
          onPress: () => Linking.openURL(`mailto:${property.agentEmail}`),
          style: 'default'
        },
        { text: 'Cancel', onPress: () => {}, style: 'cancel' }
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this property: ${property.title} in ${property.city}. Listed at $${property.price.toLocaleString()}`,
        title: property.title
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share property');
    }
  };

  const renderReview = ({ item: review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>{review.userName}</Text>
        <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
      <Text style={styles.reviewDate}>{moment(review.createdAt).fromNow()}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Gallery */}
      <View style={styles.imageContainer}>
        <FlatList
          data={property.images}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.fullImage} />
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Text style={styles.favoriteIcon}>{isFavorited ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Price and Title */}
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.price}>
            {property.forSale ? `$${property.price.toLocaleString()}` : `$${property.rentPrice}/month`}
          </Text>
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.address}>{property.address}</Text>
        </View>
        <View style={styles.ratingBox}>
          <Text style={styles.ratingText}>⭐ {property.ratings}</Text>
          <Text style={styles.reviewsText}>({property.reviewCount})</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Beds</Text>
          <Text style={styles.statValue}>{property.bedrooms}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Baths</Text>
          <Text style={styles.statValue}>{property.bathrooms}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Sq Ft</Text>
          <Text style={styles.statValue}>{(property.sqft / 1000).toFixed(1)}k</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Type</Text>
          <Text style={styles.statValue}>{property.type}</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This Property</Text>
        <Text style={styles.description}>{property.description}</Text>
      </View>

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {property.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Text style={styles.amenityText}>✓ {amenity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Property Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Year Built</Text>
          <Text style={styles.detailValue}>{property.yearBuilt}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Property Tax</Text>
          <Text style={styles.detailValue}>${(property.propertyTax || 0).toLocaleString()}/year</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>HOA Fees</Text>
          <Text style={styles.detailValue}>${(property.hoaFees || 0).toLocaleString()}/month</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Parking</Text>
          <Text style={styles.detailValue}>
            {property.parking.included ? `${property.parking.spaces} space(s)` : 'Not included'}
          </Text>
        </View>
      </View>

      {/* Agent Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agent</Text>
        <View style={styles.agentCard}>
          <View>
            <Text style={styles.agentName}>{property.agentName}</Text>
            <Text style={styles.agentEmail}>{property.agentEmail}</Text>
            <Text style={styles.agentPhone}>{property.agentPhone}</Text>
          </View>
        </View>
      </View>

      {/* Reviews */}
      {reviews.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <FlatList
            data={reviews}
            renderItem={renderReviewItem}
            keyExtractor={(item) => item.reviewId}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleContactAgent}>
          <Text style={styles.secondaryButtonText}>Contact Agent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={() => setShowBookingModal(true)}>
          <Text style={styles.primaryButtonText}>Book a Tour</Text>
        </TouchableOpacity>
      </View>

      {/* Booking Modal */}
      <Modal visible={showBookingModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Schedule a Tour</Text>

            <TextInput
              style={styles.input}
              placeholder="Date (MM/DD/YYYY)"
              value={bookingDate}
              onChangeText={setBookingDate}
            />

            <TextInput
              style={styles.input}
              placeholder="Time (HH:MM)"
              value={bookingTime}
              onChangeText={setBookingTime}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional notes"
              value={bookingNotes}
              onChangeText={setBookingNotes}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity style={styles.bookButton} onPress={handleBookTour}>
              <Text style={styles.bookButtonText}>Confirm Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowBookingModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const renderReviewItem = ({ item: review }) => (
  <View style={styles.reviewItem}>
    <View style={styles.reviewHeader}>
      <Text style={styles.reviewerName}>{review.userName}</Text>
      <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
    </View>
    <Text style={styles.reviewComment}>{review.comment}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300
  },
  fullImage: {
    width: '100%',
    height: 300
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  },
  favoriteIcon: {
    fontSize: 24
  },
  headerSection: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#059669'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4
  },
  address: {
    fontSize: 14,
    color: '#6b7280'
  },
  ratingBox: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937'
  },
  reviewsText: {
    fontSize: 12,
    color: '#6b7280'
  },
  statsSection: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  statItem: {
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280'
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 4
  },
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 21
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  amenityItem: {
    width: '48%'
  },
  amenityText: {
    fontSize: 13,
    color: '#059669'
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280'
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937'
  },
  agentCard: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8
  },
  agentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4
  },
  agentEmail: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2
  },
  agentPhone: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '500'
  },
  reviewItem: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937'
  },
  reviewRating: {
    fontSize: 14,
    fontWeight: '600'
  },
  reviewComment: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20
  },
  reviewDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 6
  },
  actionSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    flexDirection: 'row',
    gap: 12
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#059669',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#059669',
    fontSize: 15,
    fontWeight: '600'
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#f9fafb'
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  bookButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  cancelText: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 14
  }
});
