import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // You can use other icon libraries if needed
import CustomHeader from '@/components/CustomHeader';
import { router } from 'expo-router';

const FAQ = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setExpanded(expanded === index ? null : index); // Toggle the expansion
  };

  const questions = [
    {
      question: "How do I create an account on Bajiku?",
      answer: "To create an account, download the Bajiku app, tap 'Sign up,' and follow the prompts to provide your email address, password, and other basic information."
    },
    {
      question: "How do I log in to my Bajiku account?",
      answer: "To log in, open the Bajiku app, tap 'Log in,' and enter your email address and password."
    },
    {
      question: "Is my personal information safe on Bajiku?",
      answer: "Yes, we take the security and privacy of your personal information seriously. We use encryption and other security measures to protect your data."
    },
  
    {
      question: "What types of content are allowed on Bajiku?",
      answer: "We allow a wide range of content on Bajiku, including photos, videos. However, we do have community guidelines that prohibit certain types of content, such as hate speech, violence, and explicit material."
    },
    {
      question: "How do I  unfollow someone on Bajiku?",
      answer: "To unfollow someone, go to their profile, and select 'Unfollow.'"
    },
    {
      question: "Why am I experiencing issues with the Bajiku app?",
      answer: "Sorry to hear that you're experiencing issues! Please try restarting the app, checking for updates, or contacting our support team for assistance."
    },
    {
      question: "How do I reset my password on Bajiku?",
      answer: "To reset your password, tap 'Forgot password' on the login screen, enter your email address, and follow the prompts to create a new password."
    },
  
    {
      question: "How do I contact Bajiku's support team?",
      answer: "You can contact us through our in-app  chat,  or email us at support@bajiku."
    },
    {
      question: "What are Bajiku's business hours?",
      answer: "Our support team is available to assist you 24/7."
    }
  ];
  const goBack = () => {
    router.back();
  };
  return (
    <><CustomHeader
          title={"FAQ"}
          onBackPress={goBack} /><View style={styles.container}>
              {questions.map((item, index) => (
                  <View key={index} style={styles.questionContainer}>
                      <TouchableOpacity
                          style={styles.question}
                          onPress={() => toggleAnswer(index)}
                      >
                          <Text style={styles.questionText}>{item.question}</Text>
                          <Ionicons
                              name={expanded === index ? 'chevron-up' : 'chevron-down'}
                              size={20}
                              color="#fff" />
                      </TouchableOpacity>
                      {expanded === index && (
                          <Animated.View style={styles.answerContainer}>
                              <Text style={styles.answerText}>{item.answer}</Text>
                          </Animated.View>
                      )}
                  </View>
              ))}
          </View></>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#000',
  },
  questionContainer: {
    marginBottom: 15,
  },
  question: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
     color:'#ffffff'
  },
  answerContainer: {
    paddingLeft: 15,
    paddingTop: 5,
  },
  answerText: {
    fontSize: 14,
     color:'#ffffff'
  },
});

export default FAQ;
