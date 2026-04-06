import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { EmptyState, LoadingState } from '../components';

const API_BASE_URL = 'http://localhost:3001';

export default function BookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    const storedToken = await AsyncStorage.getItem('userToken');
    setToken(storedToken);
    if (storedToken) {
      await fetchBookings();
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#059669';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const renderBookingItem = ({ item: booking }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View>
          <Text style={styles.propertyTitle}>{booking.propertyTitle}</Text>
          <Text style={styles.tourDate}>
            📅 {moment(booking.tourDate).format('MMM DD, YYYY')} at {booking.tourTime}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(booking.status) }
          ]}
        >
          <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <Text style={styles.detailLabel}>Booking ID</Text>
        <Text style={styles.detailValue}>{booking.bookingId.slice(0, 12)}...</Text>
      </View>

      {booking.notes && (
        <View style={styles.bookingDetails}>
          <Text style={styles.detailLabel}>Notes</Text>
          <Text style={styles.detailValue}>{booking.notes}</Text>
        </View>
      )}

      <View style={styles.bookingDetails}>
        <Text style={styles.detailLabel}>Booked on</Text>
        <Text style={styles.detailValue}>
          {moment(booking.createdAt).format('MMM DD, YYYY')}
        </Text>
      </View>

      {booking.confirmedAt && (
        <View style={styles.bookingDetails}>
          <Text style={styles.detailLabel}>Confirmed on</Text>
          <Text style={styles.detailValue}>
            {moment(booking.confirmedAt).format('MMM DD, YYYY')}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.callButton}>
        <Text style={styles.callButtonText}>📞 Contact Agent</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <LoadingState message="Loading bookings..." />;
  }

  return (
    <View style={styles.container}>
      {bookings.length === 0 ? (
        <EmptyState
          title="No Bookings Yet"
          message="Schedule property tours from the search results"
        />
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.bookingId}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
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
  listContent: {
    padding: 12
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6
  },
  tourDate: {
    fontSize: 13,
    color: '#6b7280'
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700'
  },
  bookingDetails: {
    marginBottom: 12
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500'
  },
  callButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12
  },
  callButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  }
});
