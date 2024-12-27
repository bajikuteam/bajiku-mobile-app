import CustomHeader from '@/components/CustomHeader';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

const CommunityGuidelines = () => {
    const goBack = () => {
        router.back();
      };
  return (
    <><CustomHeader
          title={"Community Guidelines"}
          onBackPress={goBack} /><ScrollView style={styles.container}>
              {/* General Guidelines */}
              <View style={styles.section}>
                  <Text style={styles.title}>General Guidelines</Text>
                  <Text style={styles.content}>
                      <Text style={styles.sectionTitle}>1. Respect others</Text>
                      {'\n'}
                      Treat others with respect and kindness, even if you disagree with their opinions or beliefs.
                      {'\n\n'}

                      <Text style={styles.sectionTitle}>2. Be authentic</Text>
                      {'\n'}
                      Be honest and authentic in your interactions with others.
                      {'\n\n'}

                      <Text style={styles.sectionTitle}>3. Keep it legal</Text>
                      {'\n'}
                      Do not post or share content that promotes or encourages illegal activities.
                      {'\n\n'}

                      <Text style={styles.sectionTitle}>4. No hate speech</Text>
                      {'\n'}
                      Do not post or share content that promotes hate or discrimination against individuals or groups based on their race, ethnicity, national origin, sex, gender identity, disability, or religion.
                      {'\n\n'}
                  </Text>
              </View>

              {/* Content Guidelines */}
              <View style={styles.section}>
                  <Text style={styles.title}>Content Guidelines</Text>
                  <Text style={styles.content}>
                      <Text style={styles.sectionTitle}>1.  Nude content is allowed</Text>
                      {'\n'}
                      Nude content is permitted on Bajiku, but it must be posted in a respectful and tasteful manner.
                      {'\n\n'}

                      <Text style={styles.sectionTitle}>2. No harassment</Text>
                      {'\n'}
                      Do not post or share content that harasses or bullies others.
                      {'\n\n'}

                      <Text style={styles.sectionTitle}>3. No spam</Text>
                      {'\n'}
                      Do not post or share unsolicited or repetitive content, including advertisements or self-promotion.
                      {'\n\n'}

                      <Text style={styles.sectionTitle}>4. Respect intellectual property</Text>
                      {'\n'}
                      Do not post or share content that infringes on the intellectual property rights of others.
                      {'\n\n'}
                  </Text>
              </View>

              {/* Safety Guidelines */}
              <View style={styles.section}>
                  <Text style={styles.title}>Safety Guidelines</Text>
                  <Text style={styles.content}>
                      <Text style={styles.sectionTitle}>1. Protect your personal info</Text>
                      {'\n'}
                      Do not share your personal contact information, including your phone number, email address, or physical address.
                      {'\n\n'}

                      <Text style={styles.sectionTitle}>2. Be cautious of scams</Text>
                      {'\n'}
                      Be wary of suspicious messages or requests that ask for your personal info or money.
                      {'\n\n'}

                      <Text style={styles.sectionTitle}>3. Report suspicious activity</Text>
                      {'\n'}
                      If you suspect someone is violating our community guidelines, report them to our moderators.
                      {'\n\n'}
                  </Text>
              </View>

              {/* Consequences of Violating Guidelines */}
              <View style={styles.section}>
                  <Text style={styles.title}>Consequences of Violating Guidelines</Text>
                  <Text style={styles.content}>
                      <Text style={styles.sectionTitle}>1. Warning</Text>
                      {'\n'}
                      You may receive a warning from our moderators if you violate our community guidelines.
                      {'\n\n'}

                      <Text style={styles.sectionTitle}>2. Account suspension</Text>
                      {'\n'}
                      Your account may be suspended temporarily or permanently if you repeatedly violate our community guidelines.
                      {'\n\n'}

                      <Text style={styles.sectionTitle}>3. Content removal</Text>
                      {'\n'}
                      Any content that violates our community guidelines may be removed from our platform.
                      {'\n\n'}
                  </Text>
              </View>

              {/* Reporting Violations */}
              <View style={styles.section}>
                  <Text style={styles.title}>Reporting Violations</Text>
                  <Text style={styles.content}>
                      <Text style={styles.sectionTitle}>1. Report to moderators</Text>
                      {'\n'}
                      If you suspect someone is violating our community guidelines, report them to our moderators.
                      {'\n\n'}

                      <Text style={styles.sectionTitle}>2. Provide evidence</Text>
                      {'\n'}
                      Provide evidence of the violation to the offending content.
                      {'\n\n'}
                  </Text>
              </View>

              {/* Changes to Guidelines */}
              <View style={styles.section}>
                  <Text style={styles.title}>Changes to Guidelines</Text>
                  <Text style={styles.content}>
                      <Text style={styles.sectionTitle}>1. We reserve the right to change</Text>
                      {'\n'}
                      We reserve the right to change or update our community guidelines at any time.
                      {'\n\n'}

                      <Text style={styles.sectionTitle}>2. Notice of changes</Text>
                      {'\n'}
                      We will provide notice of any changes to our community guidelines on our website or through our app.
                      {'\n\n'}
                  </Text>
              </View>
          </ScrollView></>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#000',
    color:'#fff'
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
     color:'#ffffff'

  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color:'#ffffff'
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
     color:'#ffffff'
  },
});

export default CommunityGuidelines;
