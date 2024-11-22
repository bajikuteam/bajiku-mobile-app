import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface SearchComponentProps {
  endpoint: string; // The API endpoint to search from
  fieldsToDisplay: string[]; // The fields to display for each search result
}

const SearchComponent: React.FC<SearchComponentProps> = ({ endpoint, fieldsToDisplay }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${endpoint}?search=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResults(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search..."
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
        style={styles.input}
      />
      {loading && <ActivityIndicator size="small" color="#007BFF" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.resultsContainer}>
        {results.map((item, index) => (
          <View key={index} style={styles.resultItem}>
            {fieldsToDisplay.map((field) => (
              <Text key={field} style={styles.resultText}>
                <Text style={styles.fieldLabel}>{field}:</Text> {item[field]}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: '#F8F8F8',
    borderRadius: 10,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 5,
  },
  input: {
    width: '100%',
    height: 48,
    // backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    // color: '#333',
    borderColor: '#075E54',
    borderWidth: 1,
    marginBottom: 15,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 3,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  resultsContainer: {
    marginTop: 10,
    width: '100%',
  },
  resultItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  resultText: {
    fontSize: 14,
    color: '#555',
  },
  fieldLabel: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

export default SearchComponent;
