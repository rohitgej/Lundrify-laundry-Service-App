import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Collapsible from 'react-native-collapsible';
import DOMAIN_NAME from '../config/config';

const Support = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [collapsedIndex, setCollapsedIndex] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`${DOMAIN_NAME}api/getFAQs`, { method: 'POST' });
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          setFaqs(result);
        } else {
          const text = await response.text();
          console.error('Unexpected response format:', text);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFAQs();
  }, []);

  const handleSubmit = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const user_id = await AsyncStorage.getItem('user_id');
    const raw = JSON.stringify({
      user_id: user_id,
      email_id: email,
      subject: subject,
      message: message,
      name: name,
      order_id: orderId,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    await fetch(`${DOMAIN_NAME}api/post-support`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setName('');
        setEmail('');
        setOrderId('');
        setMessage('');
        setSubject('');
        Alert.alert('Success', 'Support request submitted successfully.');
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'There was an error submitting the support request.');
      });
  };

  const toggleCollapse = (index) => {
    setCollapsedIndex(collapsedIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Order ID"
        value={orderId}
        onChangeText={setOrderId}
      />

      <Picker
        selectedValue={subject}
        onValueChange={(itemValue) => setSubject(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Subject" value="" />
        {faqs.map((faq, index) => (
          <Picker.Item key={index} label={faq.query} value={faq.query} />
        ))}
      </Picker>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Type Message"
        value={message}
        onChangeText={setMessage}
        multiline={true}
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* FAQ Section */}
      <View style={styles.faqContainer}>
        <Text style={styles.faqHeader}>Frequently Asked Questions</Text>
        {faqs.length > 0 ? (
          faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
            <TouchableOpacity onPress={() => toggleCollapse(index)} style={styles.faqTitleContainer}>
              <Text style={styles.faqQuestion}>{faq.query}</Text>
              <Text style={styles.faqToggle}>{collapsedIndex === index ? '-' : '+'}</Text>
            </TouchableOpacity>
            <Collapsible collapsed={collapsedIndex !== index}>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </Collapsible>
          </View>
          ))
        ) : (
          <Text>No FAQs available at the moment.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EEEEFF',
    
  },
  tochpress:{
    width:"100%",
    backgroundColor:"#585CE4",
    paddingVertical:10,
    paddingLeft:10,
    borderRadius:5
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#585CE4',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  faqContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  faqHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 15,
  },
  faqTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: '500',
  },
  faqToggle: {
    fontSize: 24,
    fontWeight: '300',
  },
  faqAnswer: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default Support;
