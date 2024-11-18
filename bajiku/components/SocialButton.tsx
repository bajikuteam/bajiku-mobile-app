import { SocialButtonProps } from '@/services/core/types';
import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
// import { SocialButtonProps } from 'src/services/core/types'; // Adjust the path as necessary

const SocialButton: React.FC<SocialButtonProps> = ({
  text,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  style = {}, 
  icon: Icon = null,
  image = null,
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.button, styles[variant]]} 
      activeOpacity={0.7} 
    >
      <View style={styles.content}>
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        )}
        {Icon && <Icon style={styles.icon} />}
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 300,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  primary: {
    backgroundColor: '#D9D9D9',
  },
  secondary: {
    backgroundColor: '#E0E0E0', 
  },
  danger: {
    backgroundColor: '#FF6347',
  },
  disabled: {
    backgroundColor: '#A9A9A9', 
  },
  content: {
    flexDirection: 'row',
    // alignItems: 'center',
    paddingLeft: 70,
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  text: {
    color: 'black',
    fontSize: 12,
  },
});

export default SocialButton;
