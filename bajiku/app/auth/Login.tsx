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
import Button from '@/components/Button';
import SocialButton from '@/components/SocialButton';
import { useTheme } from '@/utils/useContext/ThemeContext';
import { Link, router, useNavigation } from 'expo-router';
import { loginUser } from '@/services/api/request';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/utils/useContext/UserContext';
import { Ionicons } from '@expo/vector-icons'; 
import { Input } from 'react-native-elements';

// import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

const LoginScreen = () => {
  const { theme } = useTheme(); 
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const { handleLogin } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
//  const [request, response, promptAsyn] = Google.useAuthRequest({
//   androidClientId:"382144475557-89n9a8olcmv4kflbdriju1j06p0u71ql.apps.googleusercontent.com",
//   iosClientId:"382144475557-ev3vcvohaji5f4gvgpp46ijn6qbs49io.apps.googleusercontent.com",
//   webClientId:"382144475557-unvshpmrj3m92gr4qsr86l13h8dvrnmf.apps.googleusercontent.com"
//  })


//  React.useEffect(()=>{
//   handleSigninWithGoogle()
//  },[response])

//  async function handleSigninWithGoogle() {
//   const user = await AsyncStorage.getItem('@use');
//   if (!user) {
//       if (response?.type === "success") {
//           const accessToken = response.authentication?.accessToken;
//           if (accessToken) {
//               await getUserInfo(accessToken);
//           } else {
//               console.error("Access token is undefined");
//               // Handle error (e.g., show a message to the user)
//           }
//       }
//   } else {
//       setUserInfo(JSON.parse(user));
//   }
// }



// const getUserInfo = async (token: string) => {
//   if (!token) return;

//   try {
//       const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
//           headers: {
//               Authorization: `Bearer ${token}`,
//           },
//       });

//       if (!response.ok) {
//           throw new Error(`Error fetching user info: ${response.statusText}`);
//       }

//       const userInfo = await response.json();
//       // Process userInfo as needed
//       console.log("User Info:", userInfo);
//       return userInfo; // Return user info if needed
//   } catch (error) {
//       console.error("Failed to get user info:", error);
//       // Handle error appropriately (e.g., show a message to the user)
//   }
// };



  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, 
    });
  }, [navigation]);

  const submitLogin = async () => {
    setLoading(true);
    setError(''); 
    setFormError(null);
    
    try {
      const response = await loginUser(email, password);
      const responseData = await response.json();
  
      if (response.ok && responseData.user) {
        const { id, token } = responseData.user;
  
        await AsyncStorage.setItem('id', id);  
        await AsyncStorage.setItem('token', token);
        router.push('/(tabs)');
  
        const userData = responseData.user;
        await handleLogin(userData);
      } else {
        const errorData = responseData;
        setFormError(errorData.message);
        alert(errorData.message || 'An error occurred during login.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || 'An unexpected error occurred. Please try again later.');
      } else {
        alert('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const labelColor = '#FBBC05';

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
              Sign in to get started
            </Text>

            <View style={[styles.inputWrapper, { alignItems: 'center' }]}>
              <Input
                label="Email"
                style={[{ color: textColor }]}
                containerStyle={styles.inputContainer} 
                inputContainerStyle={styles.input}
                inputStyle={{ color: textColor, fontSize: 12 }} 
                placeholder="Enter Email Address"
                value={email}
                labelStyle={{ color: labelColor }}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(''); 
                }}
              />

              <Input
                secureTextEntry={!showPassword}
                style={[{ color: textColor }]}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                inputStyle={{ color: textColor, fontSize: 12 }}
                labelStyle={{ color: labelColor }}
                placeholder="Password"
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <Ionicons name="eye" size={20} color="#488fee" />
                    ) : (
                      <Ionicons name="eye-off" size={20} color="#488fee" />
                    )}
                  </TouchableOpacity>
                }
              />

              {formError && (
                <Text style={{ color: 'red', marginVertical: 5 }}>
                  {formError}
                </Text>
              )}

              <Button
                text={loading ? 'Submitting...' : 'Login'}
                variant="primary"
                onClick={submitLogin}
                style={styles.button}
                disabled={loading}
              />
               <View style={styles.separator}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            <SocialButton
              text="Continue with Google"
              variant="primary"
              image="https://res.cloudinary.com/dyz7znlj0/image/upload/v1726888095/Vector_ef0eca.png"
            />

            <View className='mt-4'></View>

            <SocialButton
            // onClick={()=>promptAsyn()}
              text="Continue with Facebook"
              variant="primary"
              image="https://res.cloudinary.com/dyz7znlj0/image/upload/v1726888560/Social_Icons_fdhtsm.png"
            />
            </View>

           

            <View className='flex items-center text-center justify-center mt-8'>
              <Link href={"/auth/Signup"}>
                <Text style={[{ textAlign: 'center', fontSize: 14 }, { color: textColor }]}>
                  Don’t have an account?{' '}
                  <Text className="text-red-500 underline">
                    Sign up
                  </Text>
                </Text>
              </Link>
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
    height: 38,
    width: 293,
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
    width: '42%',
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
  inputWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
});

export default LoginScreen;
