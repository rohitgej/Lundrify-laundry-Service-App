import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTranslation } from 'react-i18next';

import DOMAIN_NAME from '../config/config';

const Categories = ({ route, navigation }) => {
  const{t}=useTranslation();
  const { selectedLaundryType: initialSelectedLaundryType } = route.params || {};
  const [categories, setCategories] = useState([]);
  const [laundryTypes, setLaundryTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLaundryType, setSelectedLaundryType] = useState(initialSelectedLaundryType);
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [cartQtn, setCartQtn]=useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState('');


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


  const handleCartButton = async () => {

      const userId = await AsyncStorage.getItem('user_id');
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        user_id: userId,
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

     fetch(
        `${DOMAIN_NAME}api/getCart`,
        requestOptions,
      )

      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        
        // Calculate total quantity
        const totalQuantity = result.items.reduce((sum, item) => sum + item.quantity, 0);
       
        setCartQtn(totalQuantity)
      })
      .catch((error) => console.error(error));

    
  };
  

  useEffect(() => {
    handleCartButton();
    fetchCategories();
    fetchLaundryTypes();
    fetchItems();
    getUserData();
  }, []);

  useEffect(() => {
    if (initialSelectedLaundryType) {
      setSelectedLaundryType(initialSelectedLaundryType);
    }
  }, [initialSelectedLaundryType]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${DOMAIN_NAME}api/viewcategory`);
      const result = await response.json();
      setCategories(result.categories);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserData = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    const token = Math.floor(1000000 + Math.random() * 9000000).toString(); // Generates a random 7-digit number
    await AsyncStorage.setItem('token', token); // Save the new token to AsyncStorage
  
    setUserId(user_id);
    setToken(token);
  };
  

  const fetchLaundryTypes = async () => {
    try {
      const response = await fetch(`${DOMAIN_NAME}api/viewlaundrytype`);
      const result = await response.json();
      setLaundryTypes(result.laundrytypes);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch(`${DOMAIN_NAME}api/viewitem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include any other headers you need, such as authentication tokens
        },
        body: JSON.stringify({
          // Add any necessary data you need to send with the POST request
        }),
      });
      
      const result = await response.json();
      setItems(result.item);
    } catch (error) {
      console.error(error);
    }
  };
  
  const incrementItem = (itemId) => {
    if (!selectedLaundryType) return;

    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: {
        ...prevCart[itemId],
        [selectedLaundryType]: (prevCart[itemId]?.[selectedLaundryType] || 0) + 1,
      },
    }));
  };

  const decrementItem = (itemId) => {
    if (!selectedLaundryType) return;

    setCart((prevCart) => {
      const updatedCount = (prevCart[itemId]?.[selectedLaundryType] || 0) - 1;
      if (updatedCount <= 0) {
        const { [selectedLaundryType]: _, ...restTypes } = prevCart[itemId] || {};
        if (Object.keys(restTypes).length === 0) {
          const { [itemId]: __, ...restCart } = prevCart;
          return restCart;
        }
        return {
          ...prevCart,
          [itemId]: restTypes,
        };
      }
      return {
        ...prevCart,
        [itemId]: {
          ...prevCart[itemId],
          [selectedLaundryType]: updatedCount,
        },
      };
    });
  };

  const renderCategoryTabs = () => (
    <View style={styles.categoryFilterContainer}>
      {categories.map((category) => (
        <View style={styles.catfilterSec} key={category._id}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === category._id && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category._id)}
          />
          <Text style={[styles.categoryText, selectedCategory === category._id && styles.selectedCategoryButtonText]}>
            {category.category_name}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderLaundryTypeTabs = () => (
    <FlatList
      data={laundryTypes}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.CategoriesTitle,
            selectedLaundryType === item._id && styles.selectedMainCategoryButton,
          ]}
          onPress={() => setSelectedLaundryType(item._id)}
        >
          <Text
            style={[
              styles.CategoriesList,
              selectedLaundryType === item._id && styles.selectedMainCategoryButtonText,
            ]}
          >
            {item.Laundrytype_name}
          </Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item._id}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.catagorieslistSec}
    />
  );

  const filteredItems = items.filter((item) => {
    const isCategoryMatch = !selectedCategory || item.category_id === selectedCategory;
    const isLaundryTypeMatch = !selectedLaundryType || item.id_laundrytype.some((lt) => lt.id === selectedLaundryType);
    return isCategoryMatch && isLaundryTypeMatch;
  });

  const renderItem = ({ item }) => (
    <View style={styles.laundryItem}>
      <Image source={{ uri: item.item_image }} style={styles.laundryImage} />
      <View style={styles.laundryInfo}>
        <Text style={styles.laundryName}>{item.item_name}</Text>
        {item.id_laundrytype.map((type) => (
          type.id === selectedLaundryType && (
            <Text key={type._id} style={styles.laundryPrice}>
              {laundryTypes.find((lt) => lt._id === type.id)?.Laundrytype_name}: ${type.price.toFixed(2)}
            </Text>
          )
        ))}
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decrementItem(item._id)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{cart[item._id]?.[selectedLaundryType] || 0}</Text>
        <TouchableOpacity onPress={() => incrementItem(item._id)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getTotalItems = () => {
    let totalItems = 0;
    Object.values(cart).forEach((item) => {
      Object.values(item).forEach((quantity) => {
        totalItems += quantity;
      });
    });
    return totalItems;
  };

  const getCartDetails = () => {
    let totalAmount = 0;
    let itemNames = [];
    items.forEach((item) => {
      if (cart[item._id]) {
        item.id_laundrytype.forEach((type) => {
          if (cart[item._id][type.id]) {
            totalAmount += type.price * cart[item._id][type.id];
            if (!itemNames.includes(item.item_name)) {
              itemNames.push(item.item_name);
            }
          }
        });
      }
    });
    return { totalAmount, itemNames };
  };

  const { totalAmount, itemNames } = getCartDetails();

  const handleCartButtonClick = async () => {
    const cartItems = [];
    Object.keys(cart).forEach((itemId) => {
      Object.keys(cart[itemId]).forEach((laundryTypeId) => {
        cartItems.push({
          item_id: itemId,
          category_id: items.find((item) => item._id === itemId).category_id,
          id_laundrytype: laundryTypeId,
          quantity: cart[itemId][laundryTypeId],
        });
      });
    });
  
    const requestBody = {
      token: parseInt(token),
      user_id: userId,
      items: cartItems
    };
  
    console.log(requestBody);
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify(requestBody);
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(`${DOMAIN_NAME}api/addtocart`, requestOptions);
      const result = await response.text();
      console.log(result);
      navigation.navigate('Cart');
    } catch (error) {
      console.error(error);
    }
  
    handleCartButton();
  };

  
  useFocusEffect(
    useCallback(() => {
      handleCartButton();
      fetchCategories();
      fetchLaundryTypes();
      fetchItems();
      getUserData();
      return () => {
        // Optional cleanup
      };
    }, [])
  );

  

  return (
    <View style={styles.catMainCategory}>
      <View style={styles.catHeaderSec}>
        <View style={styles.catCoverImage}>
          <Image
            source={{
              uri: 'https://www.shutterstock.com/image-photo/basket-dirty-clothes-near-washing-260nw-2376265435.jpg',
            }}
            style={styles.image}
          />
          <View style={styles.catImgCover}></View>
          <Text style={styles.catTitle}>{t('Categories')}</Text>
          <View style={styles.CategoriesListSection}>
            {renderCategoryTabs()}
            {renderLaundryTypeTabs()}
          </View>
        </View>
      </View>
      <View style={styles.cardContainer}>
        <ScrollView style={styles.homePopularSec}>
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            style={styles.laundryList}
          />
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.cartButton2} onPress={() => {
        handleCartButtonClick();
        navigation.navigate('Cart');
      }}>
        <View  style={styles.cartButtonTextSec} >
        <Text style={styles.cartButtonText2}>
          { cartQtn+getTotalItems() }
        </Text>
        </View>
        {/* <Text style={styles.cartButtonText}>
          {`Items: ${itemNames.join(', ')}`}
        </Text> */}
        <Icon name="cart-outline" size={32} color="#fff" />
      </TouchableOpacity>
      
      {/* <TouchableOpacity style={styles.cartButton} onPress={() => {
        handleCartButtonClick();
        navigation.navigate('Cart');
      }}> */}
        {/* <Text style={styles.cartButtonText}> */}
          {/* {`Cart (${getTotalItems()} items) - $${totalAmount.toFixed(2)}`} */}
        {/* </Text> */}
        {/* <Text style={styles.cartButtonText}>
          {`Items: ${itemNames.join(', ')}`}
        </Text> */}
        {/* <Icon name="cart-outline" size={26} color="#fff" /> */}
      {/* </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  catImgCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(238, 238, 255, 0.7)',
    width: '100%',
    height: 200,
    justifyContent: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  catTitle: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    position: 'absolute',
    top: 100,
    left: 120,
    fontFamily: 'Cochin',
  },
  catMainCategory: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EEEEFF',
    alignItems: 'center',
  },
  catHeaderSec: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  CategoriesTitle: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 0,
  },
  CategoriesList: {
    fontSize: 16,
    color: '#888',
  },
  selectedMainCategoryButton: {
    borderColor: '#585CE4',
    borderBottomWidth: 3,
  },
  selectedMainCategoryButtonText: {
    color: 'black',
  },
  catagorieslistSec: {
    paddingTop: 0,
  },
  categoryFilterContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  catfilterSec: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
    paddingLeft: 2,
  },
  categoryButton: {
    marginHorizontal: 5,
    width: 20,
    height: 20,
    backgroundColor: '#EEEEFF',
    borderRadius: 1,
    borderColor: '#888',
    borderWidth: 1,
  },
  selectedCategoryButton: {
    backgroundColor: '#585CE4',
    borderColor: '#585CE4',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#888',
    marginLeft: 30,
  },
  selectedCategoryButtonText: {
    color: '#888',
  },
  cardContainer: {
    width: '100%',
    height: 500,
  },
  homePopularSec: {
    width: '100%',
    paddingHorizontal: 16,
  },
  laundryList: {
    marginTop: 20,
    marginBottom: 120,
  },
  laundryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  laundryImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
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
  laundryPrice: {
    fontSize: 14,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#585CE4',
    borderRadius: 6,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  cartButton: {
    width: '90%',
    padding: 15,
    backgroundColor: '#585CE4',
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default Categories;
