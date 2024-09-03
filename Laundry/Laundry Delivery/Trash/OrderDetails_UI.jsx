import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';

const orderDetails = {
  id: 'MK2563',
  title: 'Full name',
  date: '05 May, 2021',
  phone: '7878745447',
  paymentStatus: 'paid',
  address: '123 Elm Street, Springfield, IL',
  items: [
    { id: '1', description: '3 X Jeans', price: '$24' },
    { id: '2', description: '2 X Shirt', price: '$15' },
    { id: '3', description: '2 X Shirt', price: '$15' },
    { id: '4', description: '2 X Shirt', price: '$15' },
  ],
  total: '$98',
};

const OrderDetails = ({navigation}) => {
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.orderCard}>
        <Text style={styles.orderId}>Order id: {orderDetails.id}</Text>
        <Text style={styles.title}>{orderDetails.title}</Text>
        <Text style={styles.date}>{orderDetails.date}</Text>
        <Text style={styles.date}>{orderDetails.phone}</Text>
        <Text style={styles.date}>{orderDetails.paymentStatus}</Text>
        <Text style={styles.date}>{orderDetails.address}</Text>
      </View>

      <FlatList
        data={orderDetails.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <CheckBox
              value={selectedItems[item.id] || false}
              onValueChange={() => toggleItemSelection(item.id)}
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

      <TouchableOpacity style={styles.pickupButton} onPress={() => navigation.navigate('Map')}>
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
});

export default OrderDetails;
