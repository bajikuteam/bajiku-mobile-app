import Button from '@/components/Button';
import ImageTextContainer from '@/components/ImageTextContainer';
import { setPassword } from '@/services/api/request';
import { useTheme } from '@/utils/useContext/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import { Ionicons } from '@expo/vector-icons'; 
import { Input } from 'react-native-elements';

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
    const navigation = useNavigation();


    
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

    const handlePasswordChange = (text: string) => {
        setPasswordValue(text);
        setPasswordError(null); 
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        setConfirmPasswordError(null); 
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
            return; 
        }
        const response = await setPassword(userId, password, confirmPassword); 
        setSuccessMessage(response.message);
        router.push('/auth/SetProfile');
    } catch (err) {
        setFormError('Failed to set password. Please try again.');
    } finally {
        setLoading(false);
    }
};
    const requirements = [
        { text: 'At least 8 characters long', isMet: password.length >= 8 },
        { text: 'At least one uppercase letter', isMet: /[A-Z]/.test(password) },
        { text: 'At least one lowercase letter', isMet: /[a-z]/.test(password) },
        { text: 'At least one digit', isMet: /[0-9]/.test(password) },
    ];

const labelColor = '#FBBC05'
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={[styles.loginModal, theme === 'dark' ? styles.darkModal : styles.lightModal]}>
                      
                        <View style={{ marginBottom: 32, marginTop: 16 }}>
                            <ImageTextContainer
                                imageSrc="https://res.cloudinary.com/dyz7znlj0/image/upload/v1726890693/Lock_1_hsmc82.png"
                                text="Please set a unique password."
                                subHead="Set your password?"
                            />
                        </View>

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={styles.inputWrapper}>
                                <Input                           
                                    secureTextEntry={!showPassword}
                                    style={{ color: textColor }}
                                    inputContainerStyle={styles.input}
                                    inputStyle={{ color: textColor, fontSize: 12 }} 
                                    label='Password'
                                    placeholder="Password"
                                    value={password}
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

                            {password && (
                                <View className='mb-4' style={{ justifyContent: 'flex-start', marginLeft:"10%", width: '100%', marginTop: "-10%" }}>
                                    {requirements.map((requirement, index) => (
                                        <Text key={index} style={{ color: textColor }}>
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

                            <View style={styles.inputWrapper}>
                                <Input                           
                                    secureTextEntry={!showConfirmPassword}
                                    style={{ color: textColor }}
                                    inputContainerStyle={styles.input}
                                    inputStyle={{ color: textColor, fontSize: 12 }} 
                                    label='Confirm Password'
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    labelStyle={{ color: labelColor }}
                                    onChangeText={handleConfirmPasswordChange}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButtonCon}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                                >
                                    {showConfirmPassword ? (
                                        <Ionicons name="eye" size={20} color="#488fee" />
                                    ) : (
                                        <Ionicons name="eye-off" size={20} color="#488fee" />
                                    )}
                                </TouchableOpacity>
                            </View>

                            {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}

                            <Button
                                text={loading ? "Loading..." : "Submit"}
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={loading}
                                style={{ width: '100%' }}
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
        justifyContent: 'flex-end',
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 0, 
        backgroundColor: '#000000',
    },
    loginModal: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: height * 0.8,
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
        justifyContent: 'center',
        height: 38,
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
        backgroundColor: '#000',
    },
    lightModal: {
        backgroundColor: '#fff',
    },
    inputWrapper: {
        position: 'relative',
        marginBottom: 10,
        width: '100%',
    },
    eyeButton: {
        position: 'absolute',
        right: 20,
        top: 30,
    },
    eyeButtonCon: {
        position: 'absolute',
        right: 20,
        top: 30,
    },
});

export default SetPassword;