import Button from '@/components/Button';
import Input from '@/components/Input';
import { useTheme } from '@/utils/useContext/ThemeContext';
import { Link, router, useNavigation } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; 
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import ImageUpload from '@/components/ImageUpload';
import { checkUsernameAvailability} from '@/services/api/request';
import { useUser } from '@/utils/useContext/UserContext';
import { debounce } from 'lodash';
import CustomHeader from '@/components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
const { height } = Dimensions.get('window');

const EditProfile = () => {
    const { theme } = useTheme(); 
    const { user, handleLogin } = useUser(); 
    
    // State variables
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(user?.profileImageUrl || null); // Pre-fill with user's current image
    const [firstName, setFirstName] = useState(user?.firstName || ''); // Pre-fill with user's first name
    const [lastName, setLastName] = useState(user?.lastName || ''); // Pre-fill with user's last name
    const [userName, setUsername] = useState(user?.username || ''); // Pre-fill with user's username
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [usernameAvailability, setUsernameAvailability] = useState<{ available: boolean; message: string } | null>(null);
 
    useEffect(() => {
        // If the user context changes, update the state variables
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setUsername(user.username || '');
            setImage(user.profileImageUrl || null);
        }
    }, [user]);

    const handleImageUpload = (imageUri: string) => {
        setImage(imageUri); 
        setFormError(null);  
    };

    const debouncedCheckUsername = useCallback(
        debounce(async (userName: string) => {
            if (userName) {
                setLoading(true);
                try {
                    const result = await checkUsernameAvailability(userName);
                    if (result && typeof result.available === 'boolean') {
                        setUsernameAvailability(result); 
                    } else {
                        setUsernameAvailability(null);
                    }
                } catch (error) {
                    setUsernameAvailability(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setUsernameAvailability(null);
            }
        }, 500), 
        []
    );



    const editProfile = async (image: string | null, firstName: string, lastName: string, userName: string) => {
        const userId = user.id
        if (!userId) {
            throw new Error('User ID not found');
        }
      
        // Initialize FormData
        const formData = new FormData();
      
        // Only append image if it is a local file path (skip if it's a URL)
        if (image && !image.startsWith('http')) {
            try {
                const fileInfo = await FileSystem.getInfoAsync(image);
                if (fileInfo.exists) {
                    formData.append('image', {
                        uri: fileInfo.uri,
                        name: fileInfo.uri.split('/').pop() || 'photo.jpg',
                        type: 'image/jpeg',
                    }as any);
                } else {
                    console.log("Image file not found at", image);
                }
            } catch (error) {
                console.error('Error processing image:', error);
            }
        }
      
        // Always append first name, last name, and username
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('userName', userName);
      
        // API endpoint URL
        const apiUrl = `https://backend-server-quhu.onrender.com/api/auth/profile/edit/${userId}`;
      
        // Send the request
        try {
            const response = await axios.put(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
      
            return response.data;
        } catch (error) {
            throw error;
        }
      };
      


    const handleUpdate = async () => {
        setFormError(null);
        setSuccessMessage(null);
    
        // Skip image validation if image is not selected
        if (usernameAvailable === false) {
            Alert.alert('Error', 'Username is already taken. Please choose a different one.');
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await editProfile(image, firstName, lastName, userName);
            if (response.message === "Profile updated successfully") {
                setSuccessMessage('Profile updated successfully!');
                setFirstName('');
                setLastName('');
                setUsername('');
                setImage(null); 
                setUsernameAvailable(null);
                const updatedProfileData = response.updateProfile;
                await handleLogin(updatedProfileData);
                router.push('/Profile');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error);
                if (error.response && error.response.data && error.response.data.message) {
                    console.error('API Error Response:', error.response);
                    Alert.alert('Error', error.response.data.message);
                } else {
                    console.error('API Error Request:', error.request);
                    Alert.alert('Error', 'An error occurred while updating your profile. Please try again.');
                }
            } else {
                Alert.alert('Error', 'An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleUsernameChange = (text: string) => {
        setUsername(text);
        setFormError(null);
        debouncedCheckUsername(text); 
    };

    const goBack = () => {
        router.back();
    };

    const placeholderColor = 'black'; 

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
        >
            <CustomHeader 
                title={'Edit Profile'} 
                onBackPress={goBack} 
            />

            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={[styles.loginModal, theme === 'dark' ? styles.darkModal : styles.lightModal]}>
                        <View className='absolute right-6 top-2'>
                            <TouchableOpacity>
                                <Link href={"/Profile"}><Text className='text-2xl'>X</Text></Link>
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginBottom: 20, alignItems: 'center' }}>
                            <ImageUpload onImageSelected={handleImageUpload} currentImage={image} />
                            <Text className='text-[#ffffff] text-center text-xs mt-2 mb-4'>
                                Edit Profile Picture
                            </Text>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View className='flex-row items-center justify-around gap-4'>
                                <Input
                                    style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
                                    placeholder="First Name"
                                    value={firstName}
                                    onChangeText={(text) => {
                                        setFirstName(text);
                                        setFormError(null);  
                                    }}
                                    placeholderTextColor={placeholderColor}
                                    name={''}
                                />
                                <Input
                                    style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChangeText={(text) => {
                                        setLastName(text);
                                        setFormError(null);  
                                    }}
                                    placeholderTextColor={placeholderColor}
                                    className='w-[130px]' name={''}
                                />
                            </View>
                            <Input
                                style={[{ color: theme === 'dark' ? '#fff' : '#000' }]}
                                placeholder="Username"
                                value={userName}
                                onChangeText={handleUsernameChange}
                                placeholderTextColor={placeholderColor}
                                name={''}
                            />
                            {usernameAvailability && (
                                <Text className='text-xs -mt-4 mb-4' style={{ color: usernameAvailability.available ? 'green' : 'red' }}>
                                    {usernameAvailability.message}
                                </Text>
                            )}
                            {formError && <Text style={styles.errorText}>{formError}</Text>}
                            <Button
                                text={loading ? "Loading..." : "Submit"}
                                variant="primary"
                                onClick={handleUpdate}
                                disabled={loading || usernameAvailable === false} 
                                style={{ width: 293 }}
                            />
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
        paddingTop: "20%",
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        width: 140,
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

export default EditProfile;
