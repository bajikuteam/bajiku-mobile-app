import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Button } from 'react-native';
import { Audio } from 'expo-av'; // For playing sounds
import { Picker } from '@react-native-picker/picker'; // Picker import

// Mapping of sound names to their corresponding `require` paths
const soundFiles = {
  'default.mp3': require('../../assets/sounds/notification.mp3'),
//   'chime.mp3': require('../assets/sounds/chime.mp3'),
//   'alert.mp3': require('../assets/sounds/alert.mp3'),
} as const; // 'as const' ensures these values are literal types, not just strings

type SoundType = keyof typeof soundFiles; // Creates a union type of the keys: 'default.mp3' | 'chime.mp3' | 'alert.mp3'

const availableSounds = [
  { label: 'Default', value: 'notification.mp3' },
//   { label: 'Chime', value: 'chime.mp3' },
//   { label: 'Alert', value: 'alert.mp3' },
];

const NotificationSettings = () => {
  const [isMuted, setIsMuted] = useState(false); // Control mute/unmute
  const [currentSound, setCurrentSound] = useState<SoundType>('default.mp3'); // Store current sound (restricted to 'default.mp3' | 'chime.mp3' | 'alert.mp3')
  const [sound, setSound] = useState<Audio.Sound | null>(null); // Audio state for sound playback

  // Play sound when a new notification is received
  const playNotificationSound = async () => {
    if (isMuted) return; // Don't play if muted
    try {
      const soundFile = soundFiles[currentSound]; // Get the current sound file
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile); // Create sound from file
      setSound(newSound);
      await newSound.playAsync(); // Play the sound
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  // Stop any currently playing sound
  const stopNotificationSound = async () => {
    if (sound) {
      await sound.stopAsync();
    }
  };

  // Change sound handler
  const handleSoundChange = (selectedSound: SoundType) => {
    setCurrentSound(selectedSound);
  };

  // Mute/unmute toggle handler
  const handleMuteToggle = () => {
    setIsMuted((prevState) => !prevState);
    if (isMuted) {
      playNotificationSound(); // Resume playing the sound if unmuted
    } else {
      stopNotificationSound(); // Stop the sound if muted
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup the sound when the component unmounts
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>

      {/* Mute/Unmute Sound */}
      <View style={styles.setting}>
        <Text style={{color:'#fff'}}>Mute Notifications</Text>
        <Switch value={isMuted} onValueChange={handleMuteToggle} />
      </View>

      {/* Change Notification Sound */}
      <View style={styles.setting}>
        <Text style ={{color:'#fff'}}>Change Sound</Text>
        <Picker
          selectedValue={currentSound}
          style={styles.picker}
          onValueChange={handleSoundChange}
        >
          {availableSounds.map((sound) => (
            <Picker.Item key={sound.value} label={sound.label} value={sound.value} />
          ))}
        </Picker>
      </View>

      {/* Play the current sound */}
      <Button title="Play Sound" onPress={playNotificationSound} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 150,
    color:"#FFFFFF",
  },
});

export default NotificationSettings;
