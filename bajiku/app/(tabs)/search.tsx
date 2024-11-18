
// import SearchComponent from '@/components/Search';
import SearchComponent from '@/components/SearchComponent';
import { useNavigation } from '@react-navigation/native';
// import SearchComponents from '@/components/SearchComponent';
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
 
const styles = StyleSheet.create({
    container: {
        
    }
});
 


const Search = () => {
    const navigation = useNavigation()

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: true, 
          title: 'Search For Trends', 
          headerStyle: {
            backgroundColor: '#075E54', 
          },
          headerTintColor: '#fff',
        });
      }, [navigation]);
    return (
        <SafeAreaView  >
            <SearchComponent />
        </SafeAreaView>
    );
}

 
export default Search;