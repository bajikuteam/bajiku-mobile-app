import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar, Alert, Image, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import MediaUpload from '@/components/MediaUpload';
import Button from '@/components/Button';
import axios, { AxiosError } from 'axios';
import { useUser } from '@/utils/useContext/UserContext';
import { Video, ResizeMode } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import CustomHeader from '@/components/CustomHeader';

const EditContent = () => {
    const params = useLocalSearchParams();
    const { privacy, mediaSrc, caption,mediaId} = params;
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [isPublic, setIsPublic] = useState<boolean>(privacy === 'public' ? true : false);
    const [loading, setLoading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0); 
    const { user } = useUser();

 

    const [captionText, setCaptionText] = useState(caption || '');
    const videoRef = useRef<Video>(null);
 

    const isFocused = useIsFocused();
    useEffect(() => {
      if (isFocused) {
        NavigationBar.setBackgroundColorAsync("#000000");
        NavigationBar.setButtonStyleAsync("light");
      }
    }, [isFocused]);

    useEffect(() => {
        // Check and set the media type on initial load and when mediaSrc changes
        const loadMediaSrc = () => {
            if (mediaSrc && typeof mediaSrc === 'string') {
                const fileType = mediaSrc.split('.').pop()?.toLowerCase();
                setMediaType(fileType === 'mp4' || fileType === 'mov' ? 'video' : 'image');
            }
        };

        loadMediaSrc(); 

    }, [mediaSrc]);
    
    
    
    const goBack = () => {
        router.back();
      };


      useEffect(() => {
        if (privacy) {
            setIsPublic(privacy === 'public');
        }
    }, [privacy]);


      const handleUpdateContent = async () => {
        if (loading) return; 

        setLoading(true);
        try {
            // Make the API call to update the content
            const response = await axios.patch(
                `https://my-social-media-bd.onrender.com/content/edit/${mediaId}/${user?.id}`, 
                {
                    caption: captionText, 
                    privacy: isPublic ? 'public' : 'private',
                },
              
            );
            if (response.status === 200) {
                Alert.alert('Success', 'Content updated successfully');
                router.back(); 
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                Alert.alert('Network error', 'There was an error updating the content');
            } else {
                Alert.alert('Network error', 'There was an error updating the content');
            }
            Alert.alert('Network error', 'There was an error updating the content');
          }finally {
            setLoading(false);
        }
    };
    return (
        <><CustomHeader title={'Edit Content'} onBackPress={goBack} /><KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#000000" />
                {mediaSrc && (
                    <View style={styles.uploadButton}>
                        {mediaType === 'image' ? (
                            <Image
                                source={{ uri: mediaSrc as string }}
                                style={styles.fullMedia} />
                        ) : (
                            <Video
                                ref={videoRef}
                                source={{ uri: mediaSrc as string }}
                                style={styles.fullMedia}
                                useNativeControls
                                resizeMode={ResizeMode.COVER}
                                isLooping
                                shouldPlay={false} />
                        )}
                    </View>
                )}



                <View style={styles.containerCap}>
                    <Image
                        source={{ uri: user?.profileImageUrl }}
                        style={styles.profileImage} />
      <TextInput
        style={styles.captionInput}
        placeholder="Enter a caption..."
        placeholderTextColor="#888"
        value={captionText as string} 
        onChangeText={setCaptionText}  
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />
                </View>


                <Text style={{      marginTop: 10,
        fontSize: 16,
        color: '#fff',}}>
                    Change Privacy
                </Text>
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
                    This Content will be set {isPublic ? 'Public' : 'Private'}
                </Text>

                

                {/* Update button text with loading progress */}
                <Button
        text={loading ? `Uploading... ${uploadPercent}%` : "Upload"}
        variant="primary"
        onClick={handleUpdateContent}
        style={{ width: 293 }}
        disabled={loading}
    />
            </View>

        </KeyboardAvoidingView></>
    );
};
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#000', 
    },
    containerCap: {
      flexDirection: 'row', 
      alignItems: 'flex-start', 
      width: width - 40, 
      
    
  },
captionInput: {
  width: '85%',
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
  marginTop: 15,
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
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#D1D5DB',
      marginRight: 12,
      marginTop: 15,
    },
    fullMedia: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', 
    },
    videoContainer: {
        width: '100%',
        height: '50%',
        position: 'relative',
    },
    uploadButton: {
        width: '100%',
        height: '50%',
        backgroundColor: '#222',
        borderRadius: 12,
        overflow: 'hidden', 
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditContent;


