import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import axios from 'axios';

import LoginScreen from './screens/LoginScreen';
import ChatsScreen from './screens/ChatsScreen';
import ChatScreen from './screens/ChatScreen';
import UsersScreen from './screens/UsersScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function ChatsTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ChatsList" 
        component={ChatsScreen}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.otherUserName || 'Chat',
          headerBackTitle: 'Back'
        })}
      />
    </Stack.Navigator>
  );
}

function UsersTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="UsersList" 
        component={UsersScreen}
        options={{ title: 'New Chat' }}
      />
      <Stack.Screen 
        name="UserChat" 
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.otherUserName || 'Chat',
          headerBackTitle: 'Back'
        })}
      />
    </Stack.Navigator>
  );
}

function ProfileTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileView" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ProfileTabNavigator({ onLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileView" 
        options={{ title: 'Profile' }}
      >
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function AuthStackWithProps({ onAuthSuccess }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
      >
        {(props) => <LoginScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function AppStack({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60
        }
      })}
    >
      <Tab.Screen 
        name="ChatsTab" 
        component={ChatsTabNavigator}
        options={{
          title: 'Chats',
          tabBarLabel: 'Chats',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
          )
        }}
      />
      
      <Tab.Screen 
        name="UsersTab" 
        component={UsersTabNavigator}
        options={{
          title: 'Users',
          tabBarLabel: 'Users',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
          )
        }}
      />
      
      <Tab.Screen 
        name="ProfileTab" 
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
          )
        }}
      >
        {(props) => <ProfileTabNavigator {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [state, setState] = useState({
    isLoading: true,
    userToken: null,
    userId: null
  });

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      setState({
        isLoading: false,
        userToken: token,
        userId: userId
      });
    } catch (e) {
      setState({
        isLoading: false,
        userToken: null,
        userId: null
      });
    }
  };

  const handleAuthSuccess = ({ token, userId }) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setState({
      isLoading: false,
      userToken: token,
      userId
    });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    delete axios.defaults.headers.common['Authorization'];
    setState({
      isLoading: false,
      userToken: null,
      userId: null
    });
  };

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {state.userToken == null ? (
        <AuthStackWithProps onAuthSuccess={handleAuthSuccess} />
      ) : (
        <AppStack onLogout={handleLogout} />
      )}
    </NavigationContainer>
  );
}
