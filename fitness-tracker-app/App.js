import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';

// Screens
import HomeScreen from './screens/HomeScreen';
import WorkoutsScreen from './screens/WorkoutsScreen';
import HealthScreen from './screens/HealthScreen';
import GoalsScreen from './screens/GoalsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Set up notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleLogin = (newUserId) => {
    setUserId(newUserId);
    setIsLoggedIn(true);
  };

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
          }}
        >
          <Stack.Screen name="Login">
            {(props) => (
              <HomeScreen {...props} onLogin={handleLogin} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: true,
            headerStyle: {
              backgroundColor: '#1565C0',
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
            tabBarActiveTintColor: '#1565C0',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
          })}
        >
          <Tab.Screen
            name="Dashboard"
            options={{
              title: 'Dashboard',
              tabBarLabel: 'Home',
            }}
          >
            {(props) => <HomeScreen {...props} userId={userId} />}
          </Tab.Screen>

          <Tab.Screen
            name="Workouts"
            options={{
              title: 'My Workouts',
              tabBarLabel: 'Workouts',
            }}
          >
            {(props) => <WorkoutsScreen {...props} userId={userId} />}
          </Tab.Screen>

          <Tab.Screen
            name="Health"
            options={{
              title: 'Health Metrics',
              tabBarLabel: 'Health',
            }}
          >
            {(props) => <HealthScreen {...props} userId={userId} />}
          </Tab.Screen>

          <Tab.Screen
            name="Goals"
            options={{
              title: 'My Goals',
              tabBarLabel: 'Goals',
            }}
          >
            {(props) => <GoalsScreen {...props} userId={userId} />}
          </Tab.Screen>

          <Tab.Screen
            name="Profile"
            options={{
              title: 'Profile',
              tabBarLabel: 'Profile',
            }}
          >
            {(props) => (
              <ProfileScreen
                {...props}
                userId={userId}
                onLogout={() => {
                  setIsLoggedIn(false);
                  setUserId(null);
                }}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
