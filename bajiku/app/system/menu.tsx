import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import {  router } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';
import { useUser } from '@/utils/useContext/UserContext';


const Menu = () => {
    const {handleLogout} = useUser()
    const goBack = () => {
        router.back();
      };
  return (
    <><CustomHeader title={'Menu'} onBackPress={goBack} />
    <View style={styles.menuContainer}>

          {/* Main Menu Items */}
          <View style={styles.items}>
          <TouchableOpacity onPress={() => router.push('/(tabs)')}>

                  <SidebarItem
                      icon={<Feather name="home" size={28} />}
                      label="Home" />
              </TouchableOpacity>

              <TouchableOpacity>

                  <SidebarItem
                      icon={<Feather name="settings" size={28} />}
                      label="Settings" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
          </View>

          {/* Policy Section */}
          <View style={styles.policySection}>
              <TouchableOpacity onPress={() => router.push('/system/about')}>
                  <Text style={[styles.policyText, { color: '#fff', }]}>About</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/system/communityGuidelines')}>
                  <Text style={[styles.policyText, { color: '#fff' }]}>Community Guidelines</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/system/termsAndConditions')}>
                  <Text style={[styles.policyText, { color: '#fff' }]}>Terms and Conditions</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/system/FAQ')}>
                  <Text style={[styles.policyText, { color: '#fff' }]}>FAQ</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/system/paymentFAQ')}>
                  <Text style={[styles.policyText, { color: '#fff' }]}>Payment FAQ</Text>
              </TouchableOpacity>
          </View>

      </View></>
  );
};

const SidebarItem: React.FC<{ icon: JSX.Element; label: string }> = ({
    icon,
    label,
    
  }) => {
    const iconColor = "#fff";
  
    // Clone the icon with the appropriate color
    const coloredIcon = React.cloneElement(icon, { color: iconColor });
  
    return (
      <View style={styles.sidebarItem}>
        <View style={{   marginRight: 10,}}>{coloredIcon}</View>
        <Text style={{ color: '#fff', marginTop:8 }}>{label}</Text>
      </View>
    );
  };

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    padding: 10,
  },
  items: {
    marginBottom: 20,
    marginTop:50
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  sidebarLabel: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: "#D84773",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  policySection: {
    marginTop: 30,
  },
  policyText: {
    fontSize: 16,
    paddingVertical: 10,
    color:'ffffff',
  },
});

export default Menu;
