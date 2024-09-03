import React, { useEffect, useState, useLayoutEffect,useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import i18next, { languageResources } from '../services/i18next';
import { useTranslation } from 'react-i18next';
import languagesList from '../services/languagesList.json';
import DOMAIN_NAME from '../config/config';

const Homepage = () => {
  const{t}=useTranslation();
  const [currentDate, setCurrentDate] = useState('');
  const [services, setServices] = useState([]);
  const [profileImage, setProfileImage] = useState('');
  const [cartQtn, setCartQtn]=useState(0)
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const date = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  useEffect(() => {
  const SelectedLng= async()=>{
    try {
      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (selectedLanguage) {
        i18next.changeLanguage(selectedLanguage);
        setVisible(false);
      } else {
        await i18next.changeLanguage('en'); // Set default language to English
        await AsyncStorage.setItem('selectedLanguage', 'en');
      }
      setVisible(false);
    } catch (error) {
      console.error('Error retrieving selected language: ', error);
    }
  }
  SelectedLng();
}, []);

  const changeLng = async (lng) => {
    try {
      await i18next.changeLanguage(lng);
      await AsyncStorage.setItem('selectedLanguage', lng );
      setVisible(false);
  
    } catch (error) {
      console.error('Error changing language: ', error);
    }
  };

    // Fetch the services data from the API
    const fetchServices = async () => {
      try {
        const response = await fetch(`${DOMAIN_NAME}api/viewlaundrytype`, {
          method: 'GET',
          redirect: 'follow',
        });
        const result = await response.json();
        if (result.laundrytypes) {
          setServices(
            result.laundrytypes.map((type) => ({
              id: type._id,
              name: type.Laundrytype_name,
              image: { uri: type.Laundrytype_image },
            }))
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch the profile data from the API
    const fetchProfile = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const user_id = await AsyncStorage.getItem('user_id');
      const raw = JSON.stringify({ "_id": user_id });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      try {
        const response = await fetch(`${DOMAIN_NAME}api/viewuser`, requestOptions);
        const result = await response.json();
        if (result.user && result.user.profileImage) {
          setProfileImage(result.user.profileImage);
        }
      } catch (error) {
        console.error(error);
      }
    };
    useFocusEffect(
      useCallback(() => {
      
        fetchServices();
        fetchProfile();
      }, [])
    );
 

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (<View style={styles.rightNav}>
        <TouchableOpacity style={styles.languageIcon} onPress={() => setVisible(true)}>
        <Icon name="translate" size={26} />
      </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Image
            source={{ uri: profileImage|| 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'|| profileImage  }} // Fallback to a placeholder image
            style={styles.profilePicture}
          />
        </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, profileImage]);

  const renderService = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceButton}
      onPress={() => navigation.navigate('Categories', { selectedLaundryType: item.id })}
    >
      <View style={styles.homeHeaderCategoriesImage}>
        <Image source={item.image} style={styles.serviceImage} />
      </View>
      <Text style={styles.serviceText}>{item.name}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.homeMainContainer}>
      <ScrollView>
      <Modal visible={visible} onRequestClose={() => setVisible(false)}>
        <View style={styles.languagesList}>
          <FlatList
            data={Object.keys(languageResources)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.languageButton}
                onPress={() => changeLng(item)}>
                <Text style={styles.lngName}>
                  {languagesList[item].nativeName}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      <View style={styles.homeContainer}>
      <View style={styles.homesubContainer}>
        <Text style={styles.dateText}>{t('Today')}, {currentDate}</Text>
        <Text style={styles.homeTitleText}>{t('What_service_do_you_need_today')}</Text>
        <View style={styles.bannerSec}>
        <Image source={{uri:"https://www.appindia.co.in/blog/wp-content/uploads/2022/03/How-To-Develop-An-On-Demand-Laundry-Services-App.png"}} style={styles.banneImage} />
          </View>
        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.flatListContentContainer}
        />
      </View>
    </View>
    
      </ScrollView>
    
    </View>
  );
};

const styles = StyleSheet.create({
  homeMainContainer: {
    backgroundColor: '#fff',
    height:'100%',
    flex: 1,
  },
  homeContainer: {
    marginTop: 20,
    height:800,
    backgroundColor: '#EEEEFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  homesubContainer: {
    paddingHorizontal: 16,
  },
  homeHeaderCategoriesImage: {
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginTop: 40,
    color: '#807F7F',
  },
  column: {
    justifyContent: 'space-between',
  },
  homeTitleText: {
    width: '60%',
    marginTop: 8,
    marginBottom: 30,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B3B3B',
  },
  bannerSec:{
    width:'100%',
    height:150,
    backgroundColor:'#F0F1F4',
    marginBottom:10,
    borderRadius:10,
    overflow:'hidden',
    justifyContent:'center',
    alignItems:'center'
  },
  banneImage:{
width:'90%',
height:'100%',
borderRadius:10,
  },
  serviceButton: {
    flex: 1,
    margin: 10,
    padding: 20,
    backgroundColor: '#8E91EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  serviceText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  flatListContentContainer: {
    height: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingBottom: 20,
    backgroundColor: '#EEEEFF',
  },
  profilePicture: {
    width: 35,
    height: 35,
    borderRadius: 30,
    marginRight: 10,
  },
  cartButton2: {
    width: 60,
    height:60,
    padding: 15,
    backgroundColor: '#585CE4',
    borderRadius: 50,
    position: 'absolute',
    bottom: 20,
    left:20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation:2
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  cartButtonText2: {
    color: '#585CE4',
    fontSize: 11,
    fontWeight:'bold'
  },
  cartButtonTextSec:{
    width:20,
    height: 20,
    backgroundColor:'#fff',
    borderWidth:2,
    borderColor:'#585CE4',
    borderRadius: 20,
    alignItems: 'center',
    position: 'absolute',
    zIndex:2,
    top:7,
    right:7
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageIcon: {
    position: 'absolute',
    right: 50,
  },
  languagesList: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  languageButton: {
    justifyContent:'center',
    alignItems:'center',
    padding: 20,
    textAlign:'center',
  
  },
  lngName: {
    fontSize: 18,
  },
});

export default Homepage;
