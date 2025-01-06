import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, SafeAreaView, RefreshControl, TextInput } from 'react-native';
import axios from 'axios';
import { useUser } from '@/utils/useContext/UserContext'; 
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/utils/useContext/ThemeContext';
import CustomHeader from '@/components/CustomHeader';

interface Follower {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    followingCount?:number,
    followerCount?:number
}

const SubToScreen = () => {
    const [followers, setFollowers] = useState<Follower[]>([]);
    const [filteredFollowers, setFilteredFollowers] = useState<Follower[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useUser();
    const [following, setFollowing] = useState<Follower[]>([]); 
    const [refreshing, setRefreshing] = useState<boolean>(false); 
    const [searchQuery, setSearchQuery] = useState<string>(''); 
    const { theme } = useTheme();
    const textColor = theme === 'dark' ? '#fff' : '#000';

    const fetchFollowers = async () => {
        try {
            const userId = user?.id || await AsyncStorage.getItem('userId');
            setLoading(true);
            
            const response = await axios.get(`https://my-social-media-bd.onrender.com/users/${userId}/subscribedTo`);
           
            setFollowers(response.data.subscribedTo);
            setFilteredFollowers(response.data.subscribedTo);

        } catch (error) {
            // console.error('Error fetching followers:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    const onRefresh = async () => {
        setRefreshing(true);
        await fetchFollowers(); 
    };

    useEffect(() => {
        onRefresh(); 
    }, []);


    const handleSearch = (text: string) => {
        setSearchQuery(text);
        const filtered = followers.filter(follower => 
            `${follower.firstName} ${follower.lastName} ${follower.username}`
                .toLowerCase()
                .includes(text.toLowerCase())
        );
        setFilteredFollowers(filtered);
    };

    const handlePress = async (
        userId: string, 
        username: string, 
        firstName: string, 
        lastName: string, 
        profileImageUrl: string,
        followingCount: number, 
        followerCount: number
      ) => {
        // Get the logged-in user's ID
        const loggedInUserId = user?.id || await AsyncStorage.getItem('userId');
      
        if (loggedInUserId === userId) {
          // Navigate to the logged-in user's profile
          router.push({
            pathname: '/profile/Profile',
            params: {
              userId: loggedInUserId,
              username,
              firstName,
              lastName,
              profileImageUrl,
              followingCount,
              followerCount,
            },
          });
        } else {
          // Navigate to the user details page
          router.push({
            pathname: '/userDetails/UserDetails',
            params: {
              searchUserId: userId,
              username,
              firstName,
              lastName,
              profileImageUrl,
              followingCount,
              followerCount,
            },
          });
        }
      };
      

      const [userId, setUserId] = React.useState<string | null>(null);

      React.useEffect(() => {
        const fetchUserId = async () => {
          const userId = user?.id  || await AsyncStorage.getItem('userId'); 
          const storedUserId = userId;
          setUserId(storedUserId);
        };
        fetchUserId();
      }, []);

    const renderFollower = ({ item }: { item: Follower }) => {
        const isFollowing = following.some(f => f._id === item._id); 
        return (
            <View style={styles.followerItem}>
                  <TouchableOpacity
                onPress={() =>
                    handlePress(
                        item._id,
                        item.username,
                        item.firstName,
                        item.lastName,
                        item.profileImageUrl as string,
                        item.followingCount ?? 0 ,
                        item.followerCount ?? 0
                    )
                }
            >
                {item.profileImageUrl ? (
                    <Image
                        source={{ uri: item.profileImageUrl }}
                        style={styles.profileImage}
                    />
                ) : (
                    <View style={styles.placeholderImage} />
                )}
                </TouchableOpacity>

                <TouchableOpacity
                onPress={() =>
                    handlePress(
                        item?._id,
                        item?.username,
                        item?.firstName,
                        item?.lastName,
                        item?.profileImageUrl as string,
                        item?.followingCount ?? 0 ,
                        item?.followerCount ?? 0
                    )
                }
            >
                <View style={styles.followerInfo}>
                    <Text style={styles.followerName}>{item?.firstName} {item?.lastName}</Text>
                    <Text style={styles.followerUsername}>@{item?.username}</Text>
                </View>
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.messageButton}
                        onPress={() => {
                            router.push({pathname:'/chat/message', params:{
                                profileImageUrl: item?.profileImageUrl || '', 
                                username: item?.username,
                                senderId: userId, 
                                receiverId: item?._id, 
                                senderName: user?.username, 
                            }});
                        }}
                    >
                        <Text style={styles.buttonText}>Message</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    };

    return (
        <><CustomHeader
            title={"Subscribed To"}
            onBackPress={() => router.back()} />
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#000000" />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for users you're subscribed to..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
              
                {loading ? (
                    <ActivityIndicator size="large" color="#fff" />
                ) : (
                    <FlatList
                        data={filteredFollowers}
                        keyExtractor={(item) => item._id}
                        renderItem={renderFollower}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        ListEmptyComponent={<Text style={[styles.noFollowersText, { color: textColor }]}>
                        You have not Subscribe to any user
                        </Text>} />
                )}
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 0,
        backgroundColor: '#000000', 
    },
    searchComponent: {
        marginBottom: 20,
    },
    followerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 15,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
    },
    placeholderImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ddd',
    },
    followerInfo: {
        marginLeft: 10,
    },
    followerName: {
        fontSize: 12,
        color: '#666',
          textTransform:'lowercase'
    },
    followerUsername: {
        fontSize: 12,
        color: '#666',
          textTransform:'lowercase'
     
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    messageButton: {
        width: 85,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderWidth: 2,       
        borderColor: '#ffffff',
    },
    followButton: {
        width: 72,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
    },
    noFollowersText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 40,
        paddingHorizontal: 10,
        marginBottom: 40,
        color: '#000',
        backgroundColor: '#fff',
        marginTop:40
    },
    totalFollowersText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default SubToScreen;
