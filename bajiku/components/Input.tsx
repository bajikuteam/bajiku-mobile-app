import { InputProps } from '@/services/core/types';
import React, { forwardRef } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

const inputStyles = {
  base: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: 'white',
    width: 300,
    height: 38,
    fontSize: 14,
  },
  primary: {
    borderColor: 'gray',
  },
  error: {
    borderColor: 'red',
  },
  disabled: {
    backgroundColor: '#E0E0E0',
    color: '#A0A0A0',
  },
};

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      type = 'text',
      placeholder = '',
      value,
      onChangeText,
      onBlur,
      variant = 'primary',
      error = false,
      disabled = false,
      className = '',
      label = '',
      style = {},
      name,
      icon: Icon,
    },
    ref,
  ) => {
    const finalStyle = [
      inputStyles.base,
      variant === 'error' ? inputStyles.error : inputStyles.primary,
      disabled && inputStyles.disabled,
      style, className
    ];
    const finalClassNames = `
    ${inputStyles.base}  
    ${error ? inputStyles.error : inputStyles[variant]} 
    ${disabled ? inputStyles.disabled : ''} 
    ${className}
  `;
    return (
      <View style={{ marginBottom: 16 }}>
        {label && (
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#FBBC05' }}>
            {label}
          </Text>
        )}
        <View style={{ position: 'relative' }}>
        <TextInput
  placeholder={placeholder}
  placeholderTextColor="#A0A0A0"
  value={value}
  onChangeText={onChangeText}
  onBlur={onBlur}
  editable={!disabled}
  style={[finalStyle, { fontSize: 12 }]}  
  ref={ref}
  testID={name}
  className={finalClassNames}
/>

          {Icon && (
            <View style={{ position: 'absolute', right: 16, top: 8 }}>
              <Icon style={{ color: '#A0A0A0' }} />
            </View>
          )}
        </View>
        {error && <Text style={{ fontSize: 10, color: 'red' }}>{error}</Text>}
      </View>
    );
  },
);

Input.displayName = 'Input';

export default Input;
