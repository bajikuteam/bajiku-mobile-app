import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import * as Notifications from "expo-notifications";
// import { Subscription } from "expo-modules-core";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";

// import { useNavigation } from 'expo-router';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/services/core/types";
import { useNavigation } from "@react-navigation/native";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // console.log("🔔 Notification Received: ", notification);
        setNotification(notification);
      });

      responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log("Notification Response Received: ", response);
        const { data } = response.notification.request.content;
        if (data && data.senderId) {
          setTimeout(() => {
            navigation.navigate("message", {
              senderId: data.senderId,
              receiverId: data.receiverId,
              senderName: data.username, 
              profileImageUrl:data.senderName, 
              username: data.lastName,
            });
          }, 500);
        } else {
          // console.log("Required data missing for navigation", data);
        }
      });
    
    

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [navigation]);


  

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
      {children}
    </NotificationContext.Provider>
  );
};
