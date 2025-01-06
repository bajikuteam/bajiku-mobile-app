import { Stack } from "expo-router";

const PasswordLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="passwordChange" options={{ headerShown: false }} />
      <Stack.Screen name="settinglist" options={{ headerShown: false }} />
      <Stack.Screen name="LanguageSettings" options={{ headerShown: false }} />
      <Stack.Screen name="NotificationSettings" options={{ headerShown: false }} /> 
    </Stack>
  );
};

export default PasswordLayout;
