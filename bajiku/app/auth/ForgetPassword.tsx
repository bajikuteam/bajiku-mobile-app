import Button from '@/components/Button';
import ImageTextContainer from '@/components/ImageTextContainer';
import Input from '@/components/Input';
import { useTheme } from '@/utils/useContext/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Image
} from 'react-native';

const ForgetPassword = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    setLoading(true);
    setError('');
    setEmailError(null);
  
    try {
      const response = await fetch('https://my-social-media-bd.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        await AsyncStorage.setItem('token', responseData.token);
  
        router.push('/auth/VerifyResetOtp');
      } else {
        const errorData = await response.json();
        // console.log('Error response:', errorData);
  
        // Alert the user with the error message
        if (errorData.message) {
          alert(errorData.message);  
        } else {
          alert('An error occurred. Please try again.');
        }
  
        setError(errorData.message || 'Failed to resend OTP');
      }
    } catch (error) {
      // console.error('Request error:', error);
  
      // Show a generic error message in case of an unexpected error
      alert('Something went wrong. Please try again.');
  
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.modalContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.centeredScrollView}>
          <View
            style={[
              styles.loginModal,
              theme === 'dark' ? styles.darkModal : styles.lightModal,
            ]}
          >
  

            <View style={styles.imageTextContainer}>
          <Image source={{uri :'https://res.cloudinary.com/dyz7znlj0/image/upload/v1726867781/unnamed_1_1_immicl.png' }}   style={{width: 300, height:150,
            marginBottom:5
          }}/>
              <ImageTextContainer
                text="Enter your email to receive recovery instructions."
                subHead="Lost your password?"
              />
            </View>

            <View style={styles.inputContainer}>
            <Input
                              label="Email"
                              style={styles.input}
                              placeholder="Enter Email Address"
                              value={email}
                              onChangeText={(text) => {
                                const trimmedText = text.trim();
                                setEmail(trimmedText);
                                setError(''); 
                                setEmailError('')
                              }}
                              // placeholderTextColor={placeholderColor } 
                              name={''}           
                               />

              <Button
                text={loading ? 'Submitting...' : 'Submit'}
                variant="primary"
                onClick={handleForgotPassword}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#000000',
  },
  centeredScrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginModal: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  imageTextContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    justifyContent: 'center',
    height: 38,
},

  darkModal: {
    backgroundColor: '#000',
  },
  lightModal: {
    backgroundColor: '#fff',
  },
});

export default ForgetPassword;
