import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Orders = ({ navigation }) => {
  const [showPickup, setShowPickup] = useState(true);
  const [pickupOrders, setPickupOrders] = useState([]);
  const [deliveryOrders, setDeliveryOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user_id = await AsyncStorage.getItem('user_id');
      setLoading(true);
      try {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          
          body: JSON.stringify({
            runner_id: user_id
          })
        };

        const pickupResponse = await fetch("https://newlaundryapp.demodev.shop/api/fetchPickupOrders", requestOptions);
        const deliveryResponse = await fetch("https://newlaundryapp.demodev.shop/api/fetchDeliveryOrders", requestOptions);

        const pickupResult = await pickupResponse.json();
        const deliveryResult = await deliveryResponse.json();

        setPickupOrders(pickupResult.pickupOrders);
        setDeliveryOrders(deliveryResult.deliveryOrders);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', { orderId: item.order_id})}>
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
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', { orderId: item.order_id })}>
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

const OrderItem = ({ order }) => (
  <View style={styles.orderItem}>
    <Text style={styles.title}>{order.name}</Text>
    <Text style={styles.orderId}>Order id: {order.Customer_OrderNumber}</Text>
     
    <View style={styles.textContainer}>
    <Text style={styles.date}>{new Date(order.order_date).toDateString()}</Text>
    <Text style={styles.time}>{order.timeslot}</Text>
    </View>

  </View>
);

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
    gap:5,
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  textContainer: {

    flexDirection:'row',
    justifyContent:'space-between',
  },
  title:{
    fontWeight: 'bold',
    fontSize: 16,

  },

  orderId: {
    color: '#A0A0A0',
  },
  address: {
    marginTop:10
  },
  date: {
    color: '#585CE4',
   
    fontWeight: 'bold',
  },
  time: {
    color: '#585CE4',
    
    fontWeight: 'bold',
  },
});

export default Orders;
