import { useTheme } from '@/utils/useContext/ThemeContext';
import { getThemeStyles } from '@/utils/useContext/themeStyles';
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ModeSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const styles = getThemeStyles(theme);

  const handleIconPress = (selectedTheme:any) => {
    if (theme !== selectedTheme) {
      toggleTheme();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[localStyles.switchContainer, theme === 'dark' ? localStyles.dark : localStyles.light]}
      >
        <TouchableOpacity onPress={() => handleIconPress('light')}>
          <Ionicons name="sunny" size={28} color={theme === 'light' ? '#FFD700' : '#D9D9D9'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIconPress('dark')}>
          <Ionicons name="moon" size={28} color={theme === 'dark' ? '#FFD700' : '#D9D9D9'} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 130, 
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
  },
  dark: {
    backgroundColor: '#333', 
  },
  light: {
    backgroundColor: '#333',
  },
});

export default ModeSettings;
