import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  TextSection,
  MessageText,
} from '@/styles/MessageStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamLists } from '@/services/core/types';
import { useUser } from '@/utils/useContext/UserContext';
import * as NavigationBar from 'expo-navigation-bar';
import { router } from 'expo-router';
interface Group {
    _id: string;
    groupName: string;
    groupImgUrl: string;
    groupCreationTime: string;
    groupDescription: string;
    room: string;
    name: string;
    profileImageUrl:string;
    senderId: string;
    senderName: string; 
    username: string;
    description:string
}

const GroupScreen = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

      const isFocused = useIsFocused();
      useEffect(() => {
        if (isFocused) {
          NavigationBar.setBackgroundColorAsync("#000000");
          NavigationBar.setButtonStyleAsync("light");
        }
      }, [isFocused]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch('https://my-social-media-bd.onrender.com/chat/rooms');
                const data: Group[] = await response.json();
                setGroups(data);
                setLoading(false);
            } catch (error) {
                // console.error('Error fetching group data:', error);
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <Container style={styles.container}>
              <StatusBar barStyle="light-content" backgroundColor="#000000" />
          <Text style={styles.Header}>Select a room to join</Text>
          <Text  style={styles.subHeader} >Connect with new friends</Text>
            <FlatList
                data={groups}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            router.push({pathname:'/chat/groupChat', params:{
                                id: item._id,
                                room: item.room,
                                groupName: item.groupName,
                                profileImageUrl: user?.profileImage, 
                                username: user?.username, 
                                groupImgUrl: item.groupImgUrl,
                                groupDescription: item.groupDescription,
                                groupCreationTime: item.groupCreationTime,   
                                senderId: user?.id,
                                senderName: user?.username, 
                                name: item.name,
                                description: item.description, 

                            }
                              
                            });
                        }}
                    >
                        <Card key={item._id}
                           onPress={() => {
                            router.push({
                                pathname:'/chat/groupChat', params:{
                                id: item._id,
                                room: item.room,
                                groupName: item.groupName,
                                profileImageUrl: user?.profileImage, 
                                username: user?.username, 
                                groupImgUrl: item.groupImgUrl,
                                groupDescription: item.groupDescription,
                                groupCreationTime: item.groupCreationTime,   
                                senderId: user?.id,
                                senderName: user?.username, 
                                name: item.name,
                                description: item.description, 

                            }
                            });
                        }}>
                            <UserInfo>
                                <UserImgWrapper>
                                    <UserImg style={{  width: 40,
        height: 40,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',}} source={{ uri: item.groupImgUrl }} />
                                </UserImgWrapper>
                                <TextSection>
                                    <UserInfoText>
                                        <UserName style={{textTransform:'capitalize'}}>{item.name}</UserName>
                                       
                                    </UserInfoText>
                                    <MessageText >{item.description}</MessageText>
                                </TextSection>
                            </UserInfo>
                        </Card>
                    </TouchableOpacity>
                )}
            />
        </Container>
    );
};

export default GroupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', 
        paddingTop:20
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Header:{
        color: '#D84773',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform:'capitalize'

    },
    subHeader: {
        textAlign: 'center',
        color: '#6E6E6E',
        fontWeight: 'bold',
        marginBottom: 20,
    }
});
