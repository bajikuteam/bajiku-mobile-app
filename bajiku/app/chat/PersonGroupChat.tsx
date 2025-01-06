// import React, { useState, useEffect, useCallback, } from 'react';
// import { View,StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
// import { Bubble, GiftedChat, Send, IMessage, } from 'react-native-gifted-chat';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import {useIsFocused } from '@react-navigation/native';
// import io from 'socket.io-client';
// import { useUser } from '@/utils/useContext/UserContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamListComponent } from '@/services/core/types';
// import { router, useLocalSearchParams } from 'expo-router';
// import * as NavigationBar from 'expo-navigation-bar';
// import CustomHeader from '@/components/CustomHeader';
// const socket = io('https://backend-server-quhu.onrender.com');


// interface ChatScreenRouteParams {
//   roomId: string;
//   groupName: string;
//   groupImgUrl: string;
//   room: string;
//   profileImageUrl: string;
//   senderId: string;
//   senderName: string;
//   name: string;
//   username: string;
//   description: string;
// }
// type NavigationProp = StackNavigationProp<RootStackParamListComponent>;

// // const PersonGroupChatScreen: React.FC = () => {
//   const PersonGroupChatScreen = () => {
//     const params = useLocalSearchParams();
//     const {senderId, senderName, groupImgUrl, room, name, roomId } = params;

//   const [messages, setMessages] = useState<any[]>([]);
  // const [isModalVisible, setModalVisible] = useState(false);

//   const { user } = useUser();
  // const toggleModal = () => {
  //   setModalVisible(!isModalVisible);
  // };
 
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

//   // Fetch chat history
//   useEffect(() => {   
//     const fetchChatHistory = async () => {
//       try {
//         const userId = user?.id || await AsyncStorage.getItem('userId');
//         const response = await fetch(`https://backend-server-quhu.onrender.com/personal-group-chat/all/${name}`);
//         const data = await response.json();

//         const formattedMessages = data.map((msg: any) => ({
//           _id: msg._id,
//           text: msg.text,
//           createdAt: new Date(msg.createdAt).toISOString(),
//           user: {
//             _id: msg.senderId,
//             name: msg.senderName,
//           },
//         }));

//         setMessages(formattedMessages);
//       } catch (error) {
//         // console.error('Error fetching chat history:', error);
//       }
//     };

//     fetchChatHistory();
//   }, [room]);

//   useEffect(() => {
//     // Add a listener for the 'sendMessage' event
//     socket.on('personalGroupChat', (newMessage) => {
//       try {
//         const formattedMessage = {
//           ...newMessage,
//           createdAt: new Date(newMessage.createdAt).toISOString(),
//           user: {
//             _id: newMessage.senderId,
//             name: newMessage.senderName,
//           },
//         };
  
//         setMessages((prevMessages) => GiftedChat.append(prevMessages, [formattedMessage]));
//       } catch (error) {
//         // console.error('Error processing received message:', error);
//       }
//     });
  
//     // Cleanup socket listeners
//     return () => {
//       socket.off('personalGroupChat');
//     };
//   }, [room, senderId, senderName]);


//   // Handle socket events
//   useEffect(() => {
  

//    socket.on('receiveMessageFrompersonalGroupChat', (message) => {
//   setMessages((prevMessages) => {
//     const messageExists = prevMessages.some((msg) => msg._id === message._id);
//     if (!messageExists) {
//       return GiftedChat.append(prevMessages, [{
//         ...message,
//         user: {
//           _id: message.senderId,
//           name: message.senderName,
//         },
//       }]);
//     }
//     return prevMessages;
//   });
// });


//     return () => {
//       // socket.emit('leaveRoom', { room: name });
//       // socket.off('userJoined');
//       // socket.off('userLeft');
//       socket.off('receiveMessageFrompersonalGroupChat');
//     };
//   }, [name, senderId, senderName]);

//   // Send message handler
//   const onSend = useCallback((messages: IMessage[] = []) => {
//     const messageToSend = messages[0];
//     const newMessage = {
//       _id: messageToSend._id,
//       text: messageToSend.text || '',
//       createdAt: new Date().getTime(),
//       room: name,
//       senderId,
//       senderName,
//       user: {
//         _id: senderId,
//         name: senderName,
//       },
//     };
//     socket.emit('personalGroupChat', newMessage);
//     setMessages((prevMessages) => GiftedChat.append(prevMessages, [newMessage]));
//   }, [room, senderId, senderName]);


//   const renderAdminButton = () => (
//     <TouchableOpacity onPress={toggleModal} style={styles.adminButton}>
//       <MaterialCommunityIcons name="dots-vertical" size={24} color="#fff" />
//     </TouchableOpacity>
//   );

  // const renderModal = () => (
  //   <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
      // <View style={styles.modalContent}>
      // <TouchableOpacity>
      //     <Text style={styles.modalButton}>Group Info</Text>
      //   </TouchableOpacity>
      //   <TouchableOpacity>
      //     <Text style={styles.modalButton}>Group Members</Text>
      //   </TouchableOpacity>
      //   <TouchableOpacity onPress={() => navigations.navigate('AddPersonGroupChatMember', { roomId:roomId,  })}>
      //     <Text style={styles.modalButton}>Add Member</Text>
      //   </TouchableOpacity>
      //   <TouchableOpacity onPress={() => handleRemoveUser("user_to_remove")}>
      //     <Text style={styles.modalButton}>Remove User</Text>
      //   </TouchableOpacity>
      //   <TouchableOpacity>
      //     <Text style={styles.modalButton}>Exit Group</Text>
      //   </TouchableOpacity>
      //   <TouchableOpacity>
      //     <Text style={styles.modalButton}>Delete Group </Text>
      //   </TouchableOpacity>
      //   <TouchableOpacity onPress={toggleModal}>
      //     <Text style={styles.modalCloseButton}>Close</Text>
      //   </TouchableOpacity>
      // </View>
  //   </Modal>
  // );

//   const handleAddUser = (username: string) => {
//     console.log(`Adding user: ${username}`);
//     toggleModal();
//   };

//   const handleRemoveUser = (username: string) => {
//     console.log(`Removing user: ${username}`);
//     toggleModal();
//   };


//   // Render custom send button
//   const renderSend = (props: any) => (
//     <Send {...props}>
//       <View style={styles.sendButton}>
//         <MaterialCommunityIcons
//           name="send-circle"
//           size={36}
//           color="#25D366"
//         />
//       </View>
//     </Send>
//   );


//   // Render chat bubbles with different background colors per user
//   const renderBubble = (props: any) => {
//     // const userColor = userColors[props.currentMessage.user._id] || generateRandomColor();
    
  
//     return (
//       <View>
//         {/* Display sender's name above the message from props.currentMessage.senderName */}
//         {/* <Text style={[styles.senderName]}>
//           {props.currentMessage.senderName}
//         </Text> */}
//         <Bubble
//           {...props}
//           wrapperStyle={{
//             left: {
//               backgroundColor: '#E1FFC7',
//               borderRadius: 15,
//               margin: 5,
//             },
//             right: {
//               backgroundColor: '#004C8B',
//               borderRadius: 15,
//               margin: 5,
//             },
//           }}
//         />
        
//       </View>
//     );
//   };
//   return (
//     <View style={{ flex: 1, backgroundColor: '#1c1c1e' }}>
//       <StatusBar barStyle="light-content" backgroundColor="#000000" />
//       <CustomHeader 
//   title={name as string} 
//   onBackPress={goBack} 
//   image={groupImgUrl as string}
 
// />

//     <GiftedChat
//         messages={messages}
//         onSend={(messages) => onSend(messages)}
//         user={{ _id: senderId as string, name: senderName as string }}
//         renderBubble={renderBubble}
//         alwaysShowSend
//         renderSend={renderSend}
//         scrollToBottom
//         scrollToBottomComponent={() => (
//           <FontAwesome name="angle-double-down" size={22} color="#333" />
//         )}
//         renderUsernameOnMessage={true}
//       />
      
//       </View>

//   );
// };

// export default PersonGroupChatScreen;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#E5DDD5',
//   },
  // headerTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#fff',
  // },
  // headerLeft: {
  //   flexDirection: 'row',
  //   alignItems: 'flex-start',
  // },
  // groupImage: {
  //   width: 36,
  //   height: 36,
  //   borderRadius: 12,
  //   marginRight: 10,
  // },
  // adminButton: {
  //   marginRight: 10,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // modalContent: {
  //   backgroundColor: 'white',
  //   padding: 20,
  //   borderRadius: 10,
  //   width: 200,              
  //   position: 'absolute',    
  //   top: "8%",                
  //   right: 6,               
  //   shadowColor: '#000',    
  //   shadowOffset: { width: 0, height: 2 }, 
  //   shadowOpacity: 0.25,     
  //   shadowRadius: 4,         
  //   zIndex: 1000,      
  // },
  
  // modalTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 20,
  // },
  // modalButton: {
  //   fontSize: 16,
  //   marginVertical: 10,
  //   color: '#007BFF',
  // },
  // modalCloseButton: {
  //   fontSize: 16,
  //   marginTop: 20,
  //   color: 'red',
  // },
  // sendButton: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 5,
  //   marginRight: 5,
  // },
  // senderName: {
  //   fontSize: 12,
  //   fontWeight: 'bold',
  //   marginLeft: 5,
  //   marginBottom: 3,
  // },
// });




import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, StatusBar, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, Modal, Alert, ActivityIndicator, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import io from 'socket.io-client';
import { useUser } from '@/utils/useContext/UserContext';
import CustomHeader from '@/components/CustomHeader';
import { router, useLocalSearchParams } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { formatCount, formatTime } from '@/services/core/globals';
import Button from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socket = io('https://backend-server-quhu.onrender.com');

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


interface GroupMember {
  id: string; 
  username: string; 
  profileImageUrl: string; 
}


const PersonGroupChatScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { senderId, senderName, groupImgUrl, room, name, description, roomId } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [userColors, setUserColors] = useState<{ [key: string]: string }>({});
  const { user } = useUser();
  const flatListRef = useRef<FlatList>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMembersModalVisible, setMembersModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLeaveModalVisible, setLeaveModalVisible] = useState(false);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [creator, setCreator] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
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


  // Handle socket events
  useEffect(() => {
    socket.emit('joinRoom', { room: name, userId: senderName });
  
    // Track joined users to avoid sending "userJoined" message multiple times
    let joinedUsers: Set<string> = new Set();
  
    socket.on('userJoined', ({ userId }) => {
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
  
        // const notificationMessage = {
        //   _id: `notif-${Date.now()}`,
        //   text: `@${userId} just joined`,
        //   createdAt: new Date(),
        //   system: true,
        //   user: { _id: 0 },
        // };
  
        // Add to messages state (ensure it's ordered correctly later)
        // setMessages((prevMessages) => [...prevMessages, notificationMessage as any]);
      }
    });
  
    socket.on('userLeft', ({ userId }) => {
      if (userId === senderId) {
        return;
      }
  
      // Show the leave message only if the user has already joined
      // if (joinedUsers.has(userId)) {
      //   const notificationMessage = {
      //     _id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      //     text: `@${userId} has left`,
      //     createdAt: new Date(),
      //     system: true,
      //     user: { _id: 0 },
      //   };
  
      //   setMessages((prevMessages) => [...prevMessages, notificationMessage as any]);
      //   // Remove user from joined list after they leave
      //   joinedUsers.delete(userId);
      // }
    });
  
    socket.on('receiveMessageFrompersonalGroupCha', (message) => {
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some((msg) => msg._id === message._id);
        if (!messageExists) {
          return [...prevMessages, { ...message, user: { _id: message.senderId, name: message.senderName } }];
        }
        return prevMessages;
      });
    });
  
    return () => {
      // socket.emit('leaveRoom', { room: name });
      // socket.off('userJoined');
      // socket.off('userLeft');
      socket.off('receiveMessageFrompersonalGroupCha');
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
      senderId,
      senderName,
      user: {
        _id: senderId,
        name: senderName,
      },
    };

    socket.emit('personalGroupChat', newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage as any]);
    setMessageInput('');
  }, [messageInput, senderId, senderName, name]);



  const toggleDeleteModal = () => {
    setDeleteModalVisible(!isDeleteModalVisible);
  };

  const handleDeleteGroup = async () => {
    try {
      // Replace with your delete endpoint
      const response = await fetch(`https://backend-server-quhu.onrender.com/personal-group-chat/${roomId}/delete/${user?.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Success', 'Group has been deleted successfully.');
        toggleDeleteModal();
        goBack(); // Navigate back after deletion
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to delete group.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the group.');
    }
  };



  const toggleLeaveModal = () => {
    setLeaveModalVisible(!isLeaveModalVisible);
  };
  const handleLeaveGroup = async () => {
    try {
      const response = await fetch(`https://backend-server-quhu.onrender.com/personal-group-chat/${roomId}/exit/${user?.id}`, {
        method: 'POST',
      });

      if (response.ok) {
        Alert.alert('Successfully exited the room');
        // toggleLeaveModal();
        goBack();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to delete group.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the group.');
    }
  };



  const toggleMembersModal = () => {
    setMembersModalVisible(!isMembersModalVisible);
    
  };


  const fetchGroupMembers = async () => {
    try {
      setLoadingMembers(true);
  
      const response = await fetch(
        `https://backend-server-quhu.onrender.com/personal-group-chat/${roomId}/members`
      );
      const data = await response.json();
      if (response.ok) {
        setGroupMembers(data.members || []);
        
        // Assume the first member is the creator
        if (data.members && data.members.length > 0) {
          setCreator(data.members[0].username || 'Unknown');
        } else {
          setCreator('Unknown');
        }
  
        setCreatedAt(data.members[0].roomCreatedAt || 'Unknown');
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch group members.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching group members.');
    } finally {
      setLoadingMembers(false);
    }
  };
  

  useEffect(() => {
    if (isMembersModalVisible) {
      fetchGroupMembers();
    }
  }, [isMembersModalVisible]);





  const handlePress = async (
    userId: string, 
    username: string, 
    profileImageUrl: string,
  ) => {
    // Get the logged-in user's ID
    const loggedInUserId = user?.id || await AsyncStorage.getItem('userId');
  
    if (loggedInUserId === userId) {
      // Navigate to the logged-in user's profile
      router.push({
        pathname: '/profile/Profile',
        params: {
          userId: loggedInUserId,
          username: username,
          profileImageUrl: profileImageUrl,
      
        },
      });
    } else {
      // Navigate to the user details page
      router.push({
        pathname: '/userDetails/UserDetails',
        params: {
          searchUserId: userId,
          username: username,
    
          profileImageUrl: profileImageUrl,
      
        },
      });
    }
  };

;

  const renderModal = () => (
    <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={toggleModal}>
        <View style={styles.modalContent}>
        <TouchableOpacity   onPress={() => {
        
          toggleMembersModal();
          
        }}>
          <Text style={styles.modalButton}>Group Info</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <Text style={styles.modalButton}>Edit Group</Text>
        </TouchableOpacity> */}
        <TouchableOpacity 
          onPress={() => {
            router.push({pathname:'/chat/AddPersonGroupChatMember', params:{
              roomId: roomId, 
              groupImgUrl: groupImgUrl,
              name:name
          
            }});
        }}
         >
          <Text style={styles.modalButton}>Add Member</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <Text style={styles.modalButton}>Remove User</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.modalButton}>Exit Group</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleLeaveModal}>
          <Text style={styles.modalButton}>Leave Group</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleDeleteModal}>
          <Text style={styles.modalButton}>Delete Group </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleModal}>
          <Text style={styles.modalCloseButton}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );



  const renderMembersModal = () => (
    <Modal visible={isMembersModalVisible} transparent={true} animationType="fade" onRequestClose={toggleMembersModal}>
      <View style={styles.modalOverlay}>
        
      <View style={{  height: '75%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 5,
    zIndex: 1000,}}>
            <View style={styles.modalHeader}>
  <TouchableOpacity 
    style={styles.closeButton} 
    onPress={toggleMembersModal}>
    <Text style={styles.closeButtonText}>X</Text>
  </TouchableOpacity>
</View>
         <Text  style={{ color: '#000', fontSize: 18, textAlign: 'center', marginTop:5, fontWeight:"bold"}}>Group Info</Text>

         
         <View
  style={{
    justifyContent: 'center', 
    alignItems: 'center', 
  }}
>
  <Image
    source={{ uri: groupImgUrl as string }}
    style={{
      width: 100,
      height: 100,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#000',
      marginTop:10
    }}
  />
           <Text style={{ color: '#000', fontSize: 18, textAlign: 'center', marginTop:7, fontWeight:"bold" }}>Group Name: {name}</Text>
           <Text style={{ color: '#000', fontSize: 18, textAlign: 'center',marginTop:5,fontWeight:"bold" }}>Created at: {formatTime(createdAt)}</Text>
           {/* <Text style={{ color: '#000', fontSize: 18, textAlign: 'center' }}>Description: {description}</Text> */}
           <Text style={{ color: '#000', fontSize: 18, textAlign: 'center',marginTop:5, textTransform:"lowercase", fontWeight:"bold" }}>Created by: @{creator}</Text>
        
         </View>
    
          {loadingMembers ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <><Text style={{ color: '#000', fontSize: 18, textAlign: 'center',marginTop:5,fontWeight:"bold" }}>Group members: {formatCount(groupMembers.length)} </Text><FlatList
                data={groupMembers}
                keyExtractor={(item, index) => item.username + index}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handlePress(item.id, item.username, item.profileImageUrl,  
                   )}>
                  <View style={styles.memberItem}>
                    <Image
                      source={{ uri: item.profileImageUrl }}
                      style={styles.profileImage} />
                    <Text style={styles.memberName}>@{item.username}</Text>

                  </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No members in this group.</Text>} /></>
          
          )}
        </View>
      </View>
    </Modal>
  );

  

  const renderDeleteModal = () => (
    <Modal visible={isDeleteModalVisible} transparent={true} animationType="fade" onRequestClose={toggleDeleteModal}>
      <View style={{    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
}}>
        <View style={styles.confirmationBox}>
          <Text style={styles.confirmationText}>Are you sure you want to delete this group?</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button text="Cancel" onClick={toggleDeleteModal} variant='secondary'  style={{ width: 90, height: 40, marginTop: 10 }} />
              <Button text="Continue" onClick={handleDeleteGroup} variant='primary'  style={{ width: 90, height: 40, marginTop: 10 }} />
            </View>
        </View>
      </View>
    </Modal>
  );

  const renderLeaveModal = () => (
    <Modal visible={isLeaveModalVisible} transparent={true} animationType="fade" onRequestClose={toggleLeaveModal}>
      <View style={{    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
}}>
        <View style={styles.confirmationBox}>
          <Text style={styles.confirmationText}>Are you sure you want to Leave this group?</Text>
       
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button text="Cancel" onClick={toggleLeaveModal} variant='secondary'  style={{ width: 90, height: 40, marginTop: 10 }} />
              <Button text="Continue" onClick={handleLeaveGroup} variant='primary'  style={{ width: 90, height: 40, marginTop: 10 }} />
            </View>
        </View>
      </View>
    </Modal>
  );
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
              ~@{item.user.name}
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
  


  return (
    <>
       <CustomHeader
      title={name as string} onBackPress={goBack} image={groupImgUrl as string} subtitle={ description as string} 
        onMorePress={toggleModal} 
      />
      {renderModal()}
      {renderDeleteModal()}
      {renderMembersModal()}
      {renderLeaveModal()}
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

export default PersonGroupChatScreen;

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


  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmationBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  confirmationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },




  membersModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '70%',
  },
  memberItem: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    gap:8
  },
  memberName: {
    fontSize: 16,
    marginTop: 10,
    textTransform:"lowercase", fontWeight:"bold"
  },
  memberRole: {
    fontSize: 14,
    color: '#888',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
  closeButton: {
    marginTop: 20,
    // backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
},
modalHeader: {
  flexDirection: 'row', 
  justifyContent: 'flex-end', 
  paddingHorizontal: 15,
  paddingVertical: 10, 
},
});
