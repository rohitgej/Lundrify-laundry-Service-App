import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBY3UkPgOpTUTa_KbunYXOiZEz0aYOOJ7o'; 

export default function App({route}) {
  

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
        setSource(currentLocation); // Set current location as source
        setLoading(false);
      },
      error => {
        Alert.alert(
          'Error',
          `Failed to get your location: ${error.message}` +
            ' Make sure your location is enabled.',
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
            const locationInterval = setInterval(getCurrentLocation, 60000);
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
        const locationInterval = setInterval(getCurrentLocation, 60000);
        return () => clearInterval(locationInterval);
      }
    };

    requestLocationPermission();
  }, []);

  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate; // Get the coordinates from the event
    if (isChoosingDestination) {
      setDestination(coordinate);
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

  const removeDestination = () => {
    setDestination(null);
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
                pinColor={'blue'}
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
                }}
              />
            )}
          </MapView>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonGroup}>
              {destination ? (
                <Button
                  title="Remove Destination"
                  onPress={removeDestination}
                />
              ) : (
                <Button
                  title={
                    isChoosingDestination
                      ? 'Please Choose Destination'
                      : 'Choose Destination'
                  }
                  onPress={() => setIsChoosingDestination(true)}
                />
              )}
            </View>
            <Button title="Show Coordinates" onPress={showCoordinates} />
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
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
