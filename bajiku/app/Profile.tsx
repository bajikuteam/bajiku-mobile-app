import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useUser } from '@/utils/useContext/UserContext';
import Button from '@/components/Button';
import { Video as ExpoVideo, ResizeMode } from 'expo-av'; 
import { router, useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamListComponent } from '@/services/core/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { formatCount } from '@/services/core/globals';
import CustomHeader from '@/components/CustomHeader';

type NavigationProp = StackNavigationProp<RootStackParamListComponent>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#000000"
  },
  sidebarContainer: {
    flex: 1,
    padding: 10,
  },
  profileContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
  
  },
  button: {
    width: 340,
    height: 40,
    marginTop: 10,
  },
  senbutton: {
    width: 165,
    height: 40,
    marginTop: 10,
  },
  postContainer: {
    width: 100,
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    padding: 5,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  postContent: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
  },
  postFooter: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 10,
    color: '#888',
  },
  allBtn:{
    color:'#fff',
    fontSize: 11,
  },
  icon: {
    color: '#555',
    fontSize: 18,
  },
  videoIcon: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    fontSize: 30,
    color: '#fff',
    zIndex: 1,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  noContentText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});


interface Comment {
  _id?: string;
  username: string;
  comment: string;
  createdAt: string;
  authorProfilePicSrc?: string;
  replies?: Comment[];
  likes?: number;
  expanded?: boolean;
  likedBy?: string[];
}
interface Post {
  _id: string;
  title: string;
  content: string;
  privacy: 'public' | 'private';
  mediaSrc: string;
  caption: string;
  authorProfilePicSrc: string
  likes?: number | undefined;
  comments: Comment[] | undefined;
  likedBy: string[];
  price: number
  createdBy: string
}

const Profile = () => {
  const { user } = useUser();

  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'public' | 'private' | 'subscribed' >('all');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); 
  const [subscribedPosts, setSubscribedPosts] = useState<Post[]>([]); 
  const [personalDetails, setPersonalDetails] = useState<string[]>([]);
  const [personalDetailsFollowers, setPersonalDetailsFollowers] = useState<string[]>([]);

  // useEffect(() => {
  //   fetchPosts();
  //   fetchPostsSubscribe ()
  // }, []);


  const fetchPersonalDetail = async () => {
    try {
      const response = await axios.get(
        `https://backend-server-quhu.onrender.com/users/${user?.id}`
      );
      setPersonalDetails(response.data.following || []); 
      setPersonalDetailsFollowers(response.data.followers || []); 
    } catch (error) {
      // console.error('Error fetching personal details:', error);
    }
  };

  // useEffect(() => {
  //   if (user?.id) {
  //     fetchPersonalDetail();
  //   }
  // }, [user?.id]);


  useFocusEffect(
    React.useCallback(() => {
      // Fetch posts
      fetchPosts();
      fetchPostsSubscribe();
  
      // Fetch personal details if user exists
      if (user?.id) {
        fetchPersonalDetail();
      }
  
      // Refresh action
      onRefresh();
  
      return () => {
      };
    }, [user?.id]) 
  );
  

  const fetchPostsSubscribe = async () => {
    setLoading(true);
    const userId = user?.id || await AsyncStorage.getItem('userId');
    try {
      const response = await axios.get(`https://backend-server-quhu.onrender.com/content/subscribed-by/${userId}`);
      const data = response.data;  
      if (data && Array.isArray(data)) {
        setSubscribedPosts(data); 
  
        // Automatically set the filtered posts if the current category is 'subscribed'
        if (selectedCategory === 'subscribed') {
          setFilteredPosts(data); 
        }
      }
    } catch (error) {
      // console.error('Error fetching subscribed posts:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    if (selectedCategory === 'subscribed' && subscribedPosts.length > 0) {
      setFilteredPosts(subscribedPosts); 
    }
  }, [subscribedPosts, selectedCategory]);
  

  const fetchPosts = async () => {
    setLoading(true);
    const userId = user?.id || await AsyncStorage.getItem('userId');;
    try {
      const response = await axios.get(`https://backend-server-quhu.onrender.com/content/user/${userId}`);
      const data = response.data;

      if (data && Array.isArray(data)) {
        setPosts(data);
        setFilteredPosts(data);
      } else {
        // console.error('Data is not an array:', data);
      }
    } catch (error) {
      // console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false); 
    }
  };


  const onRefresh = () => {
    setIsRefreshing(true);
    fetchPosts();
    fetchPostsSubscribe ()
    fetchPersonalDetail();
  };

  const handleCategoryChange = (category: 'all' | 'public' | 'private' | 'subscribed') => {
    setSelectedCategory(category);
    
    if (category === 'all') {
      setFilteredPosts(posts); 
    } else if (category === 'subscribed') {
      setFilteredPosts(subscribedPosts); 
    } else {
      const filtered = posts.filter((post: Post) => post.privacy === category); 
      setFilteredPosts(filtered);
    }
  };
  
  
  
  
  

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, [isFocused]);

  const navigation = useNavigation<NavigationProp>();

  const renderItem = ({ item }: { item: Post }) => {
    const isVideo = item.mediaSrc.endsWith('.mp4') || item.mediaSrc.endsWith('.mov');

    return (
      <TouchableOpacity
        onPress={() => {
          router.push( {pathname:'/PostDetail', params:{
            id: item._id,
            privacy: item.privacy,
            mediaSrc: item.mediaSrc,
            caption: item.caption,
            authorProfilePicSrc: item.authorProfilePicSrc,
            comments: item.comments as any,
            likes: item.likes,
            price: item.price,
            createdBy: item.createdBy
          }
         
          });
        }}
      >
        <View key={item._id} style={styles.postContainer}>
          {isVideo ? (
            <View style={styles.videoContainer}>
              <ExpoVideo
                source={{ uri: item.mediaSrc }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                style={{ width: '100%', height: '100%' }}
              />
              <MaterialCommunityIcons name="play-circle" style={styles.videoIcon} />
            </View>
          ) : (
            <Image source={{ uri: item.mediaSrc }} style={styles.postImage} />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  const goBack = () => {
    router.back();
  };

  return (
    <>
    <CustomHeader title={'Profile'}   onBackPress={goBack} />
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.profileContainer}>
        <Image source={{ uri: user?.profileImageUrl }} style={styles.profileImage} />
        <Text style={[styles.text, { textTransform: 'capitalize' }]}>{user?.firstName} {user?.lastName}</Text>
        <Text style={[styles.text, { textTransform: 'lowercase' }]}>@{user?.username}</Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8, marginTop: 8 }}>

          <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Following')}>
            <Icon name="user" size={20} color="#ffffff" />
            <Text style={styles.allBtn}>
              {personalDetails?.length === 1 ? '1 Following' : `${formatCount(personalDetails?.length)} Following`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Followers')}>
            <MaterialCommunityIcons name="account-group" size={20} color="#ffffff" />
            <Text style={styles.allBtn}>

              {personalDetailsFollowers?.length === 1 ? '1 Follower' : `${formatCount(personalDetailsFollowers?.length)} Followers`}
            </Text>
          </TouchableOpacity>
        </View>

        <Button text="Edit Profile" variant="secondary" style={styles.button} icon={Icon} iconProps={{ name: 'pencil', size: 14, color: '#ffffff' }} onClick={() => navigation.navigate('EditProfile')} />

        <View style={{ flexDirection: 'row', gap: 12, }}>
          <Button text="Subscribed To" variant="secondary" style={styles.senbutton} icon={Icon} iconProps={{ name: 'bell', size: 14, color: '#ffffff' }} onClick={() => navigation.navigate('SubscribedTo')} />
          <Button text="Total Earnings" variant="secondary" style={styles.senbutton} icon={Icon} iconProps={{ name: 'credit-card', size: 14, color: '#ffffff' }} onClick={() => router.push('/TotalEarnings')} />
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 15, marginBottom: 15, }}>
          <TouchableOpacity onPress={() => handleCategoryChange('all')} style={{ alignItems: 'center' }}>
            <Feather name="menu" size={20} color="#ffffff" />
            <Text style={styles.allBtn}>All Content</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCategoryChange('public')} style={{ alignItems: 'center' }}>
            <Ionicons name="eye" size={20} color="#ffffff" />
            <Text style={styles.allBtn}>Public Content</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCategoryChange('private')} style={{ alignItems: 'center' }}>
            <Ionicons name="eye-off" size={20} color="#ffffff" />
            <Text style={styles.allBtn}>Private Content</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() => {
              fetchPostsSubscribe();
              setSelectedCategory('subscribed');
            } }
          >
            <MaterialCommunityIcons name="image-album" size={20} color="#ffffff" />
            <Text style={styles.allBtn}>Subscribed Content</Text>
          </TouchableOpacity>

        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#075E54" />
            <Text>Loading Contents...</Text>
          </View>
        ) : filteredPosts.length > 0 ? (
          <FlatList
            data={filteredPosts}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10, gap: 5 }}
            contentContainerStyle={{ marginTop: 20, paddingHorizontal: 10 }}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#075E54" />} />
        ) : (
          <Text style={styles.noContentText}>No content yet</Text>
        )}
      </View>
    </SafeAreaView></>
  );
};

export default Profile;

