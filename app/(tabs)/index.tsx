import { useCaballero } from '@/components/CaballeroContext';
import { useImagen } from '@/components/ImagenContext';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { Alert, Button, Image, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const TabIndexScreen: React.FC = () => {
  const [showEditSection, setShowEditSection] = useState<'caballero' | 'batalla'>('caballero');

  // --- lógica de gestos ---
  const pinchRef = useRef(null);
  const panRef = useRef(null);
  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);


  // Gestos con GestureDetector (solo móvil)
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = baseScale.value * e.scale;
    })
    .onEnd(() => {
      baseScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = lastTranslateX.value + e.translationX;
      translateY.value = lastTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      scale.value = withSpring(1);
      baseScale.value = 1;
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      lastTranslateX.value = 0;
      lastTranslateY.value = 0;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value }
    ] as any // Forzar el tipo para evitar error de tipo
  }));
  // Estado para edición de caballero y batallas
  const [caballeroEdit, setCaballeroEdit] = useState<any>(null);
  const [batallasEdit, setBatallasEdit] = useState<any[]>([]);

  // useEffect para batallasEdit
  React.useEffect(() => {
    if (caballeroEdit && caballeroEdit.nombre) {
  fetch(`${API_URL.replace(/:3001$/, ':3002')}/api/batallas/${encodeURIComponent(caballeroEdit.nombre)}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setBatallasEdit(data))
        .catch(() => setBatallasEdit([]));
    } else {
      setBatallasEdit([]);
    }
  }, [caballeroEdit]);
  const [nombre, setNombre] = useState('');
  const { caballero, setCaballero } = useCaballero();
  const { imagen, setImagen } = useImagen();
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    nombre: '', signo: '', rango: '', constelacion: '', genero: '', descripcion: '',
    fecha: '', participantes: '', ganador: '', ubicacion: '', comentario: '',
    imagen: ''
  });
  const [editImage, setEditImage] = useState<string | null>(null);

  const pickEditImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setEditImage(result.assets[0].uri);
        Alert.alert('Imagen seleccionada', 'La imagen se ha cargado correctamente');
      } else {
        Alert.alert('Error', 'No se seleccionó ninguna imagen');
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir el selector de imágenes');
    }
  };

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        Alert.alert('Imagen seleccionada', 'La imagen se ha cargado correctamente');
      } else {
        Alert.alert('Error', 'No se seleccionó ninguna imagen');
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir el selector de imágenes');
    }
  };

  const consultarCaballero = async () => {
    try {
      if (!nombre.trim()) {
        Alert.alert('Aviso', 'Ingresa el nombre del caballero');
        return;
      }
      // Cambia la URL por la de tu microservicio
  const url = `${API_URL}/api/caballero/${encodeURIComponent(nombre)}`;
      const res = await fetch(url);
      if (res.ok) {
        const cab = await res.json();
        console.log('Caballero consultado:', cab);
        setCaballero(cab);
        // Si la imagen es una URL completa, úsala directamente; si es relativa, prepende el backend
        let imgUrl = null;
        if (cab.imagen) {
          imgUrl = cab.imagen.startsWith('http') ? cab.imagen : `${API_URL}${cab.imagen}`;
        }
        setImagen(imgUrl);
        if (Platform.OS === 'web') {
          window.alert(`Caballero encontrado: ${cab.nombre}`);
        } else {
          Alert.alert('Caballero encontrado', `Nombre: ${cab.nombre}`);
        }
      } else {
        setCaballero(null);
        setImagen(null);
        if (Platform.OS === 'web') {
          window.alert('No existe en la base de datos');
        } else {
          Alert.alert('No existe en la base de datos');
        }
      }
    } catch {
      setCaballero(null);
      if (Platform.OS === 'web') {
        window.alert('Error de conexión');
      } else {
        Alert.alert('Error de conexión');
      }
    }
  };

  const [modificarModalVisible, setModificarModalVisible] = useState(false);
  const [caballerosLista, setCaballerosLista] = useState<any[]>([]);

  return (
    <View>
      <TextInput
        placeholder="Nombre del caballero"
        value={nombre}
        onChangeText={setNombre}
        style={{ borderWidth: 1, margin: 10, padding: 5 }}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 10, gap: 8, paddingHorizontal: 8 }}>
        <View style={{ flexBasis: '45%', minWidth: 120, margin: 4 }}>
          <Button title="Consultar" onPress={consultarCaballero} />
        </View>
        <View style={{ flexBasis: '45%', minWidth: 120, margin: 4 }}>
          <Button title="Insertar un Caballero" onPress={() => setModalVisible(true)} color="#4CAF50" />
        </View>
        <View style={{ flexBasis: '45%', minWidth: 120, margin: 4 }}>
          <Button title="Eliminar Caballero" color="#e74c3c" onPress={async () => {
            if (!nombre.trim()) {
              Alert.alert('Aviso', 'Ingresa el nombre del caballero a eliminar');
              return;
            }
            try {
              const res = await fetch(`${API_URL}/api/caballero/${encodeURIComponent(nombre)}`, {
                method: 'DELETE',
              });
              if (res.ok) {
                Alert.alert('Eliminado', 'Caballero eliminado correctamente');
                setCaballero(null);
                setImagen(null);
              } else {
                Alert.alert('Error', 'No se pudo eliminar el caballero');
              }
            } catch {
              Alert.alert('Error', 'No se pudo conectar al servidor. Verifica la IP y el backend.');
            }
          }} />
        </View>
        <View style={{ flexBasis: '45%', minWidth: 120, margin: 4 }}>
          <Button title="Listar/Modificar Caballeros" color="#2980b9" onPress={async () => {
            try {
              const res = await fetch(`${API_URL}/api/caballeros`);
              if (res.ok) {
                const lista = await res.json();
                setCaballeroEdit(null); // Para mostrar la lista
                setCaballerosLista(lista); // Debes declarar const [caballerosLista, setCaballerosLista] = useState<any[]>([]);
                setModificarModalVisible(true);
              } else {
                Alert.alert('Error', 'No se pudo obtener la lista');
              }
            } catch {
              Alert.alert('Error', 'No se pudo conectar al servidor. Verifica la IP y el backend.');
            }
          }} />
        </View>
      </View>
      {/* Modal para modificar caballero */}
      <Modal visible={modificarModalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: 'white', padding: 12, borderRadius: 14, width: '96%', maxHeight: '92%' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              <Text style={{ fontSize: 20, marginBottom: 10, textAlign: 'center' }}>Modificar Caballero</Text>
              {!caballeroEdit ? (
                <View>
                  <Text style={{ marginBottom: 10 }}>Selecciona un caballero para editar:</Text>
                  {caballerosLista.map((c) => (
                    <TouchableOpacity key={c._id} style={{ padding: 8, borderBottomWidth: 1, borderColor: '#eee' }} onPress={() => setCaballeroEdit(c)}>
                      <Text>{c.nombre}</Text>
                    </TouchableOpacity>
                  ))}
                  <Button title="Cerrar" onPress={() => setModificarModalVisible(false)} color="#f44336" />
                </View>
              ) : (
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
                    <Button title="Datos del Caballero" onPress={() => setShowEditSection('caballero')} color="#2196F3" />
                    <View style={{ width: 10 }} />
                    <Button title="Batallas" onPress={() => setShowEditSection('batalla')} color="#6C3483" />
                  </View>
                  <View style={{ minHeight: 220, maxHeight: 400, backgroundColor: '#fff', paddingBottom: 8 }}>
                    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                      {showEditSection === 'caballero' && (
                        <View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={styles.label}>Nombre:</Text>
                            <TextInput value={caballeroEdit.nombre} onChangeText={v => setCaballeroEdit((e: any) => ({ ...e, nombre: v }))} style={styles.input} />
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={styles.label}>Signo:</Text>
                            <TextInput value={caballeroEdit.signo} onChangeText={v => setCaballeroEdit((e: any) => ({ ...e, signo: v }))} style={styles.input} />
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={styles.label}>Rango:</Text>
                            <TextInput value={caballeroEdit.rango} onChangeText={v => setCaballeroEdit((e: any) => ({ ...e, rango: v }))} style={styles.input} />
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={styles.label}>Constelación:</Text>
                            <TextInput value={caballeroEdit.constelacion} onChangeText={v => setCaballeroEdit((e: any) => ({ ...e, constelacion: v }))} style={styles.input} />
                          </View>
                        </View>
                      )}
                      {showEditSection === 'batalla' && (
                        <View>
                          {batallasEdit.length === 0 ? (
                            <Text style={{ color: '#888', marginBottom: 8 }}>No hay batallas registradas para este caballero.</Text>
                          ) : (
                            batallasEdit.map((batalla, idx) => (
                              <View key={batalla._id || idx} style={{ marginBottom: 16, padding: 10, borderRadius: 8, backgroundColor: '#f6f6f6', borderWidth: 1, borderColor: '#eee' }}>
                                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Batalla #{idx + 1}</Text>
                                <TextInput
                                  style={styles.input}
                                  value={batalla.fecha || ''}
                                  placeholder="Fecha"
                                  onChangeText={v => {
                                    const nuevas = [...batallasEdit];
                                    nuevas[idx] = { ...nuevas[idx], fecha: v };
                                    setBatallasEdit(nuevas);
                                  }}
                                />
                                <TextInput
                                  style={styles.input}
                                  value={batalla.participantes || ''}
                                  placeholder="Participantes"
                                  onChangeText={v => {
                                    const nuevas = [...batallasEdit];
                                    nuevas[idx] = { ...nuevas[idx], participantes: v };
                                    setBatallasEdit(nuevas);
                                  }}
                                />
                                <TextInput
                                  style={styles.input}
                                  value={batalla.ganador || ''}
                                  placeholder="Ganador"
                                  onChangeText={v => {
                                    const nuevas = [...batallasEdit];
                                    nuevas[idx] = { ...nuevas[idx], ganador: v };
                                    setBatallasEdit(nuevas);
                                  }}
                                />
                                <TextInput
                                  style={styles.input}
                                  value={batalla.ubicacion || ''}
                                  placeholder="Ubicación"
                                  onChangeText={v => {
                                    const nuevas = [...batallasEdit];
                                    nuevas[idx] = { ...nuevas[idx], ubicacion: v };
                                    setBatallasEdit(nuevas);
                                  }}
                                />
                                <TextInput
                                  style={styles.input}
                                  value={batalla.comentario || ''}
                                  placeholder="Comentario"
                                  onChangeText={v => {
                                    const nuevas = [...batallasEdit];
                                    nuevas[idx] = { ...nuevas[idx], comentario: v };
                                    setBatallasEdit(nuevas);
                                  }}
                                />
                              </View>
                            ))
                          )}
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* Imagen principal y datos */}
      <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
        {imagen ? (
          Platform.OS !== 'web' ? (
            <GestureDetector gesture={composedGesture}>
              <Animated.View style={[animatedImageStyle, { width: '100%', maxWidth: 400, height: 220, borderRadius: 18, backgroundColor: '#fff', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }]}> 
                <Image
                  source={{ uri: imagen }}
                  style={{ width: '100%', height: 200, borderRadius: 18 }}
                  resizeMode="contain"
                  onError={() => Alert.alert('Error', 'No se pudo cargar la imagen')}
                />
              </Animated.View>
            </GestureDetector>
          ) : (
            <Animated.View style={[animatedImageStyle, { width: '100%', maxWidth: 400, height: 220, borderRadius: 18, backgroundColor: '#fff', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }]}> 
              <Image
                source={{ uri: imagen }}
                style={{ width: '100%', height: 200, borderRadius: 18 }}
                resizeMode="contain"
                onError={() => Alert.alert('Error', 'No se pudo cargar la imagen')}
              />
            </Animated.View>
          )
        ) : (
          <View style={{ minWidth: 220, minHeight: 140, borderRadius: 18, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#aaa' }}>Sin imagen</Text>
          </View>
        )}
        {caballero && (
          <View style={{ width: '100%', maxWidth: 400, marginTop: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 4 }}>Nombre: {caballero.nombre}</Text>
            <Text style={{ fontSize: 16, marginBottom: 2 }}>Constelación: {caballero.constelacion}</Text>
            <Text style={{ fontSize: 16, marginBottom: 2 }}>Género: {caballero.genero}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  localBox: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    width: 110,
    fontSize: 14,
    color: '#333',
    marginRight: 8,
    textAlign: 'right',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 6,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  imageButton: {
    backgroundColor: '#f3e6fa',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    minWidth: 70,
  },
});

export default TabIndexScreen;