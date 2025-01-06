import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';

const SettingsList = () => {
   
    const goBack = () => {
        router.back();
      };
  return (

    
    <>
  <CustomHeader title={'Settings'} onBackPress={goBack} />
          <View style={styles.container}>
            </View><View style={styles.container}>
              {/* Change Password */}
              <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => router.navigate('/Appsettings/passwordChange')}>
                  <Text style={styles.settingText}>Change Password</Text>
              </TouchableOpacity>

          </View></>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#000',
    paddingTop: 20,
  },
  settingItem: {
    padding: 20,
    backgroundColor: '#1c1c1e',
    marginBottom: 10,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  settingText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: 150,
    color: '#fff',
  },
});

export default SettingsList;
