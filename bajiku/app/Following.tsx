import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, SafeAreaView, RefreshControl, TextInput } from 'react-native';
import axios from 'axios';
import { useUser } from '@/utils/useContext/UserContext';
import { router} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/utils/useContext/ThemeContext';
import CustomHeader from '@/components/CustomHeader';
import { useFocusEffect } from '@react-navigation/native';

interface Follower {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    followingCount?:number,
    followerCount?:number
}

const FollowingScreen = () => {
    const [followers, setFollowers] = useState<Follower[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const { user } = useUser();

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalFollowers, setTotalFollowers] = useState(0);
    const { theme } = useTheme();
    // const sidebarStyles = theme === 'dark' ? styles.sidebarDark : styles.sidebarLight;

    const goBack = () => {
        router.back();
      };
  const textColor = theme === 'dark' ? '#fff' : '#000';
    const fetchFollowing = async () => {
        try {
            const userId = user?.id || await AsyncStorage.getItem('userId');;
            setLoading(true);
            
            const response = await axios.get(`https://backend-server-quhu.onrender.com/users/${userId}/following`, {

            });
            setFollowers(response.data.following);
            setTotalFollowers(response.data.totalFollowing);
            setFilteredFollowers(response.data.following);
        } catch (error) {
            // console.error('Error fetching followers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowing();
    }, [page]);


    const handleUnfollow = async (followerId: string) => {
        try {
            const response = await fetch(`https://backend-server-quhu.onrender.com/users/${user?.id}/unfollow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userIdToUnfollow: followerId,
                }),
            });
    
            const data = await response.json();
            console.log('Unfollow response:', data); 
    
            if (response.ok && data.message === 'You have unfollowed the user') {
                console.log('Unfollowed successfully');
                setFollowers(prevFollowers => prevFollowers.filter(follower => follower._id !== followerId));
                setFilteredFollowers(prevFilteredFollowers => prevFilteredFollowers.filter(follower => follower._id !== followerId));
    
            } else {
                console.error('Failed to unfollow:', data);
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };
    
    
      

    const [searchQuery, setSearchQuery] = useState<string>(''); 
    const [filteredFollowers, setFilteredFollowers] = useState<Follower[]>([]);
    const handleSearch = (text: string) => {
        setSearchQuery(text);
        const filtered = followers.filter(follower => 
            `${follower.firstName} ${follower.lastName} ${follower.username}`
                .toLowerCase()
                .includes(text.toLowerCase())
        );
        setFilteredFollowers(filtered);
    };


    const handlePress = (
        userId: string, 
        username: string, 
        firstName: string, 
        lastName: string, 
        profileImageUrl: string,
        followingCount: number, 
        followerCount: number,
      ) => {
        // Check if the pressed user is the logged-in user
        if (userId === user?.id) {
          // Navigate to the logged-in user's profile
          router.push({
            pathname: '/Profile',
            params: {
              userId: userId,
              username: username,
              firstName: firstName,
              lastName: lastName,
              profileImageUrl: profileImageUrl,
              followingCount:followingCount,
              followerCount:followerCount
            },
          });
        } else {
          // Navigate to the user details page
          router.push({
            pathname: '/userDetails/UserDetails',
            params: {
              searchUserId: userId,
              username: username,
              firstName: firstName,
              lastName: lastName,
              profileImageUrl: profileImageUrl,
              followingCount:followingCount,
              followerCount:followerCount
            },
          });
        }
      };

    const renderFollower = ({ item }: { item: Follower }) => (
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
                <View style={styles.followerInfo}>
                    <Text style={styles.followerName}>{item.firstName} {item.lastName}</Text>
                    <Text style={styles.followerUsername}>@{item.username}</Text>
                </View>
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.messageButton}
                        onPress={() => {
                            router.push({pathname:'/message', params:{
                                profileImageUrl: item.profileImageUrl || '', 
                                username: item.username,
                                senderId: user?.id, 
                                receiverId: item?._id, 
                                senderName: user?.username, 
                            }
                             
                            });
                        }}
                    >
                        <Text style={styles.buttonText}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
    style={[styles.followButton, { backgroundColor: '#F90C0C' }]}
    onPress={() => handleUnfollow(item._id)}
    className="mb-3"
    disabled={!followers.some(follower => follower._id === item._id)} 
>
    <Text style={styles.buttonText}>Unfollow</Text>
</TouchableOpacity>

            </View>
        </View>
    );



    const onRefresh = async () => {
        setRefreshing(true);
        await fetchFollowing();
        setRefreshing(false);
      };
      
      
      useFocusEffect(
        React.useCallback(() => {
          onRefresh(); 
      
          return () => {
          
          };
        }, [])
      );

    return (
        <><CustomHeader
            title={"Following"}
            onBackPress={goBack} /><SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#000000" />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for followings..."
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
                        ListEmptyComponent={<Text style={[styles.noFollowersText, { color: textColor }]}>No followings found</Text>} />
                )}
            </SafeAreaView></>
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
    placeholderImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ddd',
    },
    followerInfo: {
        marginLeft: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        borderBlockColor:'#fff',
    },
    noFollowersText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    followButton: {
        width: 72,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginRight: 5,
    },
    loadMoreButton: {
        marginVertical: 20,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    loadMoreText: {
        color: '#fff',
        fontSize: 16,
    },
    followerUsername: {
        fontSize: 12,
        color: '#666',
     
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginLeft: 'auto',
        gap:5
    },
    messageButton: {
        width: 72,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderWidth: 2,       
        borderColor: '#ffffff',
    },
    followerName: {
        fontSize: 12,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
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
        marginTop:40,
       
        
    },
});

export default FollowingScreen;
