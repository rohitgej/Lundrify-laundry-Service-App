import React, {useState, useEffect, useCallback} from 'react';
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
import {Picker} from '@react-native-picker/picker';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import DOMAIN_NAME from '../config/config';

const CartPage = ({navigation}) => {
  const [couponMessage, setCouponMessage] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [items, setItems] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [laundryTypes, setLaundryTypes] = useState({});
  const [categories, setCategories] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [total, Settotal] = useState(0);
  const [discount, SetDiscount] = useState(0);
  const [DeliveryFee, SetDeliveryFee] = useState(0);
  const [token, setToken]=useState(0)
  const [date, setDate] = useState(new Date());
  const [pickupDate, setPickupDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [remark, setRemark] = useState(null)
  const [timeSlots, setTimeSlots] = useState([]);
  const [pickupTimeSlot, setPickupTimeSlot] = useState('');
  const [pickupTimeSlotId, setPickupTimeSlotId] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [addresses, setAddresses] = useState([]);
 

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);


  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
// const handleTest= async()=>{
  // const formattedDate = formatDate(new Date(date));
  //   console.warn(formattedDate); // This will show the formatted date in the console

//   const userId = await AsyncStorage.getItem('user_id');

//       const formattedDate = formatDate(new Date(date));
//       console.warn(userId,token,
//         profileName,profilePhone,
//         selectedAddress,selectedOption,
//       formattedDate,pickupTimeSlot,additionalInfo);
// }


  const handleSubmit = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const token = await AsyncStorage.getItem('token');

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const formattedDate = formatDate(new Date(date));
      console.warn(userId,token,
        profileName,profilePhone,
        selectedAddress,selectedOption,
      formattedDate,pickupTimeSlot);

      const raw = JSON.stringify({
        user_id: userId,
        token: token,
        name: profileName,
        mobile_no: profilePhone,
        address: selectedAddress,//default value not getting 
        payment: selectedOption,
        remark: additionalInfo,
        pickup_date: formattedDate,
        timeslot: pickupTimeSlot
      
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(
        `${DOMAIN_NAME}api/checkout`,
        requestOptions,
      );
      const result = await response.json();

      if (result.message==="Order placed successfully") {
        handleRefresh();
        const userMessage = result.message
        const order_id = result.order.order_id
       
        navigation.replace('Order successful',{userMessage,order_id})
      } else {
        Alert.alert(result.message || 'Failed to checkout.');
      }
    } catch (error) {
      console.error(error);
      console.warn('Failed to checkout.');
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        user_id: userId,
      
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      

      const response = await fetch(
        `${DOMAIN_NAME}api/remove-coupon`,
        requestOptions,
      );
      const result = await response.json();

      if (result) {
        setCouponMessage(result.message);
        handleRefresh();
      } else {
        setCouponMessage(result.error || 'Failed to apply coupon.');
      }
    } catch (error) {
      console.error(error);
      setCouponMessage('Failed to apply coupon.');
    }
  };

  const handleValidateCoupon = async () => {
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
        `${DOMAIN_NAME}api/apply-coupon`,
        requestOptions,
      );
      const result = await response.json();

      if (result) {
        setCouponMessage(result.message);
        handleRefresh();
      } else {
        setCouponMessage(result.error || 'Failed to apply coupon.');
      }
    } catch (error) {
      console.error(error);
      setCouponMessage('Failed to apply coupon.');
    }
  };

  // const handleTimeSlotChange = (itemValue) => {
  //   const selectedSlot = JSON.parse(itemValue);
  //   setPickupTimeSlot(selectedSlot.timeslot);
  //   setPickupTimeSlotId(selectedSlot.id);
  // };
  const handleTimeSlotChange = itemValue => {
    setPickupTimeSlot(itemValue);
    console.log(itemValue);
  };


  const handleConfirm = date => {
   
    setPickupDate(date);
 
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleAddressChange = itemValue => {
    if (itemValue === 'add_address') {
      navigation.navigate('Addresses'); // Navigate to address page
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
        `${DOMAIN_NAME}api/getCart`,
        requestOptions,
      );
      const result = await response.json();

      if (result.message === 'Items found') {

        setItems(result.items);
        setSubtotal(result.total_price);
        Settotal(result.total);
        SetDiscount(result.discount);
        SetDeliveryFee(result.delivery_charge);
        setToken(result.token)
        

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
        method: 'post',
        redirect: 'follow',
      };

      const response = await fetch(
        `${DOMAIN_NAME}api/viewitem`,
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
        `${DOMAIN_NAME}api/viewlaundrytype`,
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
      const raw = "";
      const requestOptions = {
        method: 'GET',
        body: raw,
        redirect: 'follow',
      };
  
      const response = await fetch(
        `${DOMAIN_NAME}api/viewcategory`,
        requestOptions,
      );
      const result = await response.json();
      console.log(result);
  
      if (result && result.categories) {
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
        `${DOMAIN_NAME}api/viewuser`,
        requestOptions,
      );
      const result = await response.json();

      if (result) {
        setProfileName(result.user.name);
        setProfilePhone(result.user.mobile_no);
        setProfileEmail(result.user.email_id);
        setProfilePicture(result.user.profileImage);
        setAddresses(result.user.addresses);
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
        `${DOMAIN_NAME}api/getTimeslot`,
        requestOptions,
      );
      const result = await response.json();
  
      if (result) {
        const slots = result.map(slot => ({ id: slot._id, timeslot: slot.Timeslot }));
        setTimeSlots(slots);
        console.log(slots);
      } else {
        Alert.alert('Error', 'Failed to fetch time slots.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch time slots.');
    }
  };

  const fetchPaymentMethod = async () => {
    try {
      const response = await fetch(
        `${DOMAIN_NAME}api/viewtransactionmethod`,
      );
      const result = await response.json();
      setPaymentMethods(result.transactionmethod);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
      fetchItemDetails();
      fetchLaundryTypes();
      fetchCategories();
      fetchProfileDetails();
      fetchTimeSlots();
      fetchPaymentMethod();
      handleAddressChange();
  
    }, [])
  );
 
   

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
          ? `${DOMAIN_NAME}api/incrementcart`
          : `${DOMAIN_NAME}api/decrementcart`;

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
        `${DOMAIN_NAME}api/removefromcart`,
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



  const handleRefresh = () => {
    fetchCartItems();
  };

  return (
    <ScrollView style={styles.cartMaincontainer}>
      <View style={styles.ProfileSec}>
        <Image
          source={{
            uri: profilePicture || 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'
          }}
          style={styles.profileImage}
        />
        <View style={styles.profileSubSec}>
          <View style={styles.profileDetailsSec}>
            <Text style={styles.profileTextName}>{profileName}</Text>
            <Text style={styles.profileText}>{profilePhone}</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.profileEditButton}
             onPress={() => navigation.navigate('Profile')}>
              <Icons name="pencil" size={25} style={styles.profileIconButton} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.textNoItem}><Text style={styles.textNoItemText}>No item found</Text></TouchableOpacity>

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
        <TouchableOpacity onPress={handleRefresh}><Text>.      .</Text></TouchableOpacity>
        <Text style={styles.AddressLabel}>Address</Text>

        <Picker
        selectedValue={selectedAddress}
        style={styles.input}
        onValueChange={handleAddressChange}>
         
        {addresses.map(address => (
          <Picker.Item
            key={address._id}
            label={address.address}
            value={address._id}
          />
        ))}
        <Picker.Item label="Add Address" value="add_address" />
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

        <View style={styles.summaryContainer}>
          <View style={styles.cartSummryFirstTitle}>
            <Text style={styles.cartSummeryText}>Subtotal</Text>
            <Text style={styles.cartSummeryText}>{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.cartSummryTitle}>
            <Text style={styles.cartSummeryText}>Delivery Fee</Text>
            <Text style={styles.cartSummeryText}>{DeliveryFee}</Text>
          </View>
          <View style={styles.cartSummryTitle}>
            <View>
              <Text style={styles.cartSummeryText}>Discount</Text>
              {discount > 0 ? (
                <TouchableOpacity onPress={handleRemoveCoupon}>
                  <Text style={styles.couponRemove}>Remove coupon</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <Text style={styles.cartSummeryText}>{discount}</Text>
          </View>

          <View style={styles.cartSummrylastTitle}>
            <Text style={styles.cartSummeryTotalText}>Total</Text>
            <Text style={styles.cartSummeryTotalText}>{total}</Text>
          </View>
        </View>

        <Text style={styles.datePickerLabel}>Choose Pickup Date and Time</Text>
        <View style={styles.dateAndTimeContainer}>
          <DatePicker
            mode="date"
            dividerColor={'#585CE4'}
            open={isDatePickerVisible}
            date={date}
           onDateChange={setDate}
          
          />
{/* <TouchableOpacity style={styles.pickerButton}>
  <Picker
    selectedValue={JSON.stringify({ timeslot: pickupTimeSlot})}
    onValueChange={(itemValue, itemIndex) => handleTimeSlotChange(itemValue)}
    style={styles.picker}>
    <Picker.Item label="Select time slot" value={JSON.stringify({ timeslot: '', id: '' })} />
    {timeSlots.map(slot => (
      <Picker.Item key={slot.id} label={slot.timeslot} value={JSON.stringify(slot)} />
    ))}
  </Picker>
</TouchableOpacity> */}
   <TouchableOpacity style={styles.pickerButton}>
            <Picker
              selectedValue={pickupTimeSlot}
              onValueChange={handleTimeSlotChange}
              style={styles.picker}>
              <Picker.Item label="Select time slot" value="" />
              {timeSlots.map(slot => (
                <Picker.Item key={slot.id} label={slot.timeslot} value={slot.id} />
              ))}
            </Picker>
          </TouchableOpacity>

        </View>
        <Text style={styles.datePickerLabel}>Select Payment method </Text>
        <View style={styles.paymentContainer}>
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method._id}
              style={styles.optionContainer}
              onPress={() => setSelectedOption(method._id)}>
              <View style={styles.radioCircle}>
                {selectedOption === method._id && (
                  <View style={styles.selectedRb} />
                )}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.radioText}>
                  {method.transactionmethod_name}
                </Text>
              </View>
              <Image
                source={{uri: method.transactionmethod_image}}
                style={styles.paymentIcon}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleSubmit}>
        <Text style={styles.confirmButtonText}>Proceed for payment</Text>
      </TouchableOpacity>
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
    width: 75,
    height: 75,
    borderRadius: 50,
    zIndex:6,
    elevation: 2,
  
  },
  profileSubSec: {
    marginLeft: 50,
    width: '87%',
    height: '87%',
    backgroundColor: '#585CE4',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
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
    elevation: 2,
  },
  textNoItem:{
    position:"absolute",
    width:"100%",
    top:150,
    zIndex:-1
  },
  textNoItemText:{
    textAlign:"center"
  },
  profileIconButton: {

  },
  cartflatList: {
    minHeight: 180,
    marginBottom:18,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    elevation: 1,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  
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
    gap: 10,
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
  summaryContainer: {
    marginTop: 25,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
  },
  cartSummryTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    backgroundColor: '#fff',
    padding: 10,
  },
  cartSummryFirstTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    backgroundColor: '#fff',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cartSummrylastTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    backgroundColor: '#fff',
    padding: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cartSummeryText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 5,
  },
  couponRemove: {
    color: '#eb4034',
  },
  cartSummeryTotalText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  datePickerButtonText: {
    color: 'white',
  },
  datePickerLabel: {
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 10,
  },
  dateAndTimeContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 2,
  },
  datePickerButton: {
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#585CE4',
    color: 'white',
    borderRadius: 20,
    padding: 13,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pickerButton: {
    width: '90%',
    backgroundColor: '#585CE4',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  picker: {
    width: '90%',
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
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#585CE4',
    borderRadius: 6,
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
    fontSize: 25,
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
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 10,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  paymentContainer: {
    flex: 1,
    gap: 20,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 40,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    elevation: 2,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#585CE4',
    backgroundColor: '#EEEEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#585CE4',
  },
  icon: {
    width: 55,
    height: 40,
    marginRight: 10,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  radioText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
  },
  PaymentMethodText: {
    marginLeft: 10,
  },
  paymentIcon: {
    width: 55,
    height: 40,
    marginRight: 10,
    borderRadius: 10,
    borderWidth:1,
    borderColor:'#7d7574'
  },

  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d0c0c',
  },
  additionalText: {
    fontSize: 14,
    color: '#6c757d',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  confirmButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#585CE4',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    fontWeight: 'bold',
    marginBottom: 40,
    elevation: 2,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CartPage;
