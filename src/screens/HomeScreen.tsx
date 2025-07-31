import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [currentModal, setCurrentModal] = useState<null | 'type' | 'online' | 'mode'>(null);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  const showModal = (type: 'type' | 'online' | 'mode') => {
    setCurrentModal(type);
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideModal = (onHidden?: () => void, animate: boolean = true) => {
    if (animate) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 0.8,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentModal(null);
        if (onHidden) onHidden();
      });
    } else {
      backdropOpacity.setValue(0);
      modalOpacity.setValue(0);
      scale.setValue(0.8);
      setCurrentModal(null);
      if (onHidden) onHidden();
    }
  };

  const handlePlay = () => showModal('type');

  const handleLocalPlay = () => {
    hideModal(() => showModal('mode'), false);
  };

  const handleOnlinePlay = () => {
    hideModal(() => showModal('online'), false);
  };

  const handleOnlineOption = () => {
    hideModal(() => showModal('mode'), false);
  };

  const handleModeSelect = (mode: string) => {
    hideModal(() => navigation.navigate('Queue', { mode }));
  };

  // Corrigido: agora sem parâmetro
  const goToAbout = () => {
    hideModal(() => navigation.navigate('About'));
  };

  const renderModalContent = () => {
    if (!currentModal) return null;

    let title = '';
    let buttons: { label: string; onPress: () => void }[] = [];

    if (currentModal === 'type') {
      title = 'Como deseja jogar?';
      buttons = [
        { label: 'Local', onPress: handleLocalPlay },
        { label: 'Online', onPress: handleOnlinePlay },
      ];
    } else if (currentModal === 'online') {
      title = 'Escolha uma opção online';
      buttons = [
        { label: 'Encontrar partida', onPress: handleOnlineOption },
        { label: 'Encontrar via NFC', onPress: handleOnlineOption },
      ];
    } else if (currentModal === 'mode') {
      title = 'Escolha o modo de jogo';
      buttons = [
        { label: 'Modo Clássico', onPress: () => handleModeSelect('classic') },
        { label: 'Modo Rápido', onPress: () => handleModeSelect('rapid') },
        { label: 'Modo Blitz', onPress: () => handleModeSelect('blitz') },
      ];
    }

    return (
      <TouchableWithoutFeedback onPress={() => hideModal()}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  opacity: modalOpacity,
                  transform: [{ scale }],
                },
              ]}
            >
              <Text style={styles.modalTitle}>{title}</Text>
              {buttons.map((btn, index) => (
                <TouchableOpacity key={index} style={styles.modalButton} onPress={btn.onPress}>
                  <Text style={styles.modalButtonText}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.cancelButton} onPress={() => hideModal()}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/interface-elements/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.menuButton} onPress={handlePlay}>
          <Text style={styles.menuButtonText}>Jogar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Ranking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={goToAbout}>
          <Text style={styles.menuButtonText}>Sobre</Text>
        </TouchableOpacity>
      </View>

      {renderModalContent()}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    gap: 20,
  },
  menuButton: {
    backgroundColor: '#FFE0A1',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: 180,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  menuButtonText: {
    fontSize: 16,
    color: '#4B2E00',
    fontWeight: 'bold',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  modalContent: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B2E00',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#FFE0A1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#4B2E00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#4B2E00',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
