import React, { useEffect } from "react";
import { StyleSheet, View, StatusBar, SafeAreaView } from "react-native";
import PostWithCaption from "@/components/MediaPlayer";
import * as NavigationBar from 'expo-navigation-bar';
import { useIsFocused } from "@react-navigation/native";
import DraggableModal from "@/components/DraggableModal";

export default function HomeScreen() {
 
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, [isFocused]);



  
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <SafeAreaView style={{ flex: 1, backgroundColor:"#000000" }}>
        <View style={{marginBottom:50}}>
        <PostWithCaption />

        {/* <DraggableModal/> */}
        </View>
      </SafeAreaView>

    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
});
