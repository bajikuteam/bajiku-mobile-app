import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import io from 'socket.io-client';

// Set up the socket connection (replace with your actual server URL)
const socket = io('https://backend-server-quhu.onrender.com');

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  interface Message {
    text: string;
    senderId: string;   // Update the type to include senderId
    receiverId: string; // Add receiverId
    room: string;
    timestamp: Date;
  }
  

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Handle socket events
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to the server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from the server');
    });

    socket.on('connect_error', (error) => {
      setIsConnected(false);
      console.log('Connection error:', error);
    });

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up socket listeners on component unmount
    return () => {
      socket.off('receiveMessage');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = {
        text: message,
        senderId: 'user123',  
        receiverId: 'user456',  
        room: 'chatRoom1', 
        timestamp: new Date(),
      };
    
      // Emit the message to the server
      socket.emit('sendMessage', newMessage);
    
      // Clear the input field
      setMessage('');
    }
  };
  
  

  return (
    <View>
      <Text style={{ color: isConnected ? 'green' : 'red' }}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </Text>

      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{`${item.senderId}: ${item.text}`}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Enter your message..."
        style={{ flex: 1, borderWidth: 1, borderRadius: 5, padding: 10, marginRight: 10 }}
      />

      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
