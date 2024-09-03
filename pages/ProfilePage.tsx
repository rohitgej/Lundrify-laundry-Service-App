import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React,{useState} from 'react';


const ProfilePage = () => {

  const[user,setUsers]=useState([]);

  const loadProfile = async () => {
    
    try {
      const response = await fetch("https://node.demodev.shop/api/viewuser", {
        method: "GET",
        redirect: "follow"
      });
      const result = await response.json();
      setUsers(result);
      console.warn(result);


    } catch (error) {
      console.error('Error fetching user data:', error);
    }
   
}





  return (
    <View style={styles.ProfileMain}>

     
      <View style={styles.header}>

        <Text style={styles.headerText}> User Information</Text>
      </View>

      <View style={styles.profileBody}>
        <View style={styles.profileSec}>
          <View style={styles.profileCover}></View>
          <View style={styles.profilePic}></View>
          <Text style={styles.profileName}>First Name</Text>

          <TouchableOpacity onPress={loadProfile} style={styles.button}><Text style={styles.buttonText}>load the profile</Text></TouchableOpacity>

          <View style={styles.infoSection}>
            <Text style={styles.infoHader}>Information</Text>
            <View style={styles.subInfoSec}>
              <View style={styles.subInfoSec1}>
                <Text style={styles.infoTitle}>Full Name</Text>
                <Text style={styles.infoTitle}>Userid</Text>
                <Text style={styles.infoTitle}>Email</Text>
                <Text style={styles.infoTitle}>Password</Text>
                <Text style={styles.infoTitle}>Address</Text>
           
              </View>
              <View style={styles.subInfoSec2}>
                <Text style={styles.infoTitle2}>Rohit kuamr gej</Text>
                <Text style={styles.infoTitle2}>rohit11</Text>
                <Text style={styles.infoTitle2}>rohit@gmail.com</Text>
                <Text style={styles.infoTitle2}>rohit1234</Text>
                <Text style={styles.infoTitle2}>bangalore</Text>

              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  buttonText:{
    color:"white",
    fontSize:15,
  },
  button:{
    width:"100%",
    height:40,
    justifyContent:"center",
    alignItems: "center",
    backgroundColor:"black",
    color:"white",
    marginTop:20,
    marginBottom:10,
   
  },
  ProfileMain: {
    height: '100%',
    width: '100%',
    backgroundColor: '#ECF0F8',
  },
  header: {
    width: '100%',
    height: '10%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBody: {
    width: '100%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCover: {
    width: '95%',
    height: '30%',
    backgroundColor: '#CFD0D1',
    borderRadius: 20,
    margin: 10,
  },

  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Cochin',
  },
  profileSec: {
    width: '95%',
    height: '95%',
    backgroundColor: 'white',
    borderRadius: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: '#ECF0F8',
    position: 'absolute',
    top: 180,
    left: 20,
    borderWidth: 7,
    borderColor: 'white',
  },
  profileName: {
    marginTop: 50,
    marginLeft: 30,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cochin',
    color: 'black',
  },

  infoSection: {
    width: '100%',
    height: '100%',
    marginTop: 10,
  },
  infoHader: {
    paddingLeft: 15,
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cochin',
    color: 'black',
    marginBottom: 10,
  },
  infoTitle: {
    padding: 15,
    fontSize: 15,
    fontFamily: 'Cochin',
    color: 'gray',
  },
  infoTitle2: {
    padding: 15,
    fontSize: 15,
    fontFamily: 'Cochin',
    color: 'black',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  subInfoSec: {
    width: '100%',
    flexDirection: 'row',
  },
  subInfoSec1: {
    width: '50%',
  },

  subInfoSec2: {
    width: '50%',
  },
});

export default ProfilePage;
