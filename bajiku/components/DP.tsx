// import React, { useState, useEffect, useRef } from 'react';
// import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, FlatList, Image, Animated, AppState } from 'react-native';
// import { useIsFocused, useNavigation } from '@react-navigation/native';  // For navigation
// import { useFocusEffect } from '@react-navigation/core'; // To handle focus/unfocus of the screen
// import { useVideoPlayer, VideoView } from 'expo-video';

// interface MediaItem {
//   mediaSrc: string;
//   type: 'video' | 'image';
// }

// export default function MediaDisplayScreen() {
//   const [media, setMedia] = useState<MediaItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const videoRefs = useRef<Map<number, any>>(new Map()); // Store references for videos

//   // Fetch media content
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('https://backend-server-quhu.onrender.com/content');
//       const data = await response.json();

//       const mediaWithTypes = data.map((item: any) => ({
//         mediaSrc: item.mediaSrc,
//         type: item.mediaSrc.endsWith('.mp4') || item.mediaSrc.endsWith('.mkv') ? 'video' : 'image',
//       }));

//       setMedia(mediaWithTypes);
//     } catch (error) {
//       console.error('Error fetching media data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Handle video pause on screen blur (when navigating away)
//   useFocusEffect(
//     React.useCallback(() => {
//       // Play all videos when the screen is focused
//       videoRefs.current.forEach((player) => player.play());

//       return () => {
//         // Pause all videos when the screen loses focus (unfocused)
//         videoRefs.current.forEach((player) => player.pause());
//       };
//     }, [])
//   );




//   // Viewable items handler for pausing and playing videos when they come in/out of view
//   const handleViewableItemsChanged = ({ viewableItems }: any) => {
//     videoRefs.current.forEach((player, index) => {
//       if (viewableItems.some((item: any) => item.index === index)) {
//         // Play video if it's visible
//         player.play();
//       } else {
//         // Pause video if it's out of view
//         player.pause();
//       }
//     });
//   };

//   const viewabilityConfig = {
//     itemVisiblePercentThreshold: 50, // Item is considered visible if 50% or more is on the screen
//   };


//   const isFocused = useIsFocused(); // Detect if the screen is focused
//   useEffect(() => {
//     if (!isFocused) {
//       // Pause all videos when the screen loses focus
//       videoRefs.current.forEach((player) => {
//         if (player?.pause) {
//           player.pause();
//         }
//       });
//     }
//   }, [isFocused]);

//   const cleanupVideoRefs = () => {
//     videoRefs.current.forEach((player) => {
//       if (player?.stop) {
//         player.stop(); // Explicitly stop playback
//       }
//       player = null; // Remove reference
//     });
//     videoRefs.current.clear(); // Clear map of references
//   };

//   useEffect(() => {
//     return () => {
//       // Cleanup video refs on component unmount
//       cleanupVideoRefs();
//     };
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4630ec" />
//         <Text style={styles.loadingText}>Loading media...</Text>
//       </View>
//     );
//   }

//   return isFocused ? (
//     <FlatList
//     data={media}
//     keyExtractor={(_, index) => index.toString()}
//     renderItem={({ item, index }) =>
//       item.type === 'video' ? (
//         <VideoItem
//           key={index}
//           mediaSrc={item.mediaSrc}
//           videoRef={(player: any) => videoRefs.current.set(index, player)} 
//         />
//       ) : (
//         <ImageItem mediaSrc={item.mediaSrc} />
//       )
//     }
//     onViewableItemsChanged={handleViewableItemsChanged}
//     viewabilityConfig={viewabilityConfig}
//   />
//   ) : null;
// }

// function VideoItem({
//   mediaSrc,
//   videoRef,
// }: {
//   mediaSrc: string;
//   videoRef: (player: any) => void;
// }) {
//   const [pulseAnimation] = useState(new Animated.Value(1)); // For pulsing effect
//   const player = useVideoPlayer(mediaSrc, (player) => {
//     player.loop = true;
//     player.play();
//   });

//   useEffect(() => {
//     // Set the video reference so we can access it later for pausing/playing
//     videoRef(player);

//     return () => {
//       // Clean up video reference when component unmounts
//       videoRef(null);
//     };
//   }, [player, videoRef]);

//   const handleVideoClick = () => {
//     const isPlaying = player.playing;
//     if (isPlaying) {
//       player.pause();
//     } else {
//       player.play();
//     }

    
//     const triggerPulseAnimation = () => {
//         Animated.sequence([
//           Animated.timing(pulseAnimation, {
//             toValue: 1.1, // Make the video slightly bigger
//             duration: 200,
//             useNativeDriver: true,
//           }),
//           Animated.timing(pulseAnimation, {
//             toValue: 1, // Return to normal size
//             duration: 200,
//             useNativeDriver: true,
//           }),
//         ]).start();
//       };

//     // Trigger the pulse animation
//     Animated.sequence([
//       Animated.timing(pulseAnimation, {
//         toValue: 1.1, // Make the video slightly bigger
//         duration: 200,
//         useNativeDriver: true,
//       }),
//       Animated.timing(pulseAnimation, {
//         toValue: 1, // Return to normal size
//         duration: 200,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   return (
//     <View style={styles.mediaContainer}>
//       <Animated.View style={[styles.videoContainer, { transform: [{ scale: pulseAnimation }] }]}>
//         <VideoView player={player} style={{ height: 520, width: '100%' }} nativeControls={true} />
//       </Animated.View>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleVideoClick}
//       >
//         <Text style={styles.buttonText}>{player.playing ? 'Pause' : 'Play'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// function ImageItem({ mediaSrc }: { mediaSrc: string }) {
//   return (
//     <View style={styles.mediaContainer}>
//       <Image source={{ uri: mediaSrc }} style={{ height: 520, width: '100%' }} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#555',
//   },
//   mediaContainer: {
//     marginBottom: 20,
//   },
//   videoContainer: {
//     overflow: 'hidden',
//   },
//   button: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 3,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: '#4630ec',
//   },
//   buttonText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#eeeeee',
//     textAlign: 'center',
//   },
// });

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, Image, AppState, AppStateStatus } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Video } from 'expo-av'; // Correct import from expo-av

interface MediaItem {
  mediaSrc: string;
  type: 'video' | 'image';
}

export default function MediaDisplayScreen() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef<Map<number, any>>(new Map()); // Store references for videos
  const isFocused = useIsFocused(); // Detect if the screen is focused
  const appState = useRef<AppStateStatus>('active'); // Track app state (foreground/background)

  // Fetch media content
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backend-server-quhu.onrender.com/content');
      const data = await response.json();

      const mediaWithTypes = data.map((item: any) => ({
        mediaSrc: item.mediaSrc,
        type: item.mediaSrc.endsWith('.mp4') || item.mediaSrc.endsWith('.mkv') ? 'video' : 'image',
      }));

      setMedia(mediaWithTypes);
    } catch (error) {
      console.error('Error fetching media data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle app state change to pause videos when app goes to the background
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => { // Use AppStateStatus for correct typing
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App comes to foreground
        return;
      } else {
        // App goes to background, pause all videos
        videoRefs.current.forEach((player) => {
          player.pauseAsync();
        });
      }
      appState.current = nextAppState; // Update the appState correctly
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup listener on unmount
    return () => {
      subscription.remove(); // Use remove() from the subscription object
    };
  }, []);

  // Use `useIsFocused` to detect when the screen is focused/unfocused
  useEffect(() => {
    if (!isFocused) {
      // Pause all videos when the screen is unfocused
      videoRefs.current.forEach((player) => {
        player.pauseAsync();
      });
    }
  }, [isFocused]); // Re-run whenever focus state changes

  const renderItem = ({ item, index }: { item: MediaItem; index: number }) => {
    if (item.type === 'video') {
      return (
        <VideoItem
          key={index}
          mediaSrc={item.mediaSrc}
          videoRef={(player: any) => videoRefs.current.set(index, player)}
        />
      );
    } else {
      return <ImageItem key={index} mediaSrc={item.mediaSrc} />;
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4630ec" />
      </View>
    );
  }

  return (
    <FlatList
      data={media}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
    />
  );
}

function VideoItem({
  mediaSrc,
  videoRef,
}: {
  mediaSrc: string;
  videoRef: (player: any) => void;
}) {
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    if (player) {
      videoRef(player); // Store the reference
      return () => {
        videoRef(null); // Clean up reference
      };
    }
  }, [player, videoRef]);

  return (
    <View style={{ width: '100%', backgroundColor: '#010101', paddingBottom: 20 }}>
      <Video
        source={{ uri: mediaSrc }}
        ref={setPlayer}
        style={{ height: 520, width: '100%' }}
        useNativeControls
        // resizeMode="contain"
        isLooping
      />
    </View>
  );
}

function ImageItem({ mediaSrc }: { mediaSrc: string }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Image source={{ uri: mediaSrc }} style={{ height: 520, width: '100%' }} />
    </View>
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  mediaContainer: {
    marginBottom: 20,
  },
  videoContainer: {
    overflow: 'hidden',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#4630ec',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#eeeeee',
    textAlign: 'center',
  },
});
