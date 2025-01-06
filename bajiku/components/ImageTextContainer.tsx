import { ImageTextContainerProps } from '@/services/core/types';
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const ImageTextContainer: React.FC<ImageTextContainerProps> = ({
  imageSrc,
  imageAlt = 'Image',
  text,
  subHead,
  containerStyle = {},
  textStyle = {},
  imageStyle = {},
}) => {
 
  return (
    <View style={[styles.container, containerStyle]}>
      {imageSrc && (
        <Image
          source={{ uri: imageSrc }}
          accessibilityLabel={imageAlt}
          style={[styles.image, imageStyle]}
          resizeMode="cover"
        />
      )}
      {subHead && (
        <Text style={[styles.subHead, textStyle]}>
          {subHead}
        </Text>
      )}
      {text && (
        <Text style={[styles.text, textStyle]}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 140,
    marginBottom: 16,
  },
  subHead: {
    color: '#fff', 
    fontSize: 18,
    fontWeight: 'bold'
  },
  text: {
    color: '#6E6E6E',
    fontSize: 12,
  },
});

export default ImageTextContainer;
