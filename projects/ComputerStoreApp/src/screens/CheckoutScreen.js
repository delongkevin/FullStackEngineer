import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useCart } from '../context/CartContext';

const CheckoutScreen = ({ navigation }) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });

  const handlePlaceOrder = () => {
    // Basic validation
    if (!shippingInfo.fullName || !shippingInfo.address || !paymentInfo.cardNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Order Confirmed!',
      'Thank you for your purchase! Your order has been placed successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  const total = getCartTotal();
  const shipping = total > 500 ? 0 : 29.99;
  const tax = total * 0.08; // 8% tax
  const finalTotal = total + shipping + tax;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cart.items.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemName}>{item.name}</Text>
              <Text style={styles.orderItemPrice}>
                ${item.price} x {item.quantity}
              </Text>
            </View>
          ))}
          <View style={styles.totalBreakdown}>
            <View style={styles.totalRow}>
              <Text>Subtotal:</Text>
              <Text>${total.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Shipping:</Text>
              <Text>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Tax:</Text>
              <Text>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, styles.finalTotal]}>
              <Text style={styles.finalTotalText}>Total:</Text>
              <Text style={styles.finalTotalText}>${finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={shippingInfo.fullName}
            onChangeText={text => setShippingInfo({ ...shippingInfo, fullName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Address *"
            value={shippingInfo.address}
            onChangeText={text => setShippingInfo({ ...shippingInfo, address: text })}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City"
              value={shippingInfo.city}
              onChangeText={text => setShippingInfo({ ...shippingInfo, city: text })}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="ZIP Code"
              value={shippingInfo.zipCode}
              onChangeText={text => setShippingInfo({ ...shippingInfo, zipCode: text })}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Country"
            value={shippingInfo.country}
            onChangeText={text => setShippingInfo({ ...shippingInfo, country: text })}
          />
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Cardholder Name *"
            value={paymentInfo.cardholderName}
            onChangeText={text => setPaymentInfo({ ...paymentInfo, cardholderName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Card Number *"
            value={paymentInfo.cardNumber}
            onChangeText={text => setPaymentInfo({ ...paymentInfo, cardNumber: text })}
            keyboardType="numeric"
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="MM/YY"
              value={paymentInfo.expiryDate}
              onChangeText={text => setPaymentInfo({ ...paymentInfo, expiryDate: text })}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVV"
              value={paymentInfo.cvv}
              onChangeText={text => setPaymentInfo({ ...paymentInfo, cvv: text })}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order - ${finalTotal.toFixed(2)}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderItemName: {
    flex: 2,
    fontSize: 14,
  },
  orderItemPrice: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
  },
  totalBreakdown: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 10,
    paddingTop: 10,
  },
  finalTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  placeOrderButton: {
    backgroundColor: '#28a745',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  placeOrderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;