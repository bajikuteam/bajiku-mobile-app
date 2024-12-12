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
import { VideoProvider } from '@/utils/useContext/VideoContext';
SplashScreen.preventAutoHideAsync();  
export default function App() {
 
  return (
      <ThemeProvider>
        <UserProvider>
          <ChatProvider>
            <FollowersProvider>
            <VideoProvider>
              <RootLayout />
              </VideoProvider>
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
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="userDetails" options={{ headerShown: false }} />

        <Stack.Screen name="NewChat" options={{ headerShown: false }} />
        <Stack.Screen name="PostDetail" options={{ headerShown: false }} />
        <Stack.Screen name="Profile" 
        options={{ headerShown: false ,    
     headerTitleAlign: 'center',  
      headerTintColor: '#fff',  
      headerStyle: { backgroundColor: '#000000' },
        }} />
        <Stack.Screen name="Followers" options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" options={{ headerShown: false }} />
        <Stack.Screen name="SubscribedTo" options={{ headerShown: false }} />
        <Stack.Screen name="Following" options={{ headerShown: false }} />
        <Stack.Screen name="message" options={{ headerShown: false }} />
        <Stack.Screen name="groupChat" options={{ headerShown: false }} />
        <Stack.Screen name="CreateGroup" options={{ headerShown: false }} />
        <Stack.Screen name="PersonGroupChat" options={{ headerShown: false }} />
        <Stack.Screen name="AddPersonGroupChatMember" options={{ headerShown: false }} />
        <Stack.Screen name="TotalEarnings" options={{ headerShown: false }} />  
      </Stack>
    </NavigationThemeProvider>
  );
}

