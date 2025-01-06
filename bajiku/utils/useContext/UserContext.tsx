import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface UserContextType {
  user: any; 
  setUser: React.Dispatch<React.SetStateAction<any>>;
  handleLogin: (userData: any) => Promise<void>; 
  handleLogout: () => Promise<void>;
usersId: any
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode; 
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null); 
  const [usersId, setUserId] = useState<string | null>(null);

  // useEffect(() => {
  //   const loadUserData = async () => {
  //     const userData = await AsyncStorage.getItem('user');
  //     const userId =  await AsyncStorage.getItem('userId')
  //     if (userData) {
  //       setUser(JSON.parse(userData));
  //     }
  //   };

  //   loadUserData();
  // }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const storedUserId = await AsyncStorage.getItem('userId');
        
        if (userData) {
          setUser(JSON.parse(userData));
        }
        
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
  
    loadUserData();
  }, []);
  
  const handleLogin = async (userData: any) => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    //  await AsyncStorage.setItem('id', id);  
        // await AsyncStorage.setItem('token', token);
  };

  const handleLogout = async () => {
    router.push("/");
    await AsyncStorage.clear();
    setUser(null);
  };



  return (
    <UserContext.Provider value={{ user, setUser, handleLogin, handleLogout, usersId }}>
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
