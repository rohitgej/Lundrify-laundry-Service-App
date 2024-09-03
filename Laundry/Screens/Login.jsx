import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DOMAIN_NAME from '../config/config';

const Login = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');

  const handleLogin = async () => {
    if (mobileNumber.length === 10) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        mobile_no: mobileNumber
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      try {
        const response = await fetch(`${DOMAIN_NAME}api/registration`, requestOptions);
        const result = await response.json();

        if (response.ok) {
          // Save login status
          console.log(result);
          currentOTP=result.otp;
          const user_id=result.user_id;
          await AsyncStorage.setItem('user_id', user_id);
          await AsyncStorage.setItem('isLoggedIn', 'true');
          navigation.replace('OTP verification', { mobileNumber,currentOTP,user_id});
        } else {
          Alert.alert('Error', result.message || 'Something went wrong. Please try again.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to connect to the server. Please try again.');
        console.error(error);
      }
    } else {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
    }
  };

  return (
    <View style={styles.maincontainer}>
      <Text style={styles.Title}>Welcome Back</Text>
      <View style={styles.loginContainer}>
        <View style={styles.subContainer}>
          <View>
            <Text style={styles.lable}>Mobile no.</Text>
            <TextInput
              style={styles.input}
              placeholder='Enter your mobile number'
              keyboardType='number-pad'
              maxLength={10}
              onChangeText={(number) => setMobileNumber(number)}
            />
          </View>
          <View>
            <LinearGradient
              colors={['#4c669f', '#3b5998', '#192f6a']}
              style={styles.linearGradient}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login with OTP</Text>
            </TouchableOpacity>
       
          </View>
          <Text style={styles.subtitle}>
            By creating or logging into account you are agreeing with our term and condition and privacy statement
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    maincontainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'flex-end',
    },
    loginContainer: {
      width: '100%',
      height: '40%',
      alignItems: 'center',
      backgroundColor: '#585CE4',
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
    },
    Title: {
      marginBottom: 40,
      fontSize: 30,
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: 'Cochin',
    },
    subContainer: {
      width: '80%',
      height: '60%',
      marginTop: 20,
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 0,
      borderColor: '#225BEC',
      borderRadius: 10,
      marginTop: 10,
      backgroundColor: '#EDEDED',
      fontSize: 16,
      paddingLeft: 10,
    },
    lable: {
      paddingTop: 25,
      color: 'white',
    },
    forgetText: {
      textAlign: 'right',
      color: 'white',
    },
    subtitle: {
      textAlign: 'center',
      padding: 20,
      fontSize: 10,
      color: 'white',
      fontWeight: '400',
    },
    button: {
      width: '100%',
      backgroundColor: '#EEEEFF',
      color: 'white',
      borderRadius: 10,
      padding: 10,
      marginTop: 25,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#454a47',
      fontWeight: 'bold',
      fontSize: 15,
      textAlign: 'center',
    },
    subInfo: {
      marginTop: 40,
      textAlign: 'center',
      color: 'white',
    },
  });

export default Login;
