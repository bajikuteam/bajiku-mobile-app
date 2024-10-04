import Button from '@/components/Button';
import ImageTextContainer from '@/components/ImageTextContainer';
import Input from '@/components/Input';
import { useTheme } from '@/utils/useContext/ThemeContext';
import { Link } from 'expo-router';
import React from 'react';
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
  } from 'react-native';
  const { height } = Dimensions.get('window');

 
const ForgetPassword = () => {
    const { theme } = useTheme(); 
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

              <View className='mb-16 mt-8'>
           <ImageTextContainer
            imageSrc="https://res.cloudinary.com/dyz7znlj0/image/upload/v1726890693/Lock_1_hsmc82.png"
            text="Enter your email to receive recovery instructions."
            subHead="Lost your password?"
          />
        </View>

              <View className='flex-1 items-center'>
                <Input
                  style={styles.input}
                  placeholder="Enter your Email Address"
                  className='w-[293px]'
                  placeholderTextColor="#666"
                  value={''}
                  label='Email'
                  onChangeText={(text) => { /* Handle change */ }}
                  name={''}
                />
               

                <Button
                  text="Submit"
                  variant="primary"
                  onClick={() => {
                    alert('Login Submitted!');
                   
                  }}
                  className='w-[293px]'
                />

               
                  <View  >
                  <Link href={"/SetPassword"}> <Text >Set Password</Text> </Link>
                 
                </View>

                <View  >
                  <Link href={"/EmailVerification"}> <Text >verify email</Text> </Link>
                 
                </View>
              
          
       
               
              </View>

              

              {/* <SignUpModal visible={signUpVisible} onClose={() => setSignUpVisible(false)} /> */}
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
}

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
  
  
 
export default ForgetPassword;