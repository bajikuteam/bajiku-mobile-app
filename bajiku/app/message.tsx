import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Text, Image, TextInput, KeyboardAvoidingView, Platform, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { Bubble, GiftedChat, Send, IMessage } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { useChat } from '@/utils/useContext/ChatContext';
import { useTheme } from '@/utils/useContext/ThemeContext';
import { useNotification } from '@/utils/useContext/NotificationContext'; 
import { RootStackParamList, RootStackParamListsChatList } from '@/services/core/types';
import { StackNavigationProp } from '@react-navigation/stack';

// Adjust the socket URL according to your setup
const socket = io('https://backend-server-quhu.onrender.com');
// const socket = io('http://192.168.1.107:5000');

interface ChatScreenRouteParams {
  room: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  username: string;
  profileImageUrl: string;
}

const ChatScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: ChatScreenRouteParams }, 'params'>>();
  const { profileImageUrl, username, senderId, receiverId, senderName } = route.params || {};
  const { addMessage, sendNotificationToServer  } = useChat();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const { theme } = useTheme();
  const { expoPushToken } = useNotification();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);  
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className='lowercase text-white' style={styles.headerTitle}>@{username}</Text>
      ),
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: profileImageUrl }} 
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              marginRight: 10,
            }}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: '#075E54',
      },
      headerTintColor: '#fff',
    });
  }, [navigation, username, profileImageUrl]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://backend-server-quhu.onrender.com/chat/messages/${senderId}/${receiverId}`);
        // const response = await axios.get(`http://192.168.1.107:5000/chat/messages/${senderId}/${receiverId}`);
        const fetchedMessages = response.data.map((message: Record<string, any>) => ({
          _id: message._id || `${message.senderId}-${Date.now()}`,
          text: message.text || '',
          createdAt: message.createdAt ? new Date(message.createdAt).toISOString() : new Date().toISOString(),
          user: {
            _id: message.senderId || 'unknown',
            name: message.senderName || 'Unknown User',
          },
        }));
        setMessages(fetchedMessages.sort((a: IMessage, b: IMessage) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        // console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [senderId, receiverId]);

  const onSend = useCallback((messages: any[] = []) => {
    const messageToSend = messages[0];
    const newMessage = {
      _id: messageToSend._id,
      text: messageToSend.text,
      senderId: senderId,
      receiverId: receiverId,
      senderName: senderName,
      createdAt: new Date().toISOString(),
      user: {
        _id: senderId,
        name: senderName,
      },
      username: username, 
      profileImageUrl: profileImageUrl,
    };

    socket.emit('sendMessage', newMessage);
    addMessage(newMessage);
  }, [senderId, receiverId, senderName]);

  

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      const receivedMessage = {
        ...message,
        createdAt: new Date(message.createdAt).toISOString(),
        user: {
          _id: message.senderId,
          name: message.senderName,
        },
      };
  
      setMessages((prevMessages) => GiftedChat.append(prevMessages, [receivedMessage]));
  
      // Prepare notification data
      const notificationData = {
        to: expoPushToken,
        title: `New message from ${message.senderName}`,
        body: message.text,
        senderId: message.senderId,
        receiverId: message.receiverId,
        profileImageUrl: profileImageUrl,
        username: senderName,
        senderName: message.senderName,
      };
  
      // Send push notification
      if (expoPushToken) {
        sendNotificationToServer(notificationData);
      }
    });
  
    return () => {
      socket.off('receiveMessage');
    };
  }, [expoPushToken, sendNotificationToServer]);



  
  // const renderSend = (props: any) => {
  //   return (
  //     <Send {...props}>
  //       <View style={styles.sendContainer}>
  //         <MaterialCommunityIcons
  //           name="send-circle"
  //           style={styles.sendIcon}
  //           size={32}
  //           color="#25D366"
  //         />
  //       </View>
  //     </Send>
  //   );
  // };

  const renderSend = (props: any) => (
    <Send {...props}>
      <View style={styles.sendContainer}>
        <MaterialCommunityIcons name="send-circle" style={styles.sendIcon} size={32} color="#25D366" />
      </View>
    </Send>
  );

  const renderInputToolbar = (props: any) => {
    return (
      <View style={styles.inputToolbar}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={messageInput}
          onChangeText={setMessageInput}
          onSubmitEditing={() => {
            if (messageInput.trim()) {
              onSend([{ text: messageInput, _id: Date.now() }]);
              setMessageInput(''); 
            }
          }}
          returnKeyType="send"
        />
        {renderSend(props)}
      </View>
    );
  };

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#E1FFC7',
            borderRadius: 15,
            margin: 5,
          },
          right: {
            backgroundColor: '#004C8B',
            borderRadius: 15,
            margin: 5,
          },
        }}
        textStyle={{
          left: {
            color: '#000',
          },
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />
        <GiftedChat
          messages={messages || []}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: senderId,
          }}
          renderBubble={renderBubble}
          alwaysShowSend
          renderSend={renderSend}
          scrollToBottom
          scrollToBottomComponent={scrollToBottomComponent}
          onInputTextChanged={setMessageInput}
          text={messageInput}
          renderInputToolbar={renderInputToolbar}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,

  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginRight: 10,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ChatScreen;
