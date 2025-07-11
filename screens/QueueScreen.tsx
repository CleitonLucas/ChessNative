// screens/QueueScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Queue'>;

export default function QueueScreen({ route, navigation }: Props) {
  const { mode } = route.params;

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Simula encontrar uma partida e vai para a tela de jogo
      navigation.replace('Game', { mode });
    }, 3000); // simula 3 segundos de busca

    return () => clearTimeout(timeout);
  }, [mode]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Procurando partida ({mode})...</Text>
      <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18 },
});
