import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Text, SafeAreaView, KeyboardAvoidingView, Platform, Image, TouchableOpacity } from 'react-native';
import axios, { AxiosError } from 'axios'; 
import { useUser } from '@/utils/useContext/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/Button';
import { Input } from 'react-native-elements';
import ImageTextContainer from '@/components/ImageTextContainer';
import CustomHeader from '@/components/CustomHeader';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const { user } = useUser(); 
  const labelColor = '#fff';

  const goBack = () => {
    router.back();
  };

  const validatePassword = () => {
    if (!newPassword) {
      setPasswordError('Password is required');
    } else if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else if (!/[A-Z]/.test(newPassword)) {
      setPasswordError('Password must contain at least one uppercase letter');
    } else if (!/[a-z]/.test(newPassword)) {
      setPasswordError('Password must contain at least one lowercase letter');
    } else if (!/[0-9]/.test(newPassword)) {
      setPasswordError('Password must contain at least one digit');
    } else {
      setPasswordError(null);
    }
  };

  const validateConfirmPassword = () => {
    if (confirmNewPassword !== newPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError(null);
    }
  };

  const requirements = [
    { text: 'At least 8 characters long', isMet: newPassword.length >= 8 },
    { text: 'At least one uppercase letter', isMet: /[A-Z]/.test(newPassword) },
    { text: 'At least one lowercase letter', isMet: /[a-z]/.test(newPassword) },
    { text: 'At least one digit', isMet: /[0-9]/.test(newPassword) },
  ];

  const handleChangePassword = async () => {
    // Validate before proceeding
    validatePassword();
    validateConfirmPassword();
    setLoading(true);

    // If there's a validation error, don't proceed
    if (passwordError || confirmPasswordError || !newPassword || !confirmNewPassword) {
      setLoading(false);
      return;
    }

    const userId = user?.id || await AsyncStorage.getItem('userId');  
    try {
      const response = await axios.post(
        `https://my-social-media-bd.onrender.com/api/auth/change-password/${userId}`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword,
        },
      );
      setLoading(false);

      // Handle successful password change response (status 201)
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Password updated successfully!');
        setCurrentPassword('')
        setNewPassword('')
        setConfirmNewPassword('')
        goBack()
      } else {
        Alert.alert('Error', 'Failed to update password.');
      }
    } catch (error: unknown) {
      setLoading(false);
   
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorMessage = error.response.data?.message || 'Failed to update password.';
          Alert.alert('Error', errorMessage);
        } else {
          Alert.alert('Error', `Network error: ${error.message}`);
        }
      } else {
        Alert.alert('Error', 'An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (text: string) => {
    setNewPassword(text);
    setPasswordError(null); 
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmNewPassword(text);
    setConfirmPasswordError(null); 
  };

  const isPasswordValid = () => {
    return (
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword) &&
      /[0-9]/.test(newPassword)
    );
  };

  const isFormValid = () => {
    // Check if both passwords match and meet validation criteria
    return isPasswordValid() && confirmNewPassword === newPassword;
  };

  return (
    <>
      <CustomHeader
        title={"Change Password"}
        onBackPress={goBack}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
              <View style={styles.imageTextContainer}>
                <Image
                  source={{
                    uri: 'https://res.cloudinary.com/dyz7znlj0/image/upload/v1726890139/763869a33c8ac9e99a59500992c11127_1_zd2zyb.png',
                  }}
                  style={{
                    width: 180,         
                    height: 180,       
                    borderRadius: 90,  
                    marginBottom: 5,
                  }}
                />
                <ImageTextContainer
                  subHead="Set your new unique password."
                  text=""
                />
              </View>

              <View style={styles.inputWrapper}>
                <Input
                  label="Current Password"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                  placeholder="Current Password"
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  labelStyle={{ color: labelColor }}
                  inputStyle={{ fontSize: 12, color: '#fff' }}
                />

              <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)} 
                >
                  {showCurrentPassword ? (
                    <Ionicons name="eye" size={20} color="#488fee" />
                  ) : (
                    <Ionicons name="eye-off" size={20} color="#488fee" />
                  )}
                </TouchableOpacity>
              </View>

              {/* New Password Section */}
              <View style={styles.inputWrapper}>
                <Input                           
                  secureTextEntry={!showPassword}
                  inputContainerStyle={styles.input}
                  inputStyle={{ fontSize: 12, color: '#fff' }}
                  label='Password'
                  placeholder="Password"
                  value={newPassword}
                  labelStyle={{ color: labelColor }}
                  onChangeText={handlePasswordChange} 
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)} 
                >
                  {showPassword ? (
                    <Ionicons name="eye" size={20} color="#488fee" />
                  ) : (
                    <Ionicons name="eye-off" size={20} color="#488fee" />
                  )}
                </TouchableOpacity>
              </View>

              {newPassword && (
                   <View style={{ justifyContent: 'flex-start', marginLeft:"20%", marginBottom:8, width: '100%', marginTop: "-10%" }}>
                  {requirements.map((requirement, index) => (
                    <Text key={index} style={{ color: '#fff' }}>
                      {requirement.text} 
                      {requirement.isMet ? (
                        <MaterialCommunityIcons name="check-circle" size={10} color="green" style={{ marginLeft: 4 }} />
                      ) : (
                        <MaterialCommunityIcons name="cancel" size={10} color="red" style={{ marginLeft: 2 }} />
                      )}
                    </Text>
                  ))}
                </View>
              )}

              {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

              {/* Confirm New Password Section */}
              <View style={styles.inputWrapper}>
                <Input
                  label="Confirm New Password"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                  placeholder="Confirm New Password"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmNewPassword}
                  onChangeText={handleConfirmPasswordChange}
                  labelStyle={{ color: labelColor }}
                  inputStyle={{ fontSize: 12, color: '#fff' }}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                >
                  {showConfirmPassword ? (
                    <Ionicons name="eye" size={20} color="#488fee" />
                  ) : (
                    <Ionicons name="eye-off" size={20} color="#488fee" />
                  )}
                </TouchableOpacity>
              </View>

              <Button
                text={loading ? 'Updating...' : 'Change Password'}
                onClick={handleChangePassword}
                disabled={loading || !isFormValid()}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    justifyContent: 'center',
    height: 38,
    width: 293,
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  imageTextContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: 40,
    top: 28,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default ChangePassword;
