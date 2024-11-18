import React from "react";
import {StyleSheet,  View, StatusBar, SafeAreaView } from "react-native";
import Sidebar from "@/components/Sidebar";
import PostWithCaption from "@/components/MediaPlayer";


export default function HomeScreen() {
  return (
    
  
    <SafeAreaView className="mt-4" style={styles.container}>
     <StatusBar barStyle="light-content" backgroundColor="#075E54" />
     <View className="">
      <Sidebar />
      </View>
      <View className="mt-16">
      <PostWithCaption/>
     
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
});
