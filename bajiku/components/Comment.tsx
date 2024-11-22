import React from 'react';
import { View, Modal, Text, TextInput, Button, FlatList, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';

interface CommentModalProps {
    visible: boolean;
    onClose: () => void;
    comments: string[];
    onAddComment: (comment: string, username: string, authorId: string) => void;
    username: string; 
    authorId: string; 
}

const CommentModal: React.FC<CommentModalProps> = ({ visible, onClose, comments, onAddComment, username, authorId }) => {
    const [newComment, setNewComment] = React.useState('');

    const handleAddComment = () => {
        if (newComment.trim()) {
            onAddComment(newComment, username, authorId); 
            setNewComment('');
        }
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={comments}
                            renderItem={({ item }) => (
                                <Text style={styles.commentText}>{item}</Text>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Add a comment..."
                            value={newComment}
                            onChangeText={setNewComment}
                        />
                        <Button title="Send" onPress={handleAddComment} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        height: '70%', 
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30, 
        elevation: 5, 
    },
    commentText: {
        marginBottom: 10,
        fontSize: 16,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#f9f9f9',
    },
});

export default CommentModal;
