import React, {useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/onBoarding/SignInScreen';
import SignUpScreen from '../screens/onBoarding/SignupScreen';
import auth from '@react-native-firebase/auth';
import ProfileScreen from '../screens/ProfileScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import {FavoritesProvider} from '../services/FavoriteContext';
import DetailScreen from '../screens/DetailScreen';
import {ThemeProvider} from '../services/ThemeContext';
import TrendingScreen from '../screens/TrendingScreen';
import PopularScreen from '../screens/PopularScreen';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

const AppRouter = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);
  if (initializing) return null;
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={{
              headerShown: false,
              animation: 'default',
            }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="FavoritesScreen" component={FavoriteScreen} />
            <Stack.Screen name="DetailScreen" component={DetailScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="TrendingScreen" component={TrendingScreen} />
            <Stack.Screen name="PopularScreen" component={PopularScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </FavoritesProvider>
    </ThemeProvider>
  );
};

export default AppRouter;
