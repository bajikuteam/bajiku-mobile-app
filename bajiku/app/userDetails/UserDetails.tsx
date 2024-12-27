import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, GestureResponderEvent, TouchableWithoutFeedback, Modal, Pressable } from 'react-native';
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
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    borderWidth: 2,
    borderColor: '#D1D5DB',
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
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
},
modalImage: {
   height: 300,
   width: '80%',
  resizeMode: 'contain',
  borderRadius: 15,
  borderWidth: 2,
  borderColor: '#D1D5DB',
  
},
});

interface Subscriber {
  userId: string;
  expiryDate: string;
  isActive: boolean;
}
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
  authorName: string
  createdAt: string
}
interface Follower {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
}

const UserDetails = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'public' | 'private'>('all');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); 
  const params = useLocalSearchParams();
  const { searchUserId, profileImageUrl} = params;
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useUser();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Follower[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUserName] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null); 
const [userImage, setUserImage] = useState('')
  const paystackWebViewRef = useRef(paystackProps.PayStackRef);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleImagePress = () => {
    setImgModalVisible(true); 
  };

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
      const url = `https://backend-server-quhu.onrender.com/users/userDetails/${searchUserId}`;
  
      const response = await axios.get(url);
    
      if (response.status === 200 || response.status === 201) {
        // Set other details
        setFirstName(response?.data?.firstName);
        setLastName(response?.data?.lastName);
        setFollowers(response?.data?.followers);
        setFollowing(response?.data?.following);
        setUserName(response?.data?.username);
        setUserImage(response?.data?.profileImageUrl)
  
        // Get the current user ID (assumed logged-in user)
        const userId = user?.id  || await AsyncStorage.getItem('userId'); 
        const currentUserId = userId ;
  
        // Check if the current user is subscribed and if the subscription is active
        const currentUserSubscription = response?.data?.subscribers.find(
          (subscriber: Subscriber) => 
            subscriber?.userId === currentUserId && subscriber?.isActive === true
        );
  
        if (currentUserSubscription) {
          // Extract the expiry date from the subscriber object and set it
          const expiryDate = new Date(currentUserSubscription?.expiryDate);
          setExpiryDate(expiryDate);
        } else {
          setExpiryDate(null);
        }
  
        // Set the subscription status
        setIsSubscribed(!!currentUserSubscription);
      }
    } catch (error: any) {
      // Handle error
      // console.error('Error fetching user details:', error.message);
    }
  };
  


  const toggleFollow = async () => {
    const userId = user?.id  || await AsyncStorage.getItem('userId'); 
    try {
      const url = `https://backend-server-quhu.onrender.com/users/${userId}/${isFollowing ? 'unfollow' : 'follow'}`;
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
    const userId = user?.id  || await AsyncStorage.getItem('userId'); 
    setLoading(true);
    try {
      const response = await axios.get(`https://backend-server-quhu.onrender.com/content/${searchUserId}/${userId}`);
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


  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = user?.id || await AsyncStorage.getItem('userId');
      const storedUserEmail = user?.email || await AsyncStorage.getItem('email')
      setUserId(storedUserId);
      setUserEmail(storedUserEmail)
    };
    fetchUserId();
  }, []);


  const renderItem = ({ item }: { item: Post }) => {
    
    const isPrivate = item.privacy === 'private';
    const isSubscribed = user && item.subscribers && item.subscribers.includes(userId as string ?? null);


    const handleNavigateToPostDetails = () => {
      router.push( {pathname:'/content/contentDetails', params:{
        id: item._id,
        privacy: item.privacy,
        mediaSrc: item.mediaSrc,
        caption: item.caption,
        authorProfilePicSrc: item.authorProfilePicSrc,
        comments: item.comments as any,
        likes: item.likes,
        price: item.price,
        createdBy: item.createdBy,
        authorName: item.authorName,
        createdAt: item.createdAt
      }
     } )
  }
  
    return (
      <TouchableOpacity
      onPress={() => {
        if (!isPrivate || isSubscribed) {
          router.push({
            pathname: '/content/contentDetails',
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
              authorName: item.authorName,
              createdAt: item.createdAt
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
    const userId = user?.id  || await AsyncStorage.getItem('userId'); 
    try {
      const response = await axios.get(
        `https://backend-server-quhu.onrender.com/users/${userId}/following`
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


  const handlePaymentSuccess = async (res: any) => {
    setLoading(true);
    const userId = user?.id  || await AsyncStorage.getItem('userId'); 
    const paymentData = {
      transactionRef: res.data.transactionRef?.reference,
      userId: userId,
      subscribedUserId: searchUserId,
      status: res.data.event,
      amount: 20000,
    };  
    try {
      const response = await axios.post('https://backend-server-quhu.onrender.com/payment/track', paymentData);
      await UserDetails();
      await fetchPosts()

    } catch (error) {
      // if (error instanceof AxiosError) 
      // console.error('Error tracking payment:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentCancel = () => {
    // console.log('Payment cancelled');
    // You can add additional logic for handling cancellations
  }; 
  const [imgModalVisible, setImgModalVisible] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleConfirmPayment = () => {
    setModalVisible(false);
    paystackWebViewRef.current.startTransaction(); 
  };


  
  return (
    <><CustomHeader
      title={'User Profile'}
      onBackPress={goBack} /><SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => handleImagePress()}>
          <Image
            source={{ uri: typeof profileImageUrl === 'string' ? profileImageUrl : '' }}
            style={styles.profileImage} />
            </TouchableOpacity>

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
                  pathname: '/chat/message', params: {
                    profileImageUrl: profileImageUrl || '',
                    username: username,
                    senderId: userId,
                    receiverId: searchUserId,
                    senderName: username,
                  }
                });
              } } />
          </View>

<View>
      <Paystack
        paystackKey="pk_test_6738fce2cbc3ee832e7f7e86ee0e850969e48683"
        billingEmail={userEmail as string}
        billingName="Bajiku"
        activityIndicatorColor="#000"
        amount={20000}
        channels={["card", "bank", "ussd", "qr", "mobile_money"]}
        onCancel={handlePaymentCancel}
        onSuccess={handlePaymentSuccess}
        autoStart={false}
        ref={paystackWebViewRef}
      />
    
      <Button
        text={isSubscribed ? "Subscribed" : "Subscribe"}
        variant="secondary"
        style={{ width: 340, height: 40, marginTop: 10 }}
        icon={isSubscribed ? Icon : Icon} 
        iconProps={{ name: isSubscribed ? 'check' : 'bell', size: 14, color: '#ffffff' }}
        onClick={isSubscribed ? undefined : showModal}  
        disabled={isSubscribed}
      />

{expiryDate && (
  <Text style={{color: 'red', textAlign: 'center'}}>
    Subscription Expiry Date: {expiryDate.toLocaleDateString()}
  </Text>
)}

      {/* Modal for Confirmation */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
              Continue to Subscribe?
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 20, textTransform:"lowercase" }}>
              You are about to subscribe to @{username} for a monthly service fee of ₦20,000 and all their private content becomes public to you automatic for the next one month.
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button text="Cancel" onClick={hideModal} variant='secondary'  style={{ width: 90, height: 40, marginTop: 10 }} />
              <Button text="Continue" onClick={handleConfirmPayment} variant='primary'  style={{ width: 90, height: 40, marginTop: 10 }} />
            </View>
          </View>
        </View>
      </Modal>
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


        <Modal 
        visible={imgModalVisible} 
        transparent={true} 
        animationType="fade" 
        onRequestClose={() => setImgModalVisible(false)}
      >
          <Pressable style={styles.modalContainer} onPress={() => setImgModalVisible(false)}>
          <Image source={{ uri: userImage  as string}} style={styles.modalImage} />
        </Pressable>
      </Modal>
      </SafeAreaView></>
  );
};

export default UserDetails;

