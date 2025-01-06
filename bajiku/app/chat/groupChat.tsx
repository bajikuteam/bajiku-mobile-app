import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, StatusBar, KeyboardAvoidingView, Platform, Modal} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import io from 'socket.io-client';
import { useUser } from '@/utils/useContext/UserContext';
import CustomHeader from '@/components/CustomHeader';
import { router, useLocalSearchParams } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { formatTime } from '@/services/core/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socket = io('https://my-social-media-bd.onrender.com');


interface Message {
  _id: string;
  text: string;
  createdAt: string;
  senderId: string;
  senderName: string;
  user: {
    _id: string;
    name: string;
  };
}

  const GroupChat: React.FC = () => {
  const params = useLocalSearchParams();
  const { senderId, senderName, groupImgUrl, room, name, description } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [userColors, setUserColors] = useState<{ [key: string]: string }>({});
  const { user } = useUser();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]); 
  

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // Hide the navigation bar when focused
      NavigationBar.setVisibilityAsync('hidden');
    } else {
      // Optionally show the navigation bar when not focused
      NavigationBar.setVisibilityAsync('visible');
    }
  }, [isFocused]);

  const goBack = () => {
    router.back();
  };

  // Helper function to generate a random color
  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`https://my-social-media-bd.onrender.com/chat/history/${name}`);
        const data = await response.json();

        const formattedMessages = data.map((msg: any) => ({
          _id: msg._id,
          text: msg.text,
          createdAt: new Date(msg.createdAt).toISOString(),
          user: {
            _id: msg.senderId,
            name: msg.senderName,
          },
        }));
       
        const sortedMessages = formattedMessages.sort((a: Message, b: Message) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
  
        setMessages(sortedMessages);
      } catch (error) {
        // Handle error fetching chat history
      }
    };

    fetchChatHistory();
  }, [room]);


// i add 's' to the event to prevent connecting
  // Handle socket events
  useEffect(() => {
    socket.emit('joinRooms', { room: name, userId: senderName });
  
    // Track joined users to avoid sending "userJoined" message multiple times
    let joinedUsers: Set<string> = new Set();
  
    socket.on('userJoineds', ({ userId }) => {
      if (userId === senderId) {
        return;
      }
  
      // If user has already joined, don't show the join message again
      if (!joinedUsers.has(userId)) {
        // Mark user as joined
        joinedUsers.add(userId);
  
        if (!userColors[userId]) {
          const randomColor = generateRandomColor();
          setUserColors((prev) => ({ ...prev, [userId]: randomColor }));
        }
  
        const notificationMessage = {
          _id: `notif-${Date.now()}`,
          text: `@${userId} just joined`,
          createdAt: new Date(),
          system: true,
          user: { _id: 0 },
        };
  
        // Add to messages state (ensure it's ordered correctly later)
        setMessages((prevMessages) => [...prevMessages, notificationMessage as any]);
      }
    });
  
    socket.on('userLefts', ({ userId }) => {
      if (userId === senderId) {
        return;
      }
  
      // Show the leave message only if the user has already joined
      if (joinedUsers.has(userId)) {
        const notificationMessage = {
          _id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
          text: `@${userId} has left`,
          createdAt: new Date(),
          system: true,
          user: { _id: 0 },
        };
  
        setMessages((prevMessages) => [...prevMessages, notificationMessage as any]);
        // Remove user from joined list after they leave
        joinedUsers.delete(userId);
      }
    });
  
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some((msg) => msg._id === message._id);
        if (!messageExists) {
          return [...prevMessages, { ...message, user: { _id: message.senderId, name: message.senderName } }];
        }
        return prevMessages;
      });
    });
  
    return () => {
      socket.emit('leaveRooms', { room: name });
      socket.off('userJoineds');
      socket.off('userLefts');
      socket.off('receiveMessage');
    };
  }, [name, senderId, senderName, userColors]);
  

  // Send message handler
  const onSend = useCallback(() => {
    if (messageInput.trim() === '') return;

    const newMessage = {
      _id: Date.now().toString(),
      text: messageInput,
      createdAt: new Date().getTime(),
      room: name,
      senderId:userId,
      senderName,
      user: {
        _id: senderId,
        name: senderName,
      },
    };

    socket.emit('sendMessage', newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage as any]);
    setMessageInput('');
  }, [messageInput, senderId, senderName, name]);

  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserId = async () => {
      const userId = user?.id  || await AsyncStorage.getItem('userId') || senderId; 
      const storedUserId = userId;
      setUserId(storedUserId);
    };
    fetchUserId();
  }, []);
  const renderMessage = ({ item }: any) => {
    const isSentByUser = String(item.user?._id) === (userId as string ?? null);
    const isSystemMessage = item.system; 
    
    return (
      <View
        style={[
          styles.messageContainer,
          {
            alignSelf: isSystemMessage ? 'center' : (isSentByUser ? 'flex-end' : 'flex-start'),
          },
        ]}
      >
        {isSystemMessage ? (
          <Text
            style={[
              styles.systemMessageText,
              {
                textAlign: 'center', 
                fontSize: 12,
                color: 'gray',
                textTransform: 'lowercase',
                fontStyle: 'italic',
              },
            ]}
          >
            {item.text}
          </Text>
        ) : (
          <View
            style={[
              styles.messageBubble,
              {
                backgroundColor: isSentByUser ? '#333' : '#000',
              },
            ]}
          >
            <Text
              style={[
                styles.messageText,
                {
                  color: isSentByUser ? '#000' : '#555',
                },
              ]}
            >
              {item.text}
            </Text>
            <Text
              style={[
                styles.usernameText,
                {
                  alignSelf: 'flex-end',
                  marginTop: 5,
                  fontSize: 8,
                  color: 'gray',
                  textTransform: 'lowercase',
                },
              ]}
            >
              ~@{item.user?.name}
            </Text>
          </View>
        )}
        {!isSystemMessage && (
          <Text
            style={[
              styles.usernameText,
              {
                alignSelf: 'flex-end',
                marginTop: 5,
                fontSize: 10,
                color: 'gray',
              },
            ]}
          >
            {formatTime(item.createdAt)}
          </Text>
        )}
      </View>
    );
  };



  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  const renderModal = () => (
    <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={toggleModal}>
        <View style={styles.modalContent}>
    
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.modalButton}>Leave Group</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleModal}>
          <Text style={styles.modalCloseButton}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <><CustomHeader title={name as string} onBackPress={goBack} image={groupImgUrl as string} subtitle={ description as string}    onMorePress={toggleModal}  />
         {renderModal()}
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
        <View style={{ flex: 1, backgroundColor: '#1c1c1e' }}>
          <StatusBar barStyle="light-content" backgroundColor="#000000" />
          <FlatList
  ref={flatListRef} 
  data={messages}
  renderItem={renderMessage}
  keyExtractor={(item) => item._id}
  style={styles.messageList}
  inverted={false} 
  onContentSizeChange={() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }}
/>


          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={messageInput}
              onChangeText={setMessageInput}
              placeholder="Type a message..."
              placeholderTextColor="#888" />
            <TouchableOpacity onPress={onSend} style={styles.sendButton}>
              <MaterialCommunityIcons name="send-circle" size={36} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>
    </KeyboardAvoidingView></>
  );
};

export default GroupChat;

const styles = StyleSheet.create({
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
  },
  messageLeft: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
  },
  messageRight: {
    backgroundColor: '#25D366',
    alignSelf: 'flex-end',
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1e1e1e',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2b2b2b',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#444444',
    color: '#fff',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  messageBubble: {
    borderRadius: 15,
    padding: 10,
    maxWidth: '100%',
  },
  usernameText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 3,
  },
  systemMessageText: {
    fontSize: 10,
  fontStyle: 'italic',
    color: '#888',  
    marginTop: 10,
    textTransform: 'lowercase',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 200,              
    position: 'absolute',    
    top: "8%",                
    right: 6,               
    shadowColor: '#000',    
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25,     
    shadowRadius: 4,         
    zIndex: 1000,      
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    fontSize: 16,
    marginVertical: 10,
    color: '#007BFF',
  },
  modalCloseButton: {
    fontSize: 16,
    marginTop: 20,
    color: 'red',
  },
});
