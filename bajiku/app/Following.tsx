import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, SafeAreaView, RefreshControl } from 'react-native';
import axios from 'axios';
import { useUser } from '@/utils/useContext/UserContext';
import SearchComponent from '@/components/Search';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/services/core/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '@env';
import { useTheme } from '@/utils/useContext/ThemeContext';

interface Follower {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
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
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();


    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: true, 
          title: 'Followings', 
          headerStyle: {
            backgroundColor: '#000000', 
          },
          headerTintColor: '#fff',
        });
      }, [navigation]);

    // const sidebarStyles = theme === 'dark' ? styles.sidebarDark : styles.sidebarLight;
  const textColor = theme === 'dark' ? '#fff' : '#000';
    const fetchFollowing = async () => {
        try {
            const userId = user.id || await AsyncStorage.getItem('userId');;
            setLoading(true);
            
            const response = await axios.get(`https://backend-server-quhu.onrender.com/users/${userId}/following`, {
                // const response = await axios.get(`http://192.168.1.107:5000/users/${userId}/following`, {
                params: { page, limit },
            });
            setFollowers(response.data.following);
            setTotalFollowers(response.data.totalFollowing);
        } catch (error) {
            // console.error('Error fetching followers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowing();
    }, [page]);

    const loadMoreFollowers = () => {
        if (followers.length < totalFollowers) {
            setPage(prev => prev + 1);
        }
    };

    const handleUnfollow = async (followerId: string) => {
        try {
            const userId = user.id;
           
            // await axios.post(`http://192.168.1.107:5000/users/${userId}/unfollow/${followerId}`);
            await axios.post(`https://backend-server-quhu.onrender.com/users/${userId}/unfollow/${followerId}`);
            setFollowers((prevFollowers) => prevFollowers.filter(follower => follower._id !== followerId));
        } catch (error) {
            // console.error('Error unfollowing:', error);
        }
    };

    const renderFollower = ({ item }: { item: Follower }) => (
        <View className='relative mt-4' style={styles.followerItem}>
            {item.profileImageUrl ? (
                <Image
                    source={{ uri: item.profileImageUrl }}
                    style={{ width: 36, height: 36, borderRadius: 10 }}
                />
            ) : (
                <View style={styles.placeholderImage} />
            )}
            <View style={styles.followerInfo}>
                <Text className='text-[12px]'>{item.firstName} {item.lastName}</Text>
                <Text className='text-[12px]'>@{item.username}</Text>
            </View>
            <View className='absolute gap-2 right-1' style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{
                        width: 72,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: 'black',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10,
                    }}
                    onPress={() => {
                        navigation.navigate('message', {
                            profileImageUrl: item.profileImageUrl || '',
                            username: item.username,
                            senderId: user.id,
                            receiverId: item._id,
                            firstName: item.firstName,
                            lastName: item.lastName,
                            senderName: user.username,
                        });
                    }}
                >
                    <Text style={styles.buttonText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.followButton, { backgroundColor: '#F90C0C' }]}
                    onPress={() => handleUnfollow(item._id)}
                    className='mb-3'
                >
                    <Text style={styles.buttonText}>Unfollow</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const onRefresh = async () => {
        setRefreshing(true);
        // setPage(1);
        await fetchFollowing(); 
        setRefreshing(false); 
    };

    return (
        
        <SafeAreaView style={styles.container}>
           <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.searchComponent}>
            <SearchComponent
                endpoint="https://api.example.com/users"
                fieldsToDisplay={['username', 'email', 'fullName']}
            />
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            <FlatList
                data={followers}
                keyExtractor={(item) => item._id}
                renderItem={renderFollower}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<Text style={[styles.noFollowersText, { color: textColor }]}>No followings found</Text>}
            />
        )}
    </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 0,
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
        paddingBottom: 10,
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
});

export default FollowingScreen;
