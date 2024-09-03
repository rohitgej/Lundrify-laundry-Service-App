import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';

const orders = [
  {
    id: 'MK2563',
    title: 'Full Name',
    date: '05 May, 2021',
    status: 'Pickup',
    time: '7:00 AM',
    address: '123 Elm Street, Springfield, IL',
    image: require('./pic1.jpg'), // Replace with the correct path
  },
  {
    id: 'MK2569',
    title: 'Full Name',
    date: '08 May, 2021',
    time: '7:00 AM',
    status: 'Completed',
    address: '456 Maple Avenue, Chicago, IL',
    image: require('./pic1.jpg'), // Replace with the correct path
  },
  {
    id: 'MK2527',
    title: 'Full Name',
    date: '10 May, 2021',
    time: '7:00 AM',
    status: 'Progress',
    address: '789 Oak Lane, Naperville, IL',
    image: require('./pic1.jpg'), // Replace with the correct path
  },
  {
    id: 'MK2585',
    title: 'Full Name',
    date: '05 May, 2021',
    status: 'Completed',
    time: '7:00 AM',
    address: '321 Pine Street, Evanston, IL',
    image: require('./pic1.jpg'), // Replace with the correct path
  },
  {
    id: 'MK2598',
    title: 'Full Name',
    date: '05 May, 2021',
    time: '7:00 AM',
    status: 'Progress',
    address: '654 Cedar Avenue, Peoria, IL',
    image: require('./pic1.jpg'), // Replace with the correct path
  },
  {
    id: 'MK2570',
    title: 'Full Name',
    date: '05 May, 2021',
    time: '7:00 AM',
    status: 'Completed',
    address: '987 Birch Boulevard, Rockford, IL',
    image: require('./pic1.jpg'), // Replace with the correct path
  }
];


const OrderItem = ({ order }) => (
  <View style={styles.orderItem}>

<Text style={styles.title}>{order.title}</Text>

    <View style={styles.textContainer}>
      <Text style={styles.orderId}>Order id: {order.id}</Text>
      <Text style={styles.date}>{order.date}</Text>
      <Text style={styles.time}>{order.time}</Text>
    </View>
    <Text style={styles.address}>{order.address}</Text>
  
  </View>
);

const Orders = ({ navigation }) => {
  const [showPickup, setShowPickup] = useState(true);

  const pickupOrders = orders.filter(order => order.status === 'Pickup');
  const deliveryOrders = orders.filter(order => order.status !== 'Pickup');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, showPickup && styles.activeButton]}
          onPress={() => setShowPickup(true)}
        >
          <Text style={[styles.toggleButtonText, showPickup && styles.activeButtonText]}>Pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !showPickup && styles.activeButton]}
          onPress={() => setShowPickup(false)}
        >
          <Text style={[styles.toggleButtonText, !showPickup && styles.activeButtonText]}>Delivery</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        {showPickup ? (
          <>
            <Text style={styles.sectionTitle}>Pickup Orders</Text>
            <FlatList
              data={pickupOrders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('OrderDetails')}>
                  <OrderItem order={item} />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContainer}
            />
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Delivery Orders</Text>
            <FlatList
              data={deliveryOrders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Order Details', { orderId: item.id })}>
                  <OrderItem order={item} />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
   
  },
  toggleButton: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
   
   
  },
  toggleButtonText: {
    color: '#585CE4',
    fontWeight: 'bold',
  },
  activeButton: {
    borderBottomWidth:3,
    borderBottomColor:'#585CE4',
    backgroundColor: '#EEEEFF',
  },
  activeButtonText: {
    color: '#585CE4',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {

    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  orderItem: {
  
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  textContainer: {
    flexDirection:'row',
    flex: 1,
  },
  orderId: {
    color: '#A0A0A0',
  },
  address: {
    marginTop:10
  },
  date: {
    color: '#585CE4',
    marginLeft: 20,
    fontWeight: 'bold',
  },
  time: {
    color: '#585CE4',
    marginLeft: 20,
    fontWeight: 'bold',
  },
});

export default Orders;
