import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const services = [
  {id: '1', name: 'Wash + Iron', image: require('./Assets/dryclean.png')},
  {id: '2', name: 'Iron', image: require('./Assets/iron.png')},
  {id: '3', name: 'Dry Clean', image: require('./Assets/washandironlogo.png')},
  {id: '4', name: 'Wash', image: require('./Assets/dryclean.png')},
  {id: '5', name: 'Wash', image: require('./Assets/dryclean.png')},
];

const laundries = [
  {
    id: '1',
    name: 'Dark Laundry',
    address: '14 Jonson road',
    rating: 4.5,
    isOpen: true,
    image: require('./pic1.jpg'), // Replace with your image path
  },
  {
    id: '2',
    name: 'Laundry Club',
    address: '16 Jonson road',
    rating: 4.5,
    isOpen: false,
    image: require('./pic1.jpg'), // Replace with your image path
  },
  {
    id: '3',
    name: 'Clean Zone',
    address: '18 Jonson road',
    rating: 4.5,
    isOpen: true,
    image: require('./pic1.jpg'), // Replace with your image path
  },
  {
    id: '4',
    name: 'Clean Zone',
    address: '18 Jonson road',
    rating: 4.5,
    isOpen: true,
    image: require('./pic1.jpg'), // Replace with your image path
  },
  {
    id: '5',
    name: 'Clean Zone',
    address: '18 Jonson road',
    rating: 4.5,
    isOpen: true,
    image: require('./pic1.jpg'), // Replace with your image path
  },
  {
    id: '6',
    name: 'Clean Zone',
    address: '18 Jonson road',
    rating: 4.5,
    isOpen: true,
    image: require('./pic1.jpg'), // Replace with your image path
  },
];

const Homepage = () => {
  const renderService = ({item}) => (
    <TouchableOpacity style={styles.serviceButton}>
      <View style={styles.homeHeaderCategoriesImage}>
        <Image source={item.image} style={styles.serviceImage} />
      </View>
      <Text style={styles.serviceText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderLaundry = ({item}) => (
    <View style={styles.laundryItem}>
      <Image source={item.image} style={styles.laundryImage} />
      <View style={styles.laundryInfo}>
        <Text style={styles.laundryName}>{item.name}</Text>
        <Text style={styles.laundryAddress}>{item.address}</Text>
        <Text style={styles.laundryRating}>Rating: {item.rating}</Text>
      </View>
      <TouchableOpacity style={styles.laundryStatus}>
        <Text style={styles.laundryStatusText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.homeMainContainer}>
      <View style={styles.header}>
        <Icon name="menu" size={24} color="#000" />
        <View style={styles.headerIcons}>
          <Icon name="search" size={24} color="#000" style={styles.headerIcon} />
          <Icon name="notifications" size={24} color="#000" style={styles.headerIcon} />
          <Icon name="person-circle" size={24} color="#000" />
        </View>
      </View>

      <View style={styles.homeContainer}>
        <View style={styles.homesubContainer}>
          <Text style={styles.dateText}>Today, 20 Jun, 2021</Text>
          <Text style={styles.homeTitleText}>What services do you need today</Text>
          <FlatList
            data={services}
            renderItem={renderService}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.serviceList}
          />
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <View style={styles.homePopularSec}>
          <ScrollView showsVerticalScrollIndicator={false}>
            
            {laundries.map((item) => (
              <View key={item.id} style={styles.laundryItem}>
                <Image source={item.image} style={styles.laundryImage} />
                <View style={styles.laundryInfo}>
                  <Text style={styles.laundryName}>{item.name}</Text>
                  <Text style={styles.laundryAddress}>{item.address}</Text>
                  <Text style={styles.laundryRating}>Rating: {item.rating}</Text>
                </View>
                <TouchableOpacity style={styles.laundryStatus}>
                  <Text style={styles.laundryStatusText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeMainContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 0,
  },
  homeContainer: {
    marginTop: 20,
    backgroundColor: '#EEEEFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    color: 'black',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginHorizontal: 8,
  },
  dateText: {
    marginTop: 50,
    color: '#807F7F',
  },
  homeTitleText: {
    width: '60%',
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B3B3B',
  },
  serviceList: {
    marginTop: 20,
    marginVertical: 20,
  },
  serviceButton: {
    alignItems: 'center',
    marginRight: 10,
    padding: 10,
    borderRadius: 10,
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
    color: '#3B3B3B',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3B3B3B',
    marginBottom: 10,
  },
  homePopularSec:{
    width: '100%',
    height: 500,
  },
  laundryItem: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  laundryImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  linearGradient: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  laundryInfo: {
    flex: 1,
    marginLeft: 10,
  
  },
  laundryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B3B3B',
   
  },
  laundryAddress: {
    fontSize: 14,
    color: '#888',
  },
  laundryRating: {
    fontSize: 12,
    color: '#888',
  },
  laundryStatus: {
    backgroundColor: '#585CE4',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height:50,
    borderRadius: 10,
  },
  laundryStatusText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Homepage;
