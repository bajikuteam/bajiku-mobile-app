import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from '@/utils/useContext/ThemeContext';
import { UserProvider } from '@/utils/useContext/UserContext';

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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const headerStyle = {
    backgroundColor: theme === 'dark' ? '#000' : '#fff', 
  };

  const headerTintColor = theme === 'dark' ? '#FBBC05' : '#000'; 

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="Login" 
          options={{
            headerTitle: 'Login', 
            headerBackVisible: false,
            headerShown: true,
            headerBackTitle: '', 
            headerStyle: headerStyle,
            headerTintColor: headerTintColor,
          }} 
        />
        <Stack.Screen 
          name="Signup" 
          options={{
            headerShown: true,
            headerBackVisible: false,
            headerBackTitle: '', 
            headerStyle: headerStyle,
            headerTintColor: headerTintColor,
          }} 
        />
        <Stack.Screen 
          name="EmailVerification" 
          options={{
            headerTitle: 'Verify Your Email', 
            headerBackTitle: '', 
            headerStyle: headerStyle,
            headerTintColor: headerTintColor,
          }} 
        />
        <Stack.Screen 
          name="ForgetPassword" 
          options={{
            headerTitle: 'Forget Password', 
            headerBackVisible: false,
            headerShown: true,
            headerBackTitle: '', 
            headerStyle: headerStyle,
            headerTintColor: headerTintColor,
          }} 
        />
        <Stack.Screen 
          name="SetPassword" 
          options={{
            headerTitle: 'Set Password', 
            headerBackVisible: false,
            headerBackTitle: '', 
            headerStyle: headerStyle,
            headerTintColor: headerTintColor,
          }} 
        />
      </Stack>
    </NavigationThemeProvider>
  );
}
