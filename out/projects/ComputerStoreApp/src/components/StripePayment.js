import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { paymentAPI } from '../services/api';

const StripePayment = ({ amount, onSuccess, onCancel }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);

      // Create payment intent on your backend
      const { paymentIntent, ephemeralKey, customer } = await paymentAPI.createPaymentIntent(amount);

      const { error } = await initPaymentSheet({
        merchantDisplayName: "PC Builder Pro",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: 'Jane Doe',
        },
      });

      if (error) {
        Alert.alert('Error', error.message);
        return false;
      }

      return true;
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize payment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    setLoading(true);
    
    try {
      const initialized = await initializePaymentSheet();
      if (!initialized) return;

      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        // Confirm payment on your backend
        await paymentAPI.confirmPayment({ amount });
        Alert.alert('Success', 'Your order was confirmed!');
        onSuccess();
      }
    } catch (error) {
      Alert.alert('Error', 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.paymentButton, loading && styles.disabledButton]}
        onPress={openPaymentSheet}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.paymentButtonText}>
            Pay ${amount}
          </Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  paymentButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  cancelButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StripePayment;