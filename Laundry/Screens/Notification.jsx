import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DOMAIN_NAME from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notification = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const userId = await AsyncStorage.getItem('user_id');
        const raw = JSON.stringify({
          "user_id": userId
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };

        const response = await fetch(`${DOMAIN_NAME}api/getnotifications`, requestOptions);
        const result = await response.json();

        if (result.data) {
          // Map the API data to the required format
          const notifications = result.data.map(item => ({
            id: item._id,
            title: item.notification_title,
            body: item.notification_message,
          }));
          setMessages(notifications);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, []);

  const deleteMessage = async (id) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({ id });

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(`${DOMAIN_NAME}api/deleteNotification`, requestOptions);
      const result = await response.text();
      console.log(result);

      // If delete is successful, update the local state
      if (response.ok) {
        setMessages((prevMessages) => prevMessages.filter(message => message.id !== id));
      } else {
        console.error("Failed to delete the notification");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <View style={styles.messageContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteMessage(item.id)}>
        <Icons name="delete" size={24} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#EEEEFF',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  messageContent: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  body: {
    fontSize: 14,
    color: '#555',
  },
});

export default Notification;
