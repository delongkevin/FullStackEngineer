import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { SettingsProvider } from './context/SettingsContext';
import DashboardScreen from './screens/DashboardScreen';
import ForecastScreen from './screens/ForecastScreen';
import AlertsScreen from './screens/AlertsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>Now</Text> }}
      />
      <Tab.Screen
        name="Forecast"
        component={ForecastScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>Trend</Text> }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>Alerts</Text> }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>Settings</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="WeatherTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider>
  );
}
