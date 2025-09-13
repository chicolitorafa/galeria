import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  SafeAreaView,
  Alert,
  Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import CameraScreen from '../../components/CameraScreen'

const { width } = Dimensions.get('window')
const imageSize = (width - 60) / 3

const GalleryScreen = () => {
  const [photos, setPhotos] = useState([])
  const [showCamera, setShowCamera] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [showPictureSaved, setShowPictureSaved] = useState(false)
  const [location, setLocation] = useState(null)

  // Carregar fotos salvas quando o componente montar
  useEffect(() => {
    loadSavedPhotos()
  }, [])


  // Pega a localização ao iniciar
  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    }

    getCurrentLocation()
  }, [])

  // Função para carregar fotos do AsyncStorage
  const loadSavedPhotos = async () => {
    try {
      const savedPhotos = await AsyncStorage.getItem('@gallery_photos')
      if (savedPhotos) {
        setPhotos(JSON.parse(savedPhotos))
      }
    } catch (error) {
      console.error('Erro ao carregar fotos:', error)
    }
  }

  // Função para salvar fotos no AsyncStorage
  const savePhotos = async (newPhotos) => {
    try {
      await AsyncStorage.setItem('@gallery_photos', JSON.stringify(newPhotos))
    } catch (error) {
      console.error('Erro ao salvar fotos:', error)
    }
  }

  // Callback quando uma foto é tirada na câmera
  const handlePhotoTaken = (photo) => {
    
    const newPhoto = {
      id: Date.now().toString(),
      uri: photo.uri,
      timestamp: new Date().toISOString(),
      altitude: location.coords.altitude,
      latitude: location.coords.latitude
    }

    // Adiciona no início
    const updatedPhotos = [newPhoto, ...photos]
    setPhotos(updatedPhotos)
    savePhotos(updatedPhotos)
    
    // Fechar câmera automaticamente após tirar a foto
    setShowCamera(false)
    
    // Abre o modal de sucesso
    setShowPictureSaved(true)
  }

  // Função para fechar a câmera
  const handleCloseCamera = () => {
    setShowCamera(false)
  }

  // Função para abrir foto em tela cheia
  const openPhoto = (photo) => {
    setSelectedPhoto(photo)
    setShowPhotoModal(true)
  }

  // Função para deletar foto
  const deletePhoto = (photoId) => {
    Alert.alert(
      'Deletar Foto',
      'Tem certeza que deseja deletar esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => {
            const updatedPhotos = photos.filter(photo => photo.id !== photoId)
            setPhotos(updatedPhotos)
            savePhotos(updatedPhotos)
            setShowPhotoModal(false)
            setSelectedPhoto(null)
          },
        },
      ]
    )
  }

  // Renderizar cada item da galeria
  const renderPhotoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => openPhoto(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.photoImage} />
      <View style={styles.photoOverlay}>
        <Ionicons name="expand" size={20} color="white" />
      </View>
    </TouchableOpacity>
  )

  // Botão para adicionar nova foto
  const renderAddButton = () => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => setShowCamera(true)}
      activeOpacity={0.8}
    >
      <Ionicons name="add" size={40} color="#007AFF" />
      <Text style={styles.addButtonText}>Tirar Foto</Text>
    </TouchableOpacity>
  )

  // Renderizar lista vazia
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="images-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>Nenhuma foto na galeria</Text>
      <Text style={styles.emptySubtext}>Toque no botão + para adicionar sua primeira foto</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Galeria de Fotos</Text>
        <Text style={styles.photoCount}>{photos.length} fotos</Text>
      </View>

      {/* Lista de fotos */}
      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.photosList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
        ListHeaderComponent={renderAddButton}
      />

      {/* Modal da Câmera */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraScreen
          onPhotoTaken={handlePhotoTaken}
          onClose={handleCloseCamera}
          initialFacing="back"
          showSaveButton={true}
          autoSave={false}
        />
      </Modal>

      {/* Modal de confirmação da foto */}
      <Modal
        visible={showPictureSaved}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.pictureSavedModalContainer}>
          <View style={styles.pictureSavedModalContent}>
            <Text style={styles.textPictureSaved}>Foto adicionada à galeria!</Text>
            <View style={styles.contentClosePictureSaved}>
              <Pressable onPress={() => setShowPictureSaved(false)} style={styles.buttonClosePictureSaved}>
                <Text style={styles.textClosePictureSaved}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para visualizar foto em tela cheia */}
      <Modal
        visible={showPhotoModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.photoModalContainer}>
          <TouchableOpacity
            style={styles.photoModalBackground}
            onPress={() => setShowPhotoModal(false)}
            activeOpacity={1}
          >
            <View style={styles.photoModalContent}>
              {selectedPhoto && (
                <>
                  <Image
                    source={{ uri: selectedPhoto.uri }}
                    style={styles.fullScreenImage}
                    resizeMode="contain"
                  />
                  
                  {/* Controles do modal */}
                  <View style={styles.photoModalControls}>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => setShowPhotoModal(false)}
                    >
                      <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.modalButton, styles.deleteButton]}
                      onPress={() => deletePhoto(selectedPhoto.id)}
                    >
                      <Ionicons name="trash" size={24} color="white" />
                    </TouchableOpacity>
                  </View>

                  {/* Info da foto */}
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoDataLocation}>
                      Data: {new Date(selectedPhoto.timestamp).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {'\n'}
                      Altitude: {selectedPhoto.altitude}
                      {'\n'}
                      Latitude: {selectedPhoto.latitude}
                    </Text>               
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Botão flutuante para adicionar foto (alternativo) */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setShowCamera(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="camera" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
  },
  photoCount: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  photosList: {
    padding: 15,
    paddingBottom: 100, // Espaço para o botão flutuante
  },
  addButton: {
    height: 120,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 5,
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  photoItem: {
    width: imageSize,
    height: imageSize,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e9ecef',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  photoModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  photoModalBackground: {
    flex: 1,
  },
  photoModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pictureSavedModalContainer:{
    backgroundColor: 'rgba(24, 24, 24, 0.6)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pictureSavedModalContent: {
    backgroundColor: '#fff',
    width: '80%',
    height: '15%',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  textPictureSaved: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01529f'
  },
  buttonClosePictureSaved: {
    marginTop: 8,
    backgroundColor: '#01529f',
    padding: 5,
    borderRadius: 8
  },
  textClosePictureSaved: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  },
  contentClosePictureSaved: {
    flex: 1,
    width: '30%'
  },
  fullScreenImage: {
    width: width,
    height: width,
  },
  photoModalControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  modalButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'rgba(220,53,69,0.8)',
  },
  photoInfo: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  photoDataLocation: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(3, 179, 216, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
})

export default GalleryScreen