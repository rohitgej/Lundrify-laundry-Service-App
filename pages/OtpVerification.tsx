// import React, { useState, useEffect } from 'react';
// import { Button, TextInput,StyleSheet,View,Text, Touchable, TouchableOpacity } from 'react-native';
// import auth from '@react-native-firebase/auth';

// function OtpVerification() {
//   // If null, no SMS has been sent
  
//   const [confirm, setConfirm] = useState(null);

//   // verification code (OTP - One-Time-Passcode)
//   const [code, setCode] = useState('');

//   // Handle login
//   function onAuthStateChanged(user) {
//     if (user) {
//       // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
//       // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
//       // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
//       // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
//     }
//   }

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber; // unsubscribe on unmount
//   }, []);

//   // Handle the button press
//   async function signInWithPhoneNumber(phoneNumber) {
//     const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
//     setConfirm(confirmation);
//   }

//   async function confirmCode() {
//     try {
//       const res =await confirm.confirm(code);
//       console.warn(res);
//       console.warn("verified successfully");
      
//     } catch (error) {
//       console.warn('Invalid code.');
//     }
//   }

//   if (!confirm) {
//     return (
//       <View style={styles.mainContainer}>
//       <Button
//         title="Phone Number Sign in"
//         onPress={() => signInWithPhoneNumber('+91 7008407879')}
//       />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.mainContainer}>
//       <TextInput style={styles.inputSec} value={code} onChangeText={text => setCode(text)} />
//       <Button title="Confirm Code" onPress={() => confirmCode()} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainer:{
//     height: '100%',
//     width: '100%',
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   inputSec:{
//     width:200,
//     marginBottom:20,
//     borderWidth:1
//   }

// })


// export default OtpVerification