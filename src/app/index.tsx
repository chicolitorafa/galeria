import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Image, TouchableOpacity, Button } from 'react-native'
import { Link } from 'expo-router'

export default function App() {

  return (
    <View style={styles.container}>
      <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
      />
      <View style={styles.boxContainer}>
        <Text style={styles.text}>Bem vindo(a) a galeria de fotos!</Text>
      </View>

      <Link href='/pages/gallery' asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  boxContainer: {
    padding: 16,
    backgroundColor: '#01b1d8',
    borderRadius: 8,
    marginBottom: 50
  },
  logo: {
    height: 250,
    width: 250,
  },
  button: {
    backgroundColor: '#007ebc',
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  buttonText: {
    padding: 16,
    backgroundColor: '#007ebc',
    borderRadius: 8,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  }
});