import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Animated, StyleSheet, Modal, ScrollView, AppState, RefreshControl, ActivityIndicator} from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddComment from './AddComment';
import { useFocusEffect} from '@react-navigation/native';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { ContentCaption, ContentLeft, ContentLeftBottomNameUserText, ContentLeftImg, ContentRight, FullScreen } from '@/styles/Home';
import { BlurView } from 'expo-blur';
import { useUser } from '@/utils/useContext/UserContext';
import { formatCount, formatTime } from '@/services/core/globals';
import { io } from 'socket.io-client';
import {  router, usePathname } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from './Button';
const socket = io('https://backend-server-quhu.onrender.com'); 


interface LikedState {
  [key: string]: boolean;
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

type VideoItem = {
  id?: number;
  _id?: string;
  mediaSrc: string;
  authorName: string;
  caption: string;
  authorProfilePicSrc: string;
  privacy: string;
  likes: number;
  comments?: Comment[];
  likedBy: string[];
  price: number;
  subscribers:string[]
  createdBy: string;
};

interface Reply {
  comment: string;
  username: string;
  authorId: string;
  authorProfilePicSrc: string;
  createdAt: string; 
}

interface ReplyUpdate {
  commentId: string;
  reply: Reply;
}

export default function PostWithCaption() {
  const [showPrivateContent, setShowPrivateContent] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const videoRefs = useRef<(Video | null)[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);  
  const scrollY = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});


  const toggleReplies = (commentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };


  useEffect(() => {
    socket.on('likeUpdate', (data) => {
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video._id === data.contentId ? { ...video, likes: video.likes + 1 } : video
        )
      );
    });
  
    socket.on('unlikeUpdate', (data) => {
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video._id === data.contentId ? { ...video, likes: video.likes - 1 } : video
        )
      );
    });
  
    return () => {
      socket.off('likeUpdate');
      socket.off('unlikeUpdate');
    };
  }, []);


  const getTruncatedCaption = (caption: string) => {
    const words = caption.split(' ');
    if (words.length > 10) {
      return words.slice(0, 10).join(' ') + '...';
    }
    return caption;
  };


  const togglePrivacy = () => {
    setShowPrivateContent(prev => !prev);
  };


  const fetchData = async () => {
    setLoading(true); 
    try {
      const response = await fetch(`https://backend-server-quhu.onrender.com/content/${user?.id}`);
      const data = await response.json();
    
      // Filter the videos based on the privacy setting
      const filteredVideos = data.filter((video: VideoItem) => 
        showPrivateContent ? video.privacy === 'private' : video.privacy === 'public'
      );
      
      setVideos(filteredVideos);
      setIsPlaying(new Array(filteredVideos.length).fill(false));
      const allComments = filteredVideos.flatMap((video: VideoItem) => video.comments || []);
      setComments(allComments);
    } catch (error) {
      // console.error("Error fetching video data:", error);
    } finally {
      setLoading(false); 
    }
  };
  


  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
      const timeout = setTimeout(() => {
        setLoading(false); 
      }, 2000);
      return () => clearTimeout(timeout);
    }, [showPrivateContent, user?.id])
  );

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true); 
    await fetchData(); 
    setRefreshing(false); 
  };


  const isVideo = (url: string) => {
    return url.endsWith('.mp4') || url.endsWith('.mov');
  };
  
  const pathname = usePathname();
  const isTabScreen = pathname === '/';  


  useFocusEffect(
    React.useCallback(() => {
      if (!isTabScreen) {
        if (isPlaying[activeVideoIndex] && videoRefs.current[activeVideoIndex]) {
          videoRefs.current[activeVideoIndex]?.pauseAsync();
          setIsPlaying(prev => {
            const newState = [...prev];
            newState[activeVideoIndex] = false;  
            return newState;
          });
        }
      }
      return () => {
        videoRefs.current.forEach((videoRef, idx) => {
          if (videoRef) {
            videoRef.pauseAsync();
            setIsPlaying(prev => {
              const newState = [...prev];
              newState[idx] = false;
              return newState;
            });
          }
        });
      };
    }, [activeVideoIndex, isTabScreen])
  );
  

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.floor(event.nativeEvent.contentOffset.y / 566);
        if (index !== activeVideoIndex) {
          if (videoRefs.current[activeVideoIndex]) {
            videoRefs.current[activeVideoIndex]?.pauseAsync();
            setIsPlaying(prev => {
              const newState = [...prev];
              newState[activeVideoIndex] = false;
              return newState;
            });
          }
          setActiveVideoIndex(index);
        }
      }
    }
  );

  const handleVideoClick = () => {
    const currentPlaying = isPlaying[activeVideoIndex];
    if (currentPlaying) {
      videoRefs.current[activeVideoIndex]?.pauseAsync().catch();
    } else {
      videoRefs.current[activeVideoIndex]?.playAsync().catch();
    }
    setIsPlaying(prev => {
      const newState = [...prev];
      newState[activeVideoIndex] = !currentPlaying;
      return newState;
    });
  
    Animated.sequence([
      Animated.timing(pulseAnimation, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
 
  

  const toggleCaption = () => {
    setIsExpanded(!isExpanded);
  };
  const [selectedItem, setSelectedItem] = useState<VideoItem | null>(null);

const [loadingComments, setLoadingComments] = useState(false); 
const [videoData, setVideoData] = useState<VideoItem | null>(null); 
const openCommentsModal = async (videoItem: VideoItem) => {
  setSelectedItem(videoItem);  
  setModalVisible(true); 

  setLoadingComments(true);  

  try {
    const response = await fetch(`https://backend-server-quhu.onrender.com/content/single/${videoItem._id}`)
 
    if (!response.ok) {
      throw new Error('Failed to fetch content');
    }

    const data = await response.json();
    setComments(data.comments || []); 
    setVideoData(data);  

  } catch (error) {
    // console.error('Error fetching content:', error);
  } finally {
    setLoadingComments(false); 
  }
};

  useEffect(() => {
    if (modalVisible && selectedItem) {
      // Get only the comments for the selected video
      const selectedVideo = videos.find(video => video._id === selectedItem._id);
      if (selectedVideo) {
        setComments(selectedVideo.comments || []);
      }
    }
  }, [modalVisible, selectedItem, videos]);

  useFocusEffect(
    React.useCallback(() => {
      if (modalVisible && selectedItem) {
        const selectedVideo = videos.find(video => video._id === selectedItem._id);
        if (selectedVideo) {
          setComments(selectedVideo.comments || []);
        }
      }
    }, [modalVisible, selectedItem, videos])
  );
  
  const sendCommentToAPI = async (comment: string, mediaId: string, whoCommentsId: string, username: string) => {
    try {
      const payload = {
        comment,
        username: user.username,
        authorId: user.id,
        authorProfilePicSrc: user.profileImageUrl
      };
        const response = await fetch(`https://backend-server-quhu.onrender.com/content/${mediaId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Emit the comment update through WebSocket
      socket.emit('commentUpdate', { mediaId, comment: payload });
    } catch (error) {
      // console.error("Error sending comment:", error);
    }
  };
  const sendReplyToComment = async (comment:string, mediaId:string, commentId:string, username:string) => {
    try {
      const payload = {
        comment,
        username,
        authorId: user.id,
        authorProfilePicSrc: user.profileImageUrl,
        commentId, 
        mediaId
      };  
        const response = await fetch(`https://backend-server-quhu.onrender.com/content/${mediaId}/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        // console.error('Error response from server:', errorText);
        throw new Error('Network response was not ok');
      }
      const reply = {
        ...payload,
        createdAt: new Date().toISOString(),
      };
  
      setSelectedComment((prev) => {
        if (!prev) {
          return null; 
        }
  
        return {
          ...prev,
          replies: [...(prev.replies || []), reply],
        };
      });

      socket.emit('replyUpdate', { mediaId, commentId, reply: payload });
    } catch (error) {
      // console.error("Error sending reply:", error);
    }
  };

  useEffect(() => {
    const handleReplyUpdate = ({ commentId, reply }: { commentId: string; reply: Comment }) => {
      setComments((prevComments) => 
        prevComments.map((comment) =>
          comment._id === commentId
            ? { 
                ...comment, 
                replies: [...(comment.replies || []), reply]
              }
            : comment
        )
      );
    };
    socket.on('replyUpdate', handleReplyUpdate);
  
    return () => {
      socket.off('replyUpdate', handleReplyUpdate);
    };
  }, []);

  const likeContent = async (mediaId: string) => {
    const userId = user?.id;
  
    try {
      const response = await fetch(`https://backend-server-quhu.onrender.com/content/${mediaId}/like/${userId}`, {
        method: 'POST',
      });
  
      if (response.ok) {
        setVideos(prevVideos => 
          prevVideos.map(video => {
            if (video._id === mediaId) {
              const likedBy = video.likedBy.includes(userId)
                ? video.likedBy.filter(id => id !== userId) 
                : [...(video.likedBy || []), userId]; 
              return { ...video, likedBy, likes: likedBy.length };
            }
            return video;
          })
        );
        socket.emit('likeUpdate', { contentId: mediaId, userId });
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  };
  

  useEffect(() => {
    const handleCommentUpdate = (data:any) => {
      // Update videos and log the state after the update
      setVideos(prevVideos => {
        const updatedVideos = prevVideos.map(video => 
          video._id === data.postId 
            ? { ...video, comments: [...(video.comments || []), data.comment] } 
            : video
        );
      
        return updatedVideos;
      });
  
      if (selectedItem?._id === data.postId) {
        setComments(prevComments => {
          const updatedComments = [...prevComments, data.comment];

          return updatedComments;
        });
      }
    };
  
    socket.on('commentUpdate', handleCommentUpdate);
    
    return () => {
      socket.off('commentUpdate', handleCommentUpdate);
    };
  }, [selectedItem]);
  

const likeComment = async (commentId: string, mediaId:string) => {
  const userId = user.id;

  try {
    const response = await fetch(`https://backend-server-quhu.onrender.com/content/comments/${mediaId}/${commentId}/like/${userId}`, {
      
      method: 'POST',
    });
    
    if (response.ok) {
      // Update the local state immediately for UI responsiveness
      setComments((prevComments) => 
        prevComments.map(comment => {
          if (comment._id === commentId) {
            const likedBy = comment.likedBy?.includes(userId)
              ? comment.likedBy.filter(id => id !== userId)
              : [...(comment.likedBy || []), userId];
            return { ...comment, likedBy, likes: likedBy.length };
          }
          return comment;
        })
      );
    
      socket.emit('commentLikeUpdate', { mediaId, commentId, userId });
 
    } else {
      // Handle error
    }
  } catch (error) {
    // Handle error
  }
};

  const renderItem = ({ item, index }: { item: VideoItem; index: number }) => {
    const isPrivate = item.privacy === 'private';
    const isLikedByUser = item.likedBy.includes(user && user.id);
    
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

const handlePress = (
  userId: string, 
  username: string, 
  profileImageUrl: string,
) => {
  // Check if the pressed user is the logged-in user
  if (userId === user.id) {
    // Navigate to the logged-in user's profile
    router.push({
      pathname: '/Profile',
      params: {
        userId: userId,
        username: username,
        profileImageUrl: profileImageUrl,
      },
    });
  } else {
    // Navigate to the user details page
    router.push({
      pathname: '/userDetails/UserDetails',
      params: {
        searchUserId: userId,
        username: username,
        profileImageUrl: profileImageUrl,
      },
    });
  }
};

  return (
    <View style={{ width: '100%', backgroundColor: '#010101', paddingBottom: 20 }}>
        <View>
{isVideo(item.mediaSrc) ? (
  isPrivate && (!item.subscribers || !item.subscribers.includes(user?.id)) ? (
    // Private content locked
    <View style={styles.privateContent}>
      <Image
        source={{ uri: item.mediaSrc }}
        style={{ height: 500, width: '100%', opacity: 0.5 }}
      />
      <BlurView intensity={100} style={styles.blurView}>
        <TouchableOpacity onPress={handleNavigateToPostDetails} style={{ alignItems: 'center' }}>
          <Ionicons name="lock-closed" size={50} color="#fff" />
          <Text style={{ color: '#fff', textAlign: 'center', paddingVertical: 5 }}>
            Click to unlock content
          </Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  ) : (
    // Video content (either public or private but user is a subscriber)
    <TouchableOpacity activeOpacity={1} onPress={handleVideoClick}>
      <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
        <Video
          ref={(ref) => (videoRefs.current[index] = ref)}
          style={{ height: 520, width: '100%' }}
          source={{ uri: item.mediaSrc }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={activeVideoIndex === index && isPlaying[index]}
          isLooping
        />
        {!isPlaying[index] && (
          <View style={styles.overlay}>
            <Ionicons name="play-circle" size={60} color="#fff" />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  )
) : (
  <View style={styles.privateContent}>
    <Image
      source={{ uri: item.mediaSrc }}
      style={{ height: 500, width: '100%'}}
    />
    {isPrivate && (!item.subscribers || !item.subscribers.includes(user?.id)) && (
      <BlurView style={styles.blurView}>
        <TouchableOpacity onPress={handleNavigateToPostDetails} style={{ alignItems: 'center' }}>
          <Ionicons name="lock-closed" size={50} color="#fff" />
          <Text style={{ color: '#fff', textAlign: 'center', paddingVertical: 5 }}>
            Click to unlock content
          </Text>
        </TouchableOpacity>
      </BlurView>
    )}
  </View>
)}
           <FullScreen>
            <TouchableOpacity onPress={handleNavigateToPostDetails}>
              <MaterialCommunityIcons name="fullscreen" size={40} color="#fff" />
            </TouchableOpacity>
          </FullScreen>

          <ContentCaption>
            <TouchableOpacity onPress={toggleCaption}>
              <Text style={styles.expandBtn}>
                {isExpanded ? item.caption : getTruncatedCaption(item.caption)}
              </Text>
            </TouchableOpacity>
            {item.caption.split(' ').length > 10 && (
              <TouchableOpacity onPress={toggleCaption}>
                <Text style={{ color: '#fff', fontSize: 13, paddingLeft: 2, fontWeight:'bold' }}>
                  {isExpanded ? 'Show Less' : 'Show More'}
                </Text>
              </TouchableOpacity>
            )}
          </ContentCaption>

          <ContentLeftImg>
          <TouchableOpacity onPress={() => handlePress(item.createdBy, item.authorName, item.authorProfilePicSrc)}>
            <Image
              source={{ uri: item.authorProfilePicSrc }}
              style={{ height: 50, width: 44, borderRadius: 12,
                borderWidth: 2,
                borderColor: '#D1D5DB', }}
            />
            </TouchableOpacity>
          </ContentLeftImg>

          <ContentLeftBottomNameUserText style={{ textTransform: 'lowercase' }}>
            @{item.authorName}
          </ContentLeftBottomNameUserText>


<ContentRight>
  <TouchableOpacity onPress={() => likeContent(item._id || '')}>
    <View style={styles.likeButtonContainer}>
      <Ionicons
        name="heart"
        size={25}
        color={isLikedByUser ? 'red' : '#fff'}
      />
      {/* <Text style={styles.iconText}>{formatCount(item.likes)}</Text> */}
    </View>
  </TouchableOpacity>
</ContentRight>


          <ContentLeft>
            <TouchableOpacity onPress={() => openCommentsModal(item)}>
              <View style={{  flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',  
    borderRadius: 50,             
    padding: 10,                
    borderWidth: 1,              
    borderColor: '#888',                     
    justifyContent: 'center',    
    height: 45,                  
    width: 45, }}>
                <Ionicons name="chatbubble-outline" size={23} color="#fff" />
                {/* <Text style={styles.iconText}>{formatCount(item.comments?.length || 0)}</Text> */}
              </View>
            </TouchableOpacity>
          </ContentLeft>

          <View>
          <Text style={{ color: '#fff', paddingTop: 5, fontSize: 12, paddingLeft: 10, fontWeight: 'bold' }}>
  {item.likes === 1 
    ? '1 Like' 
    : `${formatCount(item.likes)} Likes`}
</Text>

          </View>
          <TouchableOpacity onPress={() => openCommentsModal(item)}>
  <View>
    {item.comments && item.comments.length > 0 && (
      <Text style={{ color: '#fff', paddingTop: 5, fontSize: 12, paddingLeft: 10, fontWeight: 'bold' }}>
        <Text style={styles.iconText}>
          {item.comments?.length === 1 
            ? '1 comment' 
            : `View All ${formatCount(item.comments?.length || 0)} Comments`}
        </Text>
      </Text>
    )}
  </View>
</TouchableOpacity>


          {item.comments && item.comments.length > 0 ? (
            <View>
              {/* Display only the last comment */}
              <View style={{ marginBottom: 5 }}>
                <Text style={{ color: '#fff', paddingTop: 3, fontSize: 12, paddingLeft: 10, textTransform: 'lowercase' }}>
                  @{item.comments[item.comments.length - 1].username}: {item.comments[item.comments.length - 1].comment}
                </Text>
                <Text style={{ color: '#fff', fontSize: 12, paddingLeft: 10 }}>
                  {formatTime(item.comments[item.comments.length - 1].createdAt)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: 'gray', padding: 10 }}>No comments yet</Text>
          )}

          <AddComment onSend={sendCommentToAPI} mediaId={item._id || ''} username={item.authorName} whoCommentsId={item.authorProfilePicSrc} />
        </View>
    </View>
  );
};


const [replyModalVisible, setReplyModalVisible] = useState(false);
const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

const showReplies= (comment: Comment) => {
  setSelectedComment(comment);
  setReplyModalVisible(true);
};



const toggleButton = (

<View style={styles.toggleContainer}>
  <TouchableOpacity onPress={() => setShowPrivateContent(false)}>
    <Text style={styles.toggleButtonText}>Public Content</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setShowPrivateContent(true)}>
    <Text style={styles.toggleButtonText}>Private Content</Text>
  </TouchableOpacity>
</View>



);

if (loading) {
  return (
    <View style={styles.container}>
    <ActivityIndicator size="large" color="#fff" />
  </View>
  );
}
  return (
    <View style={{ width: '100%', backgroundColor: '#010101', paddingBottom: 20 }}>
      {/* Toggle button at the top */}
      {toggleButton}
     <Animated.FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={(item) => (item.id ? item.id.toString() : item._id || '')}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListEmptyComponent={
        !loading && <Text style={styles.emptyText}>No videos available</Text>
      }
    />

<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    setModalVisible(false);
  }}
> 
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text  style={{color:'#000',fontSize:14, textAlign:'center'}}>{formatCount(comments.length)} Comments</Text>
      <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      {comments.length === 0 ? (
        <Text style={styles.noCommentsText}>No comments yet</Text>
      ) : (
        <FlatList
          data={comments
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
            keyExtractor={(item) => item._id || Math.random().toString()} 
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <Image
                source={{ uri: item.authorProfilePicSrc }}
                style={styles.commentUserImage}
              />
              <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>
                  @{item.username}:
                </Text>
                <Text style={styles.commentText}>{item.comment}</Text>
                <Text style={styles.commentTime}>{formatTime(item.createdAt)}</Text>
                <View style={styles.commentActions}>
                <TouchableOpacity onPress={() => {
                if (item._id && selectedItem?._id) {
                    likeComment(item._id, selectedItem._id); 
                } 
            }}>
                    <View style={styles.likeContainer}>
                      <Ionicons
                        name="heart"
                        size={30}
                        color={item.likedBy?.includes(user.id) ? 'red' : 'gray'}
                      />
                     <Text style={styles.likeCount}>{formatCount(item.likes ?? 0)}</Text>

                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.replyButton} onPress={() => showReplies(item)}>
                  <Text style={styles.replyButtonText}>
                    {item.replies?.length === 0
                      ? "Reply"
                      : item.replies?.length === 1
                        ? "1 Reply"
                        : `${formatCount(item.replies?.length ?? 0)} Replies`}
                  </Text>
                </TouchableOpacity>

                </View>
              </View>
            </View>
          )}
        />
      )}
      <AddComment
        onSend={(comment) => sendCommentToAPI(comment, selectedItem?._id || '', user.id, selectedItem?.authorName || '')}
        mediaId={selectedItem?._id || ''}
        username={user?.username || ''}
        whoCommentsId={user?.id}
      />
    </View>
  </View>
</Modal>

<Modal
  animationType="slide"
  transparent={true}
  visible={replyModalVisible}
  onRequestClose={() => {
    setReplyModalVisible(false);
    setSelectedComment(null);
  }}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text  style={{fontSize:14, textAlign:'center', textTransform:"lowercase"}} className='text-center text-[14px] lowercase'>Reply to: @{selectedComment?.username} comment:</Text>
      <Text style={styles.commentText}>"{selectedComment?.comment}"</Text> 
      <Text style={{fontSize:14, textAlign:'center'}}  className='text-center text-[14px]'>{formatCount(selectedComment?.replies?.length ?? 0) || 0} Replies</Text>
  
      <TouchableOpacity style={styles.closeButton} onPress={() => setReplyModalVisible(false)}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      {selectedComment?.replies?.length === 0 ? (
  <Text style={styles.noCommentsText}>No replies yet</Text>
) : (
  <ScrollView style={styles.repliesContainer}>
      {selectedComment?.replies?.slice().reverse().map((reply, index) => (
      <View key={index} style={styles.replyContainer}>
        <Image source={{ uri: reply.authorProfilePicSrc }} style={styles.replyUserImage} />
        <View style={styles.replyContent}>
          <Text   className='lowercase' style={styles.replyUsername}>@{reply.username}:</Text>
          <Text style={styles.replyText}>{reply.comment}</Text>
          <Text style={styles.replyTime}>{formatTime(reply.createdAt)}</Text>
        </View>
      </View>
    ))}
  </ScrollView>
)}


<AddComment
  onSend={(comment) => {
    sendReplyToComment(
      comment,
      selectedItem?._id || '', 
      selectedComment?._id || '', 
      selectedComment?.username || '' 
    );
  }}
  mediaId={selectedItem?._id || ''}
  username={user?.username || ''}
  whoCommentsId={user?.id}
/>

    </View>
  </View>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 10,
  },
  privateContent: {
    position: 'relative',
    height: 500,
    width: '100%',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    height: '70%',
    backgroundColor: 'white',
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
    marginLeft: 'auto', 
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'black',
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
  repliesContainer: { 
    marginLeft: 50,
    marginTop: 10,
  },
  replyContent: { 
    flex: 1,
  },
  toggleRepliesText: {
    color: 'blue',
    marginTop: 5,
    textDecorationLine: 'underline', 
  },
  replyUserImage: {
    width: 36,
    height: 36,
    borderRadius: 12,
    marginRight: 8,
    
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  expandBtn:{
    color:'#fff', 
    fontSize:14,
    textTransform:"capitalize",
    fontWeight:'bold'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#000000',
    top:30
  },
  likeButtonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',  
    borderRadius: 50,             
    padding: 10,                
    borderWidth: 1,              
    borderColor: '#888',         
    marginLeft: 10,              
    justifyContent: 'center',    
    height: 45,                  
    width: 45,                   
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  toggleContainerBtn:{
    width: '40%'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeButton: {
    textDecorationLine: 'underline',  
  },
 

});
