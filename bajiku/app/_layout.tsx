import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider, useNavigation,  } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from '@/utils/useContext/ThemeContext';
import { UserProvider, useUser } from '@/utils/useContext/UserContext';
import { ChatProvider } from '@/utils/useContext/ChatContext';
import { FollowersProvider } from '@/utils/useContext/FollowingContext';
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { NotificationProvider } from '@/utils/useContext/NotificationContext';

SplashScreen.preventAutoHideAsync();

// Background notification task
const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
  if (error) {
    console.error("Error receiving background notification:", error);
    return;
  }
  console.log("Received a background notification!", data);
});

async function registerNotificationTask() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
  await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

registerNotificationTask();

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NotificationProvider>
          <ChatProvider>
            <FollowersProvider>
              <RootLayout />
            </FollowersProvider>
          </ChatProvider>
        </NotificationProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

function RootLayout() {
  // const { isLoading } = useAuth(); 
  const { theme } = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { user } = useUser(); 

  if ( !loaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
    <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />  
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="NewChat" options={{ headerShown: false }} />
          <Stack.Screen name="PostDetail" options={{ headerShown: false }} />
          <Stack.Screen name="Profile" options={{ headerShown: false }} />
          <Stack.Screen name="Followers" options={{ headerShown: false }} />
          <Stack.Screen name="Following" options={{ headerShown: false }} />
          <Stack.Screen name="message" options={{ headerBackTitleVisible: false }} />
          <Stack.Screen name="groupChat" options={{ headerBackTitleVisible: false }} />
          <Stack.Screen name="CreateGroup" options={{ headerBackTitleVisible: false }} />
          <Stack.Screen name="PersonGroupChat" options={{ headerBackTitleVisible: false }} />
          <Stack.Screen name="AddPersonGroupChatMember" options={{ headerBackTitleVisible: false }} />
       
 

      
    </Stack>
  </NavigationThemeProvider>
  );
}
