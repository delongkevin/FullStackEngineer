import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import LibraryScreen from './screens/LibraryScreen';
import PlayerScreen from './screens/PlayerScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text> }}
        />
        <Tab.Screen
          name="Library"
          component={LibraryScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>🎵</Text> }}
        />
        <Tab.Screen
          name="Player"
          component={PlayerScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>▶️</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
