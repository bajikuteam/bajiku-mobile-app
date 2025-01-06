import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

// Define the type for a post
interface Post {
  _id: string;
  authorName: string;
  authorProfilePicSrc: string;
  caption: string;
  mediaSrc: string;
  comments: any[]; // Adjust as needed based on the structure of comments
  createdAt: string;
  createdBy: string;
  likedBy: any[]; // Adjust if needed
  likes: number;
  price: number;
  privacy: string;
  subscribers: string[];
}

const RandomDataDisplay = () => {
  const [posts, setPosts] = useState<Post[]>([]);  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await axios.get('https://my-social-media-bd.onrender.com/content');
      
      // Shuffle the array and get 5 random posts
      const shuffledPosts = shuffleArray(response.data);
      const randomPosts = shuffledPosts.slice(0, 5);

      setPosts(randomPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  // Helper function to shuffle an array
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Filter posts based on search query (just a basic example)
  const filteredPosts = posts.filter(post => post.caption.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
      </View>

      {/* Grid of Posts */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item._id}
        numColumns={3} // Instagram-style grid (3 columns)
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.imageContainer}>
            <Image
              source={{ uri: item.mediaSrc }}
              style={styles.image}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  gridContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  imageContainer: {
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12, // Add rounded corners for images
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 12, // Rounded corners for the images
    marginBottom: 5,
    backgroundColor: '#f0f0f0', // Placeholder color
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RandomDataDisplay;
