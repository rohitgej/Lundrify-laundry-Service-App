import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import HomeScreen from './Laundry/Screens/HomeScreen';
import Categories from './Laundry/Screens/Categories';
import CartPage from './Laundry/Screens/Cart';
import SuccessPage from './Laundry/Screens/SuccessPage';
import Profile from './Laundry/Screens/Profile';
import Account from './Laundry/Screens/Account';
import Order from './Laundry/Screens/Order';
import OrderDetails from './Laundry/Screens/OrderDetails';
import Map from './Laundry/Screens/Mapapi';
import Login from './Laundry/Screens/Login';
import Otpverification from './Laundry/Screens/Otpverification';
import Address from './Laundry/Screens/Address';
import Addresses from './Laundry/Screens/Addresses';
import ManualAdd from './Laundry/Screens/ManualAdd'
import Notification from './Laundry/Screens/Notification';

const Stack = createNativeStackNavigator();

const App= () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loginStatus = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(loginStatus === 'true');
    };

    checkLoginStatus().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log('BootSplash has been hidden successfully');
    });
  }, []);

  const HomeIcon = () => (
    <View style={styles.iconContainer}>
      <Icon name="home" size={26} color="gray" />
    </View>
  );

  const LoginHomeIcon = () => (
    <View style={styles.iconContainer}>
      <Icon name="home" size={26} color="black" />
    </View>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>   
              <Stack.Screen name="Order" component={Order} />
            <Stack.Screen name="Order Details" component={OrderDetails} />
       
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="OTP verification" component={Otpverification} />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{
                headerShadowVisible: false,
                headerTitle: () => <LoginHomeIcon />,
                headerBackVisible: false,
              }}
            />
            <Stack.Screen name="Categories" component={Categories} />
            <Stack.Screen name="Cart" component={CartPage} />
            <Stack.Screen name="Order successful" component={SuccessPage} />
            <Stack.Screen name="Account" component={Account} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Order" component={Order} />
            <Stack.Screen name="Address" component={Address} />
            <Stack.Screen name="Addresses" component={Addresses} />
            <Stack.Screen name="Notification" component={Notification} />
        
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="ManualAdd" component={ManualAdd} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  app: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5FCFF',
  },
  iconContainer: {
    marginLeft: 10,
  }
});

export default App;
