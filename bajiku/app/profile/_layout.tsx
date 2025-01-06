import { Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Followers" options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" options={{ headerShown: false }} />
        <Stack.Screen name="SubscribedTo" options={{ headerShown: false }} />
        <Stack.Screen name="Following" options={{ headerShown: false }} />
        <Stack.Screen name="TotalEarnings" options={{ headerShown: false }} />  
       
        <Stack.Screen name="Profile" 
        options={{ headerShown: false ,    
     headerTitleAlign: 'center',  
      headerTintColor: '#fff',  
      headerStyle: { backgroundColor: '#000000' },
        }} />
    </Stack>
  );
};

export default ProfileLayout;
