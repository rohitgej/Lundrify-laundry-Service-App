import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import React, { useState } from 'react';

const CategoriesDetails = [
    { id: 'D1', name: 'Iron & cloth' },
    { id: 'D2', name: 'Iron' },
    { id: 'D3', name: 'Wash' },
    { id: 'D4', name: 'Dry Cleaning' },
];

const categories = [
    { id: 'C0', name: 'All' },
    { id: 'C1', name: 'Men' },
    { id: 'C2', name: 'Women' },
    { id: 'C3', name: 'Kids' },
];

const laundries = [
    {
        id: '1',
        name: 'Dark Laundry',
        category: 'C1',
        mainCategory: 'D1',
        price: 5,
        quantity: 0,
        image: require('./pic1.jpg'), // Replace with your image path
    },
    {
        id: '2',
        name: 'Laundry Club',
        category: 'C2',
        mainCategory: 'D2',
        price: 7,
        quantity: 0,
        image: require('./pic1.jpg'), // Replace with your image path
    },
    {
        id: '3',
        name: 'Clean Zone',
        category: 'C1',
        mainCategory: 'D4',
        price: 6,
        quantity: 0,
        image: require('./pic1.jpg'), // Replace with your image path
    },
    {
        id: '4',
        name: 'Clean Zone',
        category: 'C1',
        mainCategory: 'D1',
        price: 6,
        quantity: 0,
        image: require('./pic1.jpg'), // Replace with your image path
    },
    {
        id: '5',
        name: 'Clean Zone',
        category: 'C0',
        mainCategory: 'D4',
        price: 6,
        quantity: 0,
        image: require('./pic1.jpg'), // Replace with your image path
    },
    {
        id: '6',
        name: 'Clean Zone',
        category: 'C1',
        mainCategory: 'D2',
        price: 6,
        quantity: 0,
        image: require('./pic1.jpg'), // Replace with your image path
    },
];

const Categories = ({ navigation }) => {
    const [laundryList, setLaundryList] = useState(laundries);
    const [selectedCategory, setSelectedCategory] = useState('C0'); // Default to 'All' category
    const [selectedMainCategory, setSelectedMainCategory] = useState(null);

    const incrementQuantity = (id) => {
        setLaundryList((prevList) =>
            prevList.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decrementQuantity = (id) => {
        setLaundryList((prevList) =>
            prevList.map((item) =>
                item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    const filterByCategory = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const filterByMainCategory = (mainCategoryId) => {
        setSelectedMainCategory(mainCategoryId);
    };

    const renderCategories = ({ item }) => (
        <TouchableOpacity 
            style={[
                styles.CategoriesTitle,
                selectedMainCategory === item.id && styles.selectedMainCategoryButton
            ]}
            onPress={() => filterByMainCategory(item.id)}
        >
            <Text 
                style={[
                    styles.CategoriesList,
                    selectedMainCategory === item.id && styles.selectedMainCategoryButtonText
                ]}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const renderLaundry = ({ item }) => (
        <View style={styles.laundryItem}>
            <Image source={item.image} style={styles.laundryImage} />
            <View style={styles.laundryInfo}>
                <Text style={styles.laundryName}>{item.name}</Text>
                <Text style={styles.laundryPrice}>Price: ${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => decrementQuantity(item.id)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => incrementQuantity(item.id)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const filteredLaundries = laundryList.filter((item) =>
        (selectedCategory === 'C0' || item.category === selectedCategory) &&
        (selectedMainCategory ? item.mainCategory === selectedMainCategory : true)
    );

    const getTotalItems = () => {
        let totalItems = 0;
        laundryList.forEach(item => {
            totalItems += item.quantity;
        });
        return totalItems;
    };

    const getCartDetails = () => {
        let totalAmount = 0;
        let itemNames = [];
        laundryList.forEach(item => {
            if (item.quantity > 0) {
                totalAmount += item.price * item.quantity;
                itemNames.push(item.name);
            }
        });
        return { totalAmount, itemNames };
    };

    const { totalAmount, itemNames } = getCartDetails();

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
                    <Text style={styles.catTitle}>Iron & wash</Text>
                    <View style={styles.CategoriesListSection}>
                        <View style={styles.categoryFilterContainer}>
                            {categories.map((category) => (
                                <View style={styles.catfilterSec} key={category.id}>
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryButton,
                                            selectedCategory === category.id && styles.selectedCategoryButton,
                                        ]}
                                        onPress={() => filterByCategory(category.id)}
                                    >
                                    </TouchableOpacity>
                                    <Text style={[styles.categoryText, selectedCategory === category.id && styles.selectedCategoryButtonText]}>
                                        {category.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <FlatList
                            data={CategoriesDetails}
                            renderItem={renderCategories}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.catagorieslistSec}
                        />
                    </View>
                </View>
            </View>
            <ScrollView style={styles.homePopularSec}>
                <FlatList
                    data={filteredLaundries}
                    renderItem={renderLaundry}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    style={styles.laundryList}
                />
            </ScrollView>
            <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
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
        top:100,
        left:120,
        
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
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
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
        borderBottomWidth:3,
    },
    selectedMainCategoryButtonText: {
        color: 'black',
    },
    catagorieslistSec: {
        paddingTop: 0,
    },
    categoryFilterContainer: {
        flexDirection: 'row',
        padding:10,
        justifyContent: 'center',
        alignItems: 'center',
        gap:6,
        marginTop: 10,
       
    },
    catfilterSec:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 1,
      paddingLeft:2,
      
    },
    categoryButton: {
        marginHorizontal: 5,
        width:20,
        height:20,
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
        marginLeft:30,
    },
    selectedCategoryButtonText: {
        color: '#888',
    },
    homePopularSec: {
        width: '100%',
        paddingHorizontal: 16,
        
    },
    laundryList: {
        marginTop: 20,
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
        borderRadius:6,
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
