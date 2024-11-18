// Loading.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const Loading = () => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounce = () => {
      bounceAnim.setValue(0.5);
      Animated.timing(bounceAnim, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(bounceAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }).start(bounce);
      });
    };

    bounce();
  }, [bounceAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.bouncingText,
          {
            transform: [{ scale: bounceAnim }],
            opacity: bounceAnim.interpolate({
              inputRange: [0.5, 1.1],
              outputRange: [0, 1],
            }),
          },
        ]}
      >
        Bajîkü
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  bouncingText: {
    color: '#D84773',
    fontSize: 40,
  },
});

export default Loading;
