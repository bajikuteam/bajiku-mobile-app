import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, StatusBar, TextInput, SafeAreaView } from 'react-native';
import { Bubble, GiftedChat, Send, IMessage, InputToolbar } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { useUser } from '@/utils/useContext/UserContext';

// Initialize socket connection
const socket = io('https://backend-server-quhu.onrender.com');
// const socket = io('http://192.168.1.107:5000');
// 

interface ChatScreenRouteParams {
  _id: string;
  groupName: string;
  groupImgUrl: string;
  room: string;
  profileImageUrl: string;
  senderId: string;
  senderName: string;
  name: string;
  username: string;
  description: string;
}

const GroupChat: React.FC = () => {
  const route = useRoute<RouteProp<{ params: ChatScreenRouteParams }, 'params'>>();

  const { senderId, senderName, groupImgUrl, room, name, description } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [userColors, setUserColors] = useState<{ [key: string]: string }>({});
  const navigation = useNavigation();
  const { user } = useUser();

  // Helper function to generate a random color
  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  // Set header with group info
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
        <Text className='capitalize' style={styles.headerTitle}>{name}</Text>
        {/* <Text className='capitalize' style={[styles.headerDescription, { flexWrap: 'wrap' }]}>{description}</Text> */}
      </View>
      ),
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: groupImgUrl }}
            style={styles.groupImage}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: '#075E54',
      },
    });
  }, [navigation, groupImgUrl, name, description]);

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {  
      try {
        // const response = await fetch(`http://192.168.1.107:5000/chat/history/${name}`);
        const response = await fetch(`https://backend-server-quhu.onrender.com/chat/history/${name}`);
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

        setMessages(formattedMessages);
      } catch (error) {
        // console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [room]);

  // Handle socket events
  useEffect(() => {
    socket.emit('joinRoom', { room: name, userId: senderName });

    socket.on('userJoined', ({ userId }) => {
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

      setMessages((prevMessages) => GiftedChat.append(prevMessages, [notificationMessage]));
    });

    socket.on('userLeft', ({ userId }) => {
      const notificationMessage = {
        _id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        text: `@${userId} has left`,
        createdAt: new Date(),
        system: true,
        user: { _id: 0 },
      };

      setMessages((prevMessages) => GiftedChat.append(prevMessages, [notificationMessage]));
    });

   socket.on('receiveMessage', (message) => {
  setMessages((prevMessages) => {
    const messageExists = prevMessages.some((msg) => msg._id === message._id);
    if (!messageExists) {
      return GiftedChat.append(prevMessages, [{
        ...message,
        user: {
          _id: message.senderId,
          name: message.senderName,
        },
      }]);
    }
    return prevMessages;
  });
});


    return () => {
      socket.emit('leaveRoom', { room: name });
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('receiveMessage');
    };
  }, [name, senderId, senderName]);

  // Send message handler
  const onSend = useCallback((messages: IMessage[] = []) => {
    const messageToSend = messages[0];
    const newMessage = {
      _id: messageToSend._id,
      text: messageToSend.text || '',
      createdAt: new Date().getTime(),
      room: name,
      senderId,
      senderName,
      user: {
        _id: senderId,
        name: senderName,
      },
    };

    socket.emit('sendMessage', newMessage);
    setMessages((prevMessages) => GiftedChat.append(prevMessages, [newMessage]));
  }, [room, senderId, senderName]);

  // Render custom send button
  const renderSend = (props: any) => (
    <Send {...props}>
      <View style={styles.sendButton}>
        <MaterialCommunityIcons
          name="send-circle"
          size={36}
          color="#25D366"
        />
      </View>
    </Send>
  );


  // Render chat bubbles with different background colors per user
  const renderBubble = (props: any) => {
    // const userColor = userColors[props.currentMessage.user._id] || generateRandomColor();
    
    return (
      <View>
        {/* Display sender's name above the message from props.currentMessage.senderName */}
        {/* <Text>
          {props.currentMessage.senderName}
        </Text> */}
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
        />
        
      </View>
    );
  };
  

  return (

    // <SafeAreaView style={{ flex: 1 }}>
    // <KeyboardAvoidingView
    //   style={{ flex: 1 }}
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   keyboardVerticalOffset={0}
    // >
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />
    <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: senderId, name: senderName}}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={() => (
          <FontAwesome name="angle-double-down" size={22} color="#333" />
        )}
        renderUsernameOnMessage={true}
      />
      
      </View>
    // </KeyboardAvoidingView>
    // </SafeAreaView>
  );
};

export default GroupChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5DDD5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerDescription: {
    fontSize: 10,
    color: '#128C7E',
    maxWidth: '100%', 
    overflow: 'hidden', 
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: "flex-start"

  },
  groupImage: {
    width: 36,
    height: 36,
    borderRadius: 12,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 5,
  },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
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
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: 3,
  },
});
