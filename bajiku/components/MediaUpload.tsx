import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert, Modal, Text, Platform, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';

const { width, height } = Dimensions.get('window');

const MediaUpload = ({ onMediaSelected }: { onMediaSelected: (uri: string, type: string) => void }) => {
    const [mediaUri, setMediaUri] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const videoRef = useRef<Video>(null); 


    const handleFullScreen = () => {
        if (videoRef.current) {
            videoRef.current.presentFullscreenPlayer();
        }
    };

    // Request permissions to access media library and camera
    useEffect(() => {
        (async () => {
            const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');

            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
    }, []);

    // Pick image from gallery
    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'You need to grant media library access to upload an image.');
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [1, 2],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setMediaUri(uri);
            setMediaType('image');
            onMediaSelected(uri, 'image');
            setModalVisible(false); 
        }
    };

    // Pick a video from the gallery
    const pickVideo = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'You need to grant media library access to upload a video.');
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setMediaUri(uri);
            setMediaType('video');
            onMediaSelected(uri, 'video');
            setModalVisible(false);
        }
    };

    // Record a video with the camera
    const recordVideo = async () => {
        if (hasCameraPermission === false) {
            Alert.alert('Permission Denied', 'You need to grant camera access to record a video.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setMediaUri(uri);
            setMediaType('video');
            onMediaSelected(uri, 'video');
            setModalVisible(false); 
        }
    };

    // Handle media click to allow change (click on selected image or video)
    const handleMediaClick = () => {
        if (mediaType === 'image') {
            pickImage(); 
        } else if (mediaType === 'video') {
            pickVideo(); 
        }
    };

    const takeSelfie = async () => {
        if (hasCameraPermission === false) {
            Alert.alert('Permission Denied', 'You need to grant camera access to take a selfie.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [1, 1], 
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            onMediaSelected(uri, 'image');
            setModalVisible(false); 
        }
    };

    return (
        <View style={styles.container}>
            {/* Button to open media picker */}
            <TouchableOpacity style={styles.uploadButton} onPress={() => setModalVisible(true)}>
                {mediaUri ? (
                    mediaType === 'image' ? (
                        <Image source={{ uri: mediaUri }} 
                        // style={styles.media} 
                        style={styles.video}
                        />
                    ) : (

                        <View style={styles.videoContainer}>
                        <Video
                            ref={videoRef}
                            source={{ uri: mediaUri }}
                            style={styles.video}
                            useNativeControls
                            resizeMode={ResizeMode.COVER}
                            isLooping
                            shouldPlay={false}
                        />
                        <TouchableOpacity style={styles.fullScreenButton} onPress={handleFullScreen}>
                            <MaterialCommunityIcons name="fullscreen" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    )
                ) : (
                    <View style={styles.cameraIconContainer}>
                        <MaterialCommunityIcons name="camera" size={30} color="#000000" />
                    </View>
                )}
            </TouchableOpacity>

            {/* Modal to choose between gallery and camera */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
                            <Text style={styles.optionText}>Choose from Gallery (Image)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={pickVideo}>
                            <Text style={styles.optionText}>Choose from Gallery (Video)</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.optionButton} onPress={takeSelfie}>
                            <Text style={styles.optionText}>Take a Selfie</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={recordVideo}>
                            <Text style={styles.optionText}>Record a Video</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.optionButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.optionText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

  
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        // backgroundColor: '#f0f0f0', 
    },
    uploadButton: {
        width: width - 40,  
        height:"80%", 
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 10,
    },
    media: {
        width: '100%', 
        height: '100%',  
        borderRadius: 12,  
        resizeMode: 'contain',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    optionButton: {
        padding: 15,
        alignItems: 'center',
    },
    optionText: {
        fontSize: 18,
        color: '#007BFF',
    },
    videoContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden', // Ensures content doesn't spill out
    },
    video: {
        flex: 1, // Ensures video scales within the parent
        borderRadius: 12,
        width: '100%', 
        height: '100%',
        alignSelf: 'center', // Centers the video
    },
    
    fullScreenButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 5,
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
//     image: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 12, 
//     },
//     modalBackground: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContainer: {
//         backgroundColor: '#fff',
//         padding: 20,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//     },
//     optionButton: {
//         padding: 15,
//         alignItems: 'center',
//     },
//     optionText: {
//         fontSize: 18,
//         color: '#007BFF',
//     },
// });

// export default MediaUploads;
