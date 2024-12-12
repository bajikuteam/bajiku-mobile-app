import { Stack } from "expo-router";

const UsersDetailsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="usersFollowers" options={{ headerShown: false }} />
          <Stack.Screen name="usersFollowings" options={{ headerShown: false }} />
          <Stack.Screen name="UserDetails" options={{ headerShown: false }} />
       
    </Stack>
  );
};

export default UsersDetailsLayout;
