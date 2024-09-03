import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartPage = ({navigation}) => {
  const [couponMessage, setCouponMessage] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [items, setItems] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [laundryTypes, setLaundryTypes] = useState({});
  const [categories, setCategories] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [pickupDate, setPickupDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [pickupTimeSlot, setPickupTimeSlot] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleValidateCoupon = async() => {
    
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        user_id: userId,
        code: couponCode,
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://newlaundryapp.demodev.shop/api/apply-coupon',
        requestOptions,
      );
      const result = await response.json();

      if (result) {
        setCouponMessage(result.message);
        handleRefresh()

      } else {
        setCouponMessage(result.error || 'Failed to apply coupon.');
      }
    } catch (error) {
      console.error(error);
      setCouponMessage('Failed to apply coupon.');
    }
  };

  
  const handleTimeSlotChange = (itemValue) => {
    setPickupTimeSlot(itemValue);
  };

  const handleConfirm = (date) => {
    setPickupDate(date);
    hideDatePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleAddressChange = (itemValue) => {
    if (itemValue === 'add_address') {
      navigation.navigate('AddressPage'); // Navigate to address page
    } else {
      setSelectedAddress(itemValue);
    }
  };


  const fetchCartItems = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({user_id: userId});

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://newlaundryapp.demodev.shop/api/getCart',
        requestOptions,
      );
      const result = await response.json();

      if (result.message === 'Items found') {
        setItems(result.items);
        setSubtotal(result.total_price);
      } else {
        Alert.alert('Error', 'No items found in the cart.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch cart items.');
    }
  };

  const fetchItemDetails = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      const response = await fetch(
        'https://newlaundryapp.demodev.shop/api/viewitem',
        requestOptions,
      );
      const result = await response.json();

      if (result.message === 'All item') {
        const itemDetailsMap = {};
        result.item.forEach(item => {
          itemDetailsMap[item._id] = item;
        });
        setItemDetails(itemDetailsMap);
      } else {
        Alert.alert('Error', 'Failed to fetch item details.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch item details.');
    }
  };

  const fetchLaundryTypes = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      const response = await fetch(
        'https://newlaundryapp.demodev.shop/api/viewlaundrytype',
        requestOptions,
      );
      const result = await response.json();

      if (result.message === 'All laundry types') {
        const laundryTypesMap = {};
        result.laundrytypes.forEach(type => {
          laundryTypesMap[type._id] = type.Laundrytype_name;
        });
        setLaundryTypes(laundryTypesMap);
      } else {
        Alert.alert('Error', 'Failed to fetch laundry types.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch laundry types.');
    }
  };

  const fetchCategories = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      const response = await fetch(
        'https://newlaundryapp.demodev.shop/api/viewcategory',
        requestOptions,
      );
      const result = await response.json();

      if (result.message === 'All categories') {
        const categoriesMap = {};
        result.categories.forEach(category => {
          categoriesMap[category._id] = category.category_name;
        });
        setCategories(categoriesMap);
      } else {
        Alert.alert('Error', 'Failed to fetch categories.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch categories.');
    }
  };

  const fetchProfileDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert('Error', 'User ID not found.');
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({_id: userId});

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://newlaundryapp.demodev.shop/api/viewuser',
        requestOptions,
      );
      const result = await response.json();

      if (result) {
        setProfileName(result.user.name);
        setProfilePhone(result.user.mobile_no);
        setProfileEmail(result.user.email_id);
        setProfilePicture(result.user.profileImage);
        setAddresses(result.user.addresses);
        console.warn(addresses);
      } else {
        Alert.alert('Error', 'Failed to fetch profile details.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch profile details.');
    }
  };
  const fetchTimeSlots = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      const response = await fetch(
        'https://newlaundryapp.demodev.shop/api/getTimeslot',
        requestOptions,
      );
      const result = await response.json();

      if (result) {
        const slots = result.map(slot => slot.Timeslot);
        setTimeSlots(slots);
      } else {
        Alert.alert('Error', 'Failed to fetch time slots.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch time slots.');
    }
  };

  

  useEffect(() => {
    fetchCartItems();
    fetchItemDetails();
    fetchLaundryTypes();
    fetchCategories();
    fetchProfileDetails();
    fetchTimeSlots();
  }, []);

  

  const handleQuantityChange = async (id, type) => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert('Error', 'User ID not found.');
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        user_id: userId,
        _id: id,
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const url =
        type === 'increase'
          ? 'https://newlaundryapp.demodev.shop/api/incrementcart'
          : 'https://newlaundryapp.demodev.shop/api/decrementcart';

      const response = await fetch(url, requestOptions);
      const result = await response.text();

      if (result) {
        fetchCartItems();
      } else {
        Alert.alert('Error', 'Failed to update item quantity.');
      }
    } catch (error) {
      console.error('Error changing item quantity:', error);
      Alert.alert('Error', 'Failed to change item quantity.');
    }
  };

  const handleRemoveItem = async (id, itemCartId) => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert('Error', 'User ID not found.');
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        user_id: userId,
        _id: itemCartId,
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://newlaundryapp.demodev.shop/api/removefromcart',
        requestOptions,
      );
      const result = await response.json();

      if (result.message === 'Item removed successfully') {
        setItems(prevItems => prevItems.filter(item => item.item_id !== id));
      } else {
        Alert.alert('Error', 'Failed to remove item from the cart.');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item from the cart.');
    }
  };

  const handleSubmit = () => {
    if (name && phone && address) {
      Alert.alert(
        'Form Submitted',
        `Name: ${name}\nPhone: ${phone}\nAddress: ${address}\nAdditional Info: ${additionalInfo}`,
      );
    } else {
      Alert.alert('Error', 'Please fill in all required fields.');
    }
  };

  const handleRefresh = () => {
    fetchCartItems();
  };

  return (
    <ScrollView style={styles.cartMaincontainer}>
      <View style={styles.ProfileSec}>
        <Image
          source={{
            uri:profilePicture,
          }}
          style={styles.profileImage}
        />
        <View style={styles.profileSubSec}>
          <View style={styles.profileDetailsSec}>
            <Text style={styles.profileTextName}>{profileName}</Text>
            <Text style={styles.profileText}>{profilePhone}</Text>
         
          </View>
          <View>
            <TouchableOpacity style={styles.profileEditButton}>
              <Icons name="pencil" size={25} style={styles.profileIconButton} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        style={styles.cartflatList}
        data={items}
        keyExtractor={item => item.item_id}
        renderItem={({item}) => {
          const itemDetail = itemDetails[item.item_id] || {};
          const laundryTypeName =
            laundryTypes[item.id_laundrytype] || 'Laundry Type';
          const categoryName = categories[item.category_id] || 'Category';
          const itemCartId = item._id || 'id'; // Correct the variable name

          return (
            <View style={styles.itemContainer}>
              <Image
                source={{uri: itemDetail.item_image}}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.cartLaundryName}>
                  {itemDetail.item_name || 'Item Name'}
                </Text>
                <Text style={styles.cartPriceText}>{laundryTypeName}</Text>
                <Text style={styles.cartPriceText}>{categoryName}</Text>
                <Text style={styles.cartPriceText}>
                  {item.quantity} x ${item.price.toFixed(2)}
                </Text>
              </View>
              <View style={styles.cartquantityContainer}>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item._id, 'decrease')}
                  style={styles.cartButton}>
                  <Text style={styles.cartqntbtn}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item._id, 'increase')}
                  style={styles.cartButton}>
                  <Text style={styles.cartqntbtn}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRemoveItem(item.item_id, itemCartId)}>
                  <Icons name="delete" size={25} style={styles.iconButton} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
      <View style={styles.AddressContainer}>
      <TextInput
          style={styles.formInput}
          placeholder="Enter additional information"
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          multiline
        />
        <Text style={styles.AddressLabel}>Addresses</Text>
        
        <Picker
          selectedValue={selectedAddress}
          style={styles.input}
          onValueChange={handleAddressChange}
        >
          {addresses.map(address => (
            <Picker.Item 
              key={address._id} 
              label={address.address} 
              value={address._id} 
            />
          ))}
            <Picker.Item  label="Add Address" value="add_address" />
        </Picker>
        <Text style={styles.couponText}>Your coupon code</Text>
      <View style={styles.couponSec}>
        <TextInput
          style={styles.couponInput}
          placeholder="Enter Coupon Code"
          value={couponCode}
          onChangeText={setCouponCode}
        />
    
        <TouchableOpacity
          style={styles.couponButton}
          onPress={handleValidateCoupon}>
          <Text style={styles.couponBtnText}>Apply coupon</Text>
        </TouchableOpacity>
      
      </View>
      {couponMessage ? (
            <Text style={styles.couponMessage}>{couponMessage}</Text>
          ) : null}
      <Text>pick up date</Text>
      <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>
            {pickupDate ? pickupDate.toLocaleDateString() : 'Select Date'}
          </Text>
        </TouchableOpacity>
        <DatePicker
        modal
          mode='date'
          open={isDatePickerVisible}
          date={date}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        
         <Picker
          selectedValue={pickupTimeSlot}
          onValueChange={handleTimeSlotChange}
          style={styles.picker}
        >
          <Picker.Item label="Select time slot" value="" />
          {timeSlots.map((slot) => (
            <Picker.Item key={slot} label={slot} value={slot} />
          ))}
        </Picker>

      </View>
      
      <TouchableOpacity style={styles.cartButton} onPress={handleSubmit}>
        <Text style={styles.cartButtonText}>Submit</Text>
      </TouchableOpacity>
      <Text style={styles.totalAmount}>Total: ${subtotal.toFixed(2)}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cartMaincontainer: {
    padding: 10,
    backgroundColor: '#EEEEFF',
  },
  ProfileSec: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  profileImage: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 50,
    marginLeft: 10,
    zIndex: 1,
  },
  profileSubSec: {
    marginLeft: 50,
    width: '85%',
    height: '87%',
    backgroundColor: '#585CE4',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileDetailsSec: {
    marginLeft: 50,
  },
  profileTextName: {
    fontSize: 16,
    color: '#fff',
  },
  profileText: {
    color: '#fff',
  },
  profileEditButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    marginRight: 10,
  },
  profileIconButton: {},
  cartflatList: {
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  cartLaundryName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cartPriceText: {
    fontSize: 14,
    color: '#888',
  },
  cartquantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponButton: {
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#585CE4',
    color: 'white',
    borderRadius: 10,
    padding: 13,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  couponText: {
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 10,
  },
  couponSec: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    gap: 10,
  },
  couponInput: {
    width: '50%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  couponBtnText: {
    color: 'white',
  },
  datePickerButtonText:{
    color: 'white',
  },
  datePickerButton:{
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#585CE4',
    color: 'white',
    borderRadius: 10,
    padding: 13,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  picker:{
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#585CE4',
    color: 'white',
    borderRadius: 20,
    padding: 13,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cartButton: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cartButtonText: {
    color: '#fff',
  },
  cartqntbtn: {
    color: '#fff',
    fontSize: 18,
  },
  iconButton: {
    color: 'black',
    marginLeft: 10,
  },
  AddressContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  AddressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default CartPage;
