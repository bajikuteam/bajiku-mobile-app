import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
 
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
 
const GroupChatScreen = () => {
    return (
        <View style={styles.container}>
            <Text>GroupChatScreen</Text>
        </View>
    );
}

 
export default GroupChatScreen;