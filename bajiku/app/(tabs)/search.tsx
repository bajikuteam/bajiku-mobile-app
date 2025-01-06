import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, ActivityIndicator, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useUser } from '@/utils/useContext/UserContext';

// Define the type for User data
interface User {
  _id: string;
  username: string;
  profileImageUrl: string;
  followerCount?: number 
  followingCount?: number;
  firstName: string;
  lastName: string;
  
}

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]); 
  const { user } = useUser();

  // Debounce function to delay API request
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Function to handle search
  const handleSearch = async (query: string) => {
    // Only trigger search if query has at least 3 characters
    if (!query.trim() || query.length < 3) {
      setResults([]); 
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://my-social-media-bd.onrender.com/search/users?query=${query}`
      );
      setResults(response.data); 

      // Update recent searches to ensure no duplicates and a max of 5
      updateRecentSearches(query);
    } catch (error) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Update recent searches ensuring no duplicates and max of 5
  const updateRecentSearches = async (newSearch: string) => {
    const updatedSearches = [newSearch, ...recentSearches.filter(search => search !== newSearch)];

    // Ensure there are no more than 5 items
    const limitedSearches = updatedSearches.slice(0, 5);

    // Save updated list to AsyncStorage
    await AsyncStorage.setItem('recentSearches', JSON.stringify(limitedSearches));
    setRecentSearches(limitedSearches); // Update state with the new list
  };

  // Debounced version of the handleSearch function
  const debouncedSearch = debounce(handleSearch, 500);

  useEffect(() => {
    // Only call debouncedSearch if query length is 3 or more and not empty
    if (query.trim() && query.length >= 4) {
      debouncedSearch(query); 
    } else if (query.trim() === '') {
      setResults([]);
    }
  }, [query]);

  // Load recent searches when the component mounts
  useEffect(() => {
    const loadRecentSearches = async () => {
      const storedSearches = await AsyncStorage.getItem('recentSearches');
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    };
    loadRecentSearches();
  }, []);

  // Function to handle removal of a recent search
  const removeRecentSearch = async (searchToRemove: string) => {
    const updatedRecentSearches = recentSearches.filter(search => search !== searchToRemove);
    await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));
    setRecentSearches(updatedRecentSearches); 
  };

  const clearAllRecentSearches = async () => {
    await AsyncStorage.removeItem('recentSearches');
    setRecentSearches([]); 
  };

  // Clear search input when navigating away from the screen
  useFocusEffect(
    React.useCallback(() => {
      setQuery(''); 
    }, [])
  );

  useEffect(() => {
    // console.log('Results:', results); 
  }, [results]);

  // Handle press on recent search to autofill and search
  const handleRecentSearchClick = async (search: string) => {
    setQuery(search);  
    await handleSearch(search);
  };

  const handlePress = async (
    userId: string, 
    username: string, 
    firstName: string, 
    lastName: string, 
    profileImageUrl: string,
    followingCount: number, 
    followerCount: number
  ) => {
    // Get the logged-in user's ID
    const loggedInUserId = user?.id || await AsyncStorage.getItem('userId');
  
    if (loggedInUserId === userId) {
      // Navigate to the logged-in user's profile
      router.push({
        pathname: '/profile/Profile',
        params: {
          userId: loggedInUserId,
          username,
          firstName,
          lastName,
          profileImageUrl,
          followingCount,
          followerCount,
        },
      });
    } else {
      // Navigate to the user details page
      router.push({
        pathname: '/userDetails/UserDetails',
        params: {
          searchUserId: userId,
          username,
          firstName,
          lastName,
          profileImageUrl,
          followingCount,
          followerCount,
        },
      });
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#333'}}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by username"
        placeholderTextColor="#ccc"
        value={query}
        onChangeText={setQuery}
      />

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#fff" />}

      {/* Display Recent Searches */}
      {recentSearches.length > 0 && !query && (
        <><View>
          <Text style={{ color: 'white', marginBottom:10 }}>Recent Searches:</Text>
          <FlatList
            data={recentSearches}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.recentSearchItem}>
                <TouchableOpacity onPress={() => handleRecentSearchClick(item)}>
                  <Text style={styles.recentSearchText}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeRecentSearch(item)}>
                  <Text style={styles.removeText}>X</Text>
                </TouchableOpacity>

               
              </View>
              
            )} />

          <TouchableOpacity onPress={clearAllRecentSearches}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
          {/* <RandomDataDisplay />  */}

        </View>
    
        </>
      )}

      {/* Results Text */}
      {!query && recentSearches.length === 0 && (
        <Text style={{ color: 'white', marginBottom: 10 }}>
          No results
        </Text>
      )}

      {/* Display "No Results Found" if query has been made and no results */}
      {query && results.length === 0 && !loading && (
        <Text style={{ color: 'white', marginTop: 20 }}>No results found</Text>
      )}

      {/* Search Results List */}
      <FlatList
        data={results.length > 0 ? results : []} 
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => handlePress(item._id, item.username, item.firstName, item.lastName, item.profileImageUrl,   item.followerCount ?? 0,
              item.followingCount ?? 0)}>
              <View style={styles.userItem}>
                <Image source={{ uri: item.profileImageUrl }} style={styles.profileImage} />
                <Text style={styles.username}>@{item.username}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
          {/* <RandomDataDisplay /> */}

    </View>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 40,
    paddingHorizontal: 10,
    marginBottom: 40,
    color: '#000',
    backgroundColor: '#fff',
    marginTop: 40,
  },
  userItem: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    textTransform: 'lowercase'
  },
  recentSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recentSearchText: {
    color: '#fff',
    fontSize: 18,
  },
  removeText: {
    color: 'red',
    fontSize: 16,
  },
  clearAllText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SearchScreen;
