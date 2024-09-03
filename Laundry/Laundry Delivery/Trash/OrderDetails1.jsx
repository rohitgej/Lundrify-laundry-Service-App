import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import { watcher } from '../../metro.config';

const OrderDetails = ({ route, navigation }) => {
  const { orderId } = route.params;

  const [orderDetails, setOrderDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [coordinates, setCoordinates] = useState(null);

  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "order_id": orderId
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      try {
        const response = await fetch("https://newlaundryapp.demodev.shop/api/getcheckout", requestOptions);
        const result = await response.json();
        setOrderDetails(result.order);

        // Fetch user details
        const userHeaders = new Headers();
        userHeaders.append("Content-Type", "application/json");

        const userRaw = JSON.stringify({
          "_id": result.order.user_id
        });

        const userRequestOptions = {
          method: "POST",
          headers: userHeaders,
          body: userRaw,
          redirect: "follow"
        };

        const userResponse = await fetch("https://newlaundryapp.demodev.shop/api/viewuser", userRequestOptions);
        const userResult = await userResponse.json();
        setUserDetails(userResult.user);

        // Extract and store the coordinates
        const addressDetails = userResult.user.addresses.find(address => address._id === result.order.address);
        if (addressDetails) {
          console.warn(addressDetails.coordinates);
          setCoordinates(addressDetails.coordinates);
          
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId]
    }));
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        setSelectedImages(prevImages => [...prevImages, response.assets[0].uri]);
      }
    });
  };

  const deleteImage = (imageUri) => {
    setSelectedImages(prevImages => prevImages.filter(uri => uri !== imageUri));
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Extract address details using address ID from orderDetails
  const addressDetails = userDetails.addresses.find(address => address._id === orderDetails.address);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.orderCard}>
        <Text style={styles.orderId}>Order id: {orderDetails.order_id}</Text>
        <Text style={styles.title}>{userDetails.name}</Text>
        <Text style={styles.date}>Order Date: {new Date(orderDetails.order_date).toLocaleDateString()}</Text>
        <Text style={styles.phone}>Phone: {userDetails.mobile_no}</Text>
        <Text style={styles.paymentStatus}>Payment Status: {orderDetails.payment}</Text>
        {addressDetails && (
          <>
            <Text style={styles.address}>Address: {addressDetails.address}</Text>
            <Text style={styles.coordinates}>
              Coordinates: {addressDetails.coordinates.latitude}, {addressDetails.coordinates.longitude}
            </Text>
          </>
        )}
      </View>

      <FlatList
        data={orderDetails.items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemDescription}>{item.quantity} X Item ID: {item.item_id}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
            <CheckBox
              value={selectedItems[item._id] || false}
              onValueChange={() => toggleItemSelection(item._id)}
            />
          </View>
        )}
        contentContainerStyle={styles.itemList}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={openCamera}>
        <Text style={styles.uploadButtonText}>Upload Image</Text>
      </TouchableOpacity>

      <View style={styles.imagesContainer}>
        {selectedImages.map((imageUri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(imageUri)}>
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.pickupButton} onPress={() => navigation.navigate('Map', { coordinates })}>
        <Text style={styles.uploadButtonText}>Pickup</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#EEEEFF',
    paddingHorizontal: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
    marginBottom: 16,
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
  phone: {
    color: '#A0A0A0',
  },
  paymentStatus: {
    color: '#A0A0A0',
  },
  address: {
    color: '#A0A0A0',
  },
  coordinates: {
    color: '#A0A0A0',
  },
  itemList: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemDescription: {
    fontSize: 16,
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
  },
  uploadButton: {
    marginTop: 10,
    marginLeft: 50,
    width: '70%',
    backgroundColor: '#585CE4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickupButton: {
    marginTop: 20,
    backgroundColor: '#585CE4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    minHeight: 200,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderDetails;
