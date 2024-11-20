import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useUser } from '@/utils/useContext/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageUpload from '@/components/ImageUpload';
import { createGroup } from '@/services/api/request';
import axios from 'axios';
import { router } from 'expo-router';
import Button from '@/components/Button';
import { useNavigation } from '@react-navigation/native';

interface Follower {
  id: string;
  name: string;
  profileImageUrl: string;
}

const CreateGroupComponent: React.FC = () => {
  const [groupName, setGroupName] = useState<string>('');
  const [description, setDescription] = useState<string>(''); 
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [selectedFollowers, setSelectedFollowers] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [resetImageKey, setResetImageKey] = useState<number>(0);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation()


  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: true, 
  //     title: 'Create A New Private Room', 
  //     headerStyle: {
  //       backgroundColor: '#075E54', 
  //     },
  //     headerTintColor: '#fff',
  //   });
  // }, [navigation]);

  const fetchFollowers = async () => {
    try {
      const userId = user.id || (await AsyncStorage.getItem('userId'));
      // const response = await fetch(`http://192.168.1.107:5000/users/${userId}/followers`);
      const response = await fetch(`https://backend-server-quhu.onrender.com/users/${userId}/followers`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Fetched followers:', data);

      const followersList = data.followers.map((follower: { _id: string; username: string; profileImageUrl: string; }) => ({
        id: follower._id,
        name: follower.username,
        profileImageUrl: follower.profileImageUrl,
      }));

      setFollowers(followersList);
    } catch (error) {
      // console.error('Error fetching followers:', error);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  const toggleFollower = (followerId: string) => {
    setSelectedFollowers((prev) => {
      if (prev.includes(followerId)) {
        return prev.filter(id => id !== followerId); 
      } else {
        return [...prev, followerId];
      }
    });
  };

  const createGroups = async () => {
    setLoading(true);

    try {
        const userId = user.id || (await AsyncStorage.getItem('userId'));
        if (!userId) {
            throw new Error('User ID not found');
        }

        // Check if an image is selected
        if (!image) {
            Alert.alert('Error', 'Please select a group image.');
            return; 
        }

        const response = await createGroup(
            image,                
            groupName,            
            selectedFollowers,    
            description,          
            userId              
        );

        // Show success alert and navigate to Chat tab on successful group creation
        Alert.alert('Success', 'Group created successfully!');
        
        // Clear selections and input fields
        setSelectedFollowers([]); 
        setGroupName('');        
        setDescription('');       
        setImage(null);    
        setResetImageKey(prevKey => prevKey + 1);       
        router.push('/(tabs)/Chat'); 

    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data && error.response.data.message) {
                Alert.alert('Error', error.response.data.message);
            } else {
                Alert.alert('Error', 'An error occurred while creating the group. Please try again.');
            }
        } else {
            Alert.alert('Error', 'An unexpected error occurred.');
        }
    } finally {
        setLoading(false); 
    }
};


  const handleImageUpload = (imageUri: string) => {
    setImage(imageUri); 
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20, alignItems: 'center' }}>
        <ImageUpload key={resetImageKey} onImageSelected={handleImageUpload} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Group Description"
        value={description}
        onChangeText={setDescription}
      /> */}

      <Text className='text-[12px] text-center'>Select Group Members:</Text>
      <Text className='text-[12px] text-center'>Total Selected: {selectedFollowers.length}</Text>
      
      <FlatList
        data={followers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.followerItem, selectedFollowers.includes(item.id) && styles.selected]}
            onPress={() => toggleFollower(item.id)}
          >
            {item.profileImageUrl ? (
              <Image source={{ uri: item.profileImageUrl }} style={styles.profileImage} />
            ) : null}
            <Text className='lowercase' style={styles.followerText}>@{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      
      <Button
        text={loading ? "Creating..." : "Create"}
        variant="primary"
        onClick={createGroups}
        disabled={loading} 
        style={{ width: 293 }}
        className=''
      />
    </View>
  );
};

export default CreateGroupComponent;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
      alignItems: 'center', 
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      width: 293,
      borderRadius: 12,
    },
    subTitle: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center', 
    },
    followerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      width: 293,
      borderRadius: 12,
      borderBottomColor: '#ccc',
    },
    selected: {
      backgroundColor: '#d3f9d8',
    },
    followerText: {
      fontSize: 16,
      marginLeft: 10,
    },
    profileImage: {
      width: 36,
      height: 36,
      borderRadius: 12,
    },
    followerList: {
      alignItems: 'center', 
      justifyContent: 'center', 
    },
  });
