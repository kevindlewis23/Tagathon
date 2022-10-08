import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Dimensions} from 'react-native';
import { setWarningFilter } from 'react-native/Libraries/LogBox/Data/LogBoxData';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { Geolocation } from 'react-native-geolocation-service';
import { MapView } from 'react-native-maps';




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

const Main = () => {
    return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Menu" component={Menu}/>
            <Stack.Screen name="Map" component={Map}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
} 

const Menu = ({ navigation }) => {

    return (
            <View style={styles.container}>
                <Text style={styles.titleText}>Tagathon</Text>  
                <View>
                    <MainMenuButton title="Play"  onPress={() => navigation.navigate('Map')}/>
                    <MainMenuButton title="Stats"  onPress={() => getPos()}/>
                    <MainMenuButton title="Settings"  onPress={() => Alert.alert('Settings')}/>
                    <MainMenuButton title="Help"  onPress={() => Alert.alert('Kevin?')}/>
                </View>
            </View>
    )
}

const Map = () => {
    return (
      <View style={styles.mapContainer}>
        <MapView style={styles.map} />
        <TagButton title="   Tag  "/>
      </View>

    );
  }

const getPos = () => {
    Geolocation.getCurrentPosition(
        (position) => {
            console.log(position);
        },
        (error) => {
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        //backgroundColor: 'green',
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
        color: 'red',
        marginBottom: 40,
  }, 
tagButtonContainer: {
    backgroundColor: "#009688",
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 12
},

tagButtonText: {
    fontSize: 48,
    color: "red",
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
    marginBottom: 40,
}, 
mapContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 550
    },
map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });

export default Main;