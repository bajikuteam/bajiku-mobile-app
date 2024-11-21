import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';
import { Video } from 'expo-av';
import { useIsFocused } from '@react-navigation/native'; // Import the hook to track navigation focus

interface VideoContextType {
  videoRefs: React.MutableRefObject<(Video | null)[]>; // Array of Video refs
  playingIndex: number | null;
  playVideo: (index: number) => void;
  pauseVideo: (index: number) => void;
  pauseAllVideos: () => void;
}

interface VideoProviderProps {
  children: ReactNode;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideo = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const videoRefs = useRef<(Video | null)[]>([]);

  // Track whether the screen is focused
  const isFocused = useIsFocused();

  // Play video logic
  const playVideo = (index: number) => {
    if (playingIndex !== index) {
      setPlayingIndex(index);
      videoRefs.current[index]?.playAsync();
    }
  };

  // Pause a single video
  const pauseVideo = (index: number) => {
    setPlayingIndex(null);
    videoRefs.current[index]?.pauseAsync();
  };

  // Pause all videos
  const pauseAllVideos = useCallback(() => {
    videoRefs.current.forEach((videoRef) => {
      if (videoRef) videoRef.pauseAsync();
    });
    setPlayingIndex(null);
  }, []);

  // Pause video if the screen is unfocused
  React.useEffect(() => {
    if (!isFocused) {
      pauseAllVideos();
    }
  }, [isFocused, pauseAllVideos]); // Re-run when `isFocused` changes

  const value = {
    videoRefs,
    playingIndex,
    playVideo,
    pauseVideo,
    pauseAllVideos,
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};
