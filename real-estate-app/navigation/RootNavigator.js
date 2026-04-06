import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SearchScreen from './screens/SearchScreen';
import PropertyDetailScreen from './screens/PropertyDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import BookingsScreen from './screens/BookingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import FavoriteDetailScreen from './screens/FavoriteDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff'
        },
        headerTintColor: '#1f2937',
        headerTitleStyle: {
          fontWeight: '700'
        }
      }}
    >
      <Stack.Screen
        name="SearchList"
        component={SearchScreen}
        options={{
          title: 'Find Properties',
          headerLargeTitle: true,
          headerLargeStyle: {
            backgroundColor: '#fff'
          }
        }}
      />
      <Stack.Screen
        name="PropertyDetail"
        component={PropertyDetailScreen}
        options={({ route }) => ({
          title: route.params?.property?.title || 'Property Details'
        })}
      />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff'
        },
        headerTintColor: '#1f2937',
        headerTitleStyle: {
          fontWeight: '700'
        }
      }}
    >
      <Stack.Screen
        name="FavoritesList"
        component={FavoritesScreen}
        options={{
          title: 'My Favorites',
          headerLargeTitle: true
        }}
      />
      <Stack.Screen
        name="FavoriteDetail"
        component={FavoriteDetailScreen}
        options={({ route }) => ({
          title: route.params?.property?.title || 'Property Details'
        })}
      />
    </Stack.Navigator>
  );
}

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />
    </Stack.Navigator>
  );
}

export function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5
        },
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4
        }
      }}
    >
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔍</Text>
          )
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>❤️</Text>
          )
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsScreen}
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📅</Text>
          )
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          )
        }}
      />
    </Tab.Navigator>
  );
}

import { Text } from 'react-native';
