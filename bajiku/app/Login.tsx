import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Button from '@/components/Button';
import Input from '@/components/Input';
import SocialButton from '@/components/SocialButton';
import { useTheme } from '@/utils/useContext/ThemeContext';
import { Link, router } from 'expo-router';
import { loginUser } from '@/services/api/request';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/utils/useContext/UserContext';

const { height } = Dimensions.get('window');

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const { theme } = useTheme(); 
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useUser();

  
  const submitLogin = async () => {
    setLoading(true);
    setError(''); // Clear previous error message
    try {
      const response = await loginUser(email, password);
      
      const responseData = await response.json();
  
      if (response.ok && responseData.user) {
        const { id, token } = responseData.user;
  
        await AsyncStorage.setItem('id', id);  
        await AsyncStorage.setItem('token', token);
  
        // Navigate to the tabs
        router.push('/(tabs)/');
  
        const userData = responseData.user;
        await handleLogin(userData);
      } else {
        // Show alert with server's error message
        const errorMessage = error || 'Login failed, please check your credentials.';
        alert(errorMessage);
        console.log(errorMessage);
      }
    } catch (err) {
      // Show alert for generic error
      alert('An error occurred. Please try again.');
      // console.error('Error during login:', err);
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
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={[styles.loginModal, theme === 'dark' ? styles.darkModal : styles.lightModal]}>
              <View className='absolute right-6 top-2'>
                <TouchableOpacity>
                <Link href={"/(tabs)/"}><Text className='text-3xl'>X</Text></Link>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalTitle} className='text-[#FBBC05]'>
                Sign in to get started
              </Text>
              {/* {successMessage ? <Text className='text-center text-green-500'>{successMessage}</Text> : null} */}

              <View className='flex-1 items-center'>
              <Input
                              label="Email"
                              style={[styles.input, { color: textColor }]}
                              placeholder="Enter Email Address"
                              value={email}
                              onChangeText={(text) => {
                                setEmail(text);
                                setError(''); 
                                // setEmailError('')
                              }}
                              // placeholderTextColor={placeholderColor } 
                              name={''}           
                               />
                                 <Input
                             
                             style={[styles.input, { color: textColor, zIndex: 1 }]} 
                                  placeholder="Passworder"
                                label='Password'
                              value={password}
                              onChangeText={(text) => {
                                setPassword(text);
                                setError(''); 
                                // setEmailError('')
                              }}

                              name={password}           
                               />

<Button
              text={loading ? 'Submitting...' : 'Login'}
              variant="primary"
              onClick={submitLogin }
              className="w-[293px]"
              disabled={loading}
            />
              

                <View style={styles.separator}>
                  <View style={styles.line} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.line} />
                </View>
                <View className='mt-4'></View>
           <SocialButton
           text="Continue with Google"
           variant="primary"
           image="https://res.cloudinary.com/dyz7znlj0/image/upload/v1726888095/Vector_ef0eca.png"
         />
        <View className='mt-4'></View>
           <SocialButton
          text="Continue with Facebook"
          variant="primary"
           image="https://res.cloudinary.com/dyz7znlj0/image/upload/v1726888560/Social_Icons_fdhtsm.png"
        />
        {/* <View className='mt-4'></View> */}
           {/* <SocialButton
          text="Continue with X"
          variant="primary"
           image="https://res.cloudinary.com/dyz7znlj0/image/upload/v1726888553/Social_Icons_1_duxi1c.png"
        />
        <View className='mt-4'></View>
           <SocialButton
          text="Continue with Apple"
          variant="primary"
           image="https://res.cloudinary.com/dyz7znlj0/image/upload/v1726888544/Social_Icons_2_khidul.png"
        /> */}
                <View className='flex items-center text-center justify-center mt-8' >
              <Link href={"/Signup"}> <Text style={[{ textAlign: 'center', fontSize: 14 }, { color: textColor }]}>
                  Don’t have an account? 
                  <Text 
                    className="text-red-500 underline" 
              
                  >
                    Sign up
                  </Text>
                </Text></Link>
              </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
   
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0, 
  },
  loginModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D84774',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    width: 8,
    height: 8,
    backgroundColor: '#D84773',
    borderRadius: 4,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
    width: '35%',
  },
  orText: {
    marginHorizontal: 8,
    color: '#555',
  },
  darkModal: {
    backgroundColor: '#333', 
  },
  lightModal: {
    backgroundColor: '#fff', 
  },
});

export default LoginModal;
