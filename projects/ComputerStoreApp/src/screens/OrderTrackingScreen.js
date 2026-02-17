import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { ordersAPI } from '../services/api';

const OrderTrackingScreen = ({ route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const [orderData, trackingData] = await Promise.all([
        ordersAPI.getOrder(orderId),
        ordersAPI.trackOrder(orderId),
      ]);
      setOrder(orderData);
      setTracking(trackingData);
    } catch (error) {
      console.error('Failed to load order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ['ordered', 'confirmed', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusSteps = [
    { title: 'Ordered', description: 'Your order has been placed' },
    { title: 'Confirmed', description: 'Order confirmation received' },
    { title: 'Processing', description: 'Preparing your items' },
    { title: 'Shipped', description: 'Your order is on the way' },
    { title: 'Delivered', description: 'Order delivered successfully' },
  ];

  const currentStep = getStatusStep(order.status);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Number:</Text>
              <Text style={styles.infoValue}>#{order.id.slice(-8)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Date:</Text>
              <Text style={styles.infoValue}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Amount:</Text>
              <Text style={styles.infoValue}>${order.total}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={[styles.infoValue, styles.statusText]}>{order.status}</Text>
            </View>
          </View>
        </View>

        {/* Tracking Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracking Progress</Text>
          <View style={styles.progressContainer}>
            {statusSteps.map((step, index) => (
              <View key={step.title} style={styles.stepContainer}>
                <View style={styles.stepLine}>
                  {index > 0 && (
                    <View
                      style={[
                        styles.connector,
                        index <= currentStep && styles.connectorActive,
                      ]}
                    />
                  )}
                </View>
                <View
                  style={[
                    styles.stepIcon,
                    index <= currentStep && styles.stepIconActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumber,
                      index <= currentStep && styles.stepNumberActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepTitle,
                      index <= currentStep && styles.stepTitleActive,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tracking Details */}
        {tracking && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tracking Details</Text>
            <View style={styles.trackingInfo}>
              <View style={styles.trackingRow}>
                <Text style={styles.trackingLabel}>Tracking Number:</Text>
                <Text style={styles.trackingValue}>{tracking.trackingNumber}</Text>
              </View>
              <View style={styles.trackingRow}>
                <Text style={styles.trackingLabel}>Carrier:</Text>
                <Text style={styles.trackingValue}>{tracking.carrier}</Text>
              </View>
              <View style={styles.trackingRow}>
                <Text style={styles.trackingLabel}>Estimated Delivery:</Text>
                <Text style={styles.trackingValue}>
                  {new Date(tracking.estimatedDelivery).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>${item.price * item.quantity}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  orderInfo: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusText: {
    color: '#007AFF',
    textTransform: 'capitalize',
  },
  progressContainer: {
    paddingLeft: 10,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  stepLine: {
    width: 30,
    alignItems: 'center',
  },
  connector: {
    width: 2,
    height: 40,
    backgroundColor: '#e0e0e0',
    position: 'absolute',
    top: -40,
  },
  connectorActive: {
    backgroundColor: '#007AFF',
  },
  stepIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepIconActive: {
    backgroundColor: '#007AFF',
  },
  stepNumber: {
    color: '#666',
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: 'white',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  stepTitleActive: {
    color: '#333',
  },
  stepDescription: {
    fontSize: 14,
    color: '#999',
  },
  trackingInfo: {
    gap: 10,
  },
  trackingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackingLabel: {
    fontSize: 14,
    color: '#666',
  },
  trackingValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderTrackingScreen;