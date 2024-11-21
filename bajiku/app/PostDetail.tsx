import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity, Modal, FlatList, ScrollView, StatusBar, Animated, TouchableWithoutFeedback } from 'react-native';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import AddComment from '@/components/AddComment';
import { ContentCaption, ContentLeft, ContentLeftImg, ContentRight } from '@/styles/Home';
import { formatTime } from '@/services/core/globals';
import { useUser } from '@/utils/useContext/UserContext';
import { io } from 'socket.io-client';
import { router, useLocalSearchParams } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';
const socket = io('https://backend-server-quhu.onrender.com'); 


interface Comment {
  _id: string;
  comment: string;
  username: string;
  createdAt: string;
  likedBy: string[];
  replies?: Comment[];
  authorProfilePicSrc: string
  likes?:number
}

interface PostDetailScreenRouteParams {
  id: string;
  privacy: string;
  mediaSrc: string;
  caption: string;
  authorProfilePicSrc: string;
  likes:number
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
};

const PostDetail = () => {
  // const route = useRoute<RouteProp<{ params: PostDetailScreenRouteParams }, 'params'>>();
 
  const params = useLocalSearchParams();
  const { privacy, mediaSrc, caption, id, authorProfilePicSrc, likes } = params;
  // const isVideo = mediaSrc && (mediaSrc.endsWith('.mp4') || mediaSrc.endsWith('.mov'));
  const isVideo = (Array.isArray(mediaSrc) 
  ? mediaSrc.some(src => typeof src === 'string' && (src.endsWith('.mp4') || src.endsWith('.mov')))
  : typeof mediaSrc === 'string' && (mediaSrc.endsWith('.mp4') || mediaSrc.endsWith('.mov')));

  const navigation = useNavigation();
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PostDetailScreenRouteParams | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);


  const [isPlaying, setIsPlaying] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Function to start the pulse animation
  const startPulse = () => {
    pulseAnim.setValue(1);
    Animated.timing(pulseAnim, {
      toValue: 1.5,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      pulseAnim.setValue(1);
    });
  };

  // Handle tap to toggle playback and trigger pulse
  const handleTap = () => {
    setIsPlaying((prev) => !prev);
    startPulse();
  };

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerShown: true,
  //     title: 'Content',
  //     headerStyle: {
  //       backgroundColor: '#075E54',
  //     },
  //     headerTintColor: '#fff',
  //   });
  // }, [navigation]);


  const [isLiked, setIsLiked] = useState(false);  // Declare the 'isLiked' state

  useEffect(() => {

    // const user = 
    // Function to fetch content data
    const getContent = async () => {
      try {
        const response = await fetch(`https://backend-server-quhu.onrender.com/content/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Set comments from response
        setComments(data.comments || []);
        
        // Check if the current user is in the 'likedBy' array
        const likedByUser = data.likedBy || [];
        const isLikedByUser = likedByUser.includes(user.id);
        
        // Update the 'isLiked' state
        setIsLiked(isLikedByUser);

      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };

    // Call the getContent function to fetch data when the component mounts
    getContent();
  }, [id, user.id]);

  // useEffect(() => {
  //   getContent();
  // }, []);

  // const isUserLiked = (likedBy: string[]) => {
  //   return likedBy.includes(user?.id);
  // };


  const openCommentsModal = async () => {
    setSelectedItem(params as any);
    setModalVisible(true);
    setLoadingComments(true);

    try {
      const response = await fetch(`https://backend-server-quhu.onrender.com/content/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoadingComments(false);
    }
  };
  


  const sendCommentToAPI = async (comment: string, mediaId: string,) => {
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
  
      if (id === data.postId) {
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
  
      setSelectedComment((prev:any) => {
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
    const userId = user.id;
  
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
  if (!mediaSrc) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
          Media source is missing.
        </Text>
      </View>
    );
  }

  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  
  const showReplies= (comment: Comment) => {
    setSelectedComment(comment);
    setReplyModalVisible(true);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.mediaContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <CustomHeader 
  title={'Content'} 
  onBackPress={goBack} 
 
/>

{isVideo ? (
        <TouchableWithoutFeedback onPress={handleTap}>
          <View style={styles.videoContainer}>
            <ExpoVideo
              source={{ uri: mediaSrc  as string}}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.COVER}
              shouldPlay={isPlaying}
             style={{ height: '100%', width: '100%' }}
             useNativeControls
            />

            {!isPlaying && (
              <MaterialCommunityIcons
                name="play-circle"
                style={styles.videoIcon}
                size={64}
                color="white"
              />
            )}

            {/* Pulse animation */}
            <Animated.View
              style={[
                // styles.pulseCircle,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.5],
                    outputRange: [1, 0],
                  }),
                },
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <Image source={{ uri: mediaSrc as string }} style={styles.postImage} />
      )}
        

        <ContentCaption>
          <TouchableOpacity onPress={openCommentsModal}>
            <Text style={{ color: '#fff' }}>{caption}</Text>
          </TouchableOpacity>
        </ContentCaption>

        <ContentLeftImg>
          <Image source={{ uri: authorProfilePicSrc as string }} style={{ height: 50, width: 44, borderRadius: 12 }} />
        </ContentLeftImg>

        <ContentLeft>
          <TouchableOpacity onPress={openCommentsModal}>
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubble-outline" size={30} color="#fff" />
              <Text style={styles.iconText}>{comments?.length}</Text>
            </View>
          </TouchableOpacity>
        </ContentLeft>

        <ContentRight>
          <TouchableOpacity  onPress={() => likeContent(id as string || '')}>
            <View style={styles.iconContainer}>

              <Ionicons name="heart"  size={40} color={isLiked ? 'red' : '#fff'}  />
              <Text style={styles.iconText}>{likes}</Text>
            </View>
          </TouchableOpacity>
        </ContentRight>
      </View>

      {/* Modal for comments */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text  className='text-center text-[14px]'>
              {comments.length} Comments
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
            {loadingComments ? (
              <Text style={{ color: '#fff', textAlign: 'center' }}>Loading comments...</Text>
            ) : comments.length === 0 ? (
              <Text style={styles.noCommentsText}>No comments yet</Text>
            ) : (
              <FlatList
              data={comments
                .slice()
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                keyExtractor={(item) => item._id || Math.random().toString()} 
                renderItem={({ item }) => (
                  <View style={styles.commentContainer}>
                    <Image source={{ uri: authorProfilePicSrc as string}} style={styles.commentUserImage} />
                    <View style={styles.commentContent}>
                      <Text style={styles.commentUsername}>@{item.username}:</Text>
                      <Text style={styles.commentText}>{item.comment}</Text>
                      <Text style={styles.commentTime}>{formatTime(item.createdAt)}</Text>
                      <View style={styles.commentActions}>
                        {/* <TouchableOpacity > */}
                        <TouchableOpacity onPress={() => {
                if (item._id && selectedItem?.id) {
                    likeComment(item._id, selectedItem.id); 
                } 
            }}>
                          <View style={styles.likeContainer}>
                          <Ionicons
                        name="heart"
                        size={30}
                        color={item.likedBy?.includes(user.id) ? 'red' : 'gray'}
                      />
                            <Text style={styles.likeCount}>{item.likes}</Text>
                          </View>
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.replyButton} onPress={() => showReplies(item)}>
                  <Text style={styles.replyButtonText}>
                    {item.replies?.length === 0
                      ? "Reply"
                      : item.replies?.length === 1
                        ? "1 Reply"
                        : `${item.replies?.length} Replies`}
                  </Text>
                </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              />
            )}

            <AddComment

              onSend={(comment) => sendCommentToAPI(comment, id as string )}
              mediaId={id as string}
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
      <Text className='text-center text-[14px] lowercase'>Reply to: @{selectedComment?.username} comment:</Text>
      <Text style={styles.commentText}>"{selectedComment?.comment}"</Text> 
      <Text className='text-center text-[14px]'>{selectedComment?.replies?.length || 0} Replies</Text>
  
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
          <Text className='lowercase' style={styles.replyUsername}>@{reply.username}:</Text>
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
      selectedItem?.id || '', 
      selectedComment?._id || '', 
      selectedComment?.username || '' 
    );
  }}
  mediaId={id as string}
  username={user?.username || ''}
  whoCommentsId={user?.id}
/>

    </View>
  </View>
</Modal>
    </KeyboardAvoidingView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mediaContainer: {
    flex: 1,
    position: 'relative',
  },
  postTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  postContent: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  videoIcon: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    color: '#fff',
    zIndex: 1,
  },
  addCommentWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    zIndex: 2,
  },
  iconContainer: {
    alignItems: 'center',
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
    justifyContent:'space-between'
  },
  likeCount: {
    marginLeft: 5,
    color: 'gray',
    fontSize: 14,
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
  iconText: {
    color: 'gray', 
    fontSize: 12,
    marginTop: 2, 
  },
  
  
 });
export default PostDetail;
