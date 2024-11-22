import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import MediaUpload from '@/components/MediaUpload';
import Button from '@/components/Button';
import axios from 'axios';
import { useUser } from '@/utils/useContext/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadContent } from '@/services/api/request';
import { router } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';

const App = () => {
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const navigation = useNavigation();
    const [resetImageKey, setResetImageKey] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0); 
    const { user } = useUser();

    const handleMediaSelected = (uri: string, type: string) => {
        setSelectedMedia(uri);
        setMediaType(type as 'image' | 'video');
    };


    const isFocused = useIsFocused();
    useEffect(() => {
      if (isFocused) {
        NavigationBar.setBackgroundColorAsync("#000000");
        NavigationBar.setButtonStyleAsync("light");
      }
    }, [isFocused]);


    const handleUpload = async () => {
        const createdBy = user.id || await AsyncStorage.getItem('userId');
        const authorName = user.username;
        const authorProfilePicSrc = user.profileImageUrl;
      
        setLoading(true);
        setUploadPercent(0); 
      
        try {
          // Validate selected media
          if (!selectedMedia) {
            Alert.alert('Error', 'Please select content to upload.');
            setLoading(false);
            return;
          }
      
          const userId = user.id || (await AsyncStorage.getItem('userId'));
          if (!userId) {
            throw new Error('User ID not found');
          }
      
          // Determine media type based on selected media
          let mediaType: 'image' | 'video' | undefined;
      
          // Here you can add checks for file extensions or MIME type to decide mediaType
          if (selectedMedia.endsWith('.jpg') || selectedMedia.endsWith('.jpeg') || selectedMedia.endsWith('.png')) {
            mediaType = 'image';
          } else if (selectedMedia.endsWith('.mp4')) {
            mediaType = 'video';
          } else {
            throw new Error('Unsupported media type selected');
          }
      
          const response = await uploadContent(
            selectedMedia,
            isPublic,
            createdBy,
            caption,
            authorName,
            authorProfilePicSrc,
            mediaType,
            (progress: number) => {
                // Update the progress on state
                setUploadPercent(progress);
              }
          );
          
          // Uncomment the below line to handle successful upload
          Alert.alert('Success', 'Your content has been uploaded.');
          setSelectedMedia(null);
          setCaption('');
          setIsPublic(true);
          setResetImageKey(prevKey => prevKey + 1); 
          router.push('/(tabs)');
      
        } catch (error) {
        //   console.error('Upload error:', error);
      
          if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'An error occurred on the server.';
            Alert.alert('Error', errorMessage);
          } else if (error instanceof Error) {
            Alert.alert('Error', error.message);
          } else {
            Alert.alert('Error', 'An unexpected error occurred.');
          }
        } finally {
          setLoading(false);
        }
      };
      
      
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Conditionally render MediaUpload only if no media is selected */}
            <MediaUpload key={resetImageKey} onMediaSelected={handleMediaSelected} />

            <TextInput
                style={styles.captionInput}
                placeholder="Enter a caption..."
                placeholderTextColor="#888"
                value={caption}
                onChangeText={setCaption}
                multiline={true} 
                numberOfLines={4} 
                textAlignVertical="top" 
            />


            {/* Toggle for public/private */}
            <View style={styles.radioButtonContainer}>
                <TouchableOpacity
                    style={[styles.radioButton, isPublic ? styles.selectedRadioButton : styles.unselectedRadioButton]}
                    onPress={() => setIsPublic(true)}
                >
                    <Text style={styles.radioButtonText}>Public</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.radioButton, !isPublic ? styles.selectedRadioButton : styles.unselectedRadioButton]}
                    onPress={() => setIsPublic(false)}
                >
                    <Text style={styles.radioButtonText}>Private</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.contentTypeText}>
                This Content will be {isPublic ? 'Public' : 'Private'}
            </Text>

            {/* Update button text with loading progress */}
            <Button
                text={loading ? `Uploading... ${uploadPercent}%` : "Upload"}
                variant="primary"
                onClick={handleUpload}
                style={{ width: 293 }}
                disabled={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#000', 
    },
    captionInput: {
        width: '100%',
        minHeight: 100, 
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10, 
        color: '#fff',
        backgroundColor: '#222',
        fontSize: 16,
        textAlignVertical: 'top',
    },
    radioButtonContainer: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    selectedRadioButton: {
        backgroundColor: '#ff4757', 
    },
    unselectedRadioButton: {
        backgroundColor: '#555', 
    },
    radioButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    contentTypeText: {
        marginTop: 10,
        marginBottom:10,
        fontSize: 16,
        color: '#fff',
    },
});

export default App;
