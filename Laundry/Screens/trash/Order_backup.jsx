import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Order = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          const raw = JSON.stringify({ "user_id": userId });

          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };

          const response = await fetch("https://newlaundryapp.demodev.shop/api/allorder", requestOptions);
          const result = await response.json();
          if (result.orders) {
            setOrders(result.orders);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Out for Pickup':
        return styles.pickup;
      case 'Pending':
        return styles.progress;
      case 'Completed':
        return styles.completed;
      default:
        return styles.default;
    }
  };

  const OrderItem = ({ order }) => (
    <View style={styles.orderItem}>
      <Image source={require('./pic1.jpg')} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.orderId}>Order id: {order.order_id}</Text>
        <Text style={styles.title}>{order.items.join(', ')}</Text>
        <Text style={styles.date}>{new Date(order.order_date).toLocaleDateString()}</Text>
        <View style={[styles.statusContainer, getStatusStyle(order.delivery_status)]}>
          <Text style={styles.statusText}>{order.delivery_status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView>
    <FlatList
      data={orders}
      keyExtractor={(item) => item.order_id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Track your order', { orderId: item.order_id })}>
          <OrderItem order={item} />
        </TouchableOpacity>

      )}
      contentContainerStyle={styles.container}
    />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#EEEEFF',
    height: '100%'
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  orderId: {
    color: '#A0A0A0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    color: '#A0A0A0',
  },
  statusContainer: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
  },
  pickup: {
    backgroundColor: '#8E44AD',
  },
  completed: {
    backgroundColor: '#4CAF50',
  },
  progress: {
    backgroundColor: '#585CE4',
  },
});

export default Order;
