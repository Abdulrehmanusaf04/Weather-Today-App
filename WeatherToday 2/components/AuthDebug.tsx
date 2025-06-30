import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { clearAuthData } from '@/services/supabase';

export const AuthDebug: React.FC = () => {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    console.log('Debug: Manual sign out triggered');
    await signOut();
  };

  const handleClearAuth = async () => {
    console.log('Debug: Manual auth clear triggered');
    await clearAuthData();
    // Force reload by signing out
    await signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth Debug Info</Text>
      <Text style={styles.text}>Loading: {loading ? 'Yes' : 'No'}</Text>
      <Text style={styles.text}>User: {user ? user.email : 'None'}</Text>
      <Text style={styles.text}>User ID: {user?.id || 'None'}</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Debug Sign Out</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClearAuth}>
        <Text style={styles.buttonText}>Clear Auth Data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  clearButton: {
    backgroundColor: '#ff9500',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
  },
}); 