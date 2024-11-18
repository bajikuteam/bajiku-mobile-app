import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useUser } from '@/utils/useContext/UserContext'; 
import Loading from '@/components/Loading';

const Index = () => {
  const { user } = useUser();
  const [isReady, setIsReady] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false); 

  useEffect(() => {
    const loadApp = async () => {
      setTimeout(() => {
        setIsReady(true);
      }, 5000); 
    };
    loadApp();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      setTimeout(() => {
        if (user === null) {
          console.log('User data still loading or not found');
          setIsUserLoaded(true); 
        } else {
          setIsUserLoaded(true);
        }
      }, 3000);
    };

    loadUser();
  }, [user]);

  useEffect(() => {

    if (isReady && isUserLoaded) {
      if (user) {
        router.push('/(tabs)/'); 
      } else {
        router.push('/auth/Login'); 
      }
    }
  }, [isReady, isUserLoaded, user]); 

  if (!isReady || !isUserLoaded) {
    return (
      <Loading/>
    );
  }

  return null; 
};

export default Index;

