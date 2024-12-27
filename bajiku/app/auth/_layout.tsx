import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="Login" options={{ headerShown: false }} />
          <Stack.Screen name="Signup" options={{ headerShown: false }} />
          <Stack.Screen name="EmailVerification" options={{ headerShown: false }} />
          <Stack.Screen name="ForgetPassword" options={{ headerShown: false }} />
          <Stack.Screen name="SetPassword" options={{ headerShown: false }} />
          <Stack.Screen name="SetProfile" options={{ headerShown: false }} />
          <Stack.Screen name="VerifyResetOtp" options={{ headerShown: false }} />
          <Stack.Screen name="ResetPassword" options={{ headerShown: false }} />
          <Stack.Screen name="DisclaimerAccept" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
