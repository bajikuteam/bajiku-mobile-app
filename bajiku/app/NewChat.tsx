import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, SafeAreaView, RefreshControl } from 'react-native';
import axios from 'axios';
import { useUser } from '@/utils/useContext/UserContext'; 
import SearchComponent from '@/components/Search';
import { router, useNavigation } from 'expo-router';
import { RootStackParamList } from '@/services/core/types';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/utils/useContext/ThemeContext';
import CustomHeader from '@/components/CustomHeader';

interface Follower {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
}

const NewChatScreen = () => {
    const [followers, setFollowers] = useState<Follower[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useUser();
    const [following, setFollowing] = useState<Follower[]>([]); 
    const [refreshing, setRefreshing] = useState<boolean>(false); 
    const { theme } = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();


    // const sidebarStyles = theme === 'dark' ? styles.sidebarDark : styles.sidebarLight;
  const textColor = theme === 'dark' ? '#fff' : '#000';
    const fetchFollowers = async () => {
        try {
            const userId = user?.id || await AsyncStorage.getItem('userId');
            setLoading(true);
            
            const response = await axios.get(`https://backend-server-quhu.onrender.com/users/${userId}/followers`);
            setFollowers(response.data.followers);
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
        // await fetchFollowing(); 
    };

    useEffect(() => {
        onRefresh(); 
    }, []);

    const goBack = () => {
        router.back();
      };
    
    const renderFollower = ({ item }: { item: Follower }) => {
        const isFollowing = following.some(f => f._id === item._id); 
        return (
            <View style={styles.followerItem}>
                {item.profileImageUrl ? (
                    <Image
                        source={{ uri: item.profileImageUrl }}
                        style={styles.profileImage}
                    />
                ) : (
                    <View style={styles.placeholderImage} />
                )}

                <View style={styles.followerInfo}>
                    <Text style={styles.followerName}>{item.firstName} {item.lastName}</Text>
                    <Text style={styles.followerUsername}>@{item.username}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.messageButton}
                        onPress={() => {
                            navigation.navigate('message', {
                                profileImageUrl: item.profileImageUrl || '', 
                                username: item.username,
                                senderId: user?.id, 
                                receiverId: item?._id, 
                                senderName: user?.username, 
                            });
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
            title={"New Chat"}
            onBackPress={goBack} /><SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#000000" />
                <View style={styles.searchComponent}>
                    <SearchComponent
                        endpoint="https://api.example.com/users"
                        fieldsToDisplay={['username', 'email', 'fullName']} />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <FlatList
                        data={followers}
                        keyExtractor={(item) => item._id}
                        renderItem={renderFollower}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        ListEmptyComponent={<Text style={[styles.noFollowersText, { color: textColor }]}>
                            No followers found
                        </Text>} />
                )}
            </SafeAreaView></>
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
});

export default NewChatScreen;
