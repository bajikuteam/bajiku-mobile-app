import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert, Modal, Text, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

interface ImageUploadProps {
    onImageSelected: (imageUri: string) => void;
    currentImage?: string | null; 
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, currentImage }) => {
    const [imageUri, setImageUri] = useState<string | null>(currentImage || null);
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
            aspect: [1, 1], 
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            onImageSelected(uri);  
            setModalVisible(false); 
        }
    };

    const takeSelfie = async () => {
        if (hasCameraPermission === false) {
            Alert.alert('Permission Denied', 'You need to grant camera access to take a selfie.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1], 
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            onImageSelected(uri);
            setModalVisible(false); 
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.uploadButton} onPress={() => setModalVisible(true)}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
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
                            <Text style={styles.optionText}>Choose from Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={takeSelfie}>
                            <Text style={styles.optionText}>Take a Selfie</Text>
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
        borderWidth: 2,
        borderColor: '#D1D5DB',
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12, 
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

export default ImageUpload;

