import React, { useEffect, useState,useCallback  } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNRestart from 'react-native-restart'; 
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import DOMAIN_NAME from '../config/config';


const Account = ({ navigation }) => {
  const{t}=useTranslation();
  const [profileData, setProfileData] = useState({
    name: "",
    location: "",
    imageUrl: "https://via.placeholder.com/100"
  });

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


  const menuItems = [
    { icon: 'home', label: t('Home'), screen: 'HomeScreen' },
    { icon: '3p', label: t("Profile"), screen: 'Profile' },
    { icon: 'pin-drop', label: t("Addresses"), screen: 'Addresses' },
    { icon: 'notifications', label: t("Notification"), screen: 'Notification' },
    { icon: 'shopping-cart', label: t("My Order"), screen: 'Order' },
    { icon: 'support', label: t("Support"), screen: 'Support' },
  ];

  const logout = async () => {
    try {
      // Confirm logout
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            onPress: async () => {
              // Clear user data
              await AsyncStorage.setItem('isLoggedIn', 'false');
              await AsyncStorage.removeItem('user_id'); // Remove other user data if needed
             
              RNRestart.Restart(); // Restart the app
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error clearing user data', error);
    }
  };


    const fetchProfileData = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          "_id": user_id
         
          
        });

        
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };

        const response = await fetch(`http://20.20.20.115:3000/api/viewuser`, requestOptions);
        const result = await response.json();

        if (result.user) {
          console.log(result);
          console.log(user_id);
          setProfileData({
            name: result.user.name || "Full Name",
            number: result.user.mobile_no || 'loading...',
            imageUrl: result.user.profileImage || "https://via.placeholder.com/100"
          });
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

  
    useFocusEffect(
      useCallback(() => {
        fetchProfileData();
      }, [])
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: profileData.imageUrl ||'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' }} 
          style={styles.profileImage} 
        />
        <View style={styles.editSection}>
          <Text style={styles.profileName}>{profileData.name}</Text>
        </View>
        <View style={styles.editSection}>
          <Text style={styles.profilenumber}>{profileData.number}</Text>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <View style={styles.menuItems}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem} 
              onPress={() => navigation.navigate(item.screen)}
            >
              <Icon name={item.icon} size={24} color="#555" />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>{t("Logout")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#EEEEFF',
    alignItems: 'center',
    paddingVertical: 10,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#585CE4',
    width: '95%',
    paddingVertical: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  editSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileName: {
    marginRight: 2,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profilenumber: {
    fontSize: 16,
    color: '#D9D9D9',
  },
  menuContainer: {
    width: '94%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItems: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEFF',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 20,
    color: '#555',
  },
  logoutButton:{
    backgroundColor: '#585CE4',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  logoutText:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center', 
  }
});

export default Account;
