// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
// import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back button
// import { useNavigation } from '@react-navigation/native'; // Import useNavigation

// // Define the props type
// interface CustomHeaderProps {
//   title: string;
//   subtitle?: string;
//   onBackPress?: () => void;
//   image?: ImageSourcePropType | string;  // Updated to accept string for remote image URL
// }

// const CustomHeader: React.FC<CustomHeaderProps> = ({ title, subtitle, onBackPress, image }) => {
//   const navigation = useNavigation();  // Get the navigation object using the hook

//   const handleBackPress = () => {
//     if (onBackPress) {
//       onBackPress();
//     } else {
//       navigation.goBack();  // Navigate back if no custom onBackPress is provided
//     }
//   };

//   return (
//     <View style={styles.headerContainer}>
//       {handleBackPress && (
//         <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
//           {/* Use Ionicons for the back button */}
//           <Ionicons name="arrow-back" size={24} color="#ffffff" />
//         </TouchableOpacity>
//       )}
//       {/* Conditionally render the image, check if it's a string (URL) or ImageSourcePropType */}
//       {image && (
//         <Image
//           source={typeof image === 'string' ? { uri: image } : image}
//           style={styles.image}
//         />
//       )}
//       <View style={styles.textContainer}>
//         <Text style={styles.title}>{title}</Text>
//         {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#000000',
//     elevation: 4,
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   image: {
//     width: 40, 
//     height: 40,
//     borderRadius: 12, 
//     marginRight: 16, 
//   },
//   textContainer: {
//     flex: 1,
//   },
//   title: {
//     color: '#ffffff',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     color: '#bbbbbb',
//     fontSize: 14,
//   },
// });

// export default CustomHeader;


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back button
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView

// Define the props type
interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  image?: ImageSourcePropType | string;  // Updated to accept string for remote image URL
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, subtitle, onBackPress, image }) => {
  const navigation = useNavigation();  // Get the navigation object using the hook

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();  // Navigate back if no custom onBackPress is provided
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.headerContainer}>
        {onBackPress && (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            {/* Use Ionicons for the back button */}
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
        {/* Conditionally render the image, check if it's a string (URL) or ImageSourcePropType */}
        {image && (
          <Image
            source={typeof image === 'string' ? { uri: image } : image}
            style={styles.image}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 0, // Prevent SafeAreaView from stretching the full screen (it's just for the header)
    backgroundColor: '#000000',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8, // Add some padding if needed for spacing
    backgroundColor: '#000000',
    elevation: 4,
  },
  backButton: {
    marginRight: 16,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#bbbbbb',
    fontSize: 14,
  },
});

export default CustomHeader;

