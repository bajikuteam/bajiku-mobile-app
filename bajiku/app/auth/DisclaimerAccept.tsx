import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert,Image,  ActivityIndicator } from 'react-native';

import { acceptDisclaimerAPI } from '@/services/api/request';
import { useTheme } from '@/utils/useContext/ThemeContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DisclaimerAccept = () => {
  const { theme } = useTheme(); 
  
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const textColor = theme === 'dark' ? '#fff' : '#000';

  const [userId, setUserId] = useState<string | null>(null);
React.useEffect(() => {
  const getUserIdFromStorage = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  };
  getUserIdFromStorage();
}, []);
  
  const handleAcceptDisclaimer = async () => {
    if (!disclaimerAccepted) {
      Alert.alert('Please accept the disclaimer to proceed');
      return;
    }

    setLoading(true);

    try {
      const response = await acceptDisclaimerAPI(userId as string, disclaimerAccepted);

      if (response.message === 'Disclaimer accepted successfully') {
        router.push('/auth/EmailVerification'); 
      }
    } catch (error) {
        // console.error('Error accepting disclaimer: ', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>

                          

              <Image    
                source={{ uri: 'https://res.cloudinary.com/dyz7znlj0/image/upload/v1734210622/images_1_yqxt5x.jpg' }}
                style={{width: 300, height:300}}
              />
                   

      {/* Disclaimer Text (you can replace this with actual terms) */}
      <Text style={[styles.text, { color: textColor, marginBottom: 20 }]}>
      By clicking and continuing, you confirm that you are 18 years of age or older.
      </Text>

      {/* Checkbox or Button for accepting the disclaimer */}
      <TouchableOpacity
        style={[styles.checkboxContainer]}
        onPress={() => setDisclaimerAccepted(!disclaimerAccepted)}
      >
        <View style={[styles.checkbox, disclaimerAccepted && styles.checkboxChecked]}>
          {disclaimerAccepted && <View style={styles.checkMark} />}
        </View>
        <Text style={[styles.checkboxLabel, { color: textColor }]}>I accept the disclaimer</Text>
      </TouchableOpacity>

      {/* Submit button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleAcceptDisclaimer}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Accept Disclaimer</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#25D366',
    borderColor: '#25D366',
  },
  checkMark: {
    width: 12,
    height: 12,
    backgroundColor: '#25D366',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DisclaimerAccept;
