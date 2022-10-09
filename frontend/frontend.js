import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Dimensions, Platform, TextInput} from 'react-native';
import { setWarningFilter } from 'react-native/Libraries/LogBox/Data/LogBoxData';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapView, { Camera, Marker } from 'react-native-maps';
import { io }  from 'socket.io/client-dist/socket.io';

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

const Map = (markers) => {
  return (
    <View style={styles.mapContainer}>
      <MapView style={styles.map} showsUserLocation={true} mapType="standard" followsUserLocation={true} zoomEnabled={true} scrollEnabled={true} rotateEnabled={true}>
      {/* if (markers) 
        {markers.playerStates.map((marker, index) => (
        <Marker
          key={index}
          coordinate={{latitude: marker.user.gps.x, longitude: marker.user.gps.y}}
          title={marker.title}
          description={marker.description}
          pinColor={'#BB0000'}
        />
        ))} */}
      </MapView>
      <TagButton title="Tag"/>
    </View>
  );
}

const Login = ({ navigation }) => {
  const [name, setName] = useState('');
  const [pn, setPn] = useState('');
  const [room, setRoom] = useState('');

  const socket = io("http://localhost:3000");
  
  const signUp = () => socket.emit('signup', {phone: pn, name: name});

  return (
          <View>
              <Text style={styles.titleText}>Info</Text>  
              <View>
                <Text style={formText}>Name</Text>
              <TextInput
                  style={{height: 40}}
                  placeholder="Name"
                  onChangeText={newName => setName(newName)}
                  defaultValue={name}
                />
                <Text style={formText}>Phone Number</Text>
                  <TextInput
                  style={{height: 40}}
                  placeholder="Phone Number"
                  onChangeText={newPn => setPn(newPn)}
                  defaultValue={pn}
                />
                <Text style={formText}>Room</Text>
                <TextInput
                  style={{height: 40}}
                  placeholder="Room"
                  onChangeText={newRoom => setRoom(newRoom)}
                  defaultValue={room}
                />
                <MainMenuButton title="Play"  onPress={() => {signUp(); navigation.navigate('Map')}}/>
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
  
  formText: {
    fontSize: 24,
    color: "red",
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'lucida grande',
},

formBox: {
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 12,
  textAlign: 'center',
  justifyContent: 'center'
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