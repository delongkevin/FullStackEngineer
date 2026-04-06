import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3001';

export default function FavoriteDetailScreen({ route, navigation }) {
  const { property } = route.params;
  const [imageGalleryVisible, setImageGalleryVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [token, setToken] = useState(null);
  const [isFavorite, setIsFavorite] = useState(true);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const getToken = async () => {
    if (!token) {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);
      return storedToken;
    }
    return token;
  };

  const removeFavorite = async () => {
    try {
      const currentToken = await getToken();
      await axios.delete(`${API_BASE_URL}/api/favorites/${property.propertyId}`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      setIsFavorite(false);
      Alert.alert('Success', 'Removed from favorites');
      setTimeout(() => navigation.goBack(), 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to remove favorite');
    }
  };

  const scheduleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select both date and time');
      return;
    }

    try {
      const currentToken = await getToken();
      await axios.post(`${API_BASE_URL}/api/bookings`, {
        propertyId: property.propertyId,
        tourDate: selectedDate,
        tourTime: selectedTime
      }, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      
      Alert.alert('Success', 'Tour booked successfully!');
      setBookingModalVisible(false);
      setSelectedDate('');
      setSelectedTime('');
    } catch (error) {
      Alert.alert('Error', 'Failed to book tour');
    }
  };

  const getDates = () => {
    const dates = [];
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image Gallery */}
      <TouchableOpacity
        onPress={() => setImageGalleryVisible(true)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: property.images[selectedImageIndex] }}
          style={styles.mainImage}
        />
        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {selectedImageIndex + 1} / {property.images.length}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Image Gallery Modal */}
      <Modal visible={imageGalleryVisible} animationType="fade">
        <View style={styles.galleryContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageGalleryVisible(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <FlatList
            data={property.images}
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.fullscreenImage} />
            )}
            onMomentumScrollEnd={(e) => {
              const contentOffsetX = e.nativeEvent.contentOffset.x;
              const index = Math.round(contentOffsetX / 400);
              setSelectedImageIndex(index);
            }}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      </Modal>

      {/* Property Info */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.propertyTitle}>{property.title}</Text>
            <Text style={styles.location}>
              📍 {property.city}, {property.state}
            </Text>
          </View>
          {isFavorite && (
            <TouchableOpacity style={styles.favoriteButton}>
              <Text style={styles.favoriteIcon}>❤️</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>
            ${property.forSale ? property.price.toLocaleString() : `${property.rentPrice}/mo`}
          </Text>
          <Text style={styles.propertyType}>
            {property.forSale ? 'For Sale' : 'For Rent'}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Bedrooms</Text>
            <Text style={styles.statValue}>{property.bedrooms}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Bathrooms</Text>
            <Text style={styles.statValue}>{property.bathrooms}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Square Ft</Text>
            <Text style={styles.statValue}>{(property.sqft / 1000).toFixed(1)}k</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Rating</Text>
            <Text style={styles.statValue}>⭐ {property.ratings}</Text>
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
                <View key={index} style={styles.amenityTag}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => setBookingModalVisible(true)}
        >
          <Text style={styles.bookButtonText}>📅 Schedule Tour</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactButton}
        >
          <Text style={styles.contactButtonText}>📞 Contact Agent</Text>
        </TouchableOpacity>

        {isFavorite && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={removeFavorite}
          >
            <Text style={styles.removeButtonText}>Remove from Favorites</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Booking Modal */}
      <Modal visible={bookingModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setBookingModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Schedule Tour</Text>
              <View style={{ width: 30 }} />
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Select Date</Text>
              <FlatList
                data={getDates()}
                horizontal
                scrollEnabled
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.dateItem,
                      selectedDate === item && styles.dateItemSelected
                    ]}
                    onPress={() => setSelectedDate(item)}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        selectedDate === item && styles.dateTextSelected
                      ]}
                    >
                      {new Date(item).getDate()}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />

              <Text style={styles.modalLabel}>Select Time</Text>
              <FlatList
                data={getTimes()}
                numColumns={4}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.timeItem,
                      selectedTime === item && styles.timeItemSelected
                    ]}
                    onPress={() => setSelectedTime(item)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        selectedTime === item && styles.timeTextSelected
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={scheduleBooking}
              >
                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  mainImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#e5e7eb'
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: '#000'
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300'
  },
  fullscreenImage: {
    width: 400,
    height: '100%',
    resizeMode: 'contain'
  },
  content: {
    padding: 16
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
    maxWidth: '85%'
  },
  location: {
    fontSize: 14,
    color: '#6b7280'
  },
  favoriteButton: {
    padding: 8
  },
  favoriteIcon: {
    fontSize: 24
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  priceText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669'
  },
  propertyType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280'
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12
  },
  statItem: {
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937'
  },
  section: {
    marginBottom: 24
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
    lineHeight: 20
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  amenityTag: {
    backgroundColor: '#ecfdf5',
    borderColor: '#059669',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  amenityText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500'
  },
  bookButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  contactButton: {
    backgroundColor: '#fff',
    borderColor: '#059669',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12
  },
  contactButtonText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '600'
  },
  removeButton: {
    backgroundColor: '#fff',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 30
  },
  removeButtonText: {
    color: '#ef4444',
    fontSize: 14,
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
    paddingTop: 20,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  modalClose: {
    fontSize: 24,
    color: '#6b7280'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937'
  },
  modalBody: {
    padding: 16
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 16
  },
  dateItem: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  dateItemSelected: {
    backgroundColor: '#059669',
    borderColor: '#059669'
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280'
  },
  dateTextSelected: {
    color: '#fff'
  },
  timeItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  timeItemSelected: {
    backgroundColor: '#059669',
    borderColor: '#059669'
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280'
  },
  timeTextSelected: {
    color: '#fff'
  },
  confirmButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
