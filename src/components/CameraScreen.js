import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';

const CameraScreen = ({ 
  onPhotoTaken,           // Callback quando foto é tirada
  onClose,                // Callback para fechar a câmera
  initialFacing = 'back', // Câmera inicial
  showSaveButton = true,  // Mostrar botão salvar
  autoSave = false,       // Salvar automaticamente
}) => {
  const [facing, setFacing] = useState(initialFacing);
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const [flash, setFlash] = useState('off');
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
    if (!mediaLibraryPermission?.granted) {
      requestMediaLibraryPermission();
    }
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos da sua permissão para mostrar a câmera
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleFlash() {
    setFlash(current => {
      const modes = ['off', 'on', 'auto'];
      const currentIndex = modes.indexOf(current);
      return modes[(currentIndex + 1) % modes.length];
    });
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
        });

        setCapturedImage(photo.uri);
        
        // Callback para o componente pai
        if (onPhotoTaken) {
          onPhotoTaken(photo);
        }

        // Auto salvar se configurado
        if (autoSave && mediaLibraryPermission?.granted) {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
          Alert.alert('Salvo!', 'Foto salva automaticamente na galeria!');
        }
        
      } catch (error) {
        console.error('Erro ao tirar foto:', error);
        Alert.alert('Erro', 'Não foi possível tirar a foto');
      }
    }
  }

  async function saveToGallery() {
    if (capturedImage && mediaLibraryPermission?.granted) {
      try {
        await MediaLibrary.saveToLibraryAsync(capturedImage);
        Alert.alert('Salvo!', 'Foto salva na galeria com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar:', error);
        Alert.alert('Erro', 'Não foi possível salvar a foto');
      }
    }
  }

  function discardImage() {
    setCapturedImage(null);
  }

  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  // Preview da imagem
  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.previewContainer}>
          {/* Botão fechar no preview */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>

          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          <View style={styles.previewButtons}>
            <TouchableOpacity style={styles.previewButton} onPress={discardImage}>
              <Ionicons name="refresh" size={30} color="white" />
              <Text style={styles.previewButtonText}>Nova Foto</Text>
            </TouchableOpacity>
            
            {showSaveButton && (
              <TouchableOpacity style={styles.previewButton} onPress={saveToGallery}>
                <Ionicons name="save" size={30} color="white" />
                <Text style={styles.previewButtonText}>Salvar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Tela da câmera
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <CameraView 
        style={styles.camera} 
        facing={facing}
        flash={flash}
        ref={cameraRef}
      >
        {/* Header com controles */}
        <View style={styles.headerControls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            <Ionicons 
              name={flash === 'off' ? 'flash-off' : flash === 'on' ? 'flash' : 'flash-outline'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>

        {/* Controles inferiores */}
        <View style={styles.bottomControls}>
          <View style={styles.controlsContainer}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <View style={{ width: 60 }} />
          </View>
          
          <Text style={styles.flashInfo}>
            Flash: {flash === 'off' ? 'Desligado' : flash === 'on' ? 'Ligado' : 'Automático'}
          </Text>
        </View>
      </CameraView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 18,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  flashInfo: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: 40,
  },
  previewButton: {
    alignItems: 'center',
    padding: 15,
  },
  previewButtonText: {
    color: 'white',
    marginTop: 5,
    fontSize: 14,
  },
});

export default CameraScreen;