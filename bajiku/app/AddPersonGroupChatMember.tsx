import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useUser } from '@/utils/useContext/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Button from '@/components/Button';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {RootStackParamListComponent } from '@/services/core/types';
import SearchComponent from '@/components/Search';

interface Follower {
  id: string;
  name: string;
  profileImageUrl: string;
  roomId: string;
}

const AddPersonGroupChatMemberScreen: React.FC = () => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [selectedFollowers, setSelectedFollowers] = useState<string[]>([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  type AddPersonGroupChatMemberRouteParams = RouteProp<RootStackParamListComponent, 'AddPersonGroupChatMember'>;
  const route = useRoute<AddPersonGroupChatMemberRouteParams>();
  const navigation = useNavigation()
  const { roomId } = route.params || { roomId: '' };

  
  const fetchFollowers = async () => {
    try {
      const userId = user.id || (await AsyncStorage.getItem('userId'));
      const response = await fetch(`https://backend-server-quhu.onrender.com/users/${userId}/followers`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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

  const onSubmit = async () => {
    setLoading(true);
    try {
      const userId = user.id || (await AsyncStorage.getItem('userId'));
        const response = await axios.post(`https://backend-server-quhu.onrender.com/personal-group-chat/${roomId}/add-followers/${userId}`, {
        members: selectedFollowers,
      });
  
      if (response.status === 200 || response.status === 201) {
        Alert.alert(response.data.message);
      } else {
        throw new Error(`Unexpected response code: ${response.status}`);
      }
    } catch (error) {
      // console.error('Error adding members:', error);
      // Alert.alert("Error", "Could not add members to the group");
    } finally {
      setLoading(false);
    }
  };
  

  
  
  return (
    <><SearchComponent endpoint={''} fieldsToDisplay={[]} />
    <View style={styles.container}>

      <Text style={{ textAlign: 'center', color: 'red', fontWeight: 'bold', fontSize: 20 }}>
        Add Members
      </Text>
      <Text style={{ textAlign: 'center', color: 'red', fontWeight: 'bold', fontSize: 14 }}>
        Total Selected: {selectedFollowers.length}
      </Text>

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
            <Text style={styles.followerText}>@{item.name}</Text>
          </TouchableOpacity>
        )} />

<Button
          text={loading ? "Loading..." : "Add to Group"}
          variant="primary"
          onClick={onSubmit}
          disabled={loading || selectedFollowers.length === 0}
          style={{ width: "100%", backgroundColor: '#128C7E' }}
        />
    </View></>
  );
};

export default AddPersonGroupChatMemberScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#075E54',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    color: '#128C7E',
    textAlign: 'center',
    marginBottom: 20,
  },
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  selected: {
    backgroundColor: '#DCF8C6', 
  },
  followerText: {
    fontSize: 16,
    color: '#075E54',
    marginLeft: 10,
    textTransform: 'lowercase'
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  followerList: {
    paddingBottom: 100, 
  },
});