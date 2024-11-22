// RoundButton.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamListComponent } from '@/services/core/types';
import { Link } from 'expo-router';
import { useNavigation } from "expo-router";
type NavigationProp = StackNavigationProp<RootStackParamListComponent>;

const RoundButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={togglePopup}
        style={[styles.mainButton, isOpen ? styles.openButton : styles.closedButton]}
      >
        <FontAwesome name={isOpen ? 'times' : 'plus'} size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Popup Menu */}
      {isOpen && (
        <View style={styles.popup}>
             {/* <Link href="/contact/Followers" > */}
            <TouchableOpacity style={styles.popupItem}     onPress={() => navigation.navigate('NewChat')}>
           
            <View style={styles.popupTextContainer} >
              <Text style={styles.popupText}>New Chat</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="comment" size={20} color="#FFFFFF" />
            </TouchableOpacity>
           
          </TouchableOpacity>
          {/* </Link> */}
         
          <TouchableOpacity 
            style={styles.popupItem} 
            onPress={() => navigation.navigate('CreateGroup')}
          >
            <View style={styles.popupTextContainer}>
              <Text style={styles.popupText}>Create Private Room</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="users" size={20} color="#FFFFFF" />
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
    alignItems: 'flex-end',
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 5,
    // shadowColor: '#000',
    // shadowOpacity: 0.3,
    shadowRadius: 5,
    // shadowOffset: { width: 0, height: 2 },
  },
  openButton: {
    backgroundColor: 'gray',
  },
  closedButton: {
    backgroundColor: '#075E54',
  },
  popup: {
    position: 'absolute',
    right: 0,
    bottom: 70,
    // backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    // elevation: 5,
    // shadowColor: '#000',
    // shadowOpacity: 0.2,
    shadowRadius: 4,
    // shadowOffset: { width: 0, height: 2 },
    width: 240,
  },
  popupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#075E54',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  popupTextContainer: {
    flex: 1,
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
  },
  popupText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center', 
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'gray',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RoundButton;
