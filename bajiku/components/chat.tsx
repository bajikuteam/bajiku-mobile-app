import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import io from 'socket.io-client';

// Set up the socket connection (replace with your actual server URL)
let socket: any;

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  interface Message {
    text: string;
    senderId: string;
    receiverId: string;
    room: string;
    timestamp: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);

  useFocusEffect(
    useCallback(() => {
      // Initialize the socket connection when the screen is focused
      socket = io('https://backend-server-quhu.onrender.com', {
        transports: ['websocket'], // Force WebSocket transport
        reconnection: true, // Enable automatic reconnection
        reconnectionAttempts: 5, // Retry up to 5 times
        timeout: 20000, // Set connection timeout
      });

      // Handle socket events
      socket.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to the server');
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from the server');
      });

      socket.on('connect_error', (error:any) => {
        setIsConnected(false);
        console.error('Connection error:', error);
      });

      // Listen for incoming messages
      socket.on('receiveMessage', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Clean up the socket connection when the screen is unfocused
      return () => {
        if (socket) {
          socket.disconnect();
          console.log('Socket disconnected');
        }
      };
    }, [])
  );

  const sendMessage = () => {
    if (message.trim() !== '') {
      const newMessage: Message = {
        text: message,
        senderId: 'user123', // Replace with the actual sender ID
        receiverId: 'user456', // Replace with the actual receiver ID
        room: 'chatRoom1', // Replace with the actual room ID if needed
        timestamp: new Date().toISOString(),
      };

      // Emit the message to the server
      if (socket) {
        socket.emit('sendMessage', newMessage);
      }

      // Add the message locally for immediate feedback
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Clear the input field
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.status, { color: isConnected ? 'green' : 'red' }]}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </Text>

      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={styles.message}>
            <Text style={styles.sender}>{item.senderId}:</Text> {item.text}
          </Text>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Enter your message..."
          placeholderTextColor="#ccc"
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

// Styles for better UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#121212',
  },
  status: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flexGrow: 1,
  },
  message: {
    padding: 5,
    color: '#fff',
  },
  sender: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    color: '#fff',
    backgroundColor: '#1E1E1E',
  },
});
