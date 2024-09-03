import { useState } from 'react';
import { View, Text, TextInput,StyleSheet,TouchableOpacity } from 'react-native'


const Login = () => {
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const saveApi = async () => {

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({

  email,password
}
);

fetch("https://node.demodev.shop/api/login",
    {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      })
  .then((response) => response.text())
  .then((result) => console.warn(result))
  .catch((error) => console.error(error));
        
      };

    
  return (

    <View style={styles.maincontainer}>

      <View>
      <Text style={styles.Title}>Login</Text>
        <View style={styles.subContainer}>


            <View>
            <Text style={styles.lable}>Email:</Text>
            <TextInput style={styles.input} value={email} onChangeText={(text)=>setEmail(text)}/>
            </View>
        
        <View>
            <Text>Password:</Text>
            <TextInput  style={styles.input} value={password} onChangeText={(text)=>setPassword(text)}/>
        </View>

        <View>
            <Text>Remamber me</Text>
            <Text>Forget password?</Text>
        </View>


        <View>
        <TouchableOpacity style={styles.button} onPress={saveApi}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
            <Text style={styles.subInfo} >Don't have an account? Sign up</Text>
            </View>

            
            <Text style={styles.subtitle}> By creating or logging into account you are agreeing with our term and condition and privecy statement</Text>
      </View>
      </View>


    </View>
  )
}

const styles = StyleSheet.create({

    maincontainer:{
        width:'100%',
        height:'100%',
        alignItems: 'center',
        
    },

    subContainer:{
        width:'80%',
        height:'60%'
    },

    Title:{
        marginTop: 80,
        fontSize: 40,
        color: '#225BEC',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Cochin',
    },
    input:{
        width:'100%',
        height: 50,
        borderWidth: 0,
        borderColor: '#225BEC',
        borderRadius: 10,
        marginTop: 10,
        backgroundColor:'#EDEDED'
    },
    lable:{
        paddingTop:20,
    },

    subtitle:{
        fontSize: 10,
        color: 'gray',
        fontWeight: '400'
    },
    button:{
        width:250,
        backgroundColor:'#225BEC',
        color: 'white',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonText:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
        
    },
    subInfo:{
        marginTop: 10,
    }
})



export default Login