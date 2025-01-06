
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import axios from 'axios';  
import { useUser } from '@/utils/useContext/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/Button';
import { Input } from 'react-native-elements';
import ImageTextContainer from '@/components/ImageTextContainer';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user  } = useUser(); 
  const handleChangePassword = async () => {
    setLoading(true);

    
    // Step 1: Basic validation
    if (newPassword === currentPassword) {
      setLoading(false);
      Alert.alert('Error', 'New password cannot be the same as the current password.');
      return;
    }


    

    if (newPassword !== confirmNewPassword) {
      setLoading(false);
      Alert.alert('Error', 'New password and confirmation do not match.');
      return;
    }
    const userId = user?.id  || await AsyncStorage.getItem('userId'); 
    // Step 2: Send the password change request to the API
    try {
      const response = await axios.post(
        `https://my-social-media-bd.onrender.com/api/auth/change-password/${userId}`, 
        {
                        
          currentPassword,
          newPassword,
          confirmNewPassword,
        }
      );

      setLoading(false);
      if (response.status === 200) {
        Alert.alert('Success', 'Password updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update password.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Failed to update password.');
    }
  };


  const labelColor = '#fff';


  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.modalContainer}
  >
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>


      <View style={styles.imageTextContainer}>
          <Image source={{uri :'https://res.cloudinary.com/dyz7znlj0/image/upload/v1726867781/unnamed_1_1_immicl.png' }}   style={{width: 300, height:150,
            marginBottom:5
          }}/>
              <ImageTextContainer
                text="Enter your email to receive recovery instructions."
                subHead="Lost your password?"
              />
            </View>

      <View style={styles.inputWrapper}>

      <Input
       label="Current Password"
       containerStyle={styles.inputContainer} 
       inputContainerStyle={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        labelStyle={{ color: labelColor }}
        inputStyle={{ fontSize: 12 }} 
      />

      <Input
       label="New Password"
       containerStyle={styles.inputContainer} 
       inputContainerStyle={styles.input}
        // style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        labelStyle={{ color: labelColor }}
        inputStyle={{ fontSize: 12 }} 
      />

      <Input
       label="Confirm New Password"
       containerStyle={styles.inputContainer} 
       inputContainerStyle={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        labelStyle={{ color: labelColor }}
        inputStyle={{ fontSize: 12 }} 
      />

      <Button
        text={loading ? 'Updating...' : 'Change Password'}
        onClick={handleChangePassword}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
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
});



export default ChangePassword;
