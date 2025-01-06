import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from '@/utils/useContext/ThemeContext';
import { UserProvider } from '@/utils/useContext/UserContext';
import { ChatProvider } from '@/utils/useContext/ChatContext';
import { FollowersProvider } from '@/utils/useContext/FollowingContext';
import {usePreventScreenCapture} from 'expo-screen-capture'
import Loading from '@/components/Loading';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/services/core/i18n';


SplashScreen.preventAutoHideAsync();  
export default function App() {
 
  return (
      <ThemeProvider>
        <UserProvider>
       
          <ChatProvider>
            <FollowersProvider>
          
              <RootLayout />
            
            </FollowersProvider>
          </ChatProvider>
  
        </UserProvider>
      </ThemeProvider>
  );
}

function RootLayout() {
  const { theme } = useTheme();
  usePreventScreenCapture(); 
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  // Wait for fonts to load before rendering anything
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); 
     
    }
  }, [fontsLoaded]);

  // If fonts are not loaded yet, display loading text
  if (!fontsLoaded) {
    return <Loading/>;
  }

  return (

    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
       
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="userDetails" options={{ headerShown: false }} />
        <Stack.Screen name="system" options={{ headerShown: false }} />
        <Stack.Screen name="content" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="Appsettings" options={{ headerShown: false }} />
      </Stack>
    </NavigationThemeProvider>
  );
}

