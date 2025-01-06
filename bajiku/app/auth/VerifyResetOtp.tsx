import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native'; 
import ImageTextContainer from '@/components/ImageTextContainer';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { router } from 'expo-router';
import { verifyEmail } from '@/services/api/request';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VeirfyResetOtp: React.FC = () => {
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (otp.some((val) => val === '')) {
      setError('Please fill all OTP fields');
      return;
    }
  
    setLoading(true);
  
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('No token found. Please request a new OTP.');
        setLoading(false);
        return;
      }
  
      const otpString = otp.join(''); 
      const response = await fetch('https://my-social-media-bd.onrender.com/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: otpString, token }), 
      });
  
      const responseData = await response.json();
  
      if (response.ok) {

        AsyncStorage.setItem('userId', responseData.userId);
        router.push('/auth/ResetPassword');
      } else {
        // console.error('Error response:', responseData);
        setError(responseData.message || 'Invalid OTP');
      }
    } catch (err) {
    //   console.error('Error verifying OTP:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleInputChange = (value: string, index: number) => {
    if (value === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      return;
    }

    if (!/^\d$/.test(value) && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    setError(null);
  };



  const isFormValid = otp.every((digit) => digit !== '');

  return (
    <View style={styles.container}>
      <ImageTextContainer
        text="We have sent a verification code to your email"
        subHead="Verify Reset OTP."
      />

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <Input
            key={index}
            style={[
              styles.input,
              error && !digit ? styles.inputError : null,
              { color: '#fff' } 
            ]}
            value={digit}
            onChangeText={(value) => handleInputChange(value, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(el) => (inputsRef.current[index] = el)}
            name={'otp'}
          />
        ))}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}


          <Button
            text={loading ? 'Submit...' : 'Submit'}
            onClick={handleSubmit}
            variant="primary"
            disabled={!isFormValid || loading}
          />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', 
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 18,
    marginRight: 10,
    backgroundColor: '#1a1a1a', 
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  resendText: {
    color: '#6E6E6E',
    marginTop: 10,
  },
});

export default VeirfyResetOtp;
