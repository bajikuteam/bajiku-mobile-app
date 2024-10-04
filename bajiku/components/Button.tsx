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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#D84773',
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
    borderColor: '#D84773',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 38,
    borderRadius: 12,
  } as ViewStyle,
};

const textStyles = {
  primary: {
    color: '#ffffff',
    fontSize: 12,
  } as TextStyle,
  secondary: {
    color: '#000000',
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
    color: '#D84773',
    fontSize: 12,
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
}) => {
  const buttonStyle = disabled ? buttonStyles.disabled : buttonStyles[variant];

  const baseStyles = `${buttonStyles[variant]} ${disabled ? buttonStyles.disabled : ''} ${className}`;
  const textStyle = textStyles[variant];

  return (
    <TouchableOpacity
    onPress={onClick}
      disabled={disabled}
      style={[buttonStyle, style] as StyleProp<ViewStyle>} 
      className={baseStyles}
    >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text style={textStyle}>{text}</Text>
  <View style={{ marginLeft: 16 }}>
    {Icon && <Icon />}
  </View>
</View>

    </TouchableOpacity>
  );
};

export default Button;
