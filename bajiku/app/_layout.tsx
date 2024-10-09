import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from '@/utils/useContext/ThemeContext';
import { UserProvider } from '@/utils/useContext/UserContext';
import Loading from '@/components/Loading'; 

SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <RootLayout />
      </UserProvider>
    </ThemeProvider>
  );
}

function RootLayout() {
  const { theme } = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      SplashScreen.hideAsync();
    }, 5000); 

    return () => clearTimeout(timer); 
  }, []);

  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loading]);

  if (loading) {
    return <Loading />; 
  }

  if (!loaded) {
    return null; 
  }

  const headerStyle = {
    backgroundColor: theme === 'dark' ? '#000' : '#fff', 
  };

  const headerTintColor = theme === 'dark' ? '#FBBC05' : '#000'; 

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="Login" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Signup" 
          options={{ headerShown: false }} 
           
        />
        <Stack.Screen 
          name="EmailVerification" 
          
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ForgetPassword" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SetPassword" 
/>
        <Stack.Screen 
          name="SetProfile"
          options={{ headerShown: false }} 
        />
      </Stack>
    </NavigationThemeProvider>
  );
}
