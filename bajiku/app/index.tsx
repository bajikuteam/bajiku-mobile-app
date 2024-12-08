import React, { useState, useEffect } from 'react';
import { router, usePathname, useRouter } from 'expo-router';
import { useUser } from '@/utils/useContext/UserContext';
import Loading from '@/components/Loading';
import * as NavigationBar from 'expo-navigation-bar';
import { useIsFocused } from '@react-navigation/native';
import { BackHandler } from 'react-native';

const Index = () => {
  const { user } = useUser();
  const [isReady, setIsReady] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const isFocused = useIsFocused();
  const pathname = usePathname(); 

  // Setting the navigation bar style when screen is focused
  useEffect(() => {
    if (isFocused) {
      NavigationBar.setBackgroundColorAsync('#000000');
      NavigationBar.setButtonStyleAsync('light');
    }
  }, [isFocused]);

  // Simulate app loading with a timeout (e.g., 5 seconds)
  useEffect(() => {
    const loadApp = async () => {
      setTimeout(() => {
        setIsReady(true);
      }, 5000);
    };
    loadApp();
  }, []);

  // Simulate user loading with a timeout (e.g., 3 seconds)
  useEffect(() => {
    const loadUser = async () => {
      setTimeout(() => {
        if (user === null) {
          setIsUserLoaded(true);
        } else {
          setIsUserLoaded(true);
        }
      }, 3000);
    };
    loadUser();
  }, [user]);

  // Handle navigation when app is ready and user data is loaded
  useEffect(() => {
    if (isReady && isUserLoaded) {
      if (user) {
        router.push('/(tabs)'); 
      } else {
        router.push('/auth/Login');
      }
    }
  }, [isReady, isUserLoaded, user]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    
      if (user && pathname === '/') {
        BackHandler.exitApp();
        return true; 
      }
  
      if (!user && pathname === '/auth/Login') {
        BackHandler.exitApp();
        return true; 
      }
      return false;
    });
  
    return () => backHandler.remove(); 
  }, [user, pathname]);
  
  
  

  // Show loading until the app and user data are ready
  if (!isReady || !isUserLoaded) {
    return <Loading />;
  }

  return null; // Return nothing as the app will navigate based on the conditions above
};

export default Index;
