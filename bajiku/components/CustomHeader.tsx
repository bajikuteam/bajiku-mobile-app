import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ImageSourcePropType 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  image?: ImageSourcePropType | string;  
  onMorePress?: () => void; 
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, subtitle, onBackPress, image, onMorePress }) => {
  const navigation = useNavigation();  

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();  
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.headerContainer}>
        {onBackPress && (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
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
        {/* Three-dot icon */}
        {onMorePress && (
          <TouchableOpacity onPress={onMorePress} style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 0,
    backgroundColor: '#000000',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8, 
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
    textTransform:'lowercase'
  },
  subtitle: {
    color: '#444',
    fontSize: 12,
  },
  moreButton: {
    padding: 8,
  },
});

export default CustomHeader;
