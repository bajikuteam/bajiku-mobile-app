import { Tabs } from 'expo-router';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Feather, FontAwesome } from '@expo/vector-icons';
import Sidebar from '@/components/Sidebar';
import { TouchableOpacity, Text } from 'react-native';

export default function TabLayout() {
const headerStatusColor = "#000000"
  

  return (
    <Tabs
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: '#075E54', 
      tabBarInactiveTintColor: 'gray', 
      headerShown: false,
      tabBarLabel: () => null, 
      tabBarStyle: {
        height: 60,
        paddingBottom: 5,
        backgroundColor: route.name === 'index' ? '#000000' : '#000000', 
      },
    })}
  >
     <Tabs.Screen
  name="index"
  options={{
    headerShown: true,
    headerStyle: { backgroundColor: headerStatusColor },
    headerLeft: () => <Sidebar />,
    headerTitle: () => (
      <Text style={{fontSize: 18, fontWeight: 'bold', color: "#ffffff", }}>
        Bajîkü
      </Text>
    ),
   headerTitleAlign: 'center',
    headerRight: () => (
      <TouchableOpacity
        onPress={() => console.log('Bell icon clicked')}
        style={{ marginRight: 15 }}
      >
        <FontAwesome name="bell" size={20} color="#fff" />
      </TouchableOpacity>
    ),
    headerTintColor: '#fff',
    tabBarIcon: ({ color, focused }) => (
      <TabBarIcon
        name={focused ? 'home' : 'home-outline'}
        color={color}
      />
    ),
  }}
/>


      <Tabs.Screen
        name="search"
        options={{
          headerShown: true,
          headerTitle: 'Search For Trends' ,
          headerStyle: { backgroundColor: headerStatusColor },
          headerTintColor: '#fff',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="upload"
        options={{
          headerShown: true,
          headerTitle: 'Upload Content' ,
          headerStyle: { backgroundColor: headerStatusColor },
          headerTintColor: '#fff',
          tabBarIcon: ({ color, focused }) => (
            <Feather 
              name="upload" 
              color={color} 
              size={24} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Chat"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: headerStatusColor },
          headerTintColor: '#fff',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'message' : 'message-outline'} 
              color={color} 
              size={24} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Rooms"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: headerStatusColor },
          headerTintColor: '#fff',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'account-group' : 'account-group-outline'} 
              color={color} 
              size={24} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
