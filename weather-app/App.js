import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import DashboardScreen from './screens/DashboardScreen';
import ForecastScreen from './screens/ForecastScreen';
import AlertsScreen from './screens/AlertsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>🌤️</Text> }}
        />
        <Tab.Screen
          name="Forecast"
          component={ForecastScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>📈</Text> }}
        />
        <Tab.Screen
          name="Alerts"
          component={AlertsScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>⚠️</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
