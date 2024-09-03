import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DOMAIN_NAME from '../config/config';

const Otpverification = ({ route, navigation }) => {
  const { mobileNumber } = route.params;
  const {currentOTP}=route.params;
  const {user_id} = route.params;

  const [otp, setOtp] = useState({ input1: '', input2: '', input3: '', input4: '' });

  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);

  const handleChange = (text, ref, nextRef, index) => {
    const newOtp = { ...otp, [`input${index}`]: text };
    setOtp(newOtp);
    if (text.length === 1 && nextRef.current) {
      nextRef.current.focus();
    }
  };

  const handleKeyPress = (e, ref) => {
    if (e.nativeEvent.key === 'Backspace' && ref.current) {
      ref.current.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = `${otp.input1}${otp.input2}${otp.input3}${otp.input4}`;
    if (otpCode.length === 4) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        mobile_no: mobileNumber,
        otp: otpCode
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      try {
        const response = await fetch(`${DOMAIN_NAME}api/login`, requestOptions);
        const result = await response.json();

        if (response.ok) {
          // Save login status
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('mobileNumber', mobileNumber); // Store mobileNumber in AsyncStorage
          console.log("validate");
          console.log(mobileNumber);
          navigation.replace('HomeScreen');
        } else {
          Alert.alert('Error','Invalid OTP. Please try again.');
          await AsyncStorage.setItem('isLoggedIn', 'false');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to verify OTP. Please try again.');
        console.error(error);
      }
    } else {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP.');
    }
  };

  return (
    <View style={styles.otpMainContainer}>
      <Text style={styles.verifyHeader}>We are sending you an OTP to verify your phone number</Text>
      <Text style={styles.otpTitle}>Please Enter your code here</Text>
      <View style={styles.inputSection}>
        <TextInput
          ref={input1}
          style={styles.otpinput}
          keyboardType="numeric"
          maxLength={1}
          onChangeText={(text) => handleChange(text, input1, input2, 1)}
          onKeyPress={(e) => handleKeyPress(e, input1)}
        />
        <TextInput
          ref={input2}
          style={styles.otpinput}
          keyboardType="numeric"
          maxLength={1}
          onChangeText={(text) => handleChange(text, input2, input3, 2)}
          onKeyPress={(e) => handleKeyPress(e, input1)}
        />
        <TextInput
          ref={input3}
          style={styles.otpinput}
          keyboardType="numeric"
          maxLength={1}
          onChangeText={(text) => handleChange(text, input3, input4, 3)}
          onKeyPress={(e) => handleKeyPress(e, input2)}
        />
        <TextInput
          ref={input4}
          style={styles.otpinput}
          keyboardType="numeric"
          maxLength={1}
          onChangeText={(text) => handleChange(text, input4, input4, 4)}
          onKeyPress={(e) => handleKeyPress(e, input3)}
        />
      </View>
      <Text style={styles.otpsubtitle}>I didn't receive a code</Text>
      <Text>Resend OTP</Text>
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>
      <Text>{currentOTP}</Text>
      <Text>{user_id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  otpMainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EEEEFF',
    alignItems: 'center',
  },
  otpsubtitle: {
    marginTop: 25,
  },
  verifyHeader: {
    width: '80%',
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
    marginTop: '25%',
    marginBottom: 10,
    textAlign: 'center'
  },
  otpTitle: {
    color: 'black',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 30,
    marginBottom: 20,
  },
  inputSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginTop: 20,
  },
  otpinput: {
    width: 50,
    height: 70,
    borderRadius: 10,
    borderColor: '#000',
    textAlign: 'center',
    margin: 5,
    fontSize: 18,
    backgroundColor: 'white'
  },
  verifyButton: {
    width: "60%",
    backgroundColor: '#585CE4',
    color: 'white',
    borderRadius: 10,
    padding: 13,
    marginTop: 25,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  verifyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Otpverification;
