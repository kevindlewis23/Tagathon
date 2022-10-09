import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native'; 
import { Main } from './frontend'

export default function App() {

return(
  <View style={styles.container_main}>   
    <Main/>
  </View>
)
}

const styles = StyleSheet.create({
  container_main: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
