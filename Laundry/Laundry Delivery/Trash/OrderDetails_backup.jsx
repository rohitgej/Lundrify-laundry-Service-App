import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CheckBox from '@react-native-community/checkbox';
import { launchCamera } from 'react-native-image-picker';

const TrackOrder = ({ route, navigation }) => {
  const { orderId } = route.params;

  const [selectedItems, setSelectedItems] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [address, setAddress] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [laundryTypes, setLaundryTypes] = useState([]);
  const [CategoryTypes, setCategoryTypes] = useState([]);
  const [item, setItems] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [userId, setUserId] = useState('');

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId]
    }));
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        setSelectedImages(prevImages => [...prevImages, response.assets[0].uri]);
      }
    });
  };

  const deleteImage = (imageUri) => {
    setSelectedImages(prevImages => prevImages.filter(uri => uri !== imageUri));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', year: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({ "order_id": orderId });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      try {
        const response = await fetch("https://newlaundryapp.demodev.shop/api/getcheckout", requestOptions);
        const result = await response.json();
        setOrderDetails(result.order);
        setUserId(result.order.user_id); // Store the user_id
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTimeSlots = async () => {
      try {
        const response = await fetch("https://newlaundryapp.demodev.shop/api/getTimeslot");
        const result = await response.json();
        setTimeSlots(result);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchPaymentMethods = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      try {
        const response = await fetch("https://newlaundryapp.demodev.shop/api/viewtransactionmethod", requestOptions);
        const result = await response.json();
        setPaymentMethods(result.transactionmethod);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAddress = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({ "_id": userId });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      try {
        const response = await fetch("https://newlaundryapp.demodev.shop/api/viewuser", requestOptions);
        const result = await response.json();
        setAddress(result.user.addresses);

        const addressWithCoordinates = result.user.addresses.find(addr => addr._id === orderDetails.address);
        if (addressWithCoordinates) {
          
          const { latitude, longitude } = addressWithCoordinates.coordinates; // Adjust according to your actual data structure
          
       
          setUserCoordinates({latitude,longitude});
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategoryTypes = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      try {
        const response = await fetch("https://newlaundryapp.demodev.shop/api/viewcategory", requestOptions);
        const result = await response.json();
        setCategoryTypes(result.categories);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchLaundryTypes = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      try {
        const response = await fetch("https://newlaundryapp.demodev.shop/api/viewlaundrytype", requestOptions);
        const result = await response.json();
        setLaundryTypes(result.laundrytypes);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchItemTypes = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      try {
        const response = await fetch("https://newlaundryapp.demodev.shop/api/viewitem", requestOptions);
        const result = await response.json();
        setItems(result.item);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItemTypes();
    fetchCategoryTypes();
    fetchPaymentMethods();
    fetchOrderDetails();
    fetchTimeSlots();
    fetchLaundryTypes();
    // Fetch address after order details to ensure userId is set
    if (userId) {
      fetchAddress();
    }
  }, [orderId, userId]);

  const getPaymentMethodById = (id) => {
    const method = paymentMethods.find((method) => method._id === id);
    return method ? method.transactionmethod_name : 'Unknown';
  };

  const getTimeSlotById = (id) => {
    const slot = timeSlots.find((slot) => slot._id === id);
    return slot ? slot.Timeslot : 'Unknown';
  };

  const getAddressById = (id) => {
    const addr = address.find((addr) => addr._id === id);
    return addr ? addr.address : 'Unknown';
  };

  const getLaundryTypeById = (id) => {
    const type = laundryTypes.find((type) => type._id === id);
    return type ? type.Laundrytype_name : 'Unknown';
  };

  const getCategoryTypeById = (id) => {
    const categoryType = CategoryTypes.find((type) => type._id === id);
    return categoryType ? categoryType.category_name : 'Unknown';
  };

  const getItemTypeById = (id) => {
    const itemType = item.find((type) => type._id === id);
    return itemType ? itemType.item_name : 'Unknown';
  };
  

  if (!orderDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
   
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.footer}>
          <TouchableOpacity style={styles.verifyButton} onPress={() => navigation.navigate('Map',{orderId,userCoordinates})}>
            <Text style={styles.verifyText}>Start your Pickup</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.orderDetails} onPress={toggleExpand}>
          <View style={styles.orderCard}>
           
            <View style={styles.textContainer}>
              <Text style={styles.orderId}>Order id: {orderId}</Text>
              <Text style={styles.date}>{formatDate(orderDetails.order_date)}</Text>
              <View style={styles.statusTags}>
                {!isExpanded ? (
                  <View style={styles.statusTag}>
                    <Text style={styles.statusText}>{getPaymentMethodById(orderDetails.payment)}</Text>
                  </View>
                ) : null}
              </View>
            </View>
            <Icon name={isExpanded ? 'expand-less' : 'expand-more'} size={24} color="#585CE4" />
          </View>
          {isExpanded && (
            <>
              <View style={styles.expanded}>
                <View style={styles.subDetails}>
                  <View style={styles.subDetailsDiv}>
                    <Text style={styles.subDetailsText1}>Name :</Text>  
                    <Text style={styles.subDetailsText}>{orderDetails.name}</Text>
                  </View>
                  <View style={styles.subDetailsDiv}>
                    <Text style={styles.subDetailsText1}>Pickup date :</Text>
                    <Text style={styles.subDetailsText}>{new Date(orderDetails.pickup_date).toDateString()}</Text>
                  </View>
                  <View style={styles.subDetailsDiv}>
                    <Text style={styles.subDetailsText1}>Pickup time :</Text>
                    <Text style={styles.subDetailsText}>{getTimeSlotById(orderDetails.timeslot)}</Text>
                  </View>
                  <View style={styles.subDetailsDiv}>
                    <Text style={styles.subDetailsText1}>Phone no. :</Text>
                    <Text style={styles.subDetailsText}>{orderDetails.mobile_no}</Text>
                  </View>
                  <View style={styles.subDetailsDiv}>
                    <Text style={styles.subDetailsText1}>Address :</Text>
                    <Text style={styles.subDetailsText}>{getAddressById(orderDetails.address)}</Text>
                  </View>
                  <View style={styles.subDetailsDiv}>
                    <Text style={styles.subDetailsText1}>Payments :</Text>
                    <Text style={styles.subDetailsText}>{getPaymentMethodById(orderDetails.payment)}</Text>
                  </View>
                  <View style={styles.subDetailsDiv}>
                    <Text style={styles.subDetailsText1}>Additional info :</Text>
                    <Text style={styles.subDetailsText}>{orderDetails.remark}</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </TouchableOpacity>

        <FlatList
          data={orderDetails.items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <View style={styles.itemSubDiv}>
                <Text>{getItemTypeById(item.item_id)}</Text>
                <Text>{getCategoryTypeById(item.category_id)}</Text>
                <Text>{getLaundryTypeById(item.id_laundrytype)}</Text>
              </View>
              <Text>X {item.quantity}</Text>
           
              <Text style={styles.itemPrice}>${item.price}</Text>
              <CheckBox
              value={selectedItems[item.id] || false}
              onValueChange={() => toggleItemSelection(item.id)}
            />
            </View>
          )}
          ListFooterComponent={
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalPrice}>{orderDetails.total}</Text>
            </View>
          }
          contentContainerStyle={styles.itemList}
        />
             <TouchableOpacity style={styles.uploadButton} onPress={openCamera}>
        <Text style={styles.uploadButtonText}>Upload Image</Text>
      </TouchableOpacity>
      <View style={styles.imagesContainer}>
        {selectedImages.map((imageUri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(imageUri)}>
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    
     
      </ScrollView>
      <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('Map',{userCoordinates})}>
            <Text style={styles.verifyText}>Submit</Text>
          </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  loadingContainer:{
   height:'100%',
   backgroundColor:'#EEEEFF',
    justifyContent:'center',
    alignItems:'center'
  },
  container: {
    width:'100%',
    justifyContent:'center',
    height:'100%',
 backgroundColor:'#EEEEFF',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  statusContainer: {
    height:'80%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 26,
  },
  stageContainer: {
   
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: '#585CE4',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    marginTop: 10,
    marginLeft: 50,
    width: '70%',
    backgroundColor: '#585CE4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  line: {
    width: 38,
    height: 2,
    backgroundColor: '#CCC',
  },
  stageText: {
    fontSize: 10,
    color: '#888',
    marginTop: 4, // Space between icon and text
  },
  orderDetails:{
    marginTop:20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    color: '#A0A0A0',
  },
  statusTags: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statusTag: {
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    backgroundColor: '#585CE4',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
  },
  expanded:{
   
  },
  subDetails:{
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 16,
    gap:10
  },
  subDetailsDiv:{

  },
  subDetailsText:{
    color: '#A0A0A0',

  },
  subDetailsText1:{
    fontSize:14,
    fontWeight:'bold',
    color: '#A0A0A0',
  },
  itemList: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
  justifyContent:'space-between',
    alignItems:'center',
    paddingVertical: 8,
  },
  itemSubDiv:{
    width:'40%'
  },
  itemDescription: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#585CE4',
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  verifyButton: {
    width: '90%',
    backgroundColor: '#585CE4',
    borderRadius: 10,
    padding: 13,
  },
  verifyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagesContainer: {
    flexDirection: 'row',
  
    flexWrap: 'wrap',
    marginTop: 16,
   minHeight: 200,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton:{
    backgroundColor: '#585CE4',
    borderRadius: 10,
    padding: 13,
    position:'relative',
    width:'100%',
    bottom:20

  },
});

export default TrackOrder;
