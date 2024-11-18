
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Text, StatusBar } from 'react-native';
import { Container, Card, UserInfo, UserImgWrapper, UserImg, UserInfoText, UserName, PostTime, MessageText, TextSection } from '@/styles/MessageStyles';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList, RootStackParamListsPersonGroupChat } from '@/services/core/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from '@/utils/useContext/UserContext';
import { formatTime } from '@/services/core/globals';
import io from 'socket.io-client';
import { useTheme } from '@/utils/useContext/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useChat } from '@/utils/useContext/ChatContext';
import { useNotification } from '@/utils/useContext/NotificationContext';
import RoundButton from '@/components/RoundButton';
import Button from '@/components/Button';
import SearchComponent from '@/components/Search';
interface ChatScreenRouteParams {
  room: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  lastMessageTime: string;
  lastMessage: string;
}


const ChatListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const navigations = useNavigation<StackNavigationProp<RootStackParamListsPersonGroupChat>>();
  const [viewMode, setViewMode] = useState<'contacts' | 'groups' | 'all'>('all');

  const { user } = useUser();
  const { sendNotificationToServer } = useChat();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { theme } = useTheme();
  const { expoPushToken } = useNotification();
  // const socket = io('http://192.168.1.107:5000');
  const socket = io('https://backend-server-quhu.onrender.com');

  const [initialized, setInitialized] = useState<boolean>(false);
  

  const fetchChatContacts = async () => {
    try {
      const userId = user.id || await AsyncStorage.getItem('userId');
      const response = await fetch(`https://backend-server-quhu.onrender.com/chat/message/contacts/${userId}`);
      const data = await response.json();
      return Array.isArray(data) ? data : []; 
    } catch (error) {
      // console.error("Error fetching chat contacts:", error);
      return [];
    }
  };

  const fetchUserGroups = async () => {
    try {
      const userId = user.id || await AsyncStorage.getItem('userId');
      const response = await fetch(`https://backend-server-quhu.onrender.com/personal-group-chat/user/${userId}/rooms`);
      const data = await response.json();
      // console.log('Fetched user groups:', data); 
      return Array.isArray(data) ? data : []; 
    } catch (error) {
      // console.error("Error fetching user groups:", error);
      return [];
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const contacts = await fetchChatContacts();
    const groups = await fetchUserGroups();

    const combinedData = [
      ...groups.map((group: any) => ({
        ...group,
        type: 'group',
        lastMessageTime: group.lastMessage?.createdAt || group.createdAt,
        unreadCount: group.unreadCount ||  0,
      })), 
      ...contacts.map((contact: any) => ({
        ...contact,
        type: 'contact',
        lastMessageTime: contact.lastMessageTime || contact.createdAt,
        lastMessage: contact.lastMessage || contact.lastMessage.text,
        unreadCount: contact.unreadCount || 0,
      }))
    ];

    combinedData.sort((a, b) => {
      const aTime = a.lastMessageTime || a.createdAt;
      const bTime = b.lastMessageTime || b.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    setData(combinedData);
    setLoading(false);
  };

  useEffect(() => {
    if (!initialized) {
      fetchData();
      setInitialized(true); 
    }


    const handleNewMessage = (message: any) => {
      const { senderId, text, createdAt, receiverId, room } = message;

      setData((prevData) => {
        const updatedData = prevData.map(item => {
          if (item.type === 'contact' && item.userInfo._id === senderId && receiverId) {
            return {
              ...item,
              lastMessage: text,
              lastMessageTime: createdAt,
              unreadCount: (item.unreadCount || 0) + 1,
            };
          }
          if (item.type === 'group' && item.name === room) {
            return {
              ...item,
              lastMessage: text,
              lastMessageTime: createdAt,
              unreadCount: receiverId === user.id ? (item.unreadCount || 0) + 1 : item.unreadCount,
            };
          }
          return item;
        });

        updatedData.sort((a, b) => {
          const aTime = a.lastMessageTime || a.createdAt;
          const bTime = b.lastMessageTime || b.createdAt;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });

        return updatedData;
      });
    };

    socket.on('receiveMessage', handleNewMessage);
    socket.on('receiveMessageFrompersonalGroupChat', handleNewMessage);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
      socket.off('receiveMessageFrompersonalGroupChat', handleNewMessage);
    };
  }, [expoPushToken, sendNotificationToServer]);

  const handleCardPress = (item:any) => {
    if (item.type === 'contact') {
      navigation.navigate('message', {
        username: item.userInfo.username,
        senderId: user.id,
        receiverId: item.userInfo._id,
        senderName: user.username,
        profileImageUrl: item.userInfo.profileImageUrl,
        lastMessage: item.lastMessage, 
        lastMessageTime: item.lastMessageTime,
      });
    } else if (item.type === 'group') {
      navigations.navigate('PersonGroupChat', {
        roomId: item._id,
        room: item.room,
        groupName: item.groupName,
        profileImageUrl: user.profileImage,
        username: user.username,
        groupImgUrl: item.groupImgUrl,
        groupDescription: item.groupDescription,
        groupCreationTime: item.groupCreationTime,
        senderId: user.id,
        senderName: user.username,
        name: item.name,
        description: item.description,
        lastMessage: item.lastMessage, 
        lastMessageTime: item.lastMessageTime, 
      });
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const contacts = await fetchChatContacts();
          const groups = await fetchUserGroups();
  
          const combinedData = [
            ...groups.map((group: any) => ({
              ...group,
              type: 'group',
              lastMessageTime: group.lastMessage?.createdAt || group.createdAt,
              unreadCount: group.unreadCount || 0,
            })),
            ...contacts.map((contact: any) => ({
              ...contact,
              type: 'contact',
              lastMessageTime: contact.lastMessageTime || contact.createdAt,
              lastMessage: contact.lastMessage || contact.lastMessage.text,
              unreadCount: contact.unreadCount || 0,
            }))
          ];
  
          // Sort combined data by last message time
          combinedData.sort((a, b) => {
            const aTime = a.lastMessageTime || a.createdAt;
            const bTime = b.lastMessageTime || b.createdAt;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          });
  
          setData(combinedData);
        } catch (error) {
          // console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, [])
  );
  
  
  const filteredData = data.filter(item => {
    if (viewMode === 'contacts') {
      return item.type === 'contact';
    } else if (viewMode === 'groups') {
      return item.type === 'group';
    }
    return true; // 'all' mode
  });
  
  
  const toggleViewMode = (mode: 'contacts' | 'groups' | 'all') => {
    setViewMode(mode);
  };
  
  const renderToggleButtons = () => (
    <View style={styles.toggleContainer}>
    <Button text='All'className='w-20'  onClick={() => setViewMode('all')} variant='third'/>
    <Button text='Contacts'className='w-20 '   onClick={() => setViewMode('contacts')} variant='third'/>
    <Button text='Groups' className='w-20' onClick={() => setViewMode('groups')} variant='third'/>
      
    </View>
  );
  

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: '#075E54',
      },
      headerTintColor: '#fff',
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const sidebarStyles = theme === 'dark' ? styles.sidebarDark : styles.sidebarLight;

  const renderItem = ({ item }: { item: any }) => {
    const lastMessageTime = item.lastMessageTime || (item.type === 'group' ? item.lastMessage?.createdAt : item.createdAt);
    const isNewMessage = false; // Adjust as needed to identify new messages

    return (
      <Card onPress={() => handleCardPress(item)}>
        <UserInfo>
          <UserImgWrapper>
            <UserImg source={{ uri: item.type === 'contact' ? item.userInfo.profileImageUrl : item.groupImgUrl || 'default-image-url' }} />
          </UserImgWrapper>
          <TextSection>
            <UserInfoText>
            <UserName className='lowercase'>{item.type === 'contact' ? `@${item.userInfo.username}` : item.name || 'Group Name'}</UserName>
              <PostTime style={styles.postTime}>{formatTime(lastMessageTime)}</PostTime>
            </UserInfoText>
            <MessageText style={[styles.messageText, isNewMessage && styles.newMessage]}>
              {item.lastMessage
                ? typeof item.lastMessage === 'string'
                  ? item.lastMessage
                  : item.lastMessage.text
                : 'No message yet'}
            </MessageText>
            {item.unreadCount > 0 && (
              <View style={styles.unreadCountContainer}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </TextSection>
        </UserInfo>
      </Card>
    );
  };

  return (
    <Container style={[sidebarStyles]}>
    <StatusBar barStyle="light-content" backgroundColor="#075E54" />
    <SearchComponent endpoint={''} fieldsToDisplay={[]}/>
    {renderToggleButtons()}
    <FlatList
      data={filteredData}
      keyExtractor={(item, index) => item.type === 'contact' ? item.userInfo._id : item._id + index}
      renderItem={renderItem}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No chats available. Pull to refresh.</Text>
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#0000ff']}
        />
      }
    />
    <RoundButton />
  </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarLight: {
    backgroundColor: '#fff',
  },
  sidebarDark: {
    backgroundColor: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
  },
  postTime: {
    color: '#888',
  },
  messageText: {
    color: '#000',
  },
  newMessage: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  unreadCountContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  unreadCount: {
    color: '#fff',
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default ChatListScreen;




// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Text, StatusBar } from 'react-native';
// import { Container, Card, UserInfo, UserImgWrapper, UserImg, UserInfoText, UserName, PostTime, MessageText, TextSection } from '@/styles/MessageStyles';
// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import SearchComponent from '@/components/Search';
// import { RootStackParamList, RootStackParamListsPersonGroupChat } from '@/services/core/types';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { useUser } from '@/utils/useContext/UserContext';
// import { formatTime } from '@/services/core/globals';
// import io from 'socket.io-client';
// import { useTheme } from '@/utils/useContext/ThemeContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useChat } from '@/utils/useContext/ChatContext';
// import { useNotification } from '@/utils/useContext/NotificationContext';
// import RoundButton from '@/components/RoundButton';
// import Button from '@/components/Button';

// interface ChatScreenRouteParams {
//   room: string;
//   senderId: string;
//   receiverId: string;
//   senderName: string;
//   lastMessageTime: string;
//   lastMessage: string;
// }

// const ChatListScreen = () => {
//   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
//   const navigations = useNavigation<StackNavigationProp<RootStackParamListsPersonGroupChat>>();
//   const route = useRoute<RouteProp<{ params: ChatScreenRouteParams }, 'params'>>();
//   const { user } = useUser();
//   const { sendNotificationToServer } = useChat();
//   const [loading, setLoading] = useState<boolean>(true);
//   const [data, setData] = useState<any[]>([]);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const { theme } = useTheme();
//   const { expoPushToken } = useNotification();
//   const socket = io('http://192.168.1.107:5000'); 
//   const [viewMode, setViewMode] = useState<'contacts' | 'groups' | 'all'>('all');


//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerShown: true,
//       headerStyle: {
//         backgroundColor: '#075E54', 
//       },
//       headerTintColor: '#fff',
//     });
//   }, [navigation]);

//   const fetchChatContacts = async () => {
//     try {
//       const userId = user.id || await AsyncStorage.getItem('userId');
//       const response = await fetch(`http://192.168.1.107:5000/chat/message/contacts/${userId}`);
//       return await response.json();
//     } catch (error) {
//       console.error("Error fetching chat contacts:", error);
//       return [];
//     }
//   };

//   const fetchUserGroups = async () => {
//     try {
//       const userId = user.id || await AsyncStorage.getItem('userId');
//       const response = await fetch(`http://192.168.1.107:5000/chat/user/${userId}/rooms`);
//       return await response.json();
//     } catch (error) {
//       console.error("Error fetching user groups:", error);
//       return [];
//     }
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     const contacts = await fetchChatContacts();
//     const groups = await fetchUserGroups();

//     const combinedData = [
//       ...groups.map((group: any) => ({
//         ...group,
//         type: 'group',
//         lastMessageTime: group.lastMessage?.createdAt || group.createdAt,
//         unreadCount: group.unreadCount || 0,
//       })), 
//       ...contacts.map((contact: any) => ({
//         ...contact,
//         type: 'contact',
//         lastMessageTime: contact.lastMessageTime || contact.createdAt,
//         lastMessage: contact.lastMessage || contact.lastMessage.text,
//         unreadCount: contact.unreadCount || 0,
//       }))
//     ];

//     combinedData.sort((a, b) => {
//       const aTime = a.lastMessageTime || a.createdAt;
//       const bTime = b.lastMessageTime || b.createdAt;
//       return new Date(bTime).getTime() - new Date(aTime).getTime();
//     });

//     setData(combinedData);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
    
  //   const handleNewMessage = (message: any) => {
  //     const { senderId, text, createdAt, receiverId, room } = message;

  //     setData((prevData) => {
  //       const updatedData = prevData.map(item => {
  //         if (item.type === 'contact' && item.userInfo._id === senderId && receiverId) {
  //           return {
  //             ...item,
  //             lastMessage: text,
  //             lastMessageTime: createdAt,
  //             unreadCount: (item.unreadCount || 0) + 1,
  //           };
  //         }
  //         if (item.type === 'group' && item.name === room) {
  //           return {
  //             ...item,
  //             lastMessage: text,
  //             lastMessageTime: createdAt,
  //             unreadCount: receiverId === user.id ? (item.unreadCount || 0) + 1 : item.unreadCount,
  //           };
  //         }
  //         return item;
  //       });

  //       updatedData.sort((a, b) => {
  //         const aTime = a.lastMessageTime || a.createdAt;
  //         const bTime = b.lastMessageTime || b.createdAt;
  //         return new Date(bTime).getTime() - new Date(aTime).getTime();
  //       });

  //       return updatedData;
  //     });
  //   };

  //   socket.on('receiveMessage', handleNewMessage);
  //   socket.on('receiveMessageFrompersonalGroupChat', handleNewMessage);

  //   return () => {
  //     socket.off('receiveMessage', handleNewMessage);
  //     socket.off('receiveMessageFrompersonalGroupChat', handleNewMessage);
  //   };
  // }, [expoPushToken, sendNotificationToServer]);

//   const handleCardPress = (item: any) => {
//     if (item.type === 'contact') {
//       navigation.navigate('message', {
//         username: item.userInfo.username,
//         senderId: user.id,
//         receiverId: item.userInfo._id,
//         senderName: user.username,
//         profileImageUrl: item.userInfo.profileImageUrl,
//         lastMessage: item.lastMessage,
//         lastMessageTime: item.lastMessageTime,
//       });
//     } else if (item.type === 'group') {
//       navigations.navigate('PersonGroupChat', {
//         id: item._id,
//         room: item.room,
//         groupName: item.groupName,
//         profileImageUrl: user.profileImage,
//         username: user.username,
//         groupImgUrl: item.groupImgUrl,
//         groupDescription: item.groupDescription,
//         groupCreationTime: item.groupCreationTime,
//         senderId: user.id,
//         senderName: user.username,
//         name: item.name,
//         description: item.description,
//         lastMessage: item.lastMessage,
//         lastMessageTime: item.lastMessageTime,
//       });
//     }
//   };

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     fetchData();
//     setRefreshing(false);
//   }, []);

//   const filteredData = data.filter(item => {
//     if (viewMode === 'contacts') {
//       return item.type === 'contact';
//     } else if (viewMode === 'groups') {
//       return item.type === 'group';
//     }
//     return true; 
//   });

  // const renderToggleButtons = () => (
  //   <View style={styles.toggleContainer}>
  //        {/* <Button title="All" onPress={() => setViewMode('all')}  />
  //     <Button title="Contacts" onPress={() => setViewMode('contacts')}/>
  //     <Button title="Groups" onPress={() => setViewMode('groups')} />

  //   */}
  //   <Button text='All'className='w-20'  onClick={() => setViewMode('all')} variant='third'/>
  //   <Button text='Contacts'className='w-20 '   onClick={() => setViewMode('contacts')} variant='third'/>
  //   <Button text='Groups' className='w-20' onClick={() => setViewMode('groups')} variant='third'/>
      
  //   </View>
  // );
  
  

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   const sidebarStyles = theme === 'dark' ? styles.sidebarDark : styles.sidebarLight;

//   const renderItem = ({ item }: { item: any }) => {
//     const lastMessageTime = item.lastMessageTime || (item.type === 'group' ? item.lastMessage?.createdAt : item.createdAt);
//     return (
//       <Card onPress={() => handleCardPress(item)}>
//         <UserInfo>
//           <UserImgWrapper>
//             <UserImg source={{ uri: item.type === 'contact' ? item.userInfo.profileImageUrl : item.groupImgUrl || 'default-image-url' }} />
//           </UserImgWrapper>
//           <TextSection>
//             <UserInfoText>
//               <UserName className='lowercase'>{item.type === 'contact' ? `@${item.userInfo.username}` : item.name || 'Group Name'}</UserName>
//               <PostTime>{formatTime(lastMessageTime)}</PostTime>
//             </UserInfoText>
//             <MessageText>
//               {item.lastMessage
//                 ? typeof item.lastMessage === 'string'
//                   ? item.lastMessage
//                   : item.lastMessage.text
//                 : 'No message yet'}
//             </MessageText>
//             {item.unreadCount > 0 && (
//               <View style={styles.unreadCountContainer}>
//                 <Text style={styles.unreadCount}>{item.unreadCount}</Text>
//               </View>
//             )}
//           </TextSection>
//         </UserInfo>
//       </Card>
//     );
//   };

//   return (
//     <Container style={[sidebarStyles]}>
//       <SearchComponent endpoint={''} fieldsToDisplay={[]}/>
//       <StatusBar barStyle="light-content" backgroundColor="#075E54" />
//       {renderToggleButtons()}
//       <FlatList
//         data={filteredData}
//         keyExtractor={(item, index) => item.type === 'contact' ? item.userInfo._id : item._id + index}
//         renderItem={renderItem}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No chats available. Pull to refresh.</Text>
//           </View>
//         }
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#0000ff']}
//           />
//         }
//       />
//       <RoundButton />
//     </Container>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sidebarDark: {
//     backgroundColor: '#2a2a2a',
//   },
//   sidebarLight: {
//     backgroundColor: '#ffffff',
//   },
  // toggleContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   padding: 10,
  // },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: '#888',
//   },
//   unreadCountContainer: {
//     backgroundColor: '#ff4d4d',
//     borderRadius: 12,
//     padding: 5,
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
//   unreadCount: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },

//   toggleButton: {
//     flex: 1,
//     margin: 5,
//     padding: 10,
//     borderRadius: 5,
//     backgroundColor: '#007BFF',
//     alignItems: 'center',
//   },
//   toggleButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default ChatListScreen;
