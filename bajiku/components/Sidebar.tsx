import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import ModeSettings from './ModeSetting';
import { useTheme } from '@/utils/useContext/ThemeContext';
import { useUser } from '@/utils/useContext/UserContext';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const { user, handleLogout  } = useUser(); 

  const sidebarWidth = width * 0.8;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Determine styles based on the current theme
  const sidebarStyles = theme === 'dark' ? styles.sidebarDark : styles.sidebarLight;
  const headerBackgroundColor = theme === 'dark' ? '#000' : '#F2F2F2';
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const iconColor = theme === 'dark' ? '#fff' : '#000';

  return (
    <View style={styles.container}>
      {/* StatusBar dynamically based on theme */}
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={headerBackgroundColor}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.iconContainer}>
        {user ? (
    user.profileImageUrl ? (
      // Display profile image if it exists
      <Image
        source={{ uri: user.profileImageUrl }}
         className='w-[33px] h-[33px] rounded-[10px]'
      />
    ) : (
      <View className='bg-gray-500 p-3 rounded-full'>
    <FontAwesome name="user" size={28} color={iconColor}  />
      </View>   
    )
  ) : (
    // Display menu icon if not logged in
    <TouchableOpacity onPress={toggleSidebar} style={styles.iconContainer}>
      <Feather name="menu" size={28} color={iconColor} />
    </TouchableOpacity>
  )}
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Bajîkü</Text>
        <TouchableOpacity style={styles.iconContainer}>
          <Feather name="bell" size={28} color={iconColor} />
        </TouchableOpacity>
      </View>

      {/* Sidebar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={[sidebarStyles, { width: sidebarWidth }]}>
          <Text style={styles.logo}>Bajîkü</Text>

          {/* Display user data if logged in */}
          {user && (
            <><View className=' border-b-gray-500 border-b'>
              {/* Display profile image */}
              {user.profileImageUrl ? (
                <Image
                  source={{ uri: user.profileImageUrl }}
                  // style={styles.profileImage}
                  className='w-[40px] h-[40px] rounded-[10px]' />
              ) : (
                <FontAwesome name="user" size={60} color={iconColor} />
              )}
              <View className='flex-row gap-1 text-[10px]'>
                <Text className='text-[12px]' style={[{ color: textColor }]}>
                  {user.firstName}
                </Text>
                <Text className='text-[12px]' style={[{ color: textColor }]}>
                  {user.lastName}
                </Text>
              </View>
              <Text className='text-[12px]' style={[{ color: textColor }]}>
                @{user.username}
              </Text>
              <View  className='flex-row gap-1 mt-2 mb-2 text-[10px]'>
            <Text className='text-[10px]' style={[{ color: textColor }]}>
                {user.followerCount} Followers |
              </Text>
              <Text className='text-[10px]' style={[{ color: textColor }]}>
                {user.followingCount} Following |
              </Text>
              <Text className='text-[10px]' style={[{ color: textColor }]}>
                50 Subscribers
              </Text>
              </View>
            </View>
          
           
              </>
          )}
          <View style={styles.items}>
            <SidebarItem icon={<Feather name="home" size={28} />} label="Home" />
            <SidebarItem icon={<Feather name="user" size={28} />} label="Profile" />
            <SidebarItem icon={<Feather name="settings" size={28} />} label="Settings" />

            {/* Add Login and Signup buttons */}
            {!user ? (
              <>
                <View className="flex items-center mt-4">
                  <Link href="/Login" onPress={handleClose}>
                    <View className="bg-red-500 w-[180px] h-[38px] rounded-[12px] items-center justify-center text-center text-white">
                      <Text className="text-center text-white pt-1 text-xs">Login</Text>
                    </View>
                  </Link>
                </View>
                <View className="flex items-center mt-4">
                  <Link href="/Signup" onPress={handleClose}>
                    <View className="bg-red-500 w-[180px] h-[38px] rounded-[12px] items-center justify-center text-center text-white">
                      <Text className="text-center text-white pt-1 text-xs">Get Started</Text>
                    </View>
                  </Link>
                </View>
              </>
            ) : (
              <TouchableOpacity onPress={handleLogout } style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.policySection}>
            <Text style={[styles.policyText, { color: textColor }]}>About</Text>
            <Text style={[styles.policyText, { color: textColor }]}>Policy</Text>
            <Text style={[styles.policyText, { color: textColor }]}>Community Guidelines</Text>
            <Text style={[styles.policyText, { color: textColor }]}>Terms and Conditions</Text>
            <Text style={[styles.policyText, { color: textColor }]}>FAQ</Text>
          </View>

          <View style={styles.modeSettingsContainer}>
            <ModeSettings />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const SidebarItem: React.FC<{ icon: JSX.Element; label: string }> = ({ icon, label }) => {
  const { theme } = useTheme();

  // Determine the text and icon color based on the theme
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const iconColor = theme === 'dark' ? '#fff' : '#000';

  // Clone the icon with the appropriate color
  const coloredIcon = React.cloneElement(icon, { color: iconColor });

  return (
    <View style={styles.sidebarItem}>
      <View style={styles.icon}>{coloredIcon}</View>
      <Text style={{ color: textColor }}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 20,
    zIndex: 100,
    height: 70,
  },
  headerTitle: {
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
    fontWeight: 'bold',
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sidebarLight: {
    backgroundColor: '#fff',
    height: '100%',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'space-between',
  },
  sidebarDark: {
    backgroundColor: '#000',
    height: '100%',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'space-between',
    borderRightWidth: 1,
    borderRightColor: '#808080',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D84773',
    textAlign: 'center',
    marginBottom: 2,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 30,
  },
  items: {
    flexGrow: 0,
    marginBottom: 20,
  },
  policySection: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 30,
  },
  policyText: {
    fontSize: 14,
    marginVertical: 15,
  },
  modeSettingsContainer: {
    bottom: '5%',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#D84773',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Sidebar;
