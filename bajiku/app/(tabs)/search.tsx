
import SearchComponent from '@/components/SearchComponent';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView} from 'react-native';
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