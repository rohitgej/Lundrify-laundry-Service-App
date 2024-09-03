import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBY3UkPgOpTUTa_KbunYXOiZEz0aYOOJ7o';

export default function Address() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [houseNo, setHouseNo] = useState('');
  const [block, setBlock] = useState('');
  const [landmark, setLandmark] = useState('');
  const [address, setAddress] = useState('');
  const [isDroppingMarker, setIsDroppingMarker] = useState(false);
  const mapRef = useRef(null);
  const locationIntervalRef = useRef(null);

  const defaultLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setLocation(currentLocation);
        setMarkerPosition(currentLocation); // Set current location as marker position
        setLoading(false);
        await fetchAddress(currentLocation.latitude, currentLocation.longitude);
      },
      error => {
        Alert.alert(
          'Error',
          `Failed to get your location: ${error.message}` +
            ' Make sure your location is enabled.',
        );
        setLocation(defaultLocation);
        setMarkerPosition(defaultLocation); // Set default location as marker position
        setLoading(false);
      }
    );
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_APIKEY}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
        const addressComponents = data.results[0].address_components;
        const houseNo = addressComponents.find(component => 
          component.types.includes('street_number')
        )?.long_name || '';
        const block = addressComponents.find(component => 
          component.types.includes('route')
        )?.long_name || '';
        const landmark = addressComponents.find(component => 
          component.types.includes('sublocality_level_1')
        )?.long_name || 'loading..';
        setHouseNo(houseNo);
        setBlock(block);
        setLandmark(landmark);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
            // Refresh location every minute
            locationIntervalRef.current = setInterval(getCurrentLocation, 60000);
          } else {
            Alert.alert(
              'Permission Denied',
              'Location permission is required to show your current location on the map.',
            );
            setLocation(defaultLocation);
            setMarkerPosition(defaultLocation); // Set default location as marker position
            setLoading(false);
          }
        } catch (err) {
          console.warn(err);
          setLocation(defaultLocation);
          setMarkerPosition(defaultLocation); // Set default location as marker position
          setLoading(false);
        }
      } else {
        getCurrentLocation();
        // Refresh location every minute
        locationIntervalRef.current = setInterval(getCurrentLocation, 60000);
      }
    };

    requestLocationPermission();

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, []);

  const handleMapPress = e => {
    if (isDroppingMarker) {
      const coordinate = e.nativeEvent.coordinate;
      setMarkerPosition(coordinate);
      fetchAddress(coordinate.latitude, coordinate.longitude);
      setIsDroppingMarker(false); // Turn off marker-dropping mode after placing marker
    }
  };

  const toggleDropMarkerMode = () => {
    setIsDroppingMarker(!isDroppingMarker);
  };

  const handleSaveAddress = () => {
    if (markerPosition && address) {
        console.log('house_no:',houseNo);
        console.log('block_no:',block);
      console.log('Address:', address);
      console.log('Coordinates:', markerPosition);
    } else {
      Alert.alert('Error', 'No address or coordinates to save.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation={true}
            region={location}
            onPress={handleMapPress}>
            {/* Render main marker */}
            {markerPosition && (
              <Marker
                coordinate={markerPosition}
                title={'Marker Position'}
                description={address}
              />
            )}
          </MapView>
       
          <View style={styles.inputContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleDropMarkerMode}>
              <Text style={styles.buttonText}>
                {isDroppingMarker ? "Touch Your Desier Place" : "Place Pin Manually"}
              </Text>
            </TouchableOpacity>
          </View>
          
            <TextInput
              style={styles.input}
              placeholder="House No."
              value={houseNo}
              onChangeText={setHouseNo}
            />
            <TextInput
              style={styles.input}
              placeholder="Block"
              value={block}
              onChangeText={setBlock}
            />
            <TextInput
              style={styles.input}
              placeholder="Landmark"
              value={landmark}
              onChangeText={setLandmark}
            />
            <View style={styles.addressinput}>             
             <Text style={styles.addressinputText}>{address}</Text>
              </View> 
             
              <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveAddress}>
              <Text style={styles.saveButtonText}>
              Save Address
              </Text>
            </TouchableOpacity>

          </View>
         
          
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor:'#EEEEFF'
  },
  map: {
    width: '100%',
    height: '40%', // Half screen height
  },
  inputContainer: {
    position: 'absolute',
    top: '45%', // Position inputs below the map
    left: 20,
    right: 20,
  },
  input: {
    backgroundColor:'#f9f9f9',
    borderRadius:10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addressinput: {
   backgroundColor:'#f9f9f9',
   borderRadius:10,
  },
  addressinputText: {
    paddingVertical:20,
    marginBottom: 10,
    color: '#333',
   paddingHorizontal:10,
  },
  buttonContainer: {
marginBottom: 10,
  },
  button: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
   color:'#585CE4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton:{
    marginTop: 10,
    backgroundColor: '#585CE4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText:{
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }

});
