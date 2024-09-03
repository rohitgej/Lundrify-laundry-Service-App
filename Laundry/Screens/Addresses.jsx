import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Address from './Address';
import ManualAdd from './ManualAdd';
import DOMAIN_NAME from '../config/config';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18next from '../services/i18next';

const Addresses = ({ navigation }) => {
  const{t}=useTranslation();

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const language = await AsyncStorage.getItem('selectedLanguage');
        if (language) {
          await i18next.changeLanguage(language);
          setSelectedLanguage(language);
        }
      } catch (error) {
        console.error('Error getting language: ', error);
      }
    };
    getLanguage();
  }, []);


  const [savedAddresses, setSavedAddresses] = useState([]);

  const fetchAddresses = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    if (userId) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({ "_id": userId });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      try {
        const response = await fetch(`${DOMAIN_NAME}api/viewuser`, requestOptions);
        const result = await response.json();
        if (result && result.user && result.user.addresses) {
          setSavedAddresses(result.user.addresses);
          console.log(result.user.addresses);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
   fetchAddresses();
    }, [])
  );
  const deleteAddress = async (addressId) => {
    const userId = await AsyncStorage.getItem('user_id');
    if (userId) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "userId": userId,
        "addressId": addressId
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      try {
        const response = await fetch(`${DOMAIN_NAME}api/deleteaddress`, requestOptions);
        const result = await response.text();
        console.log(result);
        // After deletion, fetch the addresses again to update the state
        fetchAddresses();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDelete = (addressId) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteAddress(addressId) }
      ]
    );
  };

  const renderAddressItem = ({ item }) => (
    <View style={styles.locationItem}>
      <Ionicons name="location" size={24} color="black" />
      <Text style={styles.locationText}>{item.house_no}, {item.block_no}, {item.address}</Text>
      <TouchableOpacity onPress={() => handleDelete(item._id)}>
        <Ionicons name="trash-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate(Address)}>
        <View style={styles.header}>
          <Ionicons name="location-outline" size={24} color="#585CE4" />
          <Text style={styles.headerText}>{t("Current Location")}</Text>
          <Text style={styles.subText}>{t("Using GPS")}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.savedLocation}>
        <Text style={styles.savedLocationText}>{t("Saved Location")}</Text>
        <FlatList
          data={savedAddresses}
          renderItem={renderAddressItem}
          keyExtractor={item => item._id}
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton} onPress={() => navigation.navigate(ManualAdd)}
      >
        <Text style={styles.saveButtonText}>
          Add Address Manually
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#EEEEFF',
  },
  header: {
    marginBottom: 32,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#585CE4',
  },
  subText: {

    color: '#585CE4',
  },
  savedLocation: {
    marginTop: 16,
  },
  savedLocationText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    gap:20,
    marginTop: 20,
  },
  locationText: {
    width: '80%',

    flexShrink: 1,
    color: 'gray',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    backgroundColor: '#585CE4',
    paddingHorizontal: 80,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default Addresses;
