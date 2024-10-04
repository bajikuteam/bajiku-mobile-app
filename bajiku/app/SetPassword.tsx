import Button from '@/components/Button';
import ImageTextContainer from '@/components/ImageTextContainer';
import Input from '@/components/Input';
import { setPassword } from '@/services/api/request';
import { useTheme } from '@/utils/useContext/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView,
} from 'react-native';

const { height } = Dimensions.get('window');

const SetPassword = () => {
    const { theme } = useTheme(); 
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [password, setPasswordValue] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const textColor = theme === 'dark' ? '#fff' : '#000';
    
    const validatePassword = () => {
        if (!password) {
            setPasswordError('Password is required');
        } else if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
        } else if (!/[A-Z]/.test(password)) {
            setPasswordError('Password must contain at least one uppercase letter');
        } else if (!/[a-z]/.test(password)) {
            setPasswordError('Password must contain at least one lowercase letter');
        } else if (!/[0-9]/.test(password)) {
            setPasswordError('Password must contain at least one digit');
        } else {
            setPasswordError(null);
        }
    };

    const validateConfirmPassword = () => {
        if (confirmPassword !== password) {
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError(null);
        }
    };

    const handleSubmit = async () => {
        validatePassword();
        validateConfirmPassword();
    
        if (passwordError || confirmPasswordError || !password || !confirmPassword) {
            return;
        }
    
        setFormError(null);
        setLoading(true);
    
        try {
            const userId = await AsyncStorage.getItem('userId');
    
            if (!userId) {
                setFormError('No user found. Please Sign up again.');
                return; // Exit if userId is null
            }
    
            const response = await setPassword(userId, password, confirmPassword); 
            setSuccessMessage(response.message);
        } catch (err) {
            setFormError('Failed to set password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const placeholderColor = 'black'; 


    const requirements = [
      { text: 'At least 8 characters long', isMet: password.length >= 8 },
      { text: 'At least one uppercase letter', isMet: /[A-Z]/.test(password) },
      { text: 'At least one lowercase letter', isMet: /[a-z]/.test(password) },
      { text: 'At least one digit', isMet: /[0-9]/.test(password) },
    ];


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={[styles.loginModal, theme === 'dark' ? styles.darkModal : styles.lightModal]}>
                        <View style={{ position: 'absolute', right: 16, top: 16 }}>
                            <TouchableOpacity>
                                <Link href={"/(tabs)/"}><Text style={{ fontSize: 24 }}>X</Text></Link>
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginBottom: 32, marginTop: 16 }}>
                            <ImageTextContainer
                                imageSrc="https://res.cloudinary.com/dyz7znlj0/image/upload/v1726890139/763869a33c8ac9e99a59500992c11127_1_zd2zyb.png"
                                text="Please set a unique password."
                                subHead="Set your password?"
                            />
                        </View>

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Input
                                label="Password"
                                style={[styles.input, { color: textColor }]}
                                value={password}
                                onChangeText={(text) => {
                                    setPasswordValue(text);
                                    setPasswordError(null); // Clear error on input
                                }}
                                placeholderTextColor={placeholderColor} name=''
                            />

                            {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

                            <Input
                  label='Confirm Password'
                  style={[styles.input, { color: textColor }]}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setConfirmPasswordError(null); // Clear error on input
                  } }
                  placeholderTextColor={placeholderColor} name={''}                            />

{password && (
        <View style={{  }}>
          {requirements.map((requirement, index) => (
            <Text  key={index} style={{ color: textColor }}>
              {requirement.text}
              {requirement.isMet ? (
                <MaterialIcons name="check-circle" size={20} color="green" style={{ marginLeft: 4 }} />
              ) : (
                <MaterialIcons name="cancel" size={20} color="red" style={{ marginLeft: 4 }} />
              )}
            </Text>
          ))}
        </View>
      )}

                            {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}

                            <Button
                                text={loading ? "Loading..." : "Submit"}
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={loading}
                                style={{ width: 293 }}
                            />

                            {formError && <Text style={styles.errorText}>{formError}</Text>}
                            {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
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
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 10,
        marginBottom: 15,
        width: 293,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    successText: {
        color: 'green',
        marginTop: 10,
    },
    darkModal: {
        backgroundColor: '#333',
    },
    lightModal: {
        backgroundColor: '#fff',
    },
});

export default SetPassword;
