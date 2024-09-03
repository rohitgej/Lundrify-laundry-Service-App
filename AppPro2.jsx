import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import RNRestart from 'react-native-restart'; 
import Login from './Laundry/Laundry Delivery/Login';
import Otpverification from './Laundry/Laundry Delivery/Otpverification';
import Orders from './Laundry/Laundry Delivery/Orders';
import OrderDetails from './Laundry/Laundry Delivery/OrderDetails';
import Mapapi from './Laundry/Laundry Delivery/Mapapi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import Test from "./Laundry/Screens/Test";

const Stack = createNativeStackNavigator();

const AppPro2 = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    RNRestart.Restart();
  };

  const LogoutButton = () => (
    <TouchableOpacity onPress={logout} style={styles.iconContainer}>
      <Icon name="logout" size={26} color="gray" />
    </TouchableOpacity>
  );

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

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            {/* <Stack.Screen 
              name="Orders" 
              component={Orders} 
              options={{ 
                headerRight: () => <LogoutButton />
              }}
            /> */}
            <Stack.Screen name="Test" component={Test} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />
            <Stack.Screen name="Map" component={Mapapi} />
          </>
        ) : (
          <>
             <Stack.Screen name="Test" component={Test} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="OTP verification" component={Otpverification} />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />
            <Stack.Screen name="Map" component={Mapapi} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 10,
  },
});

export default AppPro2;

  {/* <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
  
        <Stack.Screen name="Orders" component={Orders} />
        <Stack.Screen name="Orders details" component={OrderDetails} />
        <Stack.Screen name="Map" component={Mapapi} />
      </Stack.Navigator>
    </NavigationContainer>  */}
   
 {/* <Mapapi/> */}