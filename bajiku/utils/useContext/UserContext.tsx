import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native'; // Import useNavigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamListS } from '@/services/core/types';
import { router } from 'expo-router';

interface UserContextType {
  user: any; 
  setUser: React.Dispatch<React.SetStateAction<any>>;
  handleLogin: (userData: any) => Promise<void>; 
  handleLogout: () => Promise<void>;
  updateFollowerCount: (userId: string, countChange: number, isFollower: boolean) => void; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode; 
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null); 

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    loadUserData();
  }, []);
  
  const handleLogin = async (userData: any) => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    console.log("Clearing user data...");
  
    // Clear user data from AsyncStorage
    await AsyncStorage.removeItem('user');
    setUser(null); // Reset user state to null (ensure no user data left in memory)
  
    console.log("User data cleared, navigating to login...");
  
    // Use router.push or navigation.navigate depending on your navigation setup
    if (router) {
      // Expo Router
      router.push('/'); // Redirect to the login screen (outside the tabs)
    } else {
      // React Navigation
      const navigation = useNavigation<StackNavigationProp<RootStackParamListS>>();
      navigation.reset({
        index: 0, // Reset the navigation stack
        routes: [{ name: 'index' }], // Navigate to the login screen
      });
    }
  
    console.log("Navigation to login initiated.");
  };



  const updateFollowerCount = (userId: string, countChange: number, isFollower: boolean) => {
    if (user && user.id === userId) {
      setUser((prev: any | null) => {
        if (!prev) return null;

        return {
          ...prev,
          followingCount: prev.followingCount + (isFollower ? 0 : countChange),
          followerCount: prev.followerCount + (isFollower ? countChange : 0),
        };
      });
    }
  };


  return (
    <UserContext.Provider value={{ user, setUser, handleLogin, handleLogout, updateFollowerCount }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
