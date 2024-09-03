import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';

const Categories = ({ route, navigation }) => {
  const { selectedLaundryType } = route.params;

  const [laundryList, setLaundryList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesDetails, setCategoriesDetails] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);

  useEffect(() => {
    if (selectedLaundryType) {
      setSelectedMainCategory(selectedLaundryType.id);
    }

    fetch("https://newlaundryapp.demodev.shop/api/viewlaundrytype", {
      method: "GET",
      redirect: "follow"
    })
      .then(response => response.json())
      .then(result => setCategoriesDetails(result.laundrytypes))
      .catch(error => console.error(error));

    fetch("https://newlaundryapp.demodev.shop/api/viewcategory", {
      method: "GET",
      redirect: "follow"
    })
      .then(response => response.json())
      .then(result => {
        setCategories([{ _id: 'All', category_name: 'All' }, ...result.categories]);
      })
      .catch(error => console.error(error));

    fetch("https://newlaundryapp.demodev.shop/api/viewitem", {
      method: "GET",
      redirect: "follow"
    })
      .then(response => response.json())
      .then(result => {
        const laundries = result.item.map(item => ({
          ...item,
          quantity: 0,
          image: { uri: item.item_image }
        }));
        setLaundryList(laundries);
      })
      .catch(error => console.error(error));
  }, [selectedLaundryType]);

  const incrementQuantity = (id) => {
    setLaundryList((prevList) =>
      prevList.map((item) =>
        item._id === id && item.id_laundrytype.some(type => type.id === selectedMainCategory)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setLaundryList((prevList) =>
      prevList.map((item) =>
        item._id === id && item.quantity > 0 && item.id_laundrytype.some(type => type.id === selectedMainCategory)
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
  };

  const filterByMainCategory = (mainCategory) => {
    setSelectedMainCategory(mainCategory);
  };

  const renderCategories = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.CategoriesTitle,
        selectedMainCategory === item._id && styles.selectedMainCategoryButton
      ]}
      onPress={() => filterByMainCategory(item._id)}
    >
      <Text
        style={[
          styles.CategoriesList,
          selectedMainCategory === item._id && styles.selectedMainCategoryButtonText
        ]}
      >
        {item.Laundrytype_name}
      </Text>
    </TouchableOpacity>
  );

  const renderLaundry = ({ item }) => {
    const relevantPrices = item.id_laundrytype.filter(type =>
      selectedMainCategory ? type.id === selectedMainCategory : true
    );

    return (
      <View style={styles.laundryItem}>
        <Image source={item.image} style={styles.laundryImage} />
        <View style={styles.laundryInfo}>
          <Text style={styles.laundryName}>{item.item_name}</Text>
          {relevantPrices.map(type => (
            <Text key={type._id} style={styles.laundryPrice}>
              {categoriesDetails.find(detail => detail._id === type.id)?.Laundrytype_name}: ${type.price.toFixed(2)}
            </Text>
          ))}
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => decrementQuantity(item._id)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => incrementQuantity(item._id)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredLaundries = laundryList.filter((item) =>
    (selectedCategory === 'All' || item.category_id === selectedCategory) &&
    (selectedMainCategory ? item.id_laundrytype.some(type => type.id === selectedMainCategory) : true)
  );

  const getTotalItems = () => {
    let totalItems = 0;
    laundryList.forEach(item => {
      if (item.id_laundrytype.some(type => type.id === selectedMainCategory)) {
        totalItems += item.quantity;
      }
    });
    return totalItems;
  };

  const getCartDetails = () => {
    let totalAmount = 0;
    let itemNames = [];
    laundryList.forEach(item => {
      if (item.quantity > 0 && item.id_laundrytype.some(type => type.id === selectedMainCategory)) {
        item.id_laundrytype.forEach(type => {
          if (type.id === selectedMainCategory) {
            totalAmount += type.price * item.quantity;
          }
        });
        itemNames.push(item.item_name);
      }
    });
    return { totalAmount, itemNames };
  };

  const { totalAmount, itemNames } = getCartDetails();

  const handleCartButtonClick = () => {
    laundryList.forEach(item => {
      if (item.quantity > 0 && item.id_laundrytype.some(type => type.id === selectedMainCategory)) {
        console.log({
          "user_id": "", // You need to replace this with the actual user_id
          "item_id": item._id,
          "category_id": item.category_id,
          "id_laundrytype": item.id_laundrytype.map(type => type.id).join(', '),
          "quantity": item.quantity
        });
      }
    });
  };

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
          <Text style={styles.catTitle}>Catagories</Text>
          <View style={styles.CategoriesListSection}>
            <View style={styles.categoryFilterContainer}>
              {categories.map((category) => (
                <View style={styles.catfilterSec} key={category._id}>
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      selectedCategory === category._id && styles.selectedCategoryButton,
                    ]}
                    onPress={() => filterByCategory(category._id)}
                  >
                  </TouchableOpacity>
                  <Text style={[styles.categoryText, selectedCategory === category._id && styles.selectedCategoryButtonText]}>
                    {category.category_name}
                  </Text>
                </View>
              ))}
            </View>
            <FlatList
              data={categoriesDetails}
              renderItem={renderCategories}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.catagorieslistSec}
            />
          </View>
        </View>
      </View>
      <View style={styles.cardContainer}>
        <ScrollView style={styles.homePopularSec}>
          <FlatList
            data={filteredLaundries}
            renderItem={renderLaundry}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            style={styles.laundryList}
          />
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.cartButton} onPress={() => {
        handleCartButtonClick();
        navigation.navigate('Cart');
      }}>
        <Text style={styles.cartButtonText}>
          {`Cart (${getTotalItems()} items) - $${totalAmount.toFixed(2)}`}
        </Text>
        <Text style={styles.cartButtonText}>
          {`Items: ${itemNames.join(', ')}`}
        </Text>
      </TouchableOpacity>
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
  cartButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Categories;
