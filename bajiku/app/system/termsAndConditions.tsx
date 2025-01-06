import CustomHeader from '@/components/CustomHeader';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, StyleSheet, View, StatusBar, TouchableOpacity, Linking } from 'react-native';

const TermsAndPrivacyPolicy = () => {
    const goBack = () => {
        router.back();
      };
  return (
    <><CustomHeader
    title={"Terms and Privacy Policy"}
    onBackPress={goBack} /><ScrollView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
          {/* Terms of Service */}
          <View style={styles.section}>
              <Text style={styles.title}>Terms of Service</Text>
              <Text style={styles.content}>
                  <Text style={styles.sectionTitle}>1. Introduction</Text>
                  {'\n'}
                  1.1 These Terms of Service ("Terms") govern your use of Bajiku, a social media app provided by Bajiku.
                  {'\n'}
                  1.2 By using Bajiku, you agree to be bound by these Terms.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>2. Eligibility</Text>
                  {'\n'}
                  2.1 You must be at least 18 years old to use Bajiku.
                  {'\n'}
                  2.2 You must provide accurate and complete information when creating an account.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>3. Account Security</Text>
                  {'\n'}
                  3.1 You are responsible for maintaining the security of your account.
                  {'\n'}
                  3.2 You must not share your account credentials with anyone.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>4. Content Guidelines</Text>
                  {'\n'}
                  4.1 You must comply with our Community Guidelines when posting content on Bajiku.
                  {'\n'}
                  4.2 You are responsible for ensuring that your content does not infringe on the rights of others.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
                  {'\n'}
                  5.1 Bajiku and its original content, features, and functionality are owned by Bajiku and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                  {'\n'}
                  5.2 You must not reproduce, distribute, or display any content from Bajiku without our prior written permission.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>6. User-Generated Content</Text>
                  {'\n'}
                  6.1 You grant us a worldwide, perpetual, irrevocable, royalty-free, and non-exclusive license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display any user-generated content you submit to Bajiku.
                  {'\n'}
                  6.2 You represent and warrant that you have the right to grant us this license.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>7. Disclaimers</Text>
                  {'\n'}
                  7.1 Bajiku is provided on an "as is" and "as available" basis.
                  {'\n'}
                  7.2 We disclaim all warranties of any kind, express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
                  {'\n'}
                  8.1 We shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of Bajiku.
                  {'\n'}
                  8.2 Our liability for damages shall be limited to the amount you paid for Bajiku.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>9. Termination</Text>
                  {'\n'}
                  9.1 We may terminate or suspend your account and access to Bajiku at any time, without notice, and for any reason.
                  {'\n'}
                  9.2 Upon termination, your right to use Bajiku shall cease immediately.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>10. Governing Law</Text>
                  {'\n'}
                  10.1 These Terms shall be governed by and construed in accordance with the laws of [Your Country/State].
                  {'\n'}
                  10.2 Any disputes arising out of or related to these Terms shall be resolved through [Dispute Resolution Process].
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>11. Changes to Terms</Text>
                  {'\n'}
                  11.1 We may modify these Terms at any time, without notice.
                  {'\n'}
                  11.2 Your continued use of Bajiku shall constitute your acceptance of the modified Terms.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>12. Contact Us</Text>
                  {'\n'}
                  12.1 If you have any questions or concerns about these Terms, please contact us at <TouchableOpacity onPress={() => Linking.openURL('mailto:support@bajiku.com')}>
                      <Text style={{  fontSize: 16,
    color: '#007BFF',
    marginTop: 10,}}>support@bajiku.com</Text>
                  </TouchableOpacity>
                  {'\n\n'}

                  By using Bajiku, you acknowledge that you have read, understood, and agree to be bound by these Terms.
              </Text>
          </View>

          {/* Privacy Policy */}
          <View style={styles.section}>
              <Text style={styles.title}>Privacy Policy</Text>
              <Text style={styles.content}>
                  <Text style={styles.sectionTitle}>1. Introduction</Text>
                  {'\n'}
                  1.1 We are committed to protecting your privacy and personal data.
                  {'\n'}
                  1.2 This Privacy Policy explains how we collect, use, and protect your personal data.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>2. Collection of Personal Data</Text>
                  {'\n'}
                  2.1 We collect personal data that you provide to us, such as your name, email address, and password.
                  {'\n'}
                  2.2 We also collect non-personal data, such as your IP address, browser type, and operating system.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>3. Use of Personal Data</Text>
                  {'\n'}
                  3.1 We use your personal data to provide and improve Bajiku.
                  {'\n'}
                  3.2 We may also use your personal data to communicate with you, such as sending you notifications and updates.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>4. Protection of Personal Data</Text>
                  {'\n'}
                  4.1 We take reasonable measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction.
                  {'\n'}
                  4.2 We use encryption and other security measures to protect your personal data.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>5. Disclosure of Personal Data</Text>
                  {'\n'}
                  5.1 We may disclose your personal data to third-party service providers who assist us in providing Bajiku.
                  {'\n'}
                  5.2 We may also disclose your personal data to law enforcement agencies or other government agencies as required by law.
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>6. Your Rights</Text>
                  {'\n'}
                  6.1 You have the right to access, correct, or delete your personal data.
                  {'\n'}
                  6.2 You can exercise these rights by contacting us at   <TouchableOpacity onPress={() => Linking.openURL('mailto:support@bajiku.com')}>
                      <Text style={{  fontSize: 16,
    color: '#007BFF',
    marginTop: 10,}}>support@bajiku.com</Text>
                  </TouchableOpacity>
                  {'\n\n'}

                  <Text style={styles.sectionTitle}>7. Changes to Privacy Policy</Text>
                  {'\n'}
                  7.1 We may modify this Privacy Policy at any time, without notice.
                 
              </Text>
          </View>
      </ScrollView></>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#000',
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

export default TermsAndPrivacyPolicy;
