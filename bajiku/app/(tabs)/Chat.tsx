
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Text, StatusBar } from 'react-native';
import { Container, Card, UserInfo, UserImgWrapper, UserImg, UserInfoText, UserName, PostTime, MessageText, TextSection } from '@/styles/MessageStyles';
import { createNavigationContainerRef, RouteProp, useFocusEffect, useIsFocused, useNavigation, useNavigationContainerRef, useRoute } from '@react-navigation/native';
// import { RootStackParamList, RootStackParamListComponent, RootStackParamListsPersonGroupChat } from '@/services/core/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from '@/utils/useContext/UserContext';
import { formatTime } from '@/services/core/globals';
import io from 'socket.io-client';
import { useTheme } from '@/utils/useContext/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useChat } from '@/utils/useContext/ChatContext';
// import { useNotification } from '@/utils/useContext/NotificationContext';
import RoundButton from '@/components/RoundButton';
import Button from '@/components/Button';
import SearchComponent from '@/components/Search';
import * as NavigationBar from 'expo-navigation-bar';
import { router } from 'expo-router';
interface ChatScreenRouteParams {
  room: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  lastMessageTime: string;
  lastMessage: string;
}

// const navigationRef = createNavigationContainerRef();

type RootStackParamList = {
  Home: undefined;
  message: { username: string; senderId: string; receiverId: string; senderName: string; profileImageUrl: string; lastMessage: string; lastMessageTime: string };
  PersonGroupChat: { roomId: string; room: string; groupName: string; profileImageUrl: string; username: string; groupImgUrl: string; groupDescription: string; groupCreationTime: string; senderId: string; senderName: string; name: string; description: string; lastMessage: string; lastMessageTime: string };
};



const ChatListScreen = () => {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  // const navigationRef = useNavigation<StackNavigationProp<RootStackParamList>>();
  // const navigation = useNavigation<NavigationProp>();

  // const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // const navigation = useNavigation(); // Using the useNavigation hook

  const [viewMode, setViewMode] = useState<'contacts' | 'groups' | 'all'>('all');

  const { user } = useUser();
  const { sendNotificationToServer } = useChat();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // const { theme } = useTheme();
  // const { expoPushToken } = useNotification();
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
  }, [sendNotificationToServer]);

  const handleCardPress = (item:any) => {
    
    if (item.type === 'contact') {
      router.push({pathname:'/message',
        params:{
          username: item.userInfo.username,
          senderId: user.id,
          receiverId: item.userInfo._id,
          senderName: user.username,
          profileImageUrl: item.userInfo.profileImageUrl,
          lastMessage: item.lastMessage, 
          lastMessageTime: item.lastMessageTime,
        }
     
      });
    } else if (item.type === 'group') {
      router.push({pathname:'/PersonGroupChat',
        params:{
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
        }
      
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
    return true; 
  });
  
  
  const toggleViewMode = (mode: 'contacts' | 'groups' | 'all') => {
    setViewMode(mode);
  };
  
  const renderToggleButtons = () => (
    <View style={styles.toggleContainer}>
    <Button text='All'  style={styles.toggleContainerBtn}   onClick={() => setViewMode('all')} variant='third'/>
    <Button text='Contacts' style={styles.toggleContainerBtn}     onClick={() => setViewMode('contacts')} variant='third'/>
    <Button text='Groups' style={styles.toggleContainerBtn}  onClick={() => setViewMode('groups')} variant='third'/>
      
    </View>
  );
  

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }, []);


  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // const sidebarStyles = theme === 'dark' ? styles.sidebarDark : styles.sidebarLight;

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
    <Container >
    <StatusBar barStyle="light-content" backgroundColor="#000000" />
    {/* <SearchComponent endpoint={''} fieldsToDisplay={[]}/> */}
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
    backgroundColor:'#000000'
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
  toggleContainerBtn:{
    width: '20%'
  }
});

export default ChatListScreen;