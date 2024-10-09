import { apiGet, apiPost, apiUpdate } from "@/utils/axios/api";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';


export const registerUser = async (email: string, dateOfBirth: string) => {
  const response = await apiPost<{ token: string }>('/api/auth/signup', {
    email,
    dateOfBirth,
  });
  return response.data;
};


export const loginUser = async (email: string, password: string) => {

  const response = await fetch('https://bajiku-backend-server.onrender.com/api/auth/signin', {
    // const response = await fetch('http://192.168.1.107:5000/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    // Throw an error if the response is not OK
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return response;
};

export const verifyEmail = async (token: string, otp: string) => {
  const response = await apiGet<{ userId: string; message: string }>(
    `/api/auth/verify-email?token=${token}&otp=${otp}`,
  );
  return response.data;
};

export const setPassword = async (
  userId: string,
  password: string,
  confirmPassword: string,
) => {
  const response = await apiUpdate<{ message: string }>(
    `/api/auth/set-password/${userId}`,
    { password, confirmPassword },
  );
  return response.data;
};

export const sendRecoveryEmail = async (email: string) => {
  const response = await apiPost<{ message: string }>(
    `/api/auth/recovery/forgot-password`,
    { email },
  );
  return response.data;
};


export const setNewPassword = async ( password:string, confirmPassword:string,  token: string) => {
    const response = await apiPost<{ message: string }>(
      `/api/auth/recovery/reset-password/${token}`,
      { password, confirmPassword },
    );
    return response.data;
  };


  export const verifyEmailLink = async (token: string, otp:string) => {
    const response = await apiGet<{ message: string }>(
      `/api/auth/verify-email?token=${token}&otp=${otp}`
    );
    return response.data;
  };

  export const setuUpUserProfile = async (userId: string, formData: any) => {
    const response = await apiUpdate<{ message: string }>(
      `/api/auth/profile/edit/${userId}`,
      formData,
    );
    return response.data;
  };


  export const updateProfile = async (image: string | null, firstName: string, lastName: string, userName: string) => {
    if (!image) {
        throw new Error('No image selected');
    }
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
        throw new Error('User ID not found');
    }
    const fileInfo = await FileSystem.getInfoAsync(image);
    if (!fileInfo.exists) {
        throw new Error('File not found');
    }

    const formData = new FormData();
    formData.append('image', {
        uri: fileInfo.uri,
        name: fileInfo.uri.split('/').pop() || 'photo.jpg',
        type: 'image/jpeg',
    } as any);

    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('userName', userName);
    // const apiUrl = `${API_BASE_URL}/edit/${userId}`;
    const apiUrl = `https://bajiku-backend-server.onrender.com/api/auth/profile/edit/${userId}`;
    // const apiUrl = `http://192.168.1.107:5000/api/auth/edit/${userId}`;
    const response = await axios.put(apiUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};


export const checkUsernameAvailability = async (userName: string) => {
  try {
      const response = await apiGet(`/api/auth/check-username/${userName}`);
      return response.data; 
  } catch (error) {
      throw error;
  }
};
