import { StyleSheet } from 'react-native';

const lightTheme = {
  background: '#fff',
  text: '#000',
};

const darkTheme = {
  background: '#000',
  text: '#fff',
};

export const getThemeStyles = (theme: 'light' | 'dark') => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? darkTheme.background : lightTheme.background,
    },
    text: {
      color: theme === 'dark' ? darkTheme.text : lightTheme.text,
      fontSize: 20,
    },
  });
};
