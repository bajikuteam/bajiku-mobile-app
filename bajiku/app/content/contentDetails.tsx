import React, { useState, useEffect, useRef } from "react";
import { Paystack, paystackProps } from "react-native-paystack-webview";
import {View,Text,Image, KeyboardAvoidingView, Platform, TouchableOpacity,Modal,FlatList, ScrollView,StatusBar, Animated,TouchableWithoutFeedback,Alert, ActivityIndicator,} from "react-native";
import { Video as ExpoVideo, ResizeMode } from "expo-av";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AddComment from "@/components/AddComment";
import {ContentLeft,ContentLeftBottomNameUserText,ContentRight, PContentCaption,PContentLeftImg,} from "@/styles/Home";
import { formatCount, formatCurrency, formatTime } from "@/services/core/globals";
import { useUser } from "@/utils/useContext/UserContext";
import { io } from "socket.io-client";
import { router, useLocalSearchParams } from "expo-router";
import CustomHeader from "@/components/CustomHeader";
import { BlurView } from "expo-blur";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/Button";
import styles from "@/styles/contentDetails";
import { Comments, ContentType, PostDetailScreenRouteParams } from "@/services/core/types";
import { SafeAreaView } from "react-native-safe-area-context";
const socket = io("https://my-social-media-bd.onrender.com");
import * as NavigationBar from 'expo-navigation-bar';
import { useIsFocused } from "@react-navigation/native";

  
const ContentDetails = () => {

    const { user } = useUser();
    const [comments, setComments] = useState<Comments[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PostDetailScreenRouteParams | null>(null);
    const [videos, setVideos] = useState<ContentType[]>([]);
    const [isSubscriber, setIsSubscriber] = useState(false); 
    const [isPlaying, setIsPlaying] = useState(false);
    const [createdBy, setCreatedBy] = useState('');
    const [privacy, setPrivacy] = useState('');
    const [mediaSrc, setMediaSrc] = useState('');
    const [caption, setCaption] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [authorProfilePicSrc, setAuthorProfilePicSrc] = useState('')
    const [createdAt, setCreated] = useState('');
    const [likes, setLikes] = useState(0);
    const [price, setPrice] = useState('');
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [isExpanded, setIsExpanded] = useState(false);
    const paystackWebViewRef = useRef(paystackProps.PayStackRef);
    const [loading, setLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const params = useLocalSearchParams();
    const {id, commentId, commentId: highlightedCommentId, replyId, replyId:highlightedtId} = params;

    const [replyModalVisible, setReplyModalVisible] = useState(false);
    const [selectedComment, setSelectedComment] = useState<Comments | null>(null);

    const isFocused = useIsFocused();

    useEffect(() => {
      if (isFocused) {
        NavigationBar.setBackgroundColorAsync("#000000");
        NavigationBar.setButtonStyleAsync("light");
      }
    }, [isFocused]);
  
  
    const showReplies = (comment: Comments) => {
      setSelectedComment(comment);
      setReplyModalVisible(true);
    };

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

    useFocusEffect(
      React.useCallback(() => {
        getContent(); 
      }, [id, user?.id, isSubscriber, isLiked]) 
    );
    useEffect(() => {
      getContent();
    }, [id, user?.id, isSubscriber, isLiked, ]); 

    useEffect(() => {
    }, [isLiked]);
    
      // useEffect(() => {
        const getContent = async () => {
          try {
            const response = await fetch(
              `https://my-social-media-bd.onrender.com/content/single/${id}`
            );
    
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            // Set comments from response
            setComments(data?.comments || []);
            setAuthorProfilePicSrc(data?.authorProfilePicSrc); 
            setCaption(data?.caption);
            setCreated(data?.createdAt);
            setCreatedBy(data?.createdBy);
            setPrice(data?.price);
            setMediaSrc(data?.mediaSrc);
            setPrivacy(data?.privacy);
            setCaption(data?.caption)
            setAuthorName(data?.authorName);
            setLikes(data?.likes);
            // Check if the current user is in the 'likedBy' array
            const likedByUser = data?.likedBy || [];
            const userId = user?.id  || await AsyncStorage.getItem('userId'); 
            const isLikedByUser = likedByUser.includes(userId);
            setIsLiked(isLikedByUser);
            const isSubscriber = data?.subscribers && data?.subscribers.includes(userId);
            setIsSubscriber(isSubscriber); 
      
          } catch (error) {
            // console.error('Error fetching data:', error);
          }
        };


// const isVideo = mediaSrc.endsWith('.mp4') || mediaSrc.endsWith('.webm') || mediaSrc.endsWith('.avi');
  
const isVideo = Array.isArray(mediaSrc)
? mediaSrc.some(
    (src) =>
      typeof src === "string" &&
      (src.endsWith(".mp4") || src.endsWith(".mov"))
  )
: typeof mediaSrc === "string" &&
  (mediaSrc.endsWith(".mp4") || mediaSrc.endsWith(".mov"));



const isPrivate = privacy === "private";
const [creator, setIsCreator] = useState(false);

useEffect(() => {
  const checkCreator = async () => {
    const userId = await AsyncStorage.getItem('userId');
    setIsCreator(createdBy === user?.id || createdBy === userId);
  };

  checkCreator();
}, [createdBy]);


const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = user?.id || await AsyncStorage.getItem('userId');
      const storedUserEmail = user?.email|| await AsyncStorage.getItem('email')
      setUserId(storedUserId);
      setUserEmail(storedUserEmail)
    };
    fetchUserId();
  }, []);

  const goBack = () => {
    router.back();
  };

  const toggleCaption = () => {
    setIsExpanded(!isExpanded);
  };
  const getTruncatedCaption = (caption: string) => {
    const words = caption.split(" ");
    if (words.length > 15) {
      return words.slice(0, 15).join(" ") + "...";
    }
    return caption;
  };


  const sendCommentToAPI = async (comment: string, mediaId: string) => {
    try {
      const payload = {
        comment,
        username: user?.username,
        authorId: user?.id,
        authorProfilePicSrc: user?.profileImageUrl,
      };
      const response = await fetch(
        `https://my-social-media-bd.onrender.com/content/${mediaId}/comments/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Emit the comment update through WebSocket
      socket.emit("commentUpdate", { mediaId, comment: payload });
    } catch (error) {
      // console.error("Error sending comment:", error);
    }
  };


  useEffect(() => {
    const handleCommentUpdate = (data: any) => {
      // Update videos and log the state after the update
      setVideos((prevVideos) => {
        const updatedVideos = prevVideos.map((video) =>
          video._id === data.postId
            ? { ...video, comments: [...(video.comments || []), data.comment] }
            : video
        );

        return updatedVideos;
      });

      if (id === data.postId) {
        setComments((prevComments) => {
          const updatedComments = [...prevComments, data.comment];

          return updatedComments;
        });
      }
    };

    socket.on("commentUpdate", handleCommentUpdate);

    return () => {
      socket.off("commentUpdate", handleCommentUpdate);
    };
  }, [selectedItem]);



  const likeContent = async (mediaId: string) => {
    const userId = user?.id  || await AsyncStorage.getItem('userId'); 

    try {
      const response = await fetch(
        `https://my-social-media-bd.onrender.com/content/${mediaId}/like/${userId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        setVideos((prevVideos) =>
          prevVideos.map((video) => {
            if (video._id === mediaId) {
              const likedBy = video.likedBy.includes(userId)
                ? video.likedBy.filter((id) => id !== userId)
                : [...(video.likedBy || []), userId];
              return { ...video, likedBy, likes: likedBy.length };
            }
            return video;
          })
        );
        getContent()
        socket.emit("likeUpdate", { contentId: mediaId, userId });
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    socket.on("likeUpdate", (data) => {
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === data.contentId
            ? { ...video, likes: video.likes + 1 }
            : video
        )
      );
    });

    socket.on("unlikeUpdate", (data) => {
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === data.contentId
            ? { ...video, likes: video.likes - 1 }
            : video
        )
      );
    });
    
    return () => {
      socket.off("likeUpdate");
      socket.off("unlikeUpdate");
    };
  }, []);


  const openCommentsModal = async () => {
    setSelectedItem(params as any);
    setModalVisible(true);
    setLoadingComments(true);
  
    try {
      const response = await fetch(
        `https://my-social-media-bd.onrender.com/content/single/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch content");
      }
  
      const data = await response.json();
      const fetchedComments = data?.comments || [];
  
      // Ensure the comment with commentId is displayed first
      const sortedComments =
        commentId && fetchedComments.length > 0
          ? [
              ...fetchedComments.filter((comment:any) => comment._id === commentId),
              ...fetchedComments.filter((comment:any) => comment._id !== commentId),
            ]
          : fetchedComments;
  
      setComments(sortedComments);

    } catch (error) {
      // console.error("Error fetching content:", error);
    } finally {
      setLoadingComments(false);
    }
  };
  
  

  useEffect(() => {
    if (commentId) {
      openCommentsModal(); 
    }
  }, [commentId]);



  const flatListRef = useRef<FlatList<Comments>>(null);


  // useEffect(() => {
  //   if (comments.length > 0 && commentId) {
  //     // Find the index of the comment by its ID
  //     const commentIndex = comments.findIndex(comment => comment._id === commentId);
  //     if (commentIndex !== -1) {
  //       // Explicit null check before calling scrollToIndex
  //       if (flatListRef.current !== null) {
  //         flatListRef.current.scrollToIndex({
  //           index: commentIndex,
  //           animated: true,
  //         });
  //       }
  //     }
  //   }
  // }, [comments, commentId]);



  // const getItemLayout = (data, index) => ({
  //   length: 50, // Adjust based on your item height
  //   offset: 50 * index,
  //   index,
  // });
  
  // const handleScrollToIndexFailed = (error) => {
  //   console.warn('Scroll to index failed:', error);
  //   if (flatListRef.current) {
  //     flatListRef.current.scrollToIndex({ index: 0, animated: true });
  //   }
  // };

  useEffect(() => {
    // Automatically open the modal as soon as the component loads
    if (replyId && comments.length > 0) {
      const commentWithReply = comments.find(comment =>
        comment.replies?.some(reply => reply._id === replyId)
      );

      if (commentWithReply) {
        setSelectedComment({
          ...commentWithReply,
          replies: [
            // Display the specific reply first if replyId matches
            ...(commentWithReply.replies?.filter(reply => reply._id === replyId) ?? []),
            // Include the rest of the replies excluding the specific reply
            ...(commentWithReply.replies
              ?.filter(reply => reply._id !== replyId)
              ?.slice()
              ?.reverse() ?? []),
          ],
        });

        setReplyModalVisible(true); 
      }
    }
  }, [replyId, comments]);
  
  



  const sendReplyToComment = async (
    comment: string,
    mediaId: string,
    commentId: string,
    username: string
  ) => {
    try {
      const payload = {
        comment,
        username,
        authorId: userId,
        authorProfilePicSrc: user?.profileImageUrl,
        commentId,
        mediaId,
      };
      const response = await fetch(
        `https://my-social-media-bd.onrender.com/content/${mediaId}/comments/${commentId}/reply/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        // console.error('Error response from server:', errorText);
        throw new Error("Network response was not ok");
      }
      const reply = {
        ...payload,
        createdAt: new Date().toISOString(),
      };

      setSelectedComment((prev: any) => {
        if (!prev) {
          return null;
        }

        return {
          ...prev,
          replies: [...(prev.replies || []), reply],
        };
      });

      socket.emit("replyUpdate", { mediaId, commentId, reply: payload });
    } catch (error) {
      // console.error("Error sending reply:", error);
    }
  };

  useEffect(() => {
    const handleReplyUpdate = ({
      commentId,
      reply,
    }: {
      commentId: string;
      reply: Comments;
    }) => {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), reply],
              }
            : comment
        )
      );
    };
    socket.on("replyUpdate", handleReplyUpdate);

    return () => {
      socket.off("replyUpdate", handleReplyUpdate);
    };
  }, []);

  const likeComment = async (commentId: string, mediaId: string) => {
    const userId = user?.id  || await AsyncStorage.getItem('userId'); 

    try {
      const response = await fetch(
        `https://my-social-media-bd.onrender.com/content/comments/${mediaId}/${commentId}/like/${userId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        // Update the local state immediately for UI responsiveness
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment._id === commentId) {
              const likedBy = comment.likedBy?.includes(userId)
                ? comment.likedBy.filter((id) => id !== userId)
                : [...(comment.likedBy || []), userId];
              return { ...comment, likedBy, likes: likedBy.length };
            }
            return comment;
          })
        );

        socket.emit("commentLikeUpdate", { mediaId, commentId, userId });
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  };


  const handlePress = async (
    userId: string, 
    username: string, 

    profileImageUrl: string,
 
  ) => {
    // Get the logged-in user's ID
    const loggedInUserId = user?.id || await AsyncStorage.getItem('userId');
  
    if (loggedInUserId === userId) {
      // Navigate to the logged-in user's profile
      router.push({
        pathname: '/profile/Profile',
        params: {
          userId: loggedInUserId,
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

  const handlePaymentSuccess = async (res: any) => {
    setLoading(true);
    const paymentData = {
      transactionRef: res.data.transactionRef.reference,
      userId: user?.id,
      postId: id,
      status: res.data.event,
      amount:price
    };
  
    try {
      await axios.post('https://my-social-media-bd.onrender.com/payment/track', paymentData);
      // Refresh content
      await getContent();
    } catch (error) {
      // console.error('Error tracking payment:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handlePaymentCancel = () => {
    // console.log('Payment cancelled');
    // You can add additional logic for handling cancellations
  }; 


  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const renderModal = () => (
    <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={toggleModal}>
        <View style={styles.modalContent}>

        <TouchableOpacity   onPress={() => {
            router.push({pathname:'/content/editContent', params:{
              mediaId: id, 
              mediaSrc: mediaSrc, 
            caption:caption, 
            privacy:privacy
          
            }});
        }}>
   <Text style={styles.modalButton}>Edit content</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleDeleteModal}>
          <Text style={styles.modalButton}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleModal}>
          <Text style={styles.modalCloseButton}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const handleDeleteContent = async () => {
    try {
      // Replace with your delete endpoint
      const response = await fetch(`https://my-social-media-bd.onrender.com/content/delete/${id}/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Success', 'Content has been deleted successfully.');
        toggleDeleteModal();
        goBack(); 
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to delete group.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the group.');
    }
  };
  const toggleDeleteModal = () => {
    setDeleteModalVisible(!isDeleteModalVisible);
  };
  const renderDeleteModal = () => (
    <Modal visible={isDeleteModalVisible} transparent={true} animationType="fade" onRequestClose={toggleDeleteModal}>
      <View style={{    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
}}>
        <View style={styles.confirmationBox}>
          <Text style={styles.confirmationText}>Are you sure you want to delete this content?</Text>
          <Text style={styles.confirmationText}>This content will be permanently deleted</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button text="Cancel" onClick={toggleDeleteModal} variant='secondary'  style={{ width: 90, height: 40, marginTop: 10 }} />
              <Button text="Continue" onClick={handleDeleteContent} variant='primary'  style={{ width: 90, height: 40, marginTop: 10 }} />
            </View>
        </View>
      </View>
    </Modal>
  );

  

  if (!mediaSrc) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
        <ActivityIndicator size="large" color="#fff" />
        </Text>
      </View>
    );
  }

  return (
    <>
    <CustomHeader
          title={"Content"}
          subtitle={userId === createdBy ? "This content belongs to you" : "Shared content"}
          onMorePress={userId === createdBy ? toggleModal : undefined}
          onBackPress={goBack} />
          <KeyboardAvoidingView
              style={styles.container}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
                  {renderModal()}
                  {renderDeleteModal()}
            <SafeAreaView style={styles.container}>
              <View style={styles.mediaContainer}>
                  <StatusBar barStyle="light-content" backgroundColor="#000000" />

                  {isPrivate && !isSubscriber && !creator ? (
                      <TouchableWithoutFeedback
                          onPress={() => paystackWebViewRef.current.startTransaction()}
                          style={{ alignItems: "center" }}
                      >
                          <BlurView intensity={100} style={styles.blurView}>
                              <Ionicons name="lock-closed" size={50} color="#fff" />
                              <Text
                                  style={{
                                      color: "#fff",
                                      textAlign: "center",
                                      paddingVertical: 5,
                                  }}
                              >
                            Click to Pay {formatCurrency(price)} to view this content!
                              </Text>
                          </BlurView>
                      </TouchableWithoutFeedback>
                  ) : (
                      <>
                          {/* Conditionally render media based on type */}
                          {mediaSrc && (
                              isVideo ? (
                                <TouchableWithoutFeedback onPress={handleTap}>
                                <View style={styles.videoContainer}>
                                  <ExpoVideo
                                    source={{ uri: mediaSrc as string }}
                                    rate={1.0}
                                    volume={1.0}
                                    isMuted={false}
                                    resizeMode={ResizeMode.COVER}
                                    shouldPlay={isPlaying}
                                    style={{ height: "100%", width: "100%" }}
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
                
                                
                                  <Animated.View
                                style={[
                                
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
                                  <Image
                                      source={{ uri: mediaSrc }}
                                      style={styles.postImage} />
                              )
                          )}
                      </>
                  )}

        <Paystack
          paystackKey="pk_test_6738fce2cbc3ee832e7f7e86ee0e850969e48683"
          billingEmail={userEmail as string} 
          // billingMobile={user.id}
          billingName="Bajiku"
          activityIndicatorColor="#000"
          amount={price}
          channels={["card", "bank", "ussd", "qr", "mobile_money"]}
          onCancel={handlePaymentCancel} 
          onSuccess={handlePaymentSuccess} 
          autoStart={false}
          ref={paystackWebViewRef}
        />

        <PContentCaption >
          <TouchableOpacity onPress={toggleCaption}>
            <Text style={styles.toggleText} >
              {isExpanded ? caption : getTruncatedCaption(caption as string)}
            </Text>
          </TouchableOpacity>
          {(caption as string).split(" ").length > 15 && (
            <TouchableOpacity onPress={toggleCaption}>
              <Text>
                {isExpanded ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          )}
        </PContentCaption>
                  <PContentLeftImg>
                  <TouchableOpacity onPress={() => handlePress(createdBy as string, authorName as string, authorProfilePicSrc as string)}>
                          <Image
                              source={{ uri: authorProfilePicSrc }}
                              style={styles.authorDP} />
                      </TouchableOpacity>
                  </PContentLeftImg>



        <ContentLeft>
          <TouchableOpacity onPress={openCommentsModal} >
            <View style={styles.chatIcon}>
              <Ionicons name="chatbubble-outline" size={25} color="#fff" />
              {/* <Text style={styles.iconText}>{formatCount(comments?.length)}</Text> */}
            </View>
          </TouchableOpacity>
        </ContentLeft>


        <ContentLeftBottomNameUserText style={[styles.captionText,{ textTransform:'lowercase'}]}>
            @{authorName}
          </ContentLeftBottomNameUserText>
          <ContentLeftBottomNameUserText style={[styles.captionText,{ marginTop:20}]}>
            {formatTime(createdAt as string)}
          </ContentLeftBottomNameUserText>


        <ContentRight>
          <TouchableOpacity onPress={() => likeContent((id as string) || "")} >
            <View style={styles.likeIcon}>
              <Ionicons
                name="heart"
                size={25}
                color={isLiked ? "red" : "#fff"}
              />
              {/* <Text style={styles.iconText}>{formatCount(likes)}</Text> */}
            </View>
          </TouchableOpacity>
        </ContentRight>


        <View style={{position:'absolute', bottom:50}}>

        <Text style={{ color: '#fff', paddingTop: 5, fontSize: 12, paddingLeft: 10, fontWeight: 'bold' }}>
  {likes === 1 
    ? '1 Like' 
    : `${formatCount(likes)} Likes`}
</Text>

<TouchableOpacity onPress={() => openCommentsModal()}>
        <View>
    {comments && comments.length > 0 && (
      <Text style={{ color: '#fff', paddingTop: 5, fontSize: 12, paddingLeft: 10, fontWeight: 'bold' }}>
        <Text style={styles.iconText}>
          {comments?.length === 1 
            ? '1 comment' 
            : `View All ${formatCount(comments?.length || 0)} Comments`}
        </Text>
      </Text>
    )}
  </View>
  </TouchableOpacity>



 

  {comments && comments.length > 0 ? (
            <View>
              {/* Display only the last comment */}
              <View style={{ marginBottom: 5 }}>
                <Text style={{ color: '#fff', paddingTop: 3, fontSize: 12, paddingLeft: 10, textTransform: 'lowercase' }}>
                  @{comments[comments.length - 1].username}: {comments[comments.length - 1].comment}
                </Text>
                <Text style={{ color: '#fff', fontSize: 12, paddingLeft: 10 }}>
                  {formatTime(comments[comments.length - 1].createdAt)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: 'gray', padding: 10 }}>No comments yet</Text>
          )}

{/* <AddComment 
    onSend={(comment) => sendCommentToAPI(comment, id as string)} 
    mediaId={id as string} 
    username={user.username || ""} 
    whoCommentsId={user.id}
  /> */}

</View>


              </View>

              <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={{textAlign:'center', color:'#fff', marginBottom:30}}>
              {formatCount(comments.length)} Comments
            </Text>
          
              
           
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
                {/* <View style={styles.closeButton}> */}
              <Text style={styles.closeButtonText}>X</Text>
              {/* </View> */}
            </TouchableOpacity>
            {loadingComments ? (
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Loading comments...
              </Text>
            ) : comments.length === 0 ? (
              <Text style={styles.noCommentsText}>No comments yet</Text>
            ) : (
    <FlatList
  ref={flatListRef}
  data={[
    ...comments.filter((item) => item._id === commentId), 
    ...comments
      .filter((item) => item._id !== commentId) 
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
  ]}
  keyExtractor={(item) => item._id || Math.random().toString()}
                renderItem={({ item }) => (

             <View
      key={item._id}
      style={[styles.commentContainer, item._id === highlightedCommentId ? styles.highlighted : null]}
    >

                    <Image
                      source={{ uri: item.authorProfilePicSrc as string }}
                      style={styles.commentUserImage}
                    />
                    <View style={styles.commentContent}>
                      <Text style={styles.commentUsername}>
                        @{item.username}:
                      </Text>
                      <Text style={styles.commentText}>{item.comment}</Text>
                      <Text style={styles.commentTime}>
                        {formatTime(item.createdAt)}
                      </Text>
                      <View style={styles.commentActions}>
                        {/* <TouchableOpacity > */}
                        <TouchableOpacity
                          onPress={() => {
                            if (item._id && selectedItem?.id) {
                              likeComment(item._id, selectedItem.id);
                            }
                          }}
                        >
                          <View style={styles.likeContainer}>
                            <Ionicons
                              name="heart"
                              size={30}
                              color={
                                item.likedBy?.includes(user?.id) ? "red" : "gray"
                              }
                            />
                            <Text style={styles.likeCount}>{formatCount(item.likes??0)}</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.replyButton}
                          onPress={() => showReplies(item)}
                        >
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
              onSend={(comment) => sendCommentToAPI(comment, id as string)}
              mediaId={id as string}
              username={user?.username || ""}
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
            <Text style={{color:'#fff', textTransform:'lowercase'}}>Reply to: @{selectedComment?.username} comment:</Text>
            <Text style={styles.commentText}>"{selectedComment?.comment}"</Text>
            <Text style={{fontSize:14, textAlign:'center', color:'#fff', marginBottom:30}}>
              {formatCount(selectedComment?.replies?.length??0) || 0} Replies
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setReplyModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            {selectedComment?.replies?.length === 0 ? (
              <Text style={styles.noCommentsText}>No replies yet</Text>
            ) : (
              <ScrollView style={styles.repliesContainer}>
      {[
      // Display the specific reply first if replyId matches
      ...(selectedComment?.replies?.filter((reply) => reply._id === replyId) ?? []),
      // Reverse the rest of the replies excluding the specific reply
      ...(selectedComment?.replies
        ?.filter((reply) => reply._id !== replyId)
        ?.slice()
        ?.reverse() ?? []),
    ].map((reply, index) => (
      <View
      key={index}
      style={replyId === reply._id ? styles.highlightedReply : styles.replyContainer}
    >

                    {/* // <View key={index} style={styles.replyContainer}> */}
                      <Image
                        source={{ uri: reply.authorProfilePicSrc }}
                        style={styles.replyUserImage}
                      />
                      <View style={styles.replyContent}>
                   
                        <Text style={styles.replyUsername}>@{reply.username}:</Text>
                        <Text style={styles.replyText}>{reply.comment}</Text>
                        <Text style={styles.replyTime}>{formatTime(reply.createdAt)}</Text>
                        {/* <TouchableOpacity
                          onPress={() => {
                            if (reply._id && selectedItem?.id) {
                              likeReply(reply._id, selectedItem.id);
                            }
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: 200  }}>
                            <Ionicons
                              name="heart"
                              size={30}
                              color={
                                reply.likedBy?.includes(user?.id) ? "red" : "gray"
                              }
                            />
                            <Text style={{ color: "#aaa",fontSize: 16, marginRight:10}}>{formatCount(reply.likes??0)}</Text>
                          </View>
                        </TouchableOpacity> */}
                      </View>
                    </View>
                  ))}
              </ScrollView>
            )}

            <AddComment
              onSend={(comment) => {
                sendReplyToComment(
                  comment,
                  selectedItem?.id || "",
                  selectedComment?._id || "",
                  selectedComment?.username || ""
                );
              }}
              mediaId={id as string}
              username={user?.username || ""}
              whoCommentsId={user?.id}
            />
          </View>
        </View>
      </Modal>
      </SafeAreaView>

          </KeyboardAvoidingView></>
  );
  
    };     
 
export default ContentDetails;