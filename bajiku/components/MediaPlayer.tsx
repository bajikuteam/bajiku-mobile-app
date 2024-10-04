import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import {Video}from 'expo-av';
import { PostWithCaptionProps } from '@/services/core/types';
// import { FaVideo } from 'react-icons/fa';
// import { BiMessageRoundedEdit } from 'react-icons/bi';
// import LikeWithCount from '../like/like';
// import AddComment from '../add-comment/add-comment';
// import CommentModal from '../../modals/comment/comment';

const PostWithCaption: React.FC<PostWithCaptionProps> = ({
  mediaSrc,
  caption,
  comments,
  profilePicSrc,
  username,
  time,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedComment, setIsExpandedComment] = useState(false);
  const [likeCount, setLikeCount] = useState(10);
  const [liked, setLiked] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const videoRef = useRef<any>(null);
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const videoHeight = isExpanded ? windowHeight * 0.7 : 300; // Change to desired expanded height

  const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const currentItem = viewableItems[0];
      if (currentItem.isViewable) {
        setVisibleIndex(currentItem.index);
      }
    }
  }, []);

  useEffect(() => {
    const handlePlay = () => {
      if (videoRef.current) {
        videoRef.current.seek(0);
      }
    };

    // Scroll event to handle video play/pause (React Native doesn't have direct intersection observer)
    // Placeholder logic; you can implement based on your specific requirements.
    const handleScroll = () => {
      handlePlay();
    };

    return () => {
      // Cleanup code if necessary
    };
  }, [mediaSrc]);

  const handleLikeClick = () => {
    setLikeCount(likeCount + (liked ? -1 : 1));
    setLiked(!liked);
  };

  const handleSendComment = (comment: string) => {
    console.log('Comment sent:', comment);
  };

  const words = caption.split(' ');
  const displayText = isExpanded
    ? caption
    : words.slice(0, 8).join(' ') + (words.length > 8 ? '...' : '');

  const getMediaType = (url: string) => {
    if (url.endsWith('.mp4') || url.endsWith('.mov')) return 'video';
    if (url.endsWith('.gif')) return 'gif';
    if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png'))
      return 'image';
    return 'unknown';
  };

  const mediaType = getMediaType(mediaSrc);

  const handleReadMoreComments = () => {
    setIsExpandedComment(!isExpandedComment);
  };

  const handleViewAllComments = () => {
    setShowCommentsModal(true);
  };

  const handleCloseModal = () => {
    setShowCommentsModal(false);
  };

  const lastComment =
    comments.length > 0 ? comments[comments.length - 1] : null;
  const commentWords = lastComment ? lastComment.text.split(' ') : [];
  const shortText = commentWords.slice(0, 10).join(' ');
  const isLongComment = commentWords.length > 10;

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
    <View style={styles.container}>
      <View>
        {/* Caption */}
        <View style={styles.captionContainer}>
          <Text style={styles.captionText}>{displayText}</Text>
          {words.length > 8 && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={styles.readMoreText}>
                {isExpanded ? 'Read less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Media Content */}
        {mediaType === 'image' && (
          <Image
            source={{ uri: mediaSrc }}
            style={[styles.media, isExpanded && styles.mediaExpanded]}
          />
        )}
        {mediaType === 'video' && (
      <Video
      ref={videoRef}
      source={{ uri: mediaSrc }}
      useNativeControls
      // resizeMode="contain"
      shouldPlay={visibleIndex === 0} // Play if visible
      isLooping
      style={[styles.video, { height: videoHeight }]} // Dynamic height
    />
        )}

        {/* Profile Picture and Username */}
        {!isExpanded && (
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: profilePicSrc }}
              style={styles.profilePic}
            />
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{username}</Text>
              <Text style={styles.time}>{time}</Text>
            </View>
          </View>
        )}

        {/* Like Button */}
        {/* <TouchableOpacity
          style={styles.likeButton}
          onPress={handleLikeClick}
        >
          <LikeWithCount likeCount={likeCount} liked={liked} />
        </TouchableOpacity> */}

        {/* Comment Button */}
        <TouchableOpacity
          onPress={handleViewAllComments}
          style={styles.commentButton}
        >
          {/* <BiMessageRoundedEdit size={30} /> */}
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      <ScrollView>
        <View>
          <Text style={styles.likesText}>{likeCount} Likes</Text>

          {/* Last Comment */}
          {lastComment && (
            <View>
              <Text>
                <Text style={styles.commentAuthor}>{lastComment.author}: </Text>
                <Text>
                  {isExpandedComment || !isLongComment
                    ? lastComment.text
                    : `${shortText}...`}
                </Text>
              </Text>
              {isLongComment && (
                <TouchableOpacity onPress={handleReadMoreComments}>
                  <Text style={styles.readMoreText}>
                    {isExpandedComment ? 'Read Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              )}
              <Text style={styles.commentTime}>{lastComment.time}</Text>
            </View>
          )}

          {/* View All Comments */}
          <TouchableOpacity onPress={handleViewAllComments}>
            <Text style={styles.viewAllCommentsText}>
              {comments.length > 0
                ? `All ${comments.length} Comments`
                : 'No Comments Yet'}
            </Text>
          </TouchableOpacity>

          {/* Add Comment */}
          {/* <AddComment onSend={handleSendComment} /> */}
        </View>
      </ScrollView>

      {/* Comment Modal */}
      {/* <Modal visible={showCommentsModal} transparent={true}>
        <CommentModal comments={comments} onClose={handleCloseModal} />
      </Modal> */}
    </View>
    </ScrollView>
  );
};

export default PostWithCaption;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Ensure padding to allow scrolling
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000', // Example background color
  },
  captionContainer: {
    marginBottom: 10,
    // height800
  },
  captionText: {
    color: '#fff',
    fontSize: 14,
  },
  readMoreText: {
    color: '#00f',
    fontSize: 12,
    marginTop: 5,
  },
  media: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  mediaExpanded: {
    opacity: 0.3,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  usernameContainer: {
    marginLeft: 10,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
  },
  time: {
    color: '#aaa',
    fontSize: 12,
  },
  likeButton: {
    position: 'absolute',
    bottom: 100,
    left: 10,
  },
  commentButton: {
    position: 'absolute',
    bottom: 60,
    left: 10,
  },
  likesText: {
    color: '#fff',
    fontSize: 14,
  },
  commentAuthor: {
    fontWeight: 'bold',
    color: '#fff',
  },
  commentTime: {
    color: '#aaa',
    fontSize: 12,
  },
  viewAllCommentsText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
  },
  video: {
    width: '100%',
    height: 1200,
  },
});
