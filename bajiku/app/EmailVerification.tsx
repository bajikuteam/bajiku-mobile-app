import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import ImageTextContainer from '@/components/ImageTextContainer';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { router } from 'expo-router';
import { verifyEmail } from '@/services/api/request';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmailVerification: React.FC = () => {
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState<number>(120);
  const [canResend, setCanResend] = useState(false);


  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleSubmit = async () => {
    if (otp.some((val) => val === '')) {
      setError('Please fill all OTP fields');
      return;
    }
  
    const otpString = otp.join('');
    setLoading(true);
  
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (!token) {
        setError('No token found. Please try again.');
        return;
      }
  
      const response = await verifyEmail(token, otpString);
      AsyncStorage.setItem('userId', response.userId);
      router.push('/SetPassword');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendOtp = () => {
    setTimer(120);
    setCanResend(false);
    setOtp(Array(6).fill(''));
    setError(null);
    inputsRef.current[0]?.focus();
  };

  const handleInputChange = (value: string, index: number) => {
    if (value === '') {
      // Handle backspace
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      // Move focus to the previous input
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      return;
    }

    if (!/^\d$/.test(value) && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input if the current value is valid
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    setError(null);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const isFormValid = otp.every((digit) => digit !== '');

  return (
    <View style={styles.container}>
      <ImageTextContainer
        text="We have sent a verification code to your email"
        subHead="Verify your email."
      />

      <View className='mt-4' style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <Input
            key={index}
            style={[
              styles.input,
              error && !digit ? styles.inputError : null,
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

      {!canResend ? (
        <>
          <Button
            text={loading ? 'Verifying...' : 'Verify OTP'}
            onClick={handleSubmit}
            variant="primary"
            disabled={!isFormValid || loading}
          />
          <Text style={styles.resendText}>
            Resend Code in {formatTime(timer)}
          </Text>
        </>
      ) : (
        <Button
          text="Resend Code"
          onClick={handleResendOtp}
          variant="primary"
          disabled={loading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 18,
    marginRight: 10,
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

export default EmailVerification;
