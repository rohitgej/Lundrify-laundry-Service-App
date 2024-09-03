import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';

const services = [
  { id: '1', name: 'Wash + Iron', image: require('./pic1.jpg') },
  { id: '2', name: 'Iron', image: require('./pic1.jpg') },
  { id: '3', name: 'Dry Clean', image: require('./pic1.jpg') },
  { id: '4', name: 'Wash', image: require('./pic1.jpg') },
  { id: '5', name: 'Wash', image: require('./pic1.jpg') },
  { id: '6', name: 'Dry Clean', image: require('./pic1.jpg') },
  { id: '7', name: 'Dry Clean', image: require('./pic1.jpg') },
  { id: '8', name: 'Dry Clean', image: require('./pic1.jpg') },
  { id: '9', name: 'Dry Clean', image: require('./pic1.jpg') },
];

const Homepage = ({navigation}) => {
  const [currentDate, setCurrentDate] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const date = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
     
      headerRight: () => (
     <Image 
          source={{ uri: 'https://via.placeholder.com/40' }} // Replace with the URL or require path of your profile picture
          style={styles.profilePicture}
        />
      ),
    });
  }, [navigation]);

  const renderService = ({ item }) => (
    <TouchableOpacity style={styles.serviceButton} onPress={() => navigation.navigate('Categories')}>
      <View style={styles.homeHeaderCategoriesImage}>
        <Image source={item.image} style={styles.serviceImage} />
      </View>
      <Text style={styles.serviceText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={styles.homeContainer}>
      <View style={styles.homesubContainer}>
        <Text style={styles.dateText}>Today, {currentDate}</Text>
        <Text style={styles.homeTitleText}>What services do you need today</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.homeMainContainer}>
      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.column}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.flatListContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  homeMainContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },
  homeContainer: {
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
    marginTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingBottom: 20,
    backgroundColor: '#EEEEFF',
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default Homepage;
