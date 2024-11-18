import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useUser } from '@/utils/useContext/UserContext';
import Button from '@/components/Button';
import Sidebar from '@/components/Sidebar';
import { Video as ExpoVideo, ResizeMode } from 'expo-av'; 
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamListComponent } from '@/services/core/types';

type NavigationProp = StackNavigationProp<RootStackParamListComponent>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    width: 340,
    height: 40,
    marginTop: 10,
  },
  senbutton: {
    width: 160,
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
});

interface Post {
  _id: string;
  title: string;
  content: string;
  privacy: 'public' | 'private';
  mediaSrc: string;
  caption: string;
  authorProfilePicSrc: string
}

const Profile = () => {
  const { user } = useUser();

  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'public' | 'private'>('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://192.168.174.55:5000/content/user/7249575860028571648');
        const data = response.data;

        if (data && Array.isArray(data)) {
          setPosts(data);
          setFilteredPosts(data);
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleCategoryChange = (category: 'all' | 'public' | 'private') => {
    setSelectedCategory(category);

    if (category === 'all') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post: Post) => post.privacy === category);
      setFilteredPosts(filtered);
    }
  };
  const navigation = useNavigation<NavigationProp>();
  // const handlePostClick = (post: Post) => {
  //   navigation.navigate('PostDetail', {post._id,}); 
  // };

  const renderItem = ({ item }: { item: Post }) => {
    const isVideo = item.mediaSrc.endsWith('.mp4') || item.mediaSrc.endsWith('.mov');

    return (
      <TouchableOpacity
      onPress={() => {
        navigation.navigate('PostDetail', {
            id: item._id, 
            privacy: item.privacy,  
            mediaSrc: item.mediaSrc,
            caption: item.caption,
            authorProfilePicSrc:item.authorProfilePicSrc


          
        });
    }}
      //  onPress={() => handlePostClick(item)} key={item._id} 
       >
      <View key={item._id} style={styles.postContainer} >
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />
      <View style={styles.sidebarContainer}>
        <Sidebar />
      </View>

      <View style={styles.profileContainer}>
        <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
        <Text style={styles.text}>{user.firstName} {user.lastName}</Text>
        <Text style={[styles.text, { textTransform: 'lowercase' }]}>@{user.username}</Text>

        <Button text="Edit Profile" variant="secondary" style={styles.button} icon={Icon} iconProps={{ name: 'pencil', size: 14, color: '#000' }} />
        
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button text="Subscribers" variant="secondary" style={styles.senbutton} icon={Icon} iconProps={{ name: 'bell', size: 14, color: '#000' }} />
          <Button text="Total Earnings" variant="secondary" style={styles.senbutton} icon={Icon} iconProps={{ name: 'credit-card', size: 14, color: '#000' }} />
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <TouchableOpacity onPress={() => handleCategoryChange('all')} style={{ alignItems: 'center' }}>
            <Feather name="menu" size={20} color="#000" />
            <Text style={{ fontSize: 10 }}>All Content</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCategoryChange('public')} style={{ alignItems: 'center' }}>
            <Ionicons name="eye" size={20} color="#000" />
            <Text style={{ fontSize: 10 }}>Public Content</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCategoryChange('private')} style={{ alignItems: 'center' }}>
            <Ionicons name="eye-off" size={20} color="#000" />
            <Text style={{ fontSize: 10 }}>Private Content</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Icon name="user" size={20} color="#000" />
            <Text style={{ fontSize: 10 }}>Following</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: 'center' }}>
            <MaterialCommunityIcons name="account-group" size={20} color="#000" />
            <Text style={{ fontSize: 10 }}>Followers</Text>
          </TouchableOpacity>
        </View>

        {/* FlatList for posts */}
        <FlatList
          data={filteredPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={3} 
          columnWrapperStyle={{
            justifyContent: 'space-between', 
            marginBottom: 10, 
          }}
          contentContainerStyle={{
            marginTop: 20, 
            paddingHorizontal: 10,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
