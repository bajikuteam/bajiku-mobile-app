import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert, Modal, Text, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

const VideoUpload = ({ onMediaSelected }: { onMediaSelected: (uri: string, type: string) => void }) => {
    const [mediaUri, setMediaUri] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null); // Track if the selected media is image or video
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null); 
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

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
            allowsEditing: true,
            aspect: [1, 1],
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

    // Take a selfie (capture an image via the camera)
    const takeSelfie = async () => {
        if (hasCameraPermission === false) {
            Alert.alert('Permission Denied', 'You need to grant camera access to take a selfie.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // For image capture
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
            allowsEditing: true,
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

    return (
        <View>
            <TouchableOpacity style={styles.uploadButton} onPress={() => setModalVisible(true)}>
                {mediaUri ? (
                    mediaType === 'image' ? (
                        <Image source={{ uri: mediaUri }} style={styles.media} />
                    ) : (
                        <View style={styles.videoThumbnail}>
                            {/* A simple text or icon to represent video */}
                            <MaterialCommunityIcons name="video" size={30} color="#fff" />
                        </View>
                    )
                ) : (
                    <View style={styles.cameraIconContainer}>
                        <MaterialCommunityIcons name="camera" size={30} color="#fff" />
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
                        <TouchableOpacity style={styles.optionButton} onPress={takeSelfie}>
                            <Text style={styles.optionText}>Take a Selfie (Image)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={pickVideo}>
                            <Text style={styles.optionText}>Choose from Gallery (Video)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={recordVideo}>
                            <Text style={styles.optionText}>Record a Video</Text>
                        </TouchableOpacity>
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
    uploadButton: {
        width: 130,
        height: 130,
        backgroundColor: '#ddd',
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
    },
    videoThumbnail: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
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
});

export default VideoUpload;
