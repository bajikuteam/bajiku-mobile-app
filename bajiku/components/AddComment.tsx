import { useUser } from '@/utils/useContext/UserContext';
import React, { useState } from 'react';
import { View, TextInput, Image, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface AddCommentProps {
  onSend: (comment: string, mediaId: string, username: string, whoCommentsId: string, replyTo?: string) => void;
  mediaId: string; 
  username: string;
  whoCommentsId: string;
  replyTo?: string;
}

const AddComment: React.FC<AddCommentProps> = ({ onSend, mediaId, username, whoCommentsId, replyTo }) => {
  const [comment, setComment] = useState('');
  const { user } = useUser(); 

  const handleSendClick = () => {
    if (comment.trim()) {
      const newComment = comment.trim();
      onSend(newComment, mediaId, username, whoCommentsId, replyTo);
      setComment('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        {user && user.profileImageUrl ? (
          <Image
            source={{ uri: user.profileImageUrl }} 
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Add a comment..."
          placeholderTextColor="#999"
          style={styles.textInput}
          onSubmitEditing={handleSendClick}
          returnKeyType="send" 
        />
        <TouchableOpacity
          onPress={handleSendClick}
          style={styles.sendButton}
        >
          <Icon name="paper-plane" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    // marginBottom: 60,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 8,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  placeholderImage: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderColor: '#D1D5DB',
    backgroundColor: '#EAEAEA', 
    borderWidth: 2,
  },
  textInput: {
    flex: 1,
    height: 36,
    padding: 8,
    borderRadius: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    backgroundColor: '#FAFAFA',
    fontSize: 12,
    marginLeft: 8,
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#D84773',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    width: 40,
    height: 40,
  },
});

export default AddComment;
