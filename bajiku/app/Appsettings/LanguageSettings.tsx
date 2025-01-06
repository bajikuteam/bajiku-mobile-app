import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import i18n from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const LanguageSettings = () => {
  const { t } = useTranslation(); 
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  useEffect(() => {
    const fetchLanguage = async () => {
      const storedLang = await AsyncStorage.getItem('language');
      if (storedLang) {
        setSelectedLanguage(storedLang);
      }
    };
    fetchLanguage();
  }, []);

  const handleChangeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang); // Change the language in i18n
    setSelectedLanguage(lang);
    await AsyncStorage.setItem('language', lang); // Save the user's language preference
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('language')}</Text>

      <TouchableOpacity
        style={styles.languageItem}
        onPress={() => handleChangeLanguage('en')}
      >
        <Text style={[styles.languageText, selectedLanguage === 'en' && styles.selected]}>
          {t('english')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.languageItem}
        onPress={() => handleChangeLanguage('es')}
      >
        <Text style={[styles.languageText, selectedLanguage === 'es' && styles.selected]}>
          {t('spanish')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  languageItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  languageText: {
    fontSize: 18,
  },
  selected: {
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default LanguageSettings;
