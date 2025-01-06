import React, { ChangeEvent, FocusEvent, CSSProperties } from 'react';
import { TextInputProps as RNTextInputProps } from 'react-native';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
export interface ApiConfig {
  headers: {
    Authorization: string;
    'Content-Type'?: string;
  };
}

export interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'disabled' | 'third';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ElementType;
  iconProps?: object;
  preventCondition?: boolean;
}

export interface SocialButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'disabled';
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ElementType;
  image?: string;
  disabled?: boolean;
}

export interface InputProps extends RNTextInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
  placeholder?: string;
  value: string; 
  onChangeText: (text: string) => void; 
  onBlur?: () => void;
  variant?: 'primary' | 'error';
  error?: boolean | string;
  disabled?: boolean;
  className?: string;
  label?: string;
  style?: any; 
  name: string;
  icon?: React.ElementType;
  maxLength?: number;
}




export interface ImageTextContainerProps {
  imageSrc?: string;
  imageAlt?: string;
  text: string;
  subHead?: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  imageStyle?: ImageStyle; 
  
}

export interface MenuItemProps {
  icon?: React.ReactNode;
  label?: string;
}

export interface SidebarItemProps {
  icon: React.ReactNode;
  label?: string;
}

export interface Comment {
  author: string;
  text: string;
  time: string;
  authorImg:string
}

export interface PostWithCaptionProps {
  mediaSrc: string;
  caption: string;
  comments: Comment[];
  likes: number;
  profilePicSrc: string;
  username: string;
  time: string;
}


// Example type definition in your types.ts file
export type RootStackParamList = {
  message: {profileImageUrl?:string, username?:string, userName?: string; room?: string; senderId?: string; receiverId?: string; firstName?:string; lastName?:string; senderName?:string ;   lastMessage?: string; // Add this line
    lastMessageTime?: string;};
    PersonGroupChat: {
      roomId: string;
      room: string;
      groupName: string;
      profileImageUrl: string;
      username: string;
      groupImgUrl: string;
      groupDescription: string;
      groupCreationTime: string;
      senderId: string;
      senderName: string;
      name: string;
      description: string;
      lastMessage: string;
      lastMessageTime: string;
    };
    Search: undefined;  
    UserDetails: { user: User };

};


export type RootStackParamListS = {
  Signup?: undefined;
  Login: undefined;
  '(tabs)': undefined;
  index: undefined;
  Home?: undefined;
  Profile?: { userId: string };
  'auth/Login'?: undefined;
};


// types.ts or wherever you define your navigation types
export type RootStackParamLists = {
  groupChat: { id: string;
    groupName?: string;
    groupImgUrl?: string;
    groupCreationTime?: string;
    groupDescription?: string;
    room?: string;
    name?: string;
    profileImageUrl?:string
    senderId?: string;
    senderName?: string; 
    username?: string
    description?:string;
  } 
};

export type RootStackParamListsPersonGroupChat = {
  PersonGroupChat: 
  { roomId: string;
    groupName: string;
    groupImgUrl: string;
    groupCreationTime: string;
    groupDescription: string;
    room: string;
    name: string;
    profileImageUrl:string
    senderId: string;
    senderName: string; 
    username: string
    description:string;
    lastMessage?: string; // Add this line
    lastMessageTime?: string;
  } 
};

export type RootStackParamListsChatList = {
  Chat: { id?: string;
    groupName?: string;
    groupImgUrl?: string;
    groupCreationTime?: string;
    groupDescription?: string;
    room?: string;
    name?: string;
    profileImageUrl?:string
    senderId?: string;
    senderName?: string; 
    username?: string
    description?:string;
    lastMessage?: string; // Add this line
    lastMessageTime?: string;
    receiverId?:string; //
  } 
};


export type RootStackParamListComponent = {
  message: {profileImageUrl?:string, username?:string, userName?: string; room?: string; senderId?: string; receiverId?: string; firstName?:string; lastName?:string; senderName?:string ;   lastMessage?: string; // Add this line
    lastMessageTime?: string;};
  PersonGroupChat: 
  { roomId: string;
    groupName: string;
    groupImgUrl: string;
    groupCreationTime: string;
    groupDescription: string;
    room: string;
    name: string;
    profileImageUrl:string
    senderId: string;
    senderName: string; 
    username: string
    description:string;
    lastMessage?: string;
    lastMessageTime?: string;
  } 
  Home: undefined;
  NewChat: undefined;
  CreateGroup: undefined;
  AddPersonGroupChatMember: { roomId: string };
  Followers: undefined;
  Following:undefined
  Profile: undefined;
  EditProfile: undefined
  SubscribedTo: undefined
  PostDetail: {id:string, likes:any , privacy:string, mediaSrc:string, caption:string, authorProfilePicSrc:string, comments:any};
  TotalEarnings: undefined

};

// src/types.ts or wherever you prefer to define types
export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}
export interface Post {
  id: string | null | undefined;
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
}
export interface TrendingSearch {
  _id: string;   
  count: number; 
}

export interface Comments {
  _id: string;
  comment: string;
  username: string;
  createdAt: string;
  likedBy: string[];
  replies?: Comments[];
  authorProfilePicSrc: string;
  likes?: number;
  commentId?: string;
  authorId?:string;
}

export  interface PostDetailScreenRouteParams {
  id: string;
  privacy: string;
  mediaSrc: string;
  caption: string;
  authorProfilePicSrc: string;
  likes: number;
}

export  interface ContentType {
  id?: number;
  _id?: string;
  mediaSrc: string;
  authorName: string;
  caption: string;
  authorProfilePicSrc: string;
  privacy: string;
  likes: number;
  comments?: Comments[];
  likedBy: string[];
  subscribers: string[];
  createdAt: string;
  
};

export interface Notification {
  IsRead: boolean;
  createdAt: string;
  message: string;
  profileImageUrl: string;
  userId: string;
  _id: string;
  whoInitiatedId:string;
  username:string;
  commentId:string;
  contentId:string;
  replyId:string;
}