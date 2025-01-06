import { Stack } from "expo-router";

const ContentLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="editContent" options={{ headerShown: false }} />
         <Stack.Screen name="contentDetails" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ContentLayout;
