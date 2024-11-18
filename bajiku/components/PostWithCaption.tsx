import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { PostWithCaptionProps } from '@/services/core/types';

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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handlePlay = () => {
        videoElement.muted = false;
        videoElement.play().catch((error) => {
          console.log('Error playing video:', error);
        });
      };

      const handlePause = () => {
        videoElement.pause();
        videoElement.muted = true;
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            handlePlay();
          } else {
            handlePause();
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.5,
        },
      );

      observer.observe(videoElement);

      return () => {
        if (videoElement) {
          observer.unobserve(videoElement);
        }
      };
    }
  }, [mediaSrc]);

  useEffect(() => {
    document.body.style.overflow = showCommentsModal ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [showCommentsModal]);

  const handleLikeClick = () => {
    setLikeCount(likeCount + (liked ? -1 : 1));
    setLiked(!liked);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.captionContainer}>
          {/* <p className="text-white font-medium text-sm lowercase">
            {displayText}
          </p> */}
          {words.length > 8 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white text-[12px] underline mt-0.5 block"
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </View>
        <View style={styles.cvideo}>
        {mediaType === 'image' && (
          <img
            src={mediaSrc}
            alt="Media"
            className="w-full h-[500px] transition-all duration-300"
          />
        )}
        {mediaType === 'video' && (
          <video
            controls
            src={mediaSrc}
            ref={videoRef}
            style={styles.video}
            // className="w-full h-[700px] object-cover"
          >
            {/* Your browser does not support the video tag. */}
          </video>
        )}
        </View>

        {/* Profile Picture and Username */}
        <View style={styles.profileContainer}>
          <img
            src={profilePicSrc}
            alt="Profile"
            className="w-[55px] h-[44px] rounded-[10px] border-2 border-[#6E6E6E]"
          />
          <View className="ml-2 text-gray-700">
            {/* <p className="font-semibold text-white">{username}</p> */}
            {/* <p className="text-xs text-white">{time}</p> */}
          </View>
        </View>

        {/* Like and Comment actions */}
        <View style={styles.actionsContainer}>
          {/* Include like and comment buttons here */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: 'black',
    marginTop:80
  },
  content: {
    position: 'relative',
    width: '100%',
  },
  captionContainer: {
    padding: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionsContainer: {
    marginTop: 16,
  },
  video: {
    // height: 800,
    aspectRatio: 1,  // Full height of the container
    width: '100%',
    objectFit: 'cover',
  },
  cvideo: {
    marginBottom: 16,
    height: 600,
    width: '100%', // Full width of the screen
    overflow: 'hidden',
    position: 'relative',
  },
});

export default PostWithCaption;
