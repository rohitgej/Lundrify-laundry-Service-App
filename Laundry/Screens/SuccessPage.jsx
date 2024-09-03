import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const SuccessPage = ({route, navigation}) => {
  const { userMessage } = route.params;
  const {order_id}=route.params;

  console.log(userMessage,order_id)

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="checkcircleo" size={180}  color="#4AAB23" />
      </View>
      <Text style={styles.successText}>{userMessage}</Text>
      <Text style={styles.descriptionText}>
        Your order has been successfully placed.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Account')}>
        <Text style={styles.buttonText}>Track Your Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4AAB23',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#585CE4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuccessPage;
