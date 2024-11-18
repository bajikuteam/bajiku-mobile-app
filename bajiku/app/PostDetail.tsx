import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import AddComment from '@/components/AddComment';
import { ContentCaption, ContentLeft, ContentLeftImg, ContentRight } from '@/styles/Home';
import { formatTime } from '@/services/core/globals';
// import { formatTime } from '@/utils/time';  // Assuming you have a utility for formatting time.

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
    fontSize: 30,
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
  commentContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
    marginLeft: 10,
  },
  commentUsername: {
    fontWeight: 'bold',
    color: '#fff',
  },
  commentText: {
    color: '#fff',
  },
  commentTime: {
    color: '#aaa',
    fontSize: 12,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  likeCount: {
    marginLeft: 5,
    color: '#fff',
  },
  replyButton: {
    marginLeft: 10,
  },
  replyButtonText: {
    color: '#fff',
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
  noCommentsText: {
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  repliesContainer: {
    maxHeight: 300,
    marginTop: 10,
  },
  replyContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  replyUserImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  replyContent: {
    flex: 1,
    marginLeft: 10,
  },
  replyUsername: {
    fontWeight: 'bold',
    color: '#fff',
  },
  replyText: {
    color: '#fff',
  },
  replyTime: {
    color: '#aaa',
    fontSize: 12,
  },
});

interface Comment {
  _id: string;
  comment: string;
  username: string;
  createdAt: string;
  likedBy: string[];
  replies?: Comment[];
}

interface PostDetailScreenRouteParams {
  id: string;
  privacy: string;
  mediaSrc: string;
  caption: string;
  authorProfilePicSrc: string;
}

const PostDetail = () => {
  const route = useRoute<RouteProp<{ params: PostDetailScreenRouteParams }, 'params'>>();
  const { privacy, mediaSrc, caption, id, authorProfilePicSrc } = route.params || {};
  const isVideo = mediaSrc && (mediaSrc.endsWith('.mp4') || mediaSrc.endsWith('.mov'));
  const navigation = useNavigation();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PostDetailScreenRouteParams | null>(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Content',
      headerStyle: {
        backgroundColor: '#075E54',
      },
      headerTintColor: '#fff',
    });
  }, [navigation]);

  const openCommentsModal = async () => {
    setSelectedItem(route.params);
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

  if (!mediaSrc) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
          Media source is missing.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.mediaContainer}>
        {isVideo ? (
          <View style={styles.videoContainer}>
            <ExpoVideo
              source={{ uri: mediaSrc }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.COVER}
              shouldPlay={false}
              style={{ height: '100%', width: '100%' }}
            />
            <MaterialCommunityIcons name="play-circle" style={styles.videoIcon} />
          </View>
        ) : (
          <Image source={{ uri: mediaSrc }} style={styles.postImage} />
        )}

        <ContentCaption>
          <TouchableOpacity onPress={openCommentsModal}>
            <Text style={{ color: '#fff' }}>{caption}</Text>
          </TouchableOpacity>
        </ContentCaption>

        <ContentLeftImg>
          <Image source={{ uri: authorProfilePicSrc }} style={{ height: 50, width: 44, borderRadius: 12 }} />
        </ContentLeftImg>

        <ContentLeft>
          <TouchableOpacity onPress={openCommentsModal}>
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubble-outline" size={30} color="#fff" />
            </View>
          </TouchableOpacity>
        </ContentLeft>

        <ContentRight>
          <TouchableOpacity>
            <View style={styles.iconContainer}>
              <Ionicons name="heart" size={40} color="#fff" />
            </View>
          </TouchableOpacity>
        </ContentRight>
      </View>

      {/* Modal for comments */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={{ textAlign: 'center', color: '#fff', marginBottom: 10 }}>
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
                data={comments}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.commentContainer}>
                    <Image source={{ uri: authorProfilePicSrc }} style={styles.commentUserImage} />
                    <View style={styles.commentContent}>
                      <Text style={styles.commentUsername}>@{item.username}:</Text>
                      <Text style={styles.commentText}>{item.comment}</Text>
                      <Text style={styles.commentTime}>{formatTime(item.createdAt)}</Text>
                      <View style={styles.commentActions}>
                        <TouchableOpacity>
                          <View style={styles.likeContainer}>
                            <Ionicons name="heart" size={30} color="gray" />
                            <Text style={styles.likeCount}>{item.likedBy.length}</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.replyButton}>
                          <Text style={styles.replyButtonText}>
                            {item.replies?.length === 0
                              ? 'Reply'
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
              onSend={(comment) => console.log('Send Comment', comment)}
              mediaId={id}
              username="Username" // Assume a username state is available
              whoCommentsId="UserID" // Assume a user id is available
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default PostDetail;
