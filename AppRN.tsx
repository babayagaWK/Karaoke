import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function AppRN() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 Vocal Remover AI</Text>
      <Text style={styles.subtitle}>Android Version</Text>
      <Text style={styles.status}>✅ React Native Ready!</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 20,
  },
  status: {
    fontSize: 14,
    color: '#22c55e',
    marginTop: 20,
  },
});
