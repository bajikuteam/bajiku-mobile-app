import { Link, router, Tabs } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity, Text, View, Modal, FlatList,  StyleSheet, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useUser } from '@/utils/useContext/UserContext';
import { useTheme } from '@/utils/useContext/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface Notification {
  IsRead: boolean;
  createdAt: string;
  message: string;
  profileImageUrl: string;
  userId: string;
  _id: string;
  whoInitiatedId:string;
  username:string;
  commentId:string;
  contentId:string;
  replyId:string;
}



const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    height: '85%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 5,
    zIndex: 1000,
     },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  commentUserImage: {
    height: 38,
    width: 38,
    borderRadius: 12,
    marginRight: 10,
    borderColor: '#000',
    borderWidth: 2,

  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    color: 'black',
    textTransform:'lowercase'
  },
  commentText: {
    color: '#ccc',
    marginVertical: 2,
  },
  commentTime: {
    color: 'gray',
    fontSize: 12,
  },
  closeButton: {
    padding: 10,
  
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
  },
  noCommentsText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#777', 
  },
  replySection: {
    marginTop: 8, 
    paddingLeft: 48, 
  },
  replyContainer: {
    flexDirection : 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    elevation: 1,
  },
  replyUsername: {
    fontWeight: 'bold',
     textTransform:"lowercase"
  },
  replyText: {
    marginVertical: 2,
  },
  replyTime: {
    color: '#888',
    fontSize: 10,
  },
  replyList: {
    maxHeight: 100, 
    marginTop: 4,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    color: 'gray', 
    fontSize: 12,
    marginTop: 2, 
    fontWeight: 'bold',
  },
  likeCount: {
    marginLeft: 5,
    color: 'gray',
    fontSize: 14,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 5,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyButton: {
    backgroundColor: '#D84773', 
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10,
  },
  replyButtonText: {
    color: 'white',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

  profileImageTwo: {
    width: 35,
    height: 35,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  sidebarItem: {
    flexDirection: "row",
    // alignItems: "center",
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: "#D84773",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  items: {
    flexGrow: 0,
    marginBottom: 20,
  },
  policySection: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 30,
  },
  policyText: {
    fontSize: 14,
    marginVertical: 15,
    color: '#000000'
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
   buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    marginVertical: 10, 
  },

  markAllButton: {
    padding: 10,
    borderRadius: 5,
  },
  markAllButtonText: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
    modalHeader: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    paddingHorizontal: 15,
    paddingVertical: 10, 
  },
});

export default function TabLayout() {
  const headerStatusColor = "#000000";
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false); 
const {user} = useUser()
const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);


useFocusEffect(
  useCallback(() => {
    setLoading(true);
    fetchNotifications ();
    const timeout = setTimeout(() => {
      setLoading(false); 
    }, 2000);
    return () => clearTimeout(timeout);
  }, [ user?.id])
);




  const fetchNotifications = async () => {
    setLoading(true);
    const userId = user?.id  || await AsyncStorage.getItem('userId'); 
    try {
      const response = await axios.get(`https://backend-server-quhu.onrender.com/notifications/${userId}`);
      const allNotifications: Notification[] = response.data;
      const unreadCount = allNotifications.filter((notification: Notification) => !notification.IsRead).length;
      setNotifications(allNotifications);
      setUnreadNotificationsCount(unreadCount); 
    } catch (error) {
      // console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);



  const handleProfilePress = () => {
    router.push('/profile/Profile'); 
  };

  const handleNotification = () => {
    router.push('/system/notifications'); 
    fetchNotifications();  
  };


  return (
    <><Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#075E54',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        unmountOnBlur: true,
        tabBarLabel: () => null,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          backgroundColor: route.name === 'index' ? '#000000' : '#000000',
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: headerStatusColor },
          headerLeft: () => (
            <TouchableOpacity onPress={handleProfilePress} style={{ marginLeft: 15 }}>
               <Image
                    source={{ uri: user?.profileImageUrl }}
                    style={styles.profileImageTwo}
                  />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: "#ffffff" }}>
              Bajîkü
            </Text>
          ),
          headerTitleAlign: 'center',
          headerRight: () => (
            <>

    <TouchableOpacity onPress={handleNotification} style={{ marginRight: 15 }}>
  <FontAwesome name="bell" size={20} color="#fff" />
  {unreadNotificationsCount > 0 && (
    <View style={styles.notificationBadge}>
      <Text style={styles.notificationText}>
        {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
      </Text>
    </View>
  )}
</TouchableOpacity>

  
              <TouchableOpacity
                 onPress={() =>router.push('/system/menu')}
                style={{ marginRight: 15 }}
              >
                  <MaterialCommunityIcons name="dots-vertical" size={24} color="#fff" />
              </TouchableOpacity>
            </>
          ),
          headerTintColor: '#fff',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color} />
          ),
        }} />

      <Tabs.Screen
        name="search"
        options={{
          headerShown: true,
          headerTitle: 'Search For Users',
          headerStyle: { backgroundColor: headerStatusColor },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={handleProfilePress} style={{ marginLeft: 15 }}>
               <Image
                    source={{ uri: user?.profileImageUrl }}
                    style={styles.profileImageTwo}
                  />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <>

    <TouchableOpacity onPress={handleNotification} style={{ marginRight: 15 }}>
  <FontAwesome name="bell" size={20} color="#fff" />
  {unreadNotificationsCount > 0 && (
    <View style={styles.notificationBadge}>
      <Text style={styles.notificationText}>
        {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
      </Text>
    </View>
  )}
</TouchableOpacity>

  
              <TouchableOpacity
                 onPress={() =>router.push('/system/menu')}
                style={{ marginRight: 15 }}
              >
                  <MaterialCommunityIcons name="dots-vertical" size={24} color="#fff" />
              </TouchableOpacity>
            </>
          ),

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
          ),
        }} />

      <Tabs.Screen
        name="upload"
        options={{
          headerShown: true,
          headerTitle: 'Upload Content',
          headerStyle: { backgroundColor: headerStatusColor },
          headerTintColor: '#fff',
          tabBarIcon: ({ color, focused }) => (
            <Feather
              name="upload"
              color={color}
              size={24} />
          ),
        }} />

      <Tabs.Screen
        name="Chat"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: headerStatusColor },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={handleProfilePress} style={{ marginLeft: 15 }}>
               <Image
                    source={{ uri: user?.profileImageUrl }}
                    style={styles.profileImageTwo}
                  />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <>

    <TouchableOpacity onPress={handleNotification} style={{ marginRight: 15 }}>
  <FontAwesome name="bell" size={20} color="#fff" />
  {unreadNotificationsCount > 0 && (
    <View style={styles.notificationBadge}>
      <Text style={styles.notificationText}>
        {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
      </Text>
    </View>
  )}
</TouchableOpacity>

  
              <TouchableOpacity
                 onPress={() =>router.push('/system/menu')}
                style={{ marginRight: 15 }}
              >
                  <MaterialCommunityIcons name="dots-vertical" size={24} color="#fff" />
              </TouchableOpacity>
            </>
          ),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'message' : 'message-outline'}
              color={color}
              size={24} />
          ),
        }} />

      <Tabs.Screen
        name="Rooms"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: headerStatusColor },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={handleProfilePress} style={{ marginLeft: 15 }}>
               <Image
                    source={{ uri: user?.profileImageUrl }}
                    style={styles.profileImageTwo}
                  />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <>

    <TouchableOpacity onPress={handleNotification} style={{ marginRight: 15 }}>
  <FontAwesome name="bell" size={20} color="#fff" />
  {unreadNotificationsCount > 0 && (
    <View style={styles.notificationBadge}>
      <Text style={styles.notificationText}>
        {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
      </Text>
    </View>
  )}
</TouchableOpacity>

  
              <TouchableOpacity
                 onPress={() =>router.push('/system/menu')}
                style={{ marginRight: 15 }}
              >
                  <MaterialCommunityIcons name="dots-vertical" size={24} color="#fff" />
              </TouchableOpacity>
            </>
          ),

          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'account-group' : 'account-group-outline'}
              color={color}
              size={24} />
          ),
        }} />
    </Tabs>


      </>
  );
}


