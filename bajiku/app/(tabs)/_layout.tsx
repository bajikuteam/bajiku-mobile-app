import { Link, router, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Feather, FontAwesome } from '@expo/vector-icons';
import Sidebar from '@/components/Sidebar';
import { TouchableOpacity, Text, View, Modal, FlatList,  StyleSheet, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useUser } from '@/utils/useContext/UserContext';
import { formatCount } from '@/services/core/globals';
import { useTheme } from '@/utils/useContext/ThemeContext';
// interface Notification {
//   _id: string;       
//   message: string;  

//   whoInitiatedId:string;
// profileImageUrl:string;
// username:string;
// }

interface Notification {
  IsRead: boolean;
  createdAt: string;
  message: string;
  profileImageUrl: string;
  userId: string;
  _id: string;
  whoInitiatedId:string;
  username:string;
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
    // marginLeft: 'auto', 
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
    width: 30,
    height: 30,
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

  const [modalVisible, setModalVisible] = useState(false); 
  const [menuModalVisible, setMenuModalVisible] = useState(false);  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false); 
const {user, handleLogout} = useUser()
const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);


  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://backend-server-quhu.onrender.com/notifications/${user?.id}`);
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
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!modalVisible && user) {
      fetchNotifications(); 
      intervalId = setInterval(() => {
        fetchNotifications();  
      }, 30000);
    }

    return () => clearInterval(intervalId);  
  }, [modalVisible, user]); 


  const handleBellPress = () => {
    fetchNotifications();  
    setModalVisible(true);  
  };

  const handleMenuPress = () => {
    setMenuModalVisible(true);  
  };

  const handleProfilePress = () => {
    router.push('/Profile'); 
  };
  const SidebarItem: React.FC<{ icon: JSX.Element; label: string }> = ({
    icon,
    label,
    
  }) => {
    const { theme } = useTheme();
  
    // Determine the text and icon color based on the theme
    const textColor = "dark" 
    const iconColor = "#000";
  
    // Clone the icon with the appropriate color
    const coloredIcon = React.cloneElement(icon, { color: iconColor });
  
    return (
      <View style={styles.sidebarItem}>
        <View style={styles.icon}>{coloredIcon}</View>
        <Text style={{ color: '#000', marginTop:8 }}>{label}</Text>
      </View>
    );
  };

  const handleLogoutFromApp = () => {
    handleLogout(); 
    setMenuModalVisible(false); 
  };

const markAllAsRead = async () => {
  try {
    await axios.patch(`https://backend-server-quhu.onrender.com/notifications/${user?.id}/mark-all-read`);
    fetchNotifications(); 
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
};


const handlePress = async (
  notificationId: string ,
  userId: string, 
  username: string, 
  profileImageUrl: string, 
  message: string, 
) => {
  // try {
    // Mark the notification as read
    await axios.patch(`https://backend-server-quhu.onrender.com/notifications/${notificationId}/mark-read`);

    if (message === "Welcome to Bajiku !. Continuing networking") {
      return; 
    }

    // Navigate only if applicable
    if (userId === user.id) {
      router.push({
        pathname: '/Profile',
        params: {
          notificationId: notificationId,
          userId: userId,
          username: username,
          profileImageUrl: profileImageUrl,
        },
      });
    } else {
      router.push({
        pathname: '/userDetails/UserDetails',
        params: {
          notificationId: notificationId,
          searchUserId: userId,
          username: username,
          profileImageUrl: profileImageUrl,
        },
      });
    }

    setModalVisible(false);
  // } catch (error) {
    // console.error('Error marking notification as read:', error);
  // }
};


// const handlePress = (
  // notificationId: string ,
  // userId: string, 
  // username: string, 
  // profileImageUrl: string, 
  // message: string, 

// ) => {
//  axios.patch(`https://backend-server-quhu.onrender.com/notifications/${notificationId}/mark-read`)
//   if (message === "Welcome to Bajiku !. Continuing networking") {
//     return; 
//   }
//   if (userId === user?.id) {
//     // Navigate to the logged-in user's profile
//     router.push({
//       pathname: '/Profile',
//       params: {
        // notificationId: notificationId,
        // userId: userId,
        // username: username,
        // profileImageUrl: profileImageUrl,
   
  
//       },
//     });
//   } else {
//     // Navigate to the user details page
//     router.push({
//       pathname: '/userDetails/UserDetails',
//       params: {
        // notificationId: notificationId,
        // searchUserId: userId,
        // username: username,
        // profileImageUrl: profileImageUrl,
      
//       },
//     });
//   }
//   setModalVisible(false);
// };

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

    <TouchableOpacity onPress={handleBellPress} style={{ marginRight: 15 }}>
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
                 onPress={handleMenuPress}
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
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'account-group' : 'account-group-outline'}
              color={color}
              size={24} />
          ),
        }} />
    </Tabs>
    <Modal
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      transparent={true}
      animationType="slide"
    >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
          <Text  style={{color:'#000',fontSize:18, textAlign:'center', marginBottom:40}}>Notifications</Text>

      <View style={styles.buttonContainer}>
  <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
    <Text style={styles.markAllButtonText}>Mark All As Read</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
    <Text style={styles.closeButtonText}>X</Text>
  </TouchableOpacity>

</View>

            {loading ? (
                <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#075E54" />
                <Text>Loading Notifications</Text>
              </View>
            ) : (
              <FlatList
              data={notifications} 
              keyExtractor={(item) => item?._id.toString()}
              renderItem={({ item }: { item: Notification }) => ( 
         
              <TouchableOpacity
  onPress={() =>
    handlePress(
      item._id,
      item.whoInitiatedId,
      item.username,
      item.profileImageUrl,
      item.message
    )
  }
>
  <View
    style={[
      styles.commentContainer,
      !item.IsRead && { backgroundColor: '#f0f8ff' }, 
    ]}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image
        source={{ uri: item.profileImageUrl }}
        style={styles.commentUserImage}
      />
      <Text style={{ marginLeft: 10, color: '#000', textTransform: 'lowercase' }}>
        {item.message}
      </Text>

      {/* Unread Indicator */}
      {!item.IsRead && (
        <View
          style={{
            width: 10,
            height: 10,
            backgroundColor: '#ff0000', 
            borderRadius: 5,
            marginLeft: 5,
          }}
        />
      )}
    </View>
  </View>
</TouchableOpacity>

              )}
            />
          )}

          </View>
        </View>
      </Modal>


      <Modal
      visible={menuModalVisible}
      onRequestClose={() => setMenuModalVisible(false)}
      transparent={true}
      animationType="slide"
    >
        <View style={styles.modalOverlay}>
          <View style={{  height: '85%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 5,
    zIndex: 1000,}}>
          <Text  style={{color:'#000',fontSize:18, textAlign:'center', marginBottom:40}}></Text>
      <View style={styles.modalHeader}>
  <TouchableOpacity 
    style={styles.closeButton} 
    onPress={() => setMenuModalVisible(false)}>
    <Text style={styles.closeButtonText}>X</Text>
  </TouchableOpacity>
</View>

      <View style={styles.items}>
          <TouchableOpacity>
          <Link href="/(tabs)" >
            <SidebarItem
              icon={<Feather name="home" size={28} />}
              label="Home"
            />
            </Link>
             </TouchableOpacity>
             <TouchableOpacity >
            <SidebarItem
              icon={<Feather name="user" size={28} />}
              label="Profile"
          
            />
            </TouchableOpacity>
          
            <SidebarItem
              icon={<Feather name="settings" size={28} />}
              label="Settings"
            />

              <TouchableOpacity onPress={handleLogoutFromApp}   style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
          </View>

          <View style={styles.policySection}>
            <Text style={[styles.policyText, { color:'#000' }]}>About</Text>
            <Text style={[styles.policyText, { color: '#000' }]}>
              Policy
            </Text>
            <Text style={[styles.policyText, { color: '#000' }]}>
              Community Guidelines
            </Text>
            <Text style={[styles.policyText, { color: '#000' }]}>
              Terms and Conditions
            </Text>
            <Text style={[styles.policyText, { color: '#000000' }]}>FAQ</Text>
          </View>

          </View>
        </View>
      </Modal>
      </>
  );
}


