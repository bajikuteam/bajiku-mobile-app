import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // You can use other icon libraries if needed
import { router } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';

const PaymentsFAQ = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setExpanded(expanded === index ? null : index); // Toggle the expansion
  };

  const questions = [
    {
      question: "How does Bajiku generate revenue?",
      answer: "Bajiku generates revenue through subscription fees paid by users."
    },
    {
      question: "How do creators earn money on Bajiku?",
      answer: "Creators can earn money on Bajiku through subscriptions to their exclusive content. When a user subscribes to a creator's content, the creator earns a portion of the subscription fee."
    },
    {
      question: "What percentage of the subscription fee does the creator earn?",
      answer: "Creators on Bajiku earn 80% of the subscription fee, while Bajiku retains 20% as a platform fee."
    },
    {
      question: "How often do creators receive payments?",
      answer: "Creators can withdraw and receive payments any day, provided they have earnings."
    },
    {
      question: "What payment methods does Bajiku support?",
      answer: "Bajiku payment method including  bank transfers."
    },
    {
      question: "Can I monetize my content on Bajiku?",
      answer: "Yes, creators can monetize their content on Bajiku through subscriptions."
    },
    {
      question: "What types of content can I monetize on Bajiku?",
      answer: "You can monetize a variety of content types on Bajiku, including photos, videos, and exclusive posts."
    },
    {
      question: "How do I earn on my Bajiku account?",
      answer: "To earn on your Bajiku account, ' You get paid for any of your content subscribed to, or by a user subscribing to you account."
      // answer: "To enable monetization on your Bajiku account, go to your account settings, tap 'Monetization,' and follow the prompts to complete the setup process."
    },

 
   
  ];

  const goBack = () => {
    router.back();
  };
  return (
    <><CustomHeader
      title={"Payment FAQ's"}
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

export default PaymentsFAQ;
