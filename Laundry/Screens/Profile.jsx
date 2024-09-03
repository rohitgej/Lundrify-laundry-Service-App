import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import DOMAIN_NAME from '../config/config';

const Profile = ({ navigation }) => {
  const{t}=useTranslation();
  const [profileData, setProfileData] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state:"",
    pincode:"",
    profileImage: "https://via.placeholder.com/100"
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfileData = async () => {
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

    fetch(`${DOMAIN_NAME}api/viewuser`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.user) {
          setProfileData({
            name: result.user.name || "Full Name",
            location: result.user.location || "Location",
            email: result.user.email_id || "email",
            phone: result.user.mobile_no || "mobile number",
            profileImage: result.user.profileImage || "https://via.placeholder.com/100"
          });
        } else {
          console.error("Failed to fetch profile data");
        }
      })
      .catch(error => console.error("Error:", error));
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
  );

  const handleSave = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "_id": user_id,
      "address": profileData.address,
      "city": profileData.city,
      "email_id": profileData.email,
      "name": profileData.name,
      "state": profileData.state,
      "postcode": profileData.pincode
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${DOMAIN_NAME}api/updateuser`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setIsEditing(false);
      })
      .catch((error) => console.error(error));
  };

  const handleEditProfilePicture = () => {
    const options = {
      mediaType: 'photo',
    };
    
    ImagePicker.launchImageLibrary(options, response => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        uploadProfilePicture(selectedImage);
      }
    });
  };

  const uploadProfilePicture = async (image) => {
    const user_id = await AsyncStorage.getItem('user_id');
    const formData = new FormData();

    formData.append("user_id", user_id);
    formData.append("profileImage", {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    });

    const requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow"
    };

    fetch(`${DOMAIN_NAME}api/uploadProfilePic`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if (result.user) {
          setProfileData({
            ...profileData,
            profileImage: result.user.profileImage || "https://via.placeholder.com/100"
          });
        }
      })
      .catch(error => console.error("Error:", error));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: profileData.profileImage || "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg" }} 
            style={styles.profileImage} 
          />
          {isEditing && (
            <TouchableOpacity style={styles.editIcon} onPress={handleEditProfilePicture}>
              <Icon name="edit" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.nameContainer}>
          <TextInput 
            style={[styles.profileName, isEditing && styles.editableText]} 
            value={profileData.name} 
            editable={isEditing} 
            onChangeText={(text) => setProfileData({ ...profileData, name: text })} 
          />
       
        </View>
      </View>

      <View style={styles.profileDetails}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{t("Email")}</Text>
          <TextInput 
            style={styles.input} 
            value={profileData.email} 
            editable={isEditing} 
            
            onChangeText={(text) => setProfileData({ ...profileData, email: text })} 
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{t("Phone Number")}</Text>
          <TextInput 
            style={styles.input} 
            value={profileData.phone} 
            editable={isEditing} 
            onChangeText={(text) => setProfileData({ ...profileData, phone: text })} 
          />
        </View>

        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <Text style={styles.editButtonText}>{isEditing ? t("Save") : t("Edit")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#EEEEFF',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    width: '95%',
    marginBottom: 10,
    backgroundColor: '#585CE4',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  editableText: {
    borderBottomWidth: 1,
    borderColor: '#545454',
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#585CE4',
    borderRadius: 15,
    padding: 5,
  },
  profileDetails: {
    width: '95%',
    backgroundColor: '#585CE4',
    borderRadius: 10,
    padding: 10,
    paddingTop: 30,
    gap: 10
  },
  inputContainer: {
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  inputLabel: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 0,
    borderColor: '#ddd',
  },
  editButton: {
    width: '100%',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#EEEEFF',
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  editButtonText: {
    color: '#545454',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
