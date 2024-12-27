import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert, Text, Dimensions, Keyboard } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';

const { width} = Dimensions.get('window');

const MediaUpload = ({ onMediaSelected }: { onMediaSelected: (uri: string, type: string) => void }) => {
    const [mediaUri, setMediaUri] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const videoRef = useRef<Video>(null);


    useFocusEffect(
        React.useCallback(() => {
            pickFromGallery();
        }, [])
    );

    // Pick media from the gallery
    const pickFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'You need to grant media library access to upload media.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });

        handleMediaResult(result);
    };

    // Capture media using the camera
    const pickFromCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'You need to grant camera access to capture media.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });

        handleMediaResult(result);
    };

    // Handle media result
    const handleMediaResult = (result: ImagePicker.ImagePickerResult) => {
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            const type = result.assets[0].type;

            setMediaUri(uri);
            setMediaType(type as 'image' | 'video');
            onMediaSelected(uri, type as 'image' | 'video');
        }
    };

    // Handle full-screen video
    const handleFullScreen = () => {
        if (videoRef.current) {
            videoRef.current.presentFullscreenPlayer();
        }
    };

    // Handle media deletion
    const deleteMedia = () => {
        setMediaUri(null);
        setMediaType(null);
        onMediaSelected('', ''); 
    };


    const [buttonWidth, setButtonWidth] = useState(350);
const [buttonHeight, setButtonHeight] = useState(300); 
const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        // Reduce size when keyboard appears
        setButtonWidth(70);  
        setButtonHeight(70);
        setIsKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        // Reset size when keyboard disappears
        setButtonWidth(350); 
        setButtonHeight(300);
        setIsKeyboardVisible(false);
    });

    // Clean up listeners when the component is unmounted
    return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
    };
}, []);
    return (
        
        <View style={styles.container}>
    <TouchableOpacity
        style={[styles.uploadButton, { width: buttonWidth, height: buttonHeight }]}
        onPress={pickFromGallery}>
        {mediaUri ? (
            mediaType === 'image' ? (
                <Image source={{ uri: mediaUri }} style={styles.fullMedia} />
            ) : (
                <View style={styles.videoContainer}>
                    <Video
                     ref={videoRef}

                        source={{ uri: mediaUri }}
                        style={styles.fullMedia}
                        useNativeControls
                        resizeMode={ResizeMode.COVER}
                        isLooping
                        shouldPlay={false}

                    />
                        {!isKeyboardVisible && (
                                                <TouchableOpacity style={styles.fullScreenButton} onPress={handleFullScreen}>
                                <MaterialCommunityIcons name="fullscreen" size={30} color="#fff" />
                            </TouchableOpacity>
                                )}
                </View>
            )
        ) : (
            <View style={styles.cameraIconContainer}>
                <MaterialCommunityIcons name="image" size={30} color="#000000" />
                <Text style={styles.placeholderText}>Select Media</Text>
            </View>
        )}

        {/* Delete Button positioned at the top of uploadButton */}
        {mediaUri && !isKeyboardVisible && (
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={deleteMedia}>
                <MaterialCommunityIcons name="delete" size={20} color="#ff0000" />
            </TouchableOpacity>
        )}
    </TouchableOpacity>

    {/* Camera Button */}
    {!isKeyboardVisible && (
        <TouchableOpacity style={styles.galleryButton} onPress={pickFromCamera}>
          <MaterialCommunityIcons name="camera" size={30} color="#fff" />
        </TouchableOpacity>
      )}
</View>

    
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#000',
    },
    uploadButton: {
     
        backgroundColor: '#222',
        borderRadius: 12,
        overflow: 'hidden', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIconContainer: {
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 8,
        fontSize: 16,
        color: '#666',
    },
    fullMedia: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', 
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    videoContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    fullScreenButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 5,
    },
    deleteButton: {
        position: 'absolute',
        left: 10,
        top:10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 10,
        borderRadius: 50,
    },
    galleryButton: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: [{ translateX: -20 }],
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default MediaUpload;





function setImageUri(uri: string) {
    throw new Error('Function not implemented.');
}
// import React, { useState, useEffect } from 'react';
// import { View, TouchableOpacity, StyleSheet, Image, Alert, Modal, Text, Platform } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import * as ImagePicker from 'expo-image-picker';
// import { ResizeMode, Video } from 'expo-av';

// const MediaUploads = ({ onMediaSelected }: { onMediaSelected: (uri: string, type: string) => void }) => {
//     const [mediaUri, setMediaUri] = useState<string | null>(null);
//     const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
//     const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
//     const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
//     const [modalVisible, setModalVisible] = useState(false);

//     // Request permissions to access media library and camera
//     useEffect(() => {
//         (async () => {
//             const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
//             setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');

//             const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
//             setHasCameraPermission(cameraStatus.status === 'granted');
//         })();
//     }, []);

//     // Pick image from gallery
//     const pickImage = async () => {
//         if (Platform.OS !== 'web') {
//             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//             if (status !== 'granted') {
//                 Alert.alert('Permission Denied', 'You need to grant media library access to upload an image.');
//                 return;
//             }
//         }

//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 1,
//         });

//         if (!result.canceled && result.assets && result.assets.length > 0) {
//             const uri = result.assets[0].uri;
//             setMediaUri(uri);
//             setMediaType('image');
//             onMediaSelected(uri, 'image');
//             setModalVisible(false); // Close the modal after selecting media
//         }
//     };

//     // Pick a video from the gallery
//     const pickVideo = async () => {
//         if (Platform.OS !== 'web') {
//             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//             if (status !== 'granted') {
//                 Alert.alert('Permission Denied', 'You need to grant media library access to upload a video.');
//                 return;
//             }
//         }

//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//             quality: 1,
//         });

//         if (!result.canceled && result.assets && result.assets.length > 0) {
//             const uri = result.assets[0].uri;
//             setMediaUri(uri);
//             setMediaType('video');
//             onMediaSelected(uri, 'video');
//             setModalVisible(false); // Close the modal after selecting media
//         }
//     };

//     // Record a video with the camera
//     const recordVideo = async () => {
//         if (hasCameraPermission === false) {
//             Alert.alert('Permission Denied', 'You need to grant camera access to record a video.');
//             return;
//         }

//         let result = await ImagePicker.launchCameraAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//             allowsEditing: true,
//             quality: 1,
//         });

//         if (!result.canceled && result.assets && result.assets.length > 0) {
//             const uri = result.assets[0].uri;
//             setMediaUri(uri);
//             setMediaType('video');
//             onMediaSelected(uri, 'video');
//             setModalVisible(false); // Close the modal after selecting media
//         }
//     };

//     // Handle media click to allow change (click on selected image or video)
//     const handleMediaClick = () => {
//         if (mediaType === 'image') {
//             pickImage(); // Allow re-selection of image
//         } else if (mediaType === 'video') {
//             pickVideo(); // Allow re-selection of video
//         }
//     };

//     return (
//         <View>
       
//                         <TouchableOpacity style={styles.uploadButton} onPress={() => setModalVisible(true)}>
//                 {mediaUri ? (
//                     mediaType === 'image' ? (
//                         <Image source={{ uri: mediaUri }}
//                         //  style={styles.media}
//                           />
//                     ) : (
//                         <Video
//                             source={{ uri: mediaUri }}
//                             // style={styles.media}
//                             useNativeControls={false}
//                             resizeMode={ResizeMode.CONTAIN}
//                             isLooping
//                             shouldPlay={false} // Do not auto-play
//                         />
//                     )
//                 ) : (
//                     <View style={styles.cameraIconContainer}>
//                         <MaterialCommunityIcons name="camera" size={30} color="#fff" />
//                     </View>
//                 )}
//             </TouchableOpacity>
//             <Modal
//                 transparent={true}
//                 visible={modalVisible}
//                 animationType="slide"
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalBackground}>
//                     <View style={styles.modalContainer}>
//                         <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
//                             <Text style={styles.optionText}>Choose from Gallery (Image)</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.optionButton} onPress={pickVideo}>
//                             <Text style={styles.optionText}>Choose from Gallery (Video)</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.optionButton} onPress={recordVideo}>
//                             <Text style={styles.optionText}>Record a Video</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.optionButton} onPress={() => setModalVisible(false)}>
//                             <Text style={styles.optionText}>Cancel</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     uploadButton: {
//         width: 130,  
//         height: 130,
//         backgroundColor: '#ddd',
//         borderRadius: 12,
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'relative',
//     },
//     cameraIconContainer: {
//         position: 'absolute',
//         bottom: 10,
//     },
    // image: {
    //     width: '100%',
    //     height: '100%',
    //     borderRadius: 12, 
    // },
    // modalBackground: {
    //     flex: 1,
    //     justifyContent: 'flex-end',
    //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // },
    // modalContainer: {
    //     backgroundColor: '#fff',
    //     padding: 20,
    //     borderTopLeftRadius: 20,
    //     borderTopRightRadius: 20,
    // },
    // optionButton: {
    //     padding: 15,
    //     alignItems: 'center',
    // },
    // optionText: {
    //     fontSize: 18,
    //     color: '#007BFF',
    // },
// });

// export default MediaUploads;
