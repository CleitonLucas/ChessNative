// screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);

  const handleModeSelect = (mode: string) => {
    setModalVisible(false);
    navigation.navigate('Queue', { mode });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chess Game</Text>
      <Button title="Jogar" onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha o modo de jogo</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleModeSelect('Clássico')}>
              <Text style={styles.buttonText}>Modo Clássico</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleModeSelect('Rápido')}>
              <Text style={styles.buttonText}>Modo Rápido</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleModeSelect('Blitz')}>
              <Text style={styles.buttonText}>Modo Blitz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, marginBottom: 10 },
  button: { padding: 10, backgroundColor: '#007AFF', marginVertical: 5, borderRadius: 5 },
  buttonText: { color: 'white', textAlign: 'center' },
  closeButton: { marginTop: 10, alignSelf: 'center' },
});
