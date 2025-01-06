import { Stack } from "expo-router";

const SystemLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="about" options={{ headerShown: false }} />
          <Stack.Screen name="FAQ" options={{ headerShown: false }} />
          <Stack.Screen name="paymentFAQ" options={{ headerShown: false }} />
          <Stack.Screen name="termsAndConditions" options={{ headerShown: false }} />
          <Stack.Screen name="communityGuidelines" options={{ headerShown: false }} />
          <Stack.Screen name="menu" options={{ headerShown: false }} />
       
    </Stack>
  );
};

export default SystemLayout;
