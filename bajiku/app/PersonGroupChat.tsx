import React, { useState, useEffect, useCallback, useLayoutEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, StatusBar, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Bubble, GiftedChat, Send, IMessage, InputToolbar } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import io from 'socket.io-client';
import { useUser } from '@/utils/useContext/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamListComponent } from '@/services/core/types';
import { router, useLocalSearchParams } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { NavigationContext } from "@react-navigation/native";
import CustomHeader from '@/components/CustomHeader';
const socket = io('https://backend-server-quhu.onrender.com');


interface ChatScreenRouteParams {
  roomId: string;
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
type NavigationProp = StackNavigationProp<RootStackParamListComponent>;

// const PersonGroupChatScreen: React.FC = () => {
  const PersonGroupChatScreen = () => {
    const params = useLocalSearchParams();
    const {senderId, senderName, groupImgUrl, room, name, roomId } = params;

  const [messages, setMessages] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const { user } = useUser();
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
 
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // Hide the navigation bar when focused
      NavigationBar.setVisibilityAsync("hidden"); 
    } else {
      // Optionally show the navigation bar when not focused
      NavigationBar.setVisibilityAsync("visible"); 
    }
  }, [isFocused]);


  const goBack = () => {
    router.back();
  };

  // Fetch chat history
  useEffect(() => {   
    const fetchChatHistory = async () => {
      try {
        const userId = user.id || await AsyncStorage.getItem('userId');
        // const response = await fetch(`http://192.168.1.107:5000/personal-group-chat/all/${name}`);
        const response = await fetch(`https://backend-server-quhu.onrender.com/personal-group-chat/all/${name}`);
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
  

   socket.on('receiveMessageFrompersonalGroupChat', (message) => {
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
      // socket.emit('leaveRoom', { room: name });
      // socket.off('userJoined');
      // socket.off('userLeft');
      socket.off('receiveMessageFrompersonalGroupChat');
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
    socket.emit('personalGroupChat', newMessage);
    setMessages((prevMessages) => GiftedChat.append(prevMessages, [newMessage]));
  }, [room, senderId, senderName]);


  const renderAdminButton = () => (
    <TouchableOpacity onPress={toggleModal} style={styles.adminButton}>
      <MaterialCommunityIcons name="dots-vertical" size={24} color="#fff" />
    </TouchableOpacity>
  );

  // const renderModal = () => (
  //   <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
  //     <View style={styles.modalContent}>
  //     <TouchableOpacity>
  //         <Text style={styles.modalButton}>Group Info</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity>
  //         <Text style={styles.modalButton}>Group Members</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity onPress={() => navigations.navigate('AddPersonGroupChatMember', { roomId:roomId,  })}>
  //         <Text style={styles.modalButton}>Add Member</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity onPress={() => handleRemoveUser("user_to_remove")}>
  //         <Text style={styles.modalButton}>Remove User</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity>
  //         <Text style={styles.modalButton}>Exit Group</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity>
  //         <Text style={styles.modalButton}>Delete Group </Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity onPress={toggleModal}>
  //         <Text style={styles.modalCloseButton}>Close</Text>
  //       </TouchableOpacity>
  //     </View>
  //   </Modal>
  // );

  const handleAddUser = (username: string) => {
    console.log(`Adding user: ${username}`);
    toggleModal();
  };

  const handleRemoveUser = (username: string) => {
    console.log(`Removing user: ${username}`);
    toggleModal();
  };


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
        {/* <Text style={[styles.senderName]}>
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
    <View style={{ flex: 1, backgroundColor: '#1c1c1e' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <CustomHeader 
  title={name as string} 
  onBackPress={goBack} 
  image={groupImgUrl as string}
 
/>

    <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: senderId as string, name: senderName as string }}
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

  );
};

export default PersonGroupChatScreen;


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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  groupImage: {
    width: 36,
    height: 36,
    borderRadius: 12,
    marginRight: 10,
  },
  adminButton: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 5,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: 3,
  },
});

