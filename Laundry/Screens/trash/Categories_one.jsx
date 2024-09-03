import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Button, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';

const laundries = [
    {
        id: '1',
        name: 'Shirt',
        price: 5.00,
        quantity: 0,
        image: { uri: 'https://example.com/shirt.jpg' },
        category: 'Men',
        mainCategory: 'Iron & Wash'
    },
    {
        id: '2',
        name: 'Pants',
        price: 7.00,
        quantity: 0,
        image: { uri: 'https://example.com/pants.jpg' },
        category: 'Women',
        mainCategory: 'Iron & Wash'
    },
    // Add more sample data as needed
];

const Categories = ({ navigation }) => {
    const [laundryList, setLaundryList] = useState(laundries);
    const [categoriesDetails, setCategoriesDetails] = useState([]);
    const [fetchedCategories, setFetchedCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedMainCategory, setSelectedMainCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLaundryTypes();
        fetchCategories();
    }, []);

    const fetchLaundryTypes = async () => {
        const raw = "";

        const requestOptions = {
            method: "GET",
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("https://newlaundryapp.demodev.shop/api/viewlaundrytype", requestOptions);
            const result = await response.json();

            if (response.ok) {
                setCategoriesDetails(result.laundrytypes.map(type => ({
                    id: type._id,
                    name: type.Laundrytype_name,
                    image: type.Laundrytype_image
                })));
            } else {
                console.error(result.message || 'Failed to fetch laundry types');
            }
        } catch (error) {
            console.error('Failed to connect to the server', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        const raw = "";

        const requestOptions = {
            method: "GET",
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("https://newlaundryapp.demodev.shop/api/viewcategory", requestOptions);
            const result = await response.json();

            if (response.ok) {
                setFetchedCategories([{ id: 'all', name: 'All' }, ...result.categories.map(cat => ({ id: cat._id, name: cat.category_name }))]);
            } else {
                console.error(result.message || 'Failed to fetch categories');
            }
        } catch (error) {
            console.error('Failed to connect to the server', error);
        }
    };

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
                selectedMainCategory === item.name && styles.selectedMainCategoryButton
            ]}
            onPress={() => filterByMainCategory(item.name)}
        >
            <Text
                style={[
                    styles.CategoriesList,
                    selectedMainCategory === item.name && styles.selectedMainCategoryButtonText
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
        (selectedCategory === 'All' || item.category === selectedCategory) &&
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
                            {fetchedCategories.map((category) => (
                                <TouchableOpacity style={styles.catfilterSec} key={category.id}
                                onPress={() => filterByCategory(category.name)}>
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryButton,
                                            selectedCategory === category.name && styles.selectedCategoryButton,
                                        ]}
                                        onPress={() => filterByCategory(category.name)}
                                    >
                                    </TouchableOpacity>
                                    <Text style={[styles.categoryText, selectedCategory === category.name && styles.selectedCategoryButtonText]}>
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <FlatList
                            data={categoriesDetails}
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
                {loading ? (
                    <ActivityIndicator size="small" color="#585CE4" />
                ) : (
                    <FlatList
                        data={filteredLaundries}
                        renderItem={renderLaundry}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        style={styles.laundryList}
                    />
                )}
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
        borderWidth: 2,
    },
    categoryText: {
        fontSize: 16,
        color: '#888',
    },
    selectedCategoryButton: {
        borderColor: '#585CE4',
        backgroundColor: '#585CE4',
    },
    selectedCategoryButtonText: {
        color: 'black',
    },
    homePopularSec: {
        width: '100%',
        height: '100%',
        backgroundColor: '#EEEEFF',
        paddingHorizontal: 16,
    },
    laundryList: {
        width: '100%',
    },
    laundryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginVertical: 8,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
    },
    laundryImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    laundryInfo: {
        flex: 1,
        paddingLeft: 16,
    },
    laundryName: {
        fontSize: 16,
        fontWeight: 'bold',
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
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEEEFF',
        borderRadius: 16,
    },
    quantityButtonText: {
        fontSize: 16,
        color: '#888',
    },
    quantityText: {
        fontSize: 16,
        paddingHorizontal: 8,
    },
    cartButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#585CE4',
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Categories;
