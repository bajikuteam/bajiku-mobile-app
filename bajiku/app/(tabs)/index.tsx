// import React, { useEffect } from "react";
// import {StyleSheet,  View, StatusBar, SafeAreaView } from "react-native";
// import Sidebar from "@/components/Sidebar";
// import PostWithCaption from "@/components/MediaPlayer";
// import * as NavigationBar from 'expo-navigation-bar';
// import { useIsFocused } from "@react-navigation/native";
// import { useTheme } from "@/utils/useContext/ThemeContext";

// export default function HomeScreen() {
//   const { theme } = useTheme(); 
//   const textColor = theme === 'dark' ? '#fff' : '#000';
//   const isFocused = useIsFocused();

  // useEffect(() => {
  //   if (isFocused) {
  //     NavigationBar.setBackgroundColorAsync('#000000');
  //     NavigationBar.setButtonStyleAsync('light');
  //   }
  // }, [isFocused]);
//   return (
//     <>
//     <StatusBar barStyle="light-content" backgroundColor="#075E54" />
//     <SafeAreaView className=" ">
//       <View>
//         <PostWithCaption />
//       </View>

//     </SafeAreaView></>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//   },
 
// });
import React, { useEffect } from "react";
import { StyleSheet, View, StatusBar, SafeAreaView } from "react-native";
import Sidebar from "@/components/Sidebar";
import PostWithCaption from "@/components/MediaPlayer";
import * as NavigationBar from 'expo-navigation-bar';
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { useTheme } from "@/utils/useContext/ThemeContext";

export default function HomeScreen() {
  const { theme } = useTheme(); 
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const isFocused = useIsFocused();

  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, [isFocused]);
  
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          {/* <PostWithCaption /> */}
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
