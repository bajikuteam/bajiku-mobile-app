import { Stack } from "expo-router";

const ChatLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
       <Stack.Screen name="PersonGroupChat" options={{ headerShown: false }} />
       <Stack.Screen name="NewChat" options={{ headerShown: false }} />
       <Stack.Screen name="message" options={{ headerShown: false }} />
       <Stack.Screen name="groupChat" options={{ headerShown: false }} />
       <Stack.Screen name="CreateGroup" options={{ headerShown: false }} />   
       <Stack.Screen name="AddPersonGroupChatMember" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ChatLayout;
