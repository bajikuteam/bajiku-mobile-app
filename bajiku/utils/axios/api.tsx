import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiConfig } from '@/services/core/types';


// const baseUrl: string = 'http://192.168.1.107:5000';
const baseUrl: string = 'https://bajiku-backend-server.onrender.com'


// Helper function to get the token from AsyncStorage
const getToken = async (): Promise<string> => {
  const token = await AsyncStorage.getItem('signature');
  return token || ''; 
};

export const apiGet = async <T = any>(path: string): Promise<AxiosResponse<T>> => {
  const token = await getToken();
  const config: ApiConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.get<T>(`${baseUrl}${path}`, config);
  return result;
};

export const apiPost = async <T = any>(
  path: string,
  body: any = {}
): Promise<AxiosResponse<T>> => {
  const token = await getToken();
  const config: ApiConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.post<T>(`${baseUrl}${path}`, body, config);
};

export const apiUpdate = async <T = any>(
  path: string,
  body: any
): Promise<AxiosResponse<T>> => {
  const token = await getToken();
  const config: ApiConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.patch<T>(`${baseUrl}${path}`, body, config);
};


export const apiPut = async <T = any>(
  path: string,
  body: any = {},
  auth: boolean = true
): Promise<AxiosResponse<T>> => {
  const token = auth ? await getToken() : '';
  const config: ApiConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.put<T>(`${baseUrl}${path}`, body, config);
};

export const apiPutFormData = async <T = any>(
  path: string,
  body: FormData = new FormData(),
  auth: boolean = true
): Promise<AxiosResponse<T>> => {
  const token = auth ? await getToken() : '';
  const config: ApiConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  return await axios.put<T>(`${baseUrl}${path}`, body, config);
};



export const apiDelete = async <T = any>(
  path: string,
  auth: boolean = true
): Promise<AxiosResponse<T>> => {
  const token = auth ? await getToken() : '';
  const config: ApiConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.delete<T>(`${baseUrl}${path}`, config);
};
