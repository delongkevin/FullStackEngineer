import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  
  token = (await Notifications.getExpoPushTokenAsync()).data;
  
  return token;
};

export const scheduleOrderNotification = (orderId, estimatedDelivery) => {
  const trigger = new Date(estimatedDelivery);
  trigger.setHours(trigger.getHours() - 2); // Notify 2 hours before estimated delivery

  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your order is arriving soon!',
      body: `Order #${orderId.slice(-8)} will be delivered in approximately 2 hours`,
      data: { orderId, type: 'order_delivery' },
    },
    trigger,
  });
};

export const schedulePromotionalNotification = (title, body, data = {}) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // Immediate
  });
};

// Listen for notification interactions
export const setNotificationListener = (navigation) => {
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    const { orderId, type } = response.notification.request.content.data;
    
    if (type === 'order_delivery' && orderId) {
      navigation.navigate('OrderTracking', { orderId });
    }
  });

  return responseListener;
};