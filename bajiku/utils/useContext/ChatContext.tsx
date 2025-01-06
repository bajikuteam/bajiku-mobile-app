import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client'; // Import socket.io client
// import { useNotification } from '@/utils/useContext/NotificationContext';

// Define the Message interface
interface Message {
  text: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  createdAt: string;
}

// Define the context properties
interface ChatContextProps {
  messages: Message[];
  addMessage: (message: Message) => void;
  sendNotificationToServer: (notificationData: any) => Promise<void>;
  // expoPushToken: string | null; // Add expoPushToken to the context
}

// Create the context
const ChatContext = createContext<ChatContextProps | undefined>(undefined);


export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useRef(io('https://my-social-media-bd.onrender.com')); 


  // Effect to handle incoming messages
  useEffect(() => {
    // Listen for incoming messages
    socket.current.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, { ...message, createdAt: new Date().toISOString() }]);
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.current.off('receiveMessage');
    };
  }, []);

  // Function to add a message and emit it through the socket
  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    socket.current.emit('sendMessage', message); // Send the message through the socket
  };

  const sendNotificationToServer = async (notificationData: any) => {
    try {
      await axios.post('https://my-social-media-bd.onrender.com/notifications/send', {
        ...notificationData,
        priority: 'high', // Add priority
        sound: 'default', // Ensure there's a sound for the notification
        // to: expoPushToken, // Include the expoPushToken in the notification data
      });
    } catch (error) {
      console.error("Error sending notification to server:", error);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, sendNotificationToServer }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the ChatContext
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
