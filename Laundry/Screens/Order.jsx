import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DOMAIN_NAME from '../config/config';

const Order = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {month: 'short', year: 'numeric', day: 'numeric'};
    return date.toLocaleDateString('en-US', options);
  };

  
    const fetchOrders = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          const myHeaders = new Headers();
          myHeaders.append('Content-Type', 'application/json');

          const raw = JSON.stringify({user_id: userId});

          const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
          };

          const response = await fetch(
           `${DOMAIN_NAME}api/allorder`,
            requestOptions,
          );
          const result = await response.json();
          if (result.orders) {
            // Sort orders by order_date in descending order
            const sortedOrders = result.orders.sort(
              (a, b) => new Date(b.order_date) - new Date(a.order_date)
            );
            setOrders(sortedOrders);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchItems = async () => {
      try {
        const requestOptions = {
          method: 'POST',
          redirect: 'follow',
        };

        const response = await fetch(
          `${DOMAIN_NAME}api/viewitem`,
          requestOptions,
        );
        const result = await response.json();
        if (result.item) {
          setItems(result.item);
        }
      } catch (error) {
        console.error(error);
      }
    };
    useFocusEffect(
      useCallback(() => {
      fetchOrders();
      fetchItems();
        return () => {
          // Optional cleanup
        };
      }, [])
    );
  


  const getStatusStyle = (status) => {
    switch (status) {
      case '1':
        return styles.ordered; // Assuming '1' is for 'ordered'
      case '2':
        return styles.accepted; // Assuming '2' is for 'accepted'
        case '3':
        return styles.readyForPickup;
      case '4':
        return styles.pickedUp;
      case '5':
        return styles.inProgress;
      case '6':
        return styles.outForDelivery;
      case '7':
        return styles.completed;
      case '8':
        return styles.cancelled;
      default:
        return orderStatusStyles.default || { backgroundColor: '#D3D3D3' }; // Default style if none match
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case '1':
        return ("Ordered");
      case '2':
        return ("Order Accepted");
      case '3':
        return ("Ready For Pickup");
      case '4':
        return ("Picked Up");
      case '5':
        return ("In Progress");
      case '6':
        return ("Out of Delivery");
      case '7':
        return ("Delivered");
      case '8':
        return("Cencelled")
      default:
        return styles.default;
    }
  };

  const getItemDetails = (itemId) => {
    return items.find((item) => item._id === itemId);
  };

  const OrderItem = ({order}) => (
   
    <View style={styles.orderItem}>
      {order.items.map((itemId) => {
        const itemDetails = getItemDetails(itemId);
        return (
          <View key={itemId} style={styles.itemContainer}>
            <Image
              source={{
                uri: itemDetails
                  ? itemDetails.item_image
                  : 'https://via.placeholder.com/50',
              }}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.orderId}>Order id: {order.customer_order_number}</Text>
              <View style={styles.itemsSec}>
                <Text style={styles.title}>
                  {itemDetails ? itemDetails.item_name : 'Loading...'}
                </Text>
                {order.number_of_items > 0 ? (
                  <Text style={styles.itemNum}>
                    {' '}
                    ({order.number_of_items})
                  </Text>
                ) : null}
              </View>
              <Text style={styles.date}>{formatDate(order.order_date)}</Text>
              
            </View>
            <View
                style={[
                  styles.statusContainer,
                  getStatusStyle(String(order.delivery_status)),
                ]}
              >
                <Text style={styles.statusText}>{getStatusText (String(order.delivery_status))}</Text>
              </View>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.maincon}>
    <ScrollView>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_id}
        renderItem={({item}) => (
         
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Order Details', {orderId: item.order_id})
            }
          >
           
            <OrderItem order={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.container}
      />
    </ScrollView>
    </View>
  );

};

const styles = StyleSheet.create({
  maincon:{
    height:'100%',
    backgroundColor:'#EEEEFF'
  },
  container: {
    padding: 16,
    backgroundColor: '#EEEEFF',
    height: '100%',
  },
  orderItem: {
  
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  orderId: {
    color: '#A0A0A0',
  },
  itemsSec: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1d1e1f',
  },
  itemNum: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1d1e1f',
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
  ordered: {
    backgroundColor: '#FFA500', // Example color for 'ordered'
  },
  accepted: {
    backgroundColor: '#00BFFF', // Example color for 'accepted'
  },
  readyForPickup: {
    backgroundColor: '#8E44AD', // Color for 'ready for pickup'
  },
  pickedUp: {
    backgroundColor: '#FF69B4', // Example color for 'picked up'
  },
  inProgress: {
    backgroundColor: '#585CE4', // Color for 'in progress'
  },
  outForDelivery: {
    backgroundColor: '#FFD700', // Example color for 'out of delivery'
  },
  completed: {
    backgroundColor: '#008000', // Example color for 'completed'
  },
  cancelled: {
    backgroundColor: '#FF0000', // Example color for 'cancelled'
  },
});

export default Order;
