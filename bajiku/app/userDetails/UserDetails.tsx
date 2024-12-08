import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, GestureResponderEvent, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useUser } from '@/utils/useContext/UserContext';
import Button from '@/components/Button';
import { Video as ExpoVideo, ResizeMode } from 'expo-av'; 
import { router, useLocalSearchParams, } from 'expo-router';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import CustomHeader from '@/components/CustomHeader';
import { formatCount } from '@/services/core/globals';
import { BlurView } from 'expo-blur';

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
    marginTop:6
  
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
    backgroundColor:'#F90C0C'
  },

  senbuttonM:{
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
  followButton: {
    width: 72,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginRight: 5,
},

buttonText: {
    color: '#fff',
    fontSize: 12,
    borderBlockColor:'#fff',
},


overlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
overlayText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
},
blurView: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "black",
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
  subscribers:string[]
  createdBy: string;
  isVideo?: boolean;
  price?: number
}
interface Follower {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
}

const UserDetails = () => {
  // const { user } = useUser();
const [filteredFollowers, setFilteredFollowers] = useState<Follower[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'public' | 'private'>('all');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); 
  const params = useLocalSearchParams();
  const { searchUserId, profileImageUrl} = params;
  console.log('id...',searchUserId)
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useUser();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Follower[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUserName] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);


  useEffect(() => {
    if (searchUserId) {
      UserDetails();
    }
  }, [searchUserId]);
  


  const UserDetails = async () => {
    try {
      const url = `https://backend-server-quhu.onrender.com/users/${searchUserId}`;
      console.log('id...1',searchUserId)
      console.log('url...',url)
      const response = await axios.get(url);
      // console.log('alll',response)
        if (response.status === 200 || response.status === 201) {
       setFirstName( response.data.firstName)
      setLastName(response.data.lastName)
      setFollowers(response.data.followers)
      setFollowing(response.data.following)
      setUserName(response.data.username)
      console.log('last name',response.data.lastName)
      }
    } catch (error:any) {
      // console.error('Error fetching user details:', error.message);
    }
  };


  const toggleFollow = async () => {
    try {
      const url = `https://backend-server-quhu.onrender.com/users/${user?.id}/${isFollowing ? 'unfollow' : 'follow'}`;
      const body = isFollowing ? { userIdToUnfollow: searchUserId } : { userIdToFollow: searchUserId };
  
      const response = await axios.post(url, body);
      
      if (response.status === 200 || response.status === 201) {
        // Toggle the following status and update UI
        setIsFollowing(prevIsFollowing => !prevIsFollowing);
      }
      //  fetchFollowings();
      //  fetchFollowers();
    } catch (error) {
      // console.error('Error toggling follow:', error);
    }
  };
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://backend-server-quhu.onrender.com/content/user/${searchUserId}`);
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


  // const onRefresh = () => {
  //   setIsRefreshing(true);
  //   fetchPosts();
  // };

  const handleCategoryChange = (category: 'all' | 'public' | 'private') => {
    setSelectedCategory(category);

    if (category === 'all') {
      setFilteredPosts(posts);
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

//   const navigation = useNavigation<NavigationProp>();




  const renderItem = ({ item }: { item: Post }) => {
    const isVideo = item.mediaSrc.endsWith('.mp4') || item.mediaSrc.endsWith('.mov')
    const isPrivate = item.privacy === 'private';
    const isSubscribed = user && item.subscribers && item.subscribers.includes(user?.id);


    const handleNavigateToPostDetails = () => {
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
     } )
  }
  
    return (
      <TouchableOpacity
      onPress={() => {
        if (!isPrivate || isSubscribed) {
          router.push({
            pathname: '/PostDetail',
            params: {
              id: item._id,
              privacy: item.privacy,
              mediaSrc: item.mediaSrc,
              caption: item.caption,
              authorProfilePicSrc: item.authorProfilePicSrc,
              comments: item.comments as any,
              likes: item.likes,
              price: item.price,
              createdBy: item.createdBy,
            },
          });
        }
      }}
    >
      <View key={item._id} style={styles.postContainer}>
        {item.isVideo ? (
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

        {isPrivate && !isSubscribed && (
          <BlurView style={styles.blurView}>
        <TouchableOpacity onPress={handleNavigateToPostDetails} style={{ alignItems: 'center' }}>
          <Ionicons name="lock-closed" size={25} color="#fff" />
          <Text style={{ color: '#fff', textAlign: 'center', paddingVertical: 5 }}>
            Click to unlock content
          </Text>
        </TouchableOpacity>
      </BlurView>
        )}
      </View>
    </TouchableOpacity>
  );
};
 



  useEffect(() => {
    fetchFollowing();
  }, []);


  const fetchFollowing = async () => {
    try {
      const response = await axios.get(
        `https://backend-server-quhu.onrender.com/users/${user?.id}/following`
      );
      // Define the type for the array of followed users
      const followingList: Follower[] = response.data.following || [];
     
      // Check if the current user is following the target user (compare with _id)
      const isCurrentlyFollowing = followingList.some((followedUser: Follower) => followedUser?._id === searchUserId);
      // Set the follow status state
      setIsFollowing(isCurrentlyFollowing);
    } catch (error) {
    //   console.error('Error fetching following:', error);
    }
  };

  

//   const fetchFollowers = async () => {
//     try {
  
//         setLoading(true);
        
//         const response = await axios.get(`https://backend-server-quhu.onrender.com/users/${searchUserId}/followers`);
//         setFollowers(response.data.followers);
//         setFilteredFollowers(response.data.followers);
//     } catch (error) {
//         // console.error('Error fetching followers:', error);
//     } finally {
//         setLoading(false);
//         setIsRefreshing(false);
//     }
// };
// const fetchFollowings = async () => {
//   try {
//     const response = await axios.get(
//       `https://backend-server-quhu.onrender.com/users/${searchUserId}/following`
//     );
//     setFollowing(response.data.following);
//     // Ensure that 'following' is an array before setting it
//     if (Array.isArray(response.data.following)) {
//       setFollowing(response.data.following);
//       setFilteredFollowers(response.data.following);

//     } else {
//       // console.error('Expected "following" to be an array, but got:', response.data.following);
//       setFollowing([]); 
//     }
  
//   } catch (error) {
//     // console.error('Error fetching followings:', error);
//     setFollowing([]); 
//   }
// };


const onRefresh = async () => {
  setIsRefreshing(true);
  await fetchPosts();
  // await fetchFollowers();
  await fetchFollowing();
  // await fetchFollowings();
  await UserDetails()
  setIsRefreshing(false);
};


useFocusEffect(
  React.useCallback(() => {
    onRefresh(); 

    return () => {
    
    };
  }, [])
);

  const goBack = () => {
    router.back();
  };

  
  return (
    <><CustomHeader
      title={'User Profile'}
      onBackPress={goBack} /><SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        <View style={styles.profileContainer}>
          <Image
            source={{ uri: typeof profileImageUrl === 'string' ? profileImageUrl : '' }}
            style={styles.profileImage} />

          <Text style={[styles.text, { textTransform: 'capitalize', }]}>{firstName} {lastName}</Text>
          <Text style={[styles.text, { textTransform: 'lowercase' }]}>@{username}</Text>
          <View style={{ flexDirection: 'row', gap: 12, }}>
            <Button
              preventCondition={true}
              text={isFollowing ? 'Unfollow' : 'Follow'}
              variant={isFollowing ? 'danger' : 'secondary'}
              style={{
                width: 165,
                height: 40,
                marginTop: 10,
                backgroundColor: isFollowing ? 'red' : 'gray',
              }}
              onClick={toggleFollow} />
            <Button text="Message" variant="secondary" style={styles.senbuttonM}
              onClick={() => {
                router.push({
                  pathname: '/message', params: {
                    profileImageUrl: profileImageUrl || '',
                    username: username,
                    senderId: user?.id,
                    receiverId: searchUserId,
                    senderName: user?.username,
                  }
                });
              } } />
          </View>

          <View>

            <Button text="Subscribe" variant="secondary" style={styles.button} icon={Icon} iconProps={{ name: 'bell', size: 14, color: '#ffffff' }} />
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


            <TouchableOpacity style={{ alignItems: 'center' }}
              onPress={() => {
                router.push({
                  pathname: '/userDetails/usersFollowings', params: {
                    ExternalUersId: searchUserId,
                  }
                });
              } }>
              <Icon name="user" size={20} color="#ffffff" />
              <Text style={styles.allBtn}> {following.length === 1 ? '1 Following' : `${formatCount(following.length)} Following`}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => {
              router.push({
                pathname: '/userDetails/usersFollowers', params: {
                  ExternalUersId: searchUserId,
                }
              });
            } }>
              <MaterialCommunityIcons name="account-group" size={20} color="#ffffff" />
              <Text style={styles.allBtn}> {followers.length === 1 ? '1 Follower' : `${formatCount(followers.length)} Followers`}
              </Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#075E54" />
              <Text>Loading posts...</Text>
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

export default UserDetails;

