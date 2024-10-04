import { Tabs } from 'expo-router';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#D84773',  // Active color
        tabBarInactiveTintColor: 'gray',   // Inactive color
        headerShown: false,
        tabBarLabel: () => null, 
        tabBarStyle: {
          height: 80, 
          paddingBottom: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="upload"
        options={{
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
        name="chat"
        options={{
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
        name="group"
        options={{
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
