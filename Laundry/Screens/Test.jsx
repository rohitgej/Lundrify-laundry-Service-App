import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Foundation';

const OPENROUTESERVICE_API_KEY = '5b3ce3597851110001cf62486751b9ae87cc4fbdb384f701d0dd8010y'; // Replace with your OpenRouteService API key

export default function App() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const mapRef = useRef(null);

  const defaultLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setLocation(currentLocation);
        setSource(currentLocation);
        setLoading(false);
      },
      (error) => {
        Alert.alert(
          'Error',
          `Failed to get your location: ${error.message}. Make sure your location is enabled.`,
        );
        setLocation(defaultLocation);
        setSource(defaultLocation);
        setLoading(false);
      },
    );
  };

  const fetchRoute = async () => {
    if (source && destination) {
      const coordinates = `${source.longitude},${source.latitude}|${destination.longitude},${destination.latitude}`;
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPENROUTESERVICE_API_KEY}&start=${coordinates}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const route = data.features[0].geometry.coordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        setRouteCoordinates(route);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to show your current location on the map.',
          );
          setLocation(defaultLocation);
          setSource(defaultLocation);
          setLoading(false);
        }
      } catch (err) {
        console.warn(err);
        setLocation(defaultLocation);
        setSource(defaultLocation);
        setLoading(false);
      }
    };

    requestLocationPermission();
  }, []);

  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    setDestination(coordinate);
  };

  useEffect(() => {
    fetchRoute();
  }, [source, destination]);

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
          >
            <UrlTile
              urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
            />
            {source && (
              <Marker
                coordinate={source}
                title={'Source'}
                description={'Your source location'}
                pinColor={'green'}
              />
            )}
            {destination && (
              <Marker
                coordinate={destination}
                title={'Destination'}
                description={'Your destination location'}
                pinColor={'red'}
              />
            )}
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={4}
                strokeColor="blue"
              />
            )}
          </MapView>

          <TouchableOpacity onPress={getCurrentLocation} style={styles.refreshContainer}>
            <Icon name="refresh" size={30} color="#FFFFFF" />
          </TouchableOpacity>
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
  refreshContainer: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: '#585CE4',
    borderRadius: 70,
  },
});
