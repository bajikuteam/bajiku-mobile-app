import React, { useEffect, useState } from "react";
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
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import ModeSettings from "./ModeSetting";
import { useTheme } from "@/utils/useContext/ThemeContext";
import { useUser } from "@/utils/useContext/UserContext";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWebSocket } from "@/utils/axios/useWebSocket";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamListComponent } from "@/services/core/types";
import { useIsFocused } from "@react-navigation/native";
import * as NavigationBar from 'expo-navigation-bar';
type NavigationProp = StackNavigationProp<RootStackParamListComponent>;

const { width } = Dimensions.get("window");

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const { setUser, user, handleLogout } = useUser();
  const { socket } = useWebSocket();
  const sidebarWidth = width * 0.8;
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, [isFocused]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleFollowerUpdate = (data: any) => {
      const { totalFollowers } = data;
      setUser((prevUser: any) => ({
        ...prevUser,
        followerCount: totalFollowers,
      }));
      AsyncStorage.setItem("followerCount", totalFollowers.toString());
    };

    const handleFollowingUpdate = (data: any) => {
      const { totalFollowing } = data;
      setUser((prevUser: any) => ({
        ...prevUser,
        followingCount: totalFollowing,
      }));
      AsyncStorage.setItem("followingCount", totalFollowing.toString());
    };

    socket.on(`followers-update-${user.id}`, handleFollowerUpdate);
    socket.on(`following-update-${user.id}`, handleFollowingUpdate);

    // Cleanup listeners on unmount
    return () => {
      socket.off(`followers-update-${user.id}`, handleFollowerUpdate);
      socket.off(`following-update-${user.id}`, handleFollowingUpdate);
    };
  }, [socket, user]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const Logout = () => {
    router.push("/auth/Login");
  };

  const handlePress = () => {
    // First navigate to 'Profile' screen
    navigation.navigate('Profile');
    // Then execute handleClose to close the sidebar or perform any other action
    handleClose();
  };
  // Determine styles based on the current theme
  const sidebarStyles =
    theme === "dark" ? styles.sidebarDark : styles.sidebarLight;
  const headerBackgroundColor = theme === 'dark' ? '#000' : '#F2F2F2';
  // const headerBackgroundColor = "#075E54";
  const textColor = theme === "dark" ? "#fff" : "#000";
  const iconColor = theme === "dark" ? "#fff" : "#000";

  return (
    <View style={styles.container}>
      {/* <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={headerBackgroundColor}
      /> */}
     <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header */}
      <View style={[styles.header]}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.iconContainer}>
          {user ? (
            user.profileImageUrl ? (
              // Display profile image if it exists
              <Image
                source={{ uri: user.profileImageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View className="bg-gray-500 p-3 rounded-full">
                <FontAwesome name="user" size={25} color={iconColor} />
              </View>
            )
          ) : (
            // Display menu icon if not logged in
            <TouchableOpacity
              onPress={toggleSidebar}
              style={styles.iconContainer}
            >
              <Feather name="menu" size={25} color={iconColor} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {/* <Text style={[styles.headerTitle, { color: textColor }]}>Bajîkü</Text>
        <TouchableOpacity style={styles.iconContainer}>
          <Feather name="bell" size={25} color={iconColor} />
        </TouchableOpacity> */}
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
            <>
              <View className=" border-b-gray-500 border-b">
                {user.profileImageUrl ? (
                  <Image
                    source={{ uri: user.profileImageUrl }}
                    // className="w-[40px] h-[40px] rounded-[10px]"
                    style={styles.profileImageTwo}
                  />
                ) : (
                  <FontAwesome name="user" size={40} color={iconColor} />
                )}
                <View className="flex-row gap-1 text-[10px]">
                  <Text className="text-[12px] lowercase" style={[{ color: textColor }]}>
                    {user.firstName}
                  </Text>
                  <Text className="text-[12px] lowercase" style={[{ color: textColor }]}>
                    {user.lastName}
                  </Text>
                </View>
                <Text className="text-[12px] lowercase" style={[{ color: textColor }]}>
                  @{user.username}
                </Text>
                <View
                  className="mb-4 mt-4"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 2,
                  }}
                >
                  <Link href="/Followers" onPress={handleClose}>
                    <Text className="text-[10px]" style={{ color: textColor }}>
                      {user.followerCount} Followers {""} |{" "}
                    </Text>
                  </Link>
                  <Link href="/Following" onPress={handleClose}>
                    <Text className="text-[10px]" style={{ color: textColor }}>
                      {user.followingCount} Following |{" "}
                    </Text>
                  </Link>
                  <Text className="text-[10px]" style={{ color: textColor }}>
                    0 Subscribers
                  </Text>
                </View>
              </View>
            </>
          )}
          <View style={styles.items}>
          <TouchableOpacity>
          <Link href="/(tabs)" onPress={handleClose}>
            <SidebarItem
              icon={<Feather name="home" size={28} />}
              label="Home"
            />
            </Link>
             </TouchableOpacity>
             <TouchableOpacity onPress={handlePress}>
            <SidebarItem
              icon={<Feather name="user" size={28} />}
              label="Profile"
          
            />
            </TouchableOpacity>
          
            <SidebarItem
              icon={<Feather name="settings" size={28} />}
              label="Settings"
            />

            {/* Add Login and Signup buttons */}
            {!user ? (
              <>
                <View className="flex items-center mt-4">
                  <Link href="/auth/Login" onPress={handleClose}>
                    <View className="bg-red-500 w-[180px] h-[38px] rounded-[12px] items-center justify-center text-center text-white">
                      <Text className="text-center text-white pt-1 text-xs">
                        Get Started
                      </Text>
                    </View>
                  </Link>
                </View>
                {/* <View className="flex items-center mt-4">
                  <Link href="/SetPassword" onPress={handleClose}>
                    <View className="bg-red-500 w-[180px] h-[38px] rounded-[12px] items-center justify-center text-center text-white">
                      <Text className="text-center text-white pt-1 text-xs">Get Started</Text>
                    </View>
                  </Link>
                </View> */}

                {/* <View className="flex items-center mt-4">
                  <Link href="/SetProfile" onPress={handleClose}>
                    <View className="bg-red-500 w-[180px] h-[38px] rounded-[12px] items-center justify-center text-center text-white">
                      <Text className="text-center text-white pt-1 text-xs">Profile</Text>
                    </View>
                  </Link>
                </View> */}
              </>
            ) : (
              <TouchableOpacity onPress={Logout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.policySection}>
            <Text style={[styles.policyText, { color: textColor }]}>About</Text>
            <Text style={[styles.policyText, { color: textColor }]}>
              Policy
            </Text>
            <Text style={[styles.policyText, { color: textColor }]}>
              Community Guidelines
            </Text>
            <Text style={[styles.policyText, { color: textColor }]}>
              Terms and Conditions
            </Text>
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

const SidebarItem: React.FC<{ icon: JSX.Element; label: string }> = ({
  icon,
  label,
  
}) => {
  const { theme } = useTheme();

  // Determine the text and icon color based on the theme
  const textColor = theme === "dark" ? "#fff" : "#000";
  const iconColor = theme === "dark" ? "#fff" : "#000";

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
    width: "100%",
    top:-30
  
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    top: 0, 
    zIndex: 100,
    // height: 60,
  },
  headerTitle: {
    fontSize: 18,
    textAlign: "center",
    flex: 1,
    fontWeight: "bold",
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sidebarLight: {
    backgroundColor: "#fff",
    height: "100%",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: "space-between",
  },
  sidebarDark: {
    backgroundColor: "#000",
    height: "100%",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: "space-between",
    borderRightWidth: 1,
    borderRightColor: "#808080",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D84773",
    textAlign: "center",
    marginBottom: 2,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
  },
  items: {
    flexGrow: 0,
    marginBottom: 20,
  },
  policySection: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 30,
  },
  policyText: {
    fontSize: 14,
    marginVertical: 15,
  },
  modeSettingsContainer: {
    bottom: "5%",
  },
  sidebarItem: {
    flexDirection: "row",
    // alignItems: "center",
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
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
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  profileImageTwo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
});

export default Sidebar;
