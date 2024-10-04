// RoundButton.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome } from '@expo/vector-icons';
const RoundButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={togglePopup}
        style={[styles.mainButton, isOpen ? styles.openButton : styles.closedButton]}
      >
        <FontAwesome name={isOpen ? 'times' : 'plus'} size={24} color="#6E6E6E" />
      </TouchableOpacity>

      {/* Popup Menu */}
      {isOpen && (
        <View style={styles.popup}>
          <TouchableOpacity style={styles.popupItem}>
            <Text style={styles.popupText}>Add a Friend</Text>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="user-plus" size={24} color="#6E6E6E" />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity style={styles.popupItem}>
            <Text style={styles.popupText}>New Chat</Text>
            <TouchableOpacity style={styles.iconButton}>
            <FontAwesome  name="comment" size={24} color="#6E6E6E" />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity style={styles.popupItem}>
            <Text style={styles.popupText}>Create Private Room</Text>
            <TouchableOpacity style={styles.iconButton}>
            <FontAwesome  name="users" size={24} color="#6E6E6E" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 16,
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // For Android shadow
    // shadowColor: '#000', // For iOS shadow
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  openButton: {
    backgroundColor: '#004C8B',
  },
  closedButton: {
    backgroundColor: 'gray',
  },
  popup: {
    position: 'absolute',
    right: 0,
    bottom: 70,
    // backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    elevation: 5, 
  },
  popupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 1,
  },
  popupText: {
    backgroundColor: 'gray',
    color: 'white',
    // paddingHorizontal: 8,
    borderRadius: 12,
    // marginRight: 10,
    textAlign: 'center',
    minWidth: 180,
    // padding:1
  },
  iconButton: {
    width: 60,
    height: 60,
    backgroundColor: '#004C8B',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RoundButton;
