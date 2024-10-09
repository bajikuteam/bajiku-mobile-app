import Button from '@/components/Button';
import Input from '@/components/Input';
import { useTheme } from '@/utils/useContext/ThemeContext';
import { Link, router, useNavigation } from 'expo-router';
import React, { useState, useCallback } from 'react';
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
} from 'react-native';
import ImageUpload from '@/components/ImageUpload';
import { checkUsernameAvailability, setuUpUserProfile, updateProfile } from '@/services/api/request';
import { useUser } from '@/utils/useContext/UserContext';
import { debounce } from 'lodash';
const { height } = Dimensions.get('window');

const SetProfileScreen = () => {
    const { theme } = useTheme(); 

    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUsername] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const { handleLogin  } = useUser(); 
    const textColor = theme === 'dark' ? '#fff' : '#000';
    const [usernameAvailability, setUsernameAvailability] = useState<{ available: boolean; message: string } | null>(null);
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false, 
      });
    }, [navigation]);


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
    

    const handleUpdate = async () => {
        setFormError(null);
        setSuccessMessage(null);

        // Validate all required fields
        if (!firstName || !lastName || !userName || !image) {
            Alert.alert('Error', 'All fields are required, including uploading a profile image.');
            return;
        }

        if (usernameAvailable === false) {
            Alert.alert('Error', 'Username is already taken. Please choose a different one.');
            return;
        }

        setLoading(true);

        try {
            const response = await updateProfile(image, firstName, lastName, userName);
            if (response.message === "Profile updated successfully") {
                setSuccessMessage('Profile updated successfully!');
                setFirstName('');
                setLastName('');
                setUsername('');
                setImage(null); 
                setUsernameAvailable(null);

                const updatedProfileData = response.updateProfile;
                await handleLogin(updatedProfileData);
                router.push('/(tabs)/');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.data.message) {
                    Alert.alert('Error', error.response.data.message);
                } else {
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

    const placeholderColor = 'black'; 

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={[styles.loginModal, theme === 'dark' ? styles.darkModal : styles.lightModal]}>
                    <Text  className='text-[#FBBC05] text-center text-xl mb-12'>
                Set-up Your Account
              </Text>
                        <View style={{ marginBottom: 20, alignItems: 'center' }}>
                            <ImageUpload onImageSelected={handleImageUpload} />
                        </View>

                        <View style={{ flex: 1, alignItems: 'center' }}>
                        <View className='flex-row w-full items-center justify-around pr-8 pl-6'>
                            <Input
                                    label="First Name"
                                    style={[styles.input, { color: textColor }]}
                                    placeholder="Enter First Name"
                                    value={firstName}
                                    onChangeText={(text) => {
                                        setFirstName(text);
                                        setFormError(null);  
                                    }}
                                    placeholderTextColor={placeholderColor}
                                    name={''}
                                />
                                <Input
                                    label="Last Name"
                                    style={[styles.input, { color: textColor }]}
                                    placeholder="Enter Last Name"
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
                                label="Username"
                                style={[{ color: textColor }]}
                                placeholder="Enter Username"
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
    },
    loginModal: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: height * 0.9,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        paddingTop:"20%",
       
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

export default SetProfileScreen;

