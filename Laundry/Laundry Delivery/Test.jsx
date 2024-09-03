import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/Foundation';
const DOMAIN_NAME = 'https://laundry.mtstech.online/';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBY3UkPgOpTUTa_KbunYXOiZEz0aYOOJ7o'; // Replace with your actual API key

export default function App({ route }) {
  
  const { orderId, userCoordinates } = route.params;
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isChoosingDestination, setIsChoosingDestination] = useState(false);
  const [time, setTime] = useState('');
  const [distance, setDistance] = useState('');
  const mapRef = useRef(null);

  const defaultLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setLocation(currentLocation);
        setSource(currentLocation); // Set current location as source
        setLoading(false);
  
        // Prepare the headers and body for the API request
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
        const raw = JSON.stringify({
          order_id: orderId, // Use the orderId from route.params
          coordinates: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: currentLocation.latitudeDelta,
            longitudeDelta: currentLocation.longitudeDelta,
          },
        });
  
        const requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
  
        // Send the location to the server
        fetch(`${DOMAIN_NAME}api/updateRunnerLocation`, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.error(error));
      },
      error => {
        Alert.alert(
          'Error',
          `Failed to get your location: ${error.message}. Make sure your location is enabled.`,
        );
        setLocation(defaultLocation);
        setSource(defaultLocation); // Set default location as source
        setLoading(false);
      }
    );
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
            const locationInterval = setInterval(getCurrentLocation, 30000);
            return () => clearInterval(locationInterval);
          } else {
            Alert.alert(
              'Permission Denied',
              'Location permission is required to show your current location on the map.',
            );
            setLocation(defaultLocation);
            setSource(defaultLocation); // Set default location as source
            setLoading(false);
          }
        } catch (err) {
          console.warn(err);
          setLocation(defaultLocation);
          setSource(defaultLocation); // Set default location as source
          setLoading(false);
        }
      } else {
        getCurrentLocation();
        // Refresh location every minute
        const locationInterval = setInterval(getCurrentLocation, 30000);
        return () => clearInterval(locationInterval);
      }
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    // Set userCoordinates as the initial destination
    if (userCoordinates) {
      setDestination(userCoordinates);
    }
  }, [userCoordinates]);

  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate; // Get the coordinates from the event
    if (isChoosingDestination) {
      setDestination(coordinate);
      setIsChoosingDestination(false);
    }
  };

  const zoomToMarker = marker => {
    if (mapRef.current && marker) {
      mapRef.current.animateToRegion({
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
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
            onPress={handleMapPress}
            trafficEnabled={true} // Enable traffic layer
          >
            {/* Render default markers */}
            <Marker coordinate={location} />
            {/* Render main markers */}
            {source && (
              <Marker
                coordinate={source}
                title={'Source'}
                description={'Your source location'}
                pinColor={'green'}
                onPress={() => zoomToMarker(source)}
              />
            )}
            {destination && (
              <Marker
                coordinate={destination}
                title={'Destination'}
                description={'Your destination location'}
                pinColor={'red'}
                onPress={() => zoomToMarker(destination)}
              />
            )}
            {source && destination && (
              <MapViewDirections
                origin={source}
                destination={destination}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={4}
                strokeColor="blue"
                timePrecision="now" // Add timePrecision prop
                onReady={result => {
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: 20,
                      bottom: 20,
                      left: 20,
                      top: 20,
                    },
                  });
                  setTime(result.duration.toFixed(0)); // Set time
                  setDistance(result.distance.toFixed(2)); // Set distance
                }}
              />
            )}
          </MapView>
          <TouchableOpacity onPress={getCurrentLocation} style={styles.refrshContainer}>
      <Icon name="refresh" marginLeft={3}  size={30} color="#FFFFFF" />
      </TouchableOpacity>
          <View style={styles.timeContainer}>
            <Text style={styles.infoContainerText} >{time} mins</Text>
            </View>
            <View style={styles.distanceContainer}>
            <Text style={styles.infoContainerText} >{distance} km</Text>
          </View>
        </>
      )}
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  refrshContainer:{
    height:50,
    width:50,
    justifyContent:'center',
    alignContent:'center',
    position: 'absolute',
    bottom: 140,
    right:30,
    backgroundColor: '#585CE4',
    padding: 10,
    borderRadius: 70,
  },
  timeContainer: {
    height:70,
    width:70,
    position: 'absolute',
    bottom: 30,
    left:20,
    backgroundColor: '#585CE4',
    padding: 10,
    borderRadius: 70,
  },
  distanceContainer: {
    height:70,
    width:70,
    position: 'absolute',
    bottom: 30,
    right:20,
    backgroundColor: '#585CE4',
    padding: 10,
    borderRadius: 70,
  },
  infoContainerText:{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 5,
  }
});
