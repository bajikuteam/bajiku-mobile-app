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
