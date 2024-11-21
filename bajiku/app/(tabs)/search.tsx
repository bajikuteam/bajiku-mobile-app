
// import SearchComponent from '@/components/Search';
import SearchComponent from '@/components/SearchComponent';
import { useIsFocused, useNavigation } from '@react-navigation/native';
// import SearchComponents from '@/components/SearchComponent';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
const styles = StyleSheet.create({
    container: {
        
    }
});
 


const Search = () => {

    const isFocused = useIsFocused();

    useEffect(() => {
      if (isFocused) {
        NavigationBar.setBackgroundColorAsync("#000000");
        NavigationBar.setButtonStyleAsync("light");
      }
    }, [isFocused]);
   
    return (
        <SafeAreaView  >
            <SearchComponent />
        </SafeAreaView>
    );
}

 
export default Search;