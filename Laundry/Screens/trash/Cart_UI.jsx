import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Button
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
const timeSlot = [
  { key: '00:00-03:00' },
  { key: '03:00-09:00' },
  { key: '09:00-12:00' },
  
];


const CartPage = ({navigation}) => {
 


  const [couponCode, setCouponCode] = useState('');
  const [date, setDate] = useState(new Date())
  const [selectedOption, setSelectedOption] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const options = [
    {
      id: 'paypal',
      name: 'Pay Via PayPal',
      icon: require('./pic1.jpg'), // Add your PayPal icon image to the assets folder
      additionalText: 'Add account',
    },
    {
      id: 'card',
      name: 'Visa/Master Card',
      icon: require('./pic1.jpg'), // Add your Visa icon image to the assets folder
      additionalText: '**** 4581',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: require('./pic1.jpg'), // Add your Cash on Delivery icon image to the assets folder
      additionalText: '',
    },
  ];

  
  const [items, setItems] = useState([
    {
      id: '1',
      name: 'Jeans',
      price: 8.0,
      quantity: 1,
      image: require('./pic1.jpg'),
    },
    {
      id: '2',
      name: 'Shirt',
      price: 5.0,
      quantity: 1,
      image: require('./pic1.jpg'),
    },
  ]);
  const [pickupDate, setPickupDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSubmit = () => {
    if (name && phone && address) {
      Alert.alert('Form Submitted', `Name: ${name}\nPhone: ${phone}\nAddress: ${address}\nAdditional Info: ${additionalInfo}`);
    } else {
      Alert.alert('Error', 'Please fill in all required fields.');
    }
  };

  const handleQuantityChange = (id, type) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === 'increase'
                  ? item.quantity + 1
                  : item.quantity > 0
                  ? item.quantity - 1
                  : 0,
            }
          : item,
      ),
    );
  };

  const handleRemoveItem = id => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleValidateCoupon = () => {
    // Example API call to validate coupon code
    alert('Coupon validated');
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

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const discount = 5; // Example static discount
  const total = subtotal - discount;

  return (
    <ScrollView style={styles.cartMaincontainer}>
       
      
      <FlatList
        style={styles.cartflatList}
        data={items}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.cartLaundryName}>{item.name}</Text>
              <Text style={styles.cartPriceText}>
                laundry type
              </Text>
              <Text style={styles.cartPriceText}>
                catagories
              </Text>
              <Text style={styles.cartPriceText}>
                {item.quantity} x ${item.price.toFixed(2)}
              </Text>
            </View>
            <View style={styles.cartquantityContainer}>
              <TouchableOpacity
                onPress={() => handleQuantityChange(item.id, 'decrease')}
                style={styles.cartButton}>
                <Text style={styles.cartqntbtn}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleQuantityChange(item.id, 'increase')}
                style={styles.cartButton}>
                <Text style={styles.cartqntbtn}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                <Icons name="delete" size={25} style={styles.iconButton} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
         <Text style={styles.datePickerLabel}>Your information</Text>
      <View style={styles.formContainer}>

      <Text style={styles.formLabel}>Name</Text>
      <TextInput
        style={styles.formInput}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      
      <Text style={styles.formLabel}>Phone Number</Text>
      <TextInput
        style={styles.formInput}
        placeholder="Enter your phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      
      <Text style={styles.formLabel}>Address</Text>
      <TextInput
        style={styles.formInput}
        placeholder="Enter your address"
        value={address}
        onChangeText={setAddress}
      />
      
      <Text style={styles.formLabel}>Additional Information</Text>
      <TextInput
        style={[styles.formInput, styles.textArea]}
        placeholder="Enter any additional information"
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
        multiline
      />
    </View>
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
      <View style={styles.summaryContainer}>
        <View style={styles.cartSummryFirstTitle}>
          <Text style={styles.cartSummeryText}>Subtotal</Text>
          <Text style={styles.cartSummeryText}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.cartSummryTitle}>
          <Text style={styles.cartSummeryText}>Delivery Fee</Text>
          <Text style={styles.cartSummeryText}>Free</Text>
        </View>
        <View style={styles.cartSummryTitle}>
          <Text style={styles.cartSummeryText}>Discount</Text>
          <Text style={styles.cartSummeryText}>${discount}</Text>
        </View>
        <View style={styles.cartSummrylastTitle}>
          <Text style={styles.cartSummeryTotalText}>Total</Text>
          <Text style={styles.cartSummeryTotalText}>${total.toFixed(2)}</Text>
        </View>
      </View>
    
      <Text style={styles.datePickerLabel}>Choose Pickup Date and Time</Text>
      <View style={styles.dateAndTimeContainer}>
    
      <DatePicker date={date} 
      dividerColor={"#585CE4"}  
      onDateChange={setDate}
       mode='date' 
       style={styles.dateText}/>
      
      <FlatList
        data={timeSlot}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              style={styles.timeSlotButton}
              onPress={() => setSelectedTimeSlot(item.key)}>
              <Text style={styles.itemText}>{item.key}</Text>
            </TouchableOpacity>
            
          </View>
        )}
        keyExtractor={(item) => item.key}
       horizontal
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
      />
      </View>
   

    <Text style={styles.datePickerLabel}>Select Payment method </Text>
      <View style={styles.paymentContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.optionContainer}
          onPress={() => setSelectedOption(option.id)}
        >
          <View style={styles.radioCircle}>
            {selectedOption === option.id && <View style={styles.selectedRb} />}
          </View>
         
          <View style={styles.textContainer}>
            <View style={styles.PaymentMethodText}>
            <Text style={styles.optionText}>{option.name}</Text>

            {option.additionalText ? (
              <Text style={styles.additionalText}>{option.additionalText}</Text>
            ) : null}
            </View>
          </View>
          <Image source={option.icon} style={styles.icon} />
        </TouchableOpacity>
      ))}
    </View>
      
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => navigation.navigate('Order successful')}><Text  style={styles.confirmButtonText} >Proceed for payment</Text></TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
  cartMaincontainer: {
    padding: 20,
    backgroundColor: '#EEEEFF',
  },
  cartflatList: {
    minHeight: 180,
    marginBottom:18,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  cartLaundryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B3B3B',
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
  cartButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#585CE4',
    borderRadius: 6,
  },
  cartqntbtn: {
    color: '#fff',
    fontSize: 18,
  },
  iconButton: {
    color: 'black',
    fontSize: 25,
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
  couponBtnText: {
    color: 'white',
  },
  summaryContainer: {
    marginTop: 25,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    marginBottom: 20,
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
  cartSummeryTotalText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  datePickerLabel: {
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 10,
  },
  dateAndTimeContainer:{
    width:'100%',
    height:300,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:40,
  },
  paymentContainer: {
    flex: 1,
    gap:20,
    paddingVertical:10,
    backgroundColor: '#f9f9f9',
    marginBottom: 40,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   
    backgroundColor:'#fff',
    padding: 16,
    borderRadius: 10,
    justifyContent:'space-between',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#585CE4',
    backgroundColor:'#EEEEFF',
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
  PaymentMethodText:{
    marginLeft: 10,

  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'#888',
  },
  additionalText: {
    fontSize: 14,
    color: '#6c757d',
  },
  confirmButton:{
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
  },
  confirmButtonText:{
    color:'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor:'white',
    marginBottom:20,
    borderRadius: 10,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 5,
  },
  formInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 0,
    backgroundColor:'#f9f9f9',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
  },

});

export default CartPage;