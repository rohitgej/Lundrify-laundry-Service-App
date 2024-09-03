import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const orders = [
  {
    id: 'MK2569',
    title: 'Clean Zone',
    date: '05 May, 2021',
    status: 'Pickup',
    image: require('./pic1.jpg'), // Replace with the correct path
  },
  {
    id: 'MK2569',
    title: 'Laundry Club',
    date: '08 May, 2021',
    status: 'Completed',
    image: require('./pic1.jpg'), // Replace with the correct path
  },
  {
    id: 'MK2569',
    title: 'Laund Man',
    date: '10 May, 2021',
    status: 'Progress',
    image: require('./pic1.jpg'), // Replace with the correct path
  },
  {
    id: 'MK2569',
    title: 'Clean Box',
    date: '05 May, 2021',
    status: 'Completed',
    image: require('./pic1.jpg'), // Replace with the correct path
  },
  {
    id: 'MK2569',
    title: 'Laundry Box',
    date: '05 May, 2021',
    status: 'Progress',
    image: require('./pic1.jpg'), // Replace with the correct path
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case 'Pickup':
      return styles.pickup;
    case 'Completed':
      return styles.completed;
    case 'Progress':
      return styles.progress;
    default:
      return styles.default;
  }
};

const OrderItem = ({ order }) => (
  <View style={styles.orderItem} >
    <Image source={order.image} style={styles.image} />
    <View style={styles.textContainer}>
      <Text style={styles.orderId}>Order id: {order.id}</Text>
      <Text style={styles.title}>{order.title}</Text>
      <Text style={styles.date}>{order.date}</Text>
      <View style={[styles.statusContainer, getStatusStyle(order.status)]}>
        <Text style={styles.statusText}>{order.status}</Text>
      </View>
    </View>
  </View>
);

const Order = ({navigation}) => (
    <TouchableOpacity onPress={() => navigation.navigate('Track your order')}>
  <FlatList
    data={orders}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <OrderItem order={item} />}
    contentContainerStyle={styles.container}
  />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#EEEEFF',
    height:'100%'
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
