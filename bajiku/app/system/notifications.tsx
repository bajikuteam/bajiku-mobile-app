import { Notification } from '@/services/core/types';
import { useUser } from '@/utils/useContext/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList, RefreshControl, Modal, TouchableWithoutFeedback} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '@/components/CustomHeader';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        borderColor: '#fff',
        borderWidth: 2,
    },
    commentContent: {
        flex: 1,
    },
    commentUsername: {
        color: '#fff',
        textTransform: 'lowercase'
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
            position: 'absolute',
            top: 5, 
            right: 20, 
            // backgroundColor: 'rgba(255, 255, 255, 0.6)', 
            borderRadius: 50,
            padding: 10,
          
    },
    closeButtonText: {
        fontSize: 20,
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
        width: 40,
        height: 40,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
    },
    sidebarItem: {
        flexDirection: "row",
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
    pickerWrapper: {
        height: 40,
        width: 230,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8, 
        marginBottom: 15,
        paddingHorizontal: 10,
        justifyContent: 'center',
        overflow: 'hidden',  
        marginLeft:10,
        marginTop:50,
      },
      picker: {
        height: '100%',
        width: '100%',
        color: '#000',
        paddingVertical: 10,
        position: 'relative', 
    },

      selectedValue: {
        fontSize: 16,
        color: '#000',
      },
      modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        // backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContainer: {
        height: "50%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        elevation: 5,
        zIndex: 1000,
      },
      option: {
        paddingVertical: 20,
      },
      optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      optionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 15,
      },
      dropdownIcon: {
        position: 'absolute',
        right: 10,
        top: '100%',
        transform: [{ translateY: -10 }],
    },
  
});

const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<string>('all');
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        setLoading(true);
        const userId = user?.id || await AsyncStorage.getItem('userId');
        try {
            const response = await axios.get(`https://my-social-media-bd.onrender.com/notifications/${userId}`);
            const allNotifications: Notification[] = response.data;
            const unreadCount = allNotifications.filter((notification: Notification) => !notification.IsRead).length;
            setNotifications(allNotifications);
            setUnreadNotificationsCount(unreadCount);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        const userId = user?.id || await AsyncStorage.getItem('userId');
        try {
            await axios.patch(`https://my-social-media-bd.onrender.com/notifications/${userId}/mark-all-read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const handlePress = async (
        notificationId: string,
        userId: string,
        whoInitiatedId: string,
        profileImageUrl: string,
        message: string,
        contentId?: string,
        commentId?: string,
        replyId?: string
    ) => {
        // Mark the notification as read
        await axios.patch(`https://my-social-media-bd.onrender.com/notifications/${notificationId}/mark-read`);

        const normalizedMessage = message.toLowerCase();
    
        if (normalizedMessage.includes('welcome to bajiku! continue networking')) {
            return; 
        }
    
        if (normalizedMessage.includes('you have a new subscriber')) {
            return;
        }

        if (contentId) {
            router.push({
                pathname: '/content/contentDetails',
                params: {
                    notificationId: notificationId,
                    userId: userId,
                    whoInitiatedId: whoInitiatedId,
                    profileImageUrl: profileImageUrl,
                    id: contentId,
                    commentId: commentId,
                    replyId: replyId
                },
            });
        } 
        else if (normalizedMessage.includes("your withdrawal request of")) {
            router.push({
                pathname: '/profile/TotalEarnings',
                params: {
                    notificationId: notificationId,
                    userId: userId,
                    whoInitiatedId: whoInitiatedId,
                    profileImageUrl: profileImageUrl,
                },
            });
        } 
        else {
            router.push({
                pathname: '/userDetails/UserDetails',
                params: {
                    notificationId: notificationId,
                    searchUserId: whoInitiatedId,
                    whoInitiatedId: whoInitiatedId,
                    profileImageUrl: profileImageUrl,
                },
            });
        }
    };
    
    const goBack = () => {
        router.back();
    };



    useFocusEffect(
        useCallback(() => {
          setLoading(true);
          handleRefresh()
          fetchNotifications ();
          const timeout = setTimeout(() => {
            setLoading(false); 
          }, 2000);
          return () => clearTimeout(timeout);
        }, [ user?.id])
      );
      
      const [refreshing, setRefreshing] = useState(false);
      
      const handleRefresh = async () => {
        setRefreshing(true); 
        await fetchNotifications ()
        setRefreshing(false); 
      };

      const [label, setLabel] = useState<string>('--All Activities--');
      const [isModalVisible, setIsModalVisible] = React.useState(false);

      const options = [
        { label: 'All', value: 'all', icon: <Ionicons name="albums" size={20} color="black" /> },
        { label: 'Likes', value: 'like', icon: <Ionicons name="heart" size={20} color="red" /> },
        { label: 'Comments', value: 'comment', icon:  <Ionicons name="chatbubble" size={20} color="blue" /> },
        { label: 'Follows', value: 'follow', icon: <Ionicons name="person-add" size={20} color="purple" /> },
        { label: 'Subscribes', value: 'subscribe', icon: <MaterialCommunityIcons name="bell-plus" size={20} color="green" /> },
        { label: 'Transactions', value: 'your withdrawal request', icon:   <MaterialCommunityIcons name="wallet" size={20} color="green" /> },
      ];
    
      const handleSelect = (value:any, label?:any ) => {
        setFilter(value);
        setLabel(label)
        setIsModalVisible(false);
      };

    return (
        <>
            <CustomHeader
                title={"Notifications"}
                onBackPress={goBack} 
            />
            <View style={styles.container}>

<View style={styles.pickerWrapper}>

    {/* <TouchableOpacity style={styles.picker} onPress={() => setIsModalVisible(true)}> */}
    <TouchableOpacity style={styles.picker} onPress={() => setIsModalVisible(true)}>
                        <Text style={styles.selectedValue}>{label || '--Activities--'}</Text>
                        <Ionicons
                            name="chevron-down"
                            size={20}
                            color="black"
                            style={styles.dropdownIcon}
                        />
                    </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
                {options.map((option, index) => (
                    <TouchableOpacity key={index} onPress={() => handleSelect(option.value, option.label)} style={styles.option}>
                     <View style={styles.optionContent}>
                      {option.icon}
                      <Text style={styles.optionText}>{option.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>



                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginBottom: 20 }} onPress={markAllAsRead}>
                        <Text style={styles.markAllButtonText}>Mark All As Read</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#D84773" />
                    </View>
                ) : (
                    <FlatList
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                      }
                        data={notifications.filter((item) => {
                            // Filter logic based on the selected filter
                            if (filter === 'like' && item.message.toLowerCase().includes('like')) return true;
                            if (filter === 'comment' && item.message.toLowerCase().includes("comment") && !item.message.toLowerCase().includes("like")) return true;
                            if (filter === 'subscribe' && item.message.toLowerCase().includes('subscribe')) return true;
                            if (filter === 'follow' && item.message.toLowerCase().includes('follow')) return true;
                            if (filter === 'your withdrawal request' && item.message.toLowerCase().includes('your withdrawal request')) return true;
                            if (filter === 'all') return true;
                            return false;
                        })}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() =>
                                    handlePress(
                                        item._id,
                                        item.userId,
                                        item.whoInitiatedId,
                                        item.profileImageUrl,
                                        item.message,
                                        item.contentId,
                                        item.commentId,
                                        item.replyId
                                    )
                                }
                            >
                                <View
                                    style={[
                                        styles.commentContainer,
                                        !item.IsRead && { backgroundColor: '#1e1e1c' },
                                    ]}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                                        {item.message.toLowerCase().includes("like") && item.message.toLowerCase().includes("comment") ? (
                                            <FontAwesome name="heart" size={20} color="red" style={{ marginRight: 10 }} />
                                        ) : (
                                            <>
                                                {item.message.toLowerCase().includes("like") && (
                                                    <FontAwesome name="heart" size={20} color="red" style={{ marginRight: 10 }} />
                                                )}
                                                {item.message.toLowerCase().includes("comment") && !item.message.toLowerCase().includes("like") && (
                                                     <Ionicons name="chatbubble" size={20} color="blue" style={{ marginRight: 10 }} />
                                                    
                                                )}
                                            </>
                                        )}

                                        {item.message.toLowerCase().includes("your withdrawal request") && (
                                            <MaterialCommunityIcons name="wallet" size={20} color="green" style={{ marginRight: 10 }} />
                                        )}

                                        {item.message.toLowerCase().includes("subscribe") && (
                                            <MaterialCommunityIcons name="bell-plus" size={20} color="green" style={{ marginRight: 10 }} />
                                        )}

                                        {item.message.toLowerCase().includes("follow") && (
                                            <MaterialCommunityIcons name="account-plus" size={20} color="purple" style={{ marginRight: 10 }} />
                                        )}

                                        <Image source={{ uri: item.profileImageUrl }} style={styles.commentUserImage} />
                                        <Text
                                            style={{
                                                marginLeft: 5,
                                                color: '#777',
                                                textTransform: 'lowercase',
                                                flexWrap: 'wrap',
                                                maxWidth: '80%',
                                            }}
                                        >
                                            {item.message}
                                        </Text>

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
                        ListEmptyComponent={() => (
                            <Text style={styles.noCommentsText}>No notifications yet</Text>
                        )}
                    />
                )}
            </View>
        </>
    );
};

export default Notifications;
