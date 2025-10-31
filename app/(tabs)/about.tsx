

import { useCaballero } from '@/components/CaballeroContext';
import React, { useEffect, useState } from 'react';
import { Button, Image, Modal, ScrollView, Text, View } from 'react-native';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AboutScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { caballero } = useCaballero();
  const [batallas, setBatallas] = useState([]);

  useEffect(() => {
    // Consulta las batallas donde participa el caballero
    if (caballero && caballero.nombre) {
  fetch(`${API_URL}/api/batallas/${encodeURIComponent(caballero.nombre)}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setBatallas(data))
        .catch(() => setBatallas([]));
    }
  }, [caballero]);

  if (!caballero) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>No hay caballero consultado.</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {(caballero.imagen && (caballero.imagen.startsWith('http') || caballero.imagen.startsWith('/')))
        ? (
          <View style={{
            maxWidth: 320,
            maxHeight: 220,
            width: '100%',
            height: 'auto',
            borderRadius: 18,
            backgroundColor: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            marginBottom: 10,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
          }}>
            <Image
              source={{ uri: caballero.imagen }}
              style={{ width: '100%', height: 200, borderRadius: 18, objectFit: 'contain' }}
              resizeMode="contain"
              onError={() => alert('No se pudo cargar la imagen')}
            />
          </View>
        )
        : (
          <View style={{
            minWidth: 220,
            minHeight: 140,
            borderRadius: 18,
            backgroundColor: '#eee',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            marginBottom: 10,
          }}>
            <Text style={{ color: '#aaa' }}>Sin imagen</Text>
          </View>
        )}
      <Text style={{ fontSize: 18, color: '#666', marginTop: 10 }}>Constelación: {caballero.constelacion}</Text>
      <Button title="Ver" onPress={() => setModalVisible(true)} />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, maxHeight: '80%' }}>
            <ScrollView>
              <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{caballero.nombre}</Text>
              <Text style={{ fontSize: 18 }}>Signo: {caballero.signo}</Text>
              <Text style={{ fontSize: 18 }}>Rango: {caballero.rango}</Text>
              <Text style={{ fontSize: 18 }}>Constelación: {caballero.constelacion}</Text>
              <Text style={{ fontSize: 18 }}>Género: {caballero.genero}</Text>
              <Text style={{ fontSize: 16, marginVertical: 8 }}>Descripción: {caballero.descripcion}</Text>
              <Text style={{ fontSize: 18, marginTop: 10, fontWeight: 'bold' }}>Batallas:</Text>
              {batallas.length === 0 && <Text>No hay batallas registradas.</Text>}
              {batallas.map((b, i) => (
                <View key={i} style={{ marginBottom: 10 }}>
                  <Text>Fecha: {b.fecha}</Text>
                  <Text>Participantes: {b.participantes.join(', ')}</Text>
                  <Text>Ganador: {b.ganador}</Text>
                  <Text>Ubicación: {b.ubicacion}</Text>
                  <Text>Comentario: {b.comentario}</Text>
                </View>
              ))}
            </ScrollView>
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}