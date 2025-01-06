// import React, { useState, useEffect, useCallback, } from 'react';
// import { View, StyleSheet, TextInput, StatusBar} from 'react-native';
// import { Bubble, GiftedChat, Send, IMessage } from 'react-native-gifted-chat';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import axios from 'axios';
// import { useIsFocused } from '@react-navigation/native';
// import io from 'socket.io-client';
// import { useChat } from '@/utils/useContext/ChatContext';

// import { router, useLocalSearchParams } from 'expo-router';
// import CustomHeader from '@/components/CustomHeader';
// import * as NavigationBar from 'expo-navigation-bar';

// // Adjust the socket URL according to your setup
// const socket = io('https://my-social-media-bd.onrender.com');


// interface ChatScreenRouteParams {
//   room: string;
//   senderId: string;
//   receiverId: string;
//   senderName: string;
//   username: string;
//   profileImageUrl: string;
// }

// const ChatScreen: React.FC = () => {

//   const params = useLocalSearchParams();
//   const { profileImageUrl, username, senderId, receiverId, senderName } = params;
 
//   // const { addMessage, sendNotificationToServer  } = useChat();
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [messageInput, setMessageInput] = useState<string>('');

//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     setIsReady(true);  
//   }, []);


//   const isFocused = useIsFocused();

//   useEffect(() => {
//     if (isFocused) {
//       // Hide the navigation bar when focused
//       NavigationBar.setVisibilityAsync("hidden"); 
//     } else {
//       // Optionally show the navigation bar when not focused
//       NavigationBar.setVisibilityAsync("visible"); 
//     }
//   }, [isFocused]);

//   const goBack = () => {
//     router.back();
//   };


  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await axios.get(`https://my-social-media-bd.onrender.com/chat/messages/${senderId}/${receiverId}`);
      
  //       const fetchedMessages = response.data.map((message: Record<string, any>) => ({
  //         _id: message._id || `${message.senderId}-${Date.now()}`,
  //         text: message.text || '',
  //         createdAt: message.createdAt ? new Date(message.createdAt).toISOString() : new Date().toISOString(),
  //         user: {
  //           _id: message.senderId || 'unknown',
  //           name: message.senderName || 'Unknown User',
  //         },
  //       }));
  //       setMessages(fetchedMessages.sort((a: IMessage, b: IMessage) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  //     } catch (error) {
  //       // console.error("Error fetching messages:", error);
  //     }
  //   };

  //   fetchMessages();
  // }, [senderId, receiverId]);

//   const onSend = useCallback((messages: any[] = []) => {
//     const messageToSend = messages[0];
//     const newMessage = {
//       _id: messageToSend._id as string,
//       text: messageToSend.text as string,
//       senderId: senderId as string,
//       receiverId: receiverId as string,
//       senderName: senderName as string,
//       createdAt: new Date().toISOString()  as string,
//       user: {
//         _id: senderId,
//         name: senderName,
//       },
//       username: username, 
//       profileImageUrl: profileImageUrl,
//     };

//     socket.emit('sendMessage', newMessage);
//   }, [senderId, receiverId, senderName]);

  

//   useEffect(() => {
    // socket.on('receiveMessage', (message) => {
    //   const receivedMessage = {
    //     ...message,
    //     createdAt: new Date(message.createdAt).toISOString(),
    //     user: {
    //       _id: message.senderId,
    //       name: message.senderName,
    //     },
    //   };
  
//       setMessages((prevMessages) => GiftedChat.append(prevMessages, [receivedMessage]));
  
//     });
  
//     return () => {
//       socket.off('receiveMessage');
//     };
//   }, []);




//   const renderSend = (props: any) => (
//     <Send {...props}>
//       <View style={styles.sendContainer}>
//         <MaterialCommunityIcons name="send-circle" style={styles.sendIcon} size={32} color="#25D366" />
//       </View>
//     </Send>
//   );

//   const renderInputToolbar = (props: any) => {
//     return (
//       <View style={styles.inputToolbar}>
//         <TextInput
//           style={styles.textInput}
//           placeholder="Type a message..."
//           value={messageInput}
//           onChangeText={setMessageInput}
//           onSubmitEditing={() => {
//             if (messageInput.trim()) {
//               onSend([{ text: messageInput, _id: Date.now() }]);
//               setMessageInput(''); 
//             }
//           }}
//           returnKeyType="send"
//         />
//         {renderSend(props)}
//       </View>
//     );
//   };

//   const renderBubble = (props: any) => {
//     return (
//       <Bubble
//         {...props}
//         wrapperStyle={{
//           left: {
//             backgroundColor: '#E1FFC7',
//             borderRadius: 15,
//             margin: 5,
//           },
//           right: {
//             backgroundColor: '#004C8B',
//             borderRadius: 15,
//             margin: 5,
//           },
//         }}
//         textStyle={{
//           left: {
//             color: '#000',
//           },
//           right: {
//             color: '#fff',
//           },
//         }}
//       />
//     );
//   };

//   const scrollToBottomComponent = () => {
//     return <FontAwesome name="angle-double-down" size={22} color="#333" />;
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: '#1c1c1e' }}>
//       <StatusBar barStyle="light-content" backgroundColor="#000000" />
//       <CustomHeader 
//   title={username as string} 
//   onBackPress={goBack} 
//   image={profileImageUrl as string}
// />
//         <GiftedChat
//           messages={messages || []}
//           onSend={(messages) => onSend(messages)}
//           user={{
//             _id: senderId as string,
//           }}
//           renderBubble={renderBubble}
//           alwaysShowSend
//           renderSend={renderSend}
//           scrollToBottom
//           scrollToBottomComponent={scrollToBottomComponent}
//           onInputTextChanged={setMessageInput}
//           text={messageInput}
//           renderInputToolbar={renderInputToolbar}
//         />
//       </View>
//   );
// };

// const styles = StyleSheet.create({
//   inputToolbar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 5,

//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   textInput: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 25,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderWidth: 1,
//     borderColor: '#CCCCCC',
//     marginRight: 10,
//   },
//   sendContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sendIcon: {
//     marginBottom: 5,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
// });

// export default ChatScreen;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import io from 'socket.io-client';
import CustomHeader from '@/components/CustomHeader';
import * as NavigationBar from 'expo-navigation-bar';
import axios from 'axios';
import { formatTime } from '@/services/core/globals';
import { useUser } from '@/utils/useContext/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

let socket: any;

interface IMessage {
  _id: string;
  text: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  user: {
    _id: string;
    name: string;
  };
  isSystem?: boolean;
}

const ChatScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { profileImageUrl, username, senderId, receiverId, senderName } = params;
  const { user } = useUser();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const isFocused = useIsFocused();
  
  // Hide/Show the navigation bar when focused
  useEffect(() => {
    if (isFocused) {
      NavigationBar.setVisibilityAsync('hidden');
    } else {
      NavigationBar.setVisibilityAsync('visible');
    }
  }, [isFocused]);

  const goBack = () => {
    router.back();
  };

  // Fetch messages from the server
  const fetchMessages = async () => {
    const userId = await AsyncStorage.getItem('userId') || user?.id;
    try {
      const response = await axios.get(
        `https://my-social-media-bd.onrender.com/chat/messages/${userId}/${receiverId}`
      );
      const fetchedMessages = response.data.map((message: Record<string, any>) => ({
        _id: message._id || `${message.senderId}-${Date.now()}`,
        text: message.text || '',
        createdAt: message.createdAt ? new Date(message.createdAt).toISOString() : new Date().toISOString(),
        user: {
          _id: message.senderId || 'unknown',
          name: message.senderName || 'Unknown User',
        },
      }));

      // Filter out system messages and handle date change logic
      const messagesWithDates: IMessage[] = [];
      let lastDate: string | null = null;

      fetchedMessages.forEach((message: IMessage) => {
        const messageDate = new Date(message.createdAt).toDateString();
        if (messageDate !== lastDate) {
          // Optional: you can add date separators here if needed, but for now, they are excluded
          lastDate = messageDate;
        }
        messagesWithDates.push(message);
      });

      // Filter out system messages (those with isSystem: true)
      const filteredMessages = messagesWithDates.filter((msg) => !msg.isSystem);

      setMessages(
        filteredMessages.sort(
          (a: IMessage, b: IMessage) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Fetch messages on focus
  useFocusEffect(
    useCallback(() => {
      fetchMessages();
    }, [senderId, receiverId])
  );

  // Send a new message
  const onSend = useCallback(
    (message: string) => {
      const newMessage = {
        _id: `${senderId}-${Date.now()}`,
        text: message,
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
      setMessages((prevMessages) => [...prevMessages, newMessage as any]);
      fetchMessages();
      setMessageInput('');
    },
    [senderId, receiverId, senderName]
  );

  // Initialize socket connection
  useEffect(() => {
    if (isFocused) {
      socket = io('https://my-social-media-bd.onrender.com', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 20000,
      });

      socket.on('receiveMessage', (message: any) => {
        const messageDate = new Date(message.createdAt).toDateString();
        const lastMessage = messages[messages.length - 1];
        const lastMessageDate = lastMessage ? new Date(lastMessage.createdAt).toDateString() : null;

        const newMessages = [...messages];
        // Only add the new message, and don't add date separators (system messages)
        newMessages.push(message);

        // Filter out system messages before updating the state
        const filteredMessages = newMessages.filter((msg) => !msg.isSystem);

        setMessages(filteredMessages);
      });

      return () => {
        socket.off('receiveMessage');
        socket.disconnect();
      };
    }
  }, [isFocused, messages]);

  const [userId, setUserId] = React.useState<string | null>(null);

  // Get userId from AsyncStorage or context
  React.useEffect(() => {
    const fetchUserId = async () => {
      const userId = user?.id || await AsyncStorage.getItem('userId') || senderId;
      setUserId(userId);
    };
    fetchUserId();
  }, [user?.id, senderId]);

  // Render individual chat message
  const renderItem = ({ item, index }: { item: IMessage; index: number }) => {
    // Skip rendering system messages (those with isSystem: true)
    if (item.isSystem) {
      return null;
    }

    const currentDate = new Date(item.createdAt).toDateString();
    const nextItem = messages[index + 1];
    const nextDate = nextItem ? new Date(nextItem.createdAt).toDateString() : null;

    const isSentByUser = String(item?.user?._id) === String(userId);

    return (
      <>
        {/* {currentDate !== nextDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>
        )} */}
        <View
          style={[
            styles.messageContainer,
            {
              alignSelf: isSentByUser ? 'flex-end' : 'flex-start',
            },
          ]}
        >
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
              {item?.text}
            </Text>
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
              {formatTime(item?.createdAt)}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <CustomHeader title={username as string} onBackPress={goBack} image={profileImageUrl as string} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#000000" />

          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
            inverted
            contentContainerStyle={styles.messagesContainer}
          />

          <View style={styles.inputToolbar}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={messageInput}
              onChangeText={setMessageInput}
              onSubmitEditing={() => {
                if (messageInput.trim()) {
                  onSend(messageInput);
                }
              }}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={() => onSend(messageInput)} style={styles.sendButton}>
              <MaterialCommunityIcons name="send-circle" size={32} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  messagesContainer: {
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageBubble: {
    borderRadius: 15,
    padding: 10,
    maxWidth: '100%',
  },
  messageText: {
    fontSize: 16,
  },
  usernameText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 3,
  },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  sendButton: {
    marginLeft: 10,
  },
  dateContainer: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default ChatScreen;
