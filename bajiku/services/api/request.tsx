// import { apiPost, apiGet, apiUpdate } from '../../utils/axios/api';

import { apiGet, apiPost, apiUpdate } from "@/utils/axios/api";

export const registerUser = async (email: string, dateOfBirth: string) => {
  const response = await apiPost<{ token: string }>('/api/auth/signup', {
    email,
    dateOfBirth,
  });
  return response.data;
};


export const loginUser = async (email: string, password: string) => {
  const response = await fetch('http://192.168.1.107:5000/api/auth/signin', {
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

// export const loginUser = async (email: string, password: string) => {
//   const response = await apiPost<{ token: string }>('/api/auth/signin', JSON.stringify({
//     email,
//     password,
//   }), );
//   return response.data;
// };


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