import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Dimensions, Platform, TextInput} from 'react-native';
import { setWarningFilter } from 'react-native/Libraries/LogBox/Data/LogBoxData';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapView from 'react-native-maps';
//import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';

const Stack = createNativeStackNavigator();

const MainMenuButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

const TagButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.tagButtonContainer}>
      <Text style={styles.tagButtonText}>{title}</Text>
    </TouchableOpacity>
);

export const Main = () => {
    return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Menu" component={Menu}/>
            <Stack.Screen name="Map" component={Map}/>
            <Stack.Screen name="Login" component={Login}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
} 

const Menu = ({ navigation }) => {

    return (
            <View style={styles.container}>
                <Text style={styles.titleText}>Tagathon</Text>  
                <View>
                    <MainMenuButton title="Start"  onPress={() => navigation.navigate('Login')}/>
                    <MainMenuButton title="Stats"  onPress={() => TESTGEO()}/>
                    <MainMenuButton title="Settings"  onPress={() => Alert.alert('Settings')}/>
                    <MainMenuButton title="Help"  onPress={() => Alert.alert('Kevin?')}/>                    
                </View>
            </View>
    )
}

//SIgn in user
//Select room you want to join
//Room page
//Display info with who is in your game and all that jazz


const Map = () => {
    return (
        <View style={styles.mapContainer}>
          <MapView style={styles.map} showsUserLocation={true}/>
          <TagButton title="Tag"/>
        </View>
    );
  }

const MapCameraFixed = () => {
  
  return (

    <View style={styles.mapContainer}>
      <MapView style={styles.map} showsUserLocation={true} initialCamera={cam}/>
      <TagButton title="Tag"/>
    </View>
  );
}

  const Login = ({ navigation }) => {
    const [text, setText] = useState('');
    return (
            <View>
                <Text style={styles.titleText}>Info</Text>  
                <View>
                <TextInput
                    style={{height: 40}}
                    placeholder="Type here to translate!"
                    onChangeText={newText => setText(newText)}
                    defaultValue={text}
                  />
                    <TextInput
                    style={{height: 40}}
                    placeholder="Type here to translate!"
                    onChangeText={newText => setText(newText)}
                    defaultValue={text}
                  />
                  <TextInput
                    style={{height: 40}}
                    placeholder="Type here to translate!"
                    onChangeText={newText => setText(newText)}
                    defaultValue={text}
                  />                    
                </View>
            </View>
    )
}

export const getLocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  if (errorMsg) {
    return errorMsg;
  } else if (location) {
    return location;
  }
}

const styles = StyleSheet.create({
  container: {
      paddingTop: 60,
      //backgroundColor: 'green',
      textAlign: 'center',
      justifyContent: 'center'
  },

  titleText: {
      fontSize: 75,
      //Doesnt Work: fontFamily: 'Franklin Gothic Medium',
      fontWeight: 'bold',
      color: 'red',
      textAlign: 'center',
      marginBottom: 80
  },

  tag: {
      fontSize: 48,
      //Doesnt Work: fontFamily: 'Franklin Gothic Medium',
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'red',
      marginBottom: 40,
  }, 
  
  buttonContainer: {
      //backgroundColor: "#009688",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      textAlign: 'center',
      justifyContent: 'center'
  },

  buttonText: {
      fontSize: 48,
      color: "red",
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 40,
      fontFamily: 'lucida grande',
  }, 

  tagButtonContainer: {
      justifyContent: 'center', 
      backgroundColor: "red",
      borderRadius: 100,
      paddingVertical: 10,
      paddingHorizontal: 100, 
  },

  tagButtonText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      margin: 10,
      textAlignVertical: 'center'
  }, 
  
  mapContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 400,
        borderBottomColor: 'gray',
        borderBottomWidth: 5,
      },

  map:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        marginBottom: 55, 
      },
 
    });

export default Main;