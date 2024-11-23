import { ButtonProps } from '@/services/core/types';
import React from 'react';
import { TouchableOpacity, Text, View, ViewStyle, TextStyle, StyleProp } from 'react-native';

const buttonStyles = {
  primary: {
    backgroundColor: '#D84773',
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 38,
    borderRadius: 12,
  } as ViewStyle,
  secondary: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 30,
    borderRadius: 10,
  } as ViewStyle,
  danger: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 38,
    borderRadius: 12,
  } as ViewStyle,
  disabled: {
    backgroundColor: '#EFA3B5',
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 38,
    borderRadius: 12,
  } as ViewStyle,
  third: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 38,
    borderRadius: 12,
  } as ViewStyle,

  fourth: {
    backgroundColor: '#F90C0C',
    borderWidth: 1,
    borderColor: '#F90C0C',
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    height: 38,
    borderRadius: 12,
  } as ViewStyle,
};

const textStyles = {
  primary: {
    color: '#FBBC05',
    fontSize: 12,
  } as TextStyle,
  secondary: {
    color: '#ffffff',
    fontSize: 12,
  } as TextStyle,
  danger: {
    color: '#ffffff',
    fontSize: 12,
  } as TextStyle,
  disabled: {
    color: 'gray',
    fontSize: 12,
  } as TextStyle,
  third: {
    color: '#075E54',
    fontSize: 12,
  } as TextStyle,
  fourth: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
  } as TextStyle,
};

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = 'primary',
  disabled = false,
  style = {},
  className = '',
  icon: Icon = null,
  iconProps
}) => {
  const buttonStyle = disabled ? buttonStyles.disabled : buttonStyles[variant];
  const textStyle = textStyles[variant];

  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={[buttonStyle, style] as StyleProp<ViewStyle>} // Combine button styles
    >
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={textStyle}>{text}</Text>
        {Icon && (
          <View style={{ marginLeft: 8 }}>
             {Icon && React.createElement(Icon, { ...iconProps })}
      
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
