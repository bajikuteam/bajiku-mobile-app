import CustomHeader from '@/components/CustomHeader';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const About = () => {
    const goBack = () => {
        router.back();
      };
  return (
    <><CustomHeader
          title={"About Bajiku"}
          onBackPress={goBack} /><View style={styles.container}>
              {/* <Text style={styles.header}>About Bajiku</Text> */}

              <View style={styles.section}>
                  <Text style={styles.title}>App Overview</Text>
                  <Text style={styles.description}>
                      Bajiku is a social media platform designed to bring people together, share content, and connect with others. Whether you are here to share your creativity or interact with a global community, Bajiku offers a variety of features to help you do just that.
                  </Text>
              </View>

              <View style={styles.section}>
                  <Text style={styles.title}>Version</Text>
                  <Text style={styles.description}>Version 1.0.0</Text>
              </View>

              <View style={styles.section}>
                  <Text style={styles.title}>Contact Us</Text>
                  <Text style={styles.description}>If you have any questions, feel free to reach out to us:</Text>
                  <TouchableOpacity onPress={() => Linking.openURL('mailto:support@bajiku.com')}>
                      <Text style={styles.link}>support@bajiku.com</Text>
                  </TouchableOpacity>
              </View>

              <View style={styles.section}>
                  <Text style={styles.title}>Follow Us</Text>
                  <Text style={styles.description}>Stay updated with our latest news and updates:</Text>
                  <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/bajikuapp')}>
                      <Text style={styles.link}>Instagram</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL('https://www.twitter.com/bajikuapp')}>
                      <Text style={styles.link}>Twitter</Text>
                  </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                  <Text style={styles.footerText}>© 2024 Bajiku. All Rights Reserved.</Text>
              </View>
          </View></>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#000',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 22,
  },
  link: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 5,
  },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default About;
