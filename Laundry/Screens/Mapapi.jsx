import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Button,
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DOMAIN_NAME from '../config/config';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBY3UkPgOpTUTa_KbunYXOiZEz0aYOOJ7o';

export default function App({ route }) {
  const { order_id } = route.params;
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isChoosingDestination, setIsChoosingDestination] = useState(false);
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
        setLoading(false);
      },
      error => {
        Alert.alert(
          'Error',
          `Failed to get your location: ${error.message}. Make sure your location is enabled.`,
        );
        setLocation(defaultLocation);
        setLoading(false);
      }
    );
  };

  const fetchDestination = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order_id, userId }),
      };

      const response = await fetch(
        `${DOMAIN_NAME}api/getrunner-userlocation`,
        requestOptions
      );
      const result = await response.json();

      const runnerCoordinates = result.runner_location.coordinates;
      const userCoordinates = result.user_address_coordinates;

      const sourceLocation = {
        latitude: userCoordinates.latitude,
        longitude: userCoordinates.longitude,
        latitudeDelta: userCoordinates.latitudeDelta,
        longitudeDelta: userCoordinates.longitudeDelta,
      };

      const destinationLocation = {
        latitude: runnerCoordinates.latitude,
        longitude: runnerCoordinates.longitude,
        latitudeDelta: runnerCoordinates.latitudeDelta,
        longitudeDelta: runnerCoordinates.longitudeDelta,
      };

      setSource(sourceLocation);
      setDestination(destinationLocation);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
            const locationInterval = setInterval(getCurrentLocation, 60000);
            return () => clearInterval(locationInterval);
          } else {
            Alert.alert(
              'Permission Denied',
              'Location permission is required to show your current location on the map.'
            );
            setLocation(defaultLocation);
            setLoading(false);
          }
        } catch (err) {
          console.warn(err);
          setLocation(defaultLocation);
          setLoading(false);
        }
      } else {
        getCurrentLocation();
        const locationInterval = setInterval(getCurrentLocation, 60000);
        return () => clearInterval(locationInterval);
      }
    };

    requestLocationPermission();
    fetchDestination();
    const destinationInterval = setInterval(fetchDestination, 3000);
    return () => clearInterval(destinationInterval);
  }, []);

  const handleMapPress = e => {
    if (isChoosingDestination) {
      setDestination(e.nativeEvent.coordinate);
      setIsChoosingDestination(false);
    }
  };

  const showCoordinates = () => {
    if (source && destination) {
      mapRef.current.fitToCoordinates([source, destination], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    } else {
      Alert.alert(
        'Select Locations',
        'Please select a destination to show the route.'
      );
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
            onPress={handleMapPress}>
            {source && (
              <Marker
                coordinate={source}
                title={'Source'}
                description={'Your source location'}
                onPress={() => zoomToMarker(source)}
              >
                <Image
                  source={require('./images-removebg-preview.png')}
                  style={{ width: 30, height: 45 }}
                />
              </Marker>
            )}
            {destination && (
              <Marker
                coordinate={destination}
                title={'Destination'}
                description={'Your destination location'}
                onPress={() => zoomToMarker(destination)}
              >
                <Image
                  source={require('./FH9OH3mVIAMOcTZ-removebg-preview.png')}
                  style={{ width: 60, height: 60 }}
                />
              </Marker>
            )}
            {source && destination && (
              <MapViewDirections
                origin={source}
                destination={destination}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={6}
                strokeColor="black"
                timePrecision="now"
                onReady={result => {
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: 20,
                      bottom: 20,
                      left: 20,
                      top: 20,
                    },
                  });
                }}
              />
            )}
          </MapView>
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
});
