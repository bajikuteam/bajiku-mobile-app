
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
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import Button from '@/components/Button';
import Input from '@/components/Input';
import SocialButton from '@/components/SocialButton';
import { useTheme } from '@/utils/useContext/ThemeContext';
import { Link, router, useNavigation } from 'expo-router';
import { registerUser } from '@/services/api/request';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

const { height } = Dimensions.get('window');


const SignUpScreen = () => {
  const { theme } = useTheme(); 
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const [emailError, setEmailError] = useState<string | null>(null);
  const [dateOfBirthError, setDateOfBirthError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, 
    });
  }, [navigation]);


  // Validate email for both presence and correct format
  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError(null);
    }
  };

  const validateDateOfBirth = () => {
    if (!dob) {
      setDateOfBirthError('Date of Birth is required');
    } else {
      setDateOfBirthError(null);
    }
  };



  const handleRegister = async () => {
    const trimmedEmail = email.trim();
    setEmail(trimmedEmail);
    validateEmail();
    validateDateOfBirth();
  
    if (emailError || dateOfBirthError || !email || !dob) {
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      // Assuming registerUser returns both the token and user object
      const response = await registerUser(email, dob);
  
      // Check if the response contains both token and user object
      if (response.token && response.user && response.user._id) {
        // Store both the token and userId in AsyncStorage
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('userId', response.user._id); 
  
        // Clear the form fields after successful registration
        setEmail('');
        setDob('');
        setSelectedDate(new Date());
        setEmailError(null);
        setDateOfBirthError(null);
  
        // Navigate to email verification screen
        router.push('/auth/EmailVerification');
      } else {
        setError('Registration failed');
        Alert.alert('Error', 'Registration failed');
      }
    } catch (err) {
      if (isAxiosError(err)) {
        // Axios error handling
        if (err.response && err.response.status === 409 && err.response.data?.message) {
          Alert.alert('Error', err.response.data.message); 
        } else {
          Alert.alert('Error', 'An unexpected error occurred');
        }
      } else if (isErrorWithMessage(err)) {
        Alert.alert('Error', err.message); 
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Type guard to check if the error is an Axios error
  function isAxiosError(error: unknown): error is { response?: { status: number; data?: { message?: string } } } {
    return typeof error === 'object' && error !== null && 'response' in error;
  }
  
  // Type guard to check if the error has a message
  function isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === 'object' && error !== null && 'message' in error;
  }
  

const placeholderColor = theme === 'dark' ? '#fff' : '#000';


const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
  const currentDate = selectedDate || new Date(); 
  
  if (event.type === 'set') {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      toggleDatePicker();
      setSelectedDate(currentDate);
      setDob(currentDate.toLocaleDateString());
    } else {
      setSelectedDate(currentDate);
      setDob(currentDate.toLocaleDateString());
    }
  } else {
    toggleDatePicker();
    setShowDatePicker(false);
  }
};

const toggleDatePicker = () => {
  setShowDatePicker(!showDatePicker);
}


const confirmIOSDate = () => {
  if (selectedDate) {
    setDob(selectedDate.toLocaleDateString());
  }
  setShowDatePicker(false);
  toggleDatePicker()
}

  return (
     
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={[styles.loginModal, theme === 'dark' ? styles.darkModal : styles.lightModal]}>
            {/* <View className='absolute right-6 top-2'>
                <TouchableOpacity>
                <Link href={"/"}><Text className='text-2xl'>X</Text></Link>
                </TouchableOpacity>
              </View> */}

              <Text style={styles.modalTitle} className='text-[#FBBC05]'>
                Sign up to get started
              </Text>

              <View className='flex-1 items-center'>
             
              <Input
                              label="Email"
                              style={[styles.input, { color: textColor }]}
                              placeholder="Enter Email Address"
                              value={email}
                              onChangeText={(text) => {
                                const trimmedText = text.trim();
                                setEmail(trimmedText);
                                setError(''); 
                                setEmailError('')
                              }}
                              placeholderTextColor={placeholderColor } 
                              name={''}           
                               />
                                {emailError && <Text className="text-red-500   text-[12px]">{emailError}</Text>}

              {showDatePicker && (
              <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
              )}

              {showDatePicker && Platform.OS === 'ios' && 
              (
                <View style={{flexDirection: "row", justifyContent: "space-around"}}>
                  <TouchableOpacity style={[styles.button, styles.pickerButton, {backgroundColor: "#11182711"}]} onPress={toggleDatePicker}>
                    <Text 
                    style={[styles.buttonText, {color:"#075985"}]} onPress={toggleDatePicker}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.button, styles.pickerButton]} onPress={confirmIOSDate}>
                    <Text 
                    style={[styles.buttonText,]} onPress={confirmIOSDate}>
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

            {!showDatePicker && (
             <Pressable onPress={toggleDatePicker} style={styles.inputContainer}>
             <Text className='text-[#FBBC05] font-bold'>Date of Birth</Text>
             <View style={styles.inputWrapper}>
               <TextInput
               
               className='text-white'
               style={[styles.input, { color: '#ffffff' }]} 
                 placeholder="Select Date of Birth"
                 value={dob}
                 onChangeText={() => {}} 
                 editable={false}
                 placeholderTextColor={'#ffffff'}
               />
               <Icon name="calendar-today" size={20} color={textColor} style={styles.icon} />
             </View>
           </Pressable>
            )}
        
            {dateOfBirthError && <Text className="text-red-500  text-[12px]">{dateOfBirthError}</Text>}

            {error ? <Text className='text-red-500 absolute  text-[12px]'>{error}</Text> : null}

                

            <Button
              text={loading ? 'Submitting...' : 'Submit'}
              variant="primary"
              onClick={handleRegister}
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
           // onClick={handleGoogleLogin}
           variant="primary"
           image="https://res.cloudinary.com/dyz7znlj0/image/upload/v1726888095/Vector_ef0eca.png"
         />
        <View className='mt-4'></View>
           <SocialButton
          text="Continue with Facebook"
          // onClick={handleGoogleLogin}
          variant="primary"
           image="https://res.cloudinary.com/dyz7znlj0/image/upload/v1726888560/Social_Icons_fdhtsm.png"
        />
        {/* <View className='mt-4'></View>
           <SocialButton
          text="Continue with X"
          // onClick={handleGoogleLogin}
          variant="primary"
           image="https://res.cloudinary.com/dyz7znlj0/image/upload/v1726888553/Social_Icons_1_duxi1c.png"
        />
        <View className='mt-4'></View>
           <SocialButton
          text="Continue with Apple"
          // onClick={handleGoogleLogin}
          variant="primary"
           image="https://res.cloudinary.com/dyz7znlj0/image/upload/v1726888544/Social_Icons_2_khidul.png"
        /> */}


                 <View className='flex items-center text-center justify-center mt-8' >
               <Link href={"/auth/Login"}>  <Text style={[{ textAlign: 'center', fontSize: 14 }, { color: textColor }]}>
                Already have an account? 
                  <Text 
                    className="text-red-500 underline" 
                   
                  >
                    Sign in
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
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 30,
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
  datePicker:{
height:120,
marginTop: -10,
  },
  pickerButton: {
    paddingHorizontal:20
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  button:{
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:50,
    marginBottom:15,
    marginTop:10,
    backgroundColor:'#075985',
  },

  inputContainer: {
    marginBottom: 15, 
  },
  inputWrapper: {
    flexDirection: 'row',
    // alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    width:293,
    height:38,
    borderRadius: 12,
    padding: 10,
    // marginBottom: 15,
    justifyContent: 'space-between',
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    color: '#ffffff', 
  },

});

export default SignUpScreen;
