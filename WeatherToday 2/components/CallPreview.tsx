import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MicOff, X } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

interface CallPreviewProps {
  onClose: () => void;
}

export const CallPreview: React.FC<CallPreviewProps> = ({ onClose }) => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.iconButton}>
          <MicOff size={24} color="#000" />
        </View>
        <View style={styles.profileContainer}>
          {user?.user_metadata?.avatar_url ? (
            <Image
              source={{ uri: user.user_metadata.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.email?.[0].toUpperCase() ?? 'U'}
              </Text>
            </View>
          )}
          <View style={styles.soundWave}>
            <View style={[styles.bar, styles.bar1]} />
            <View style={[styles.bar, styles.bar2]} />
            <View style={[styles.bar, styles.bar3]} />
          </View>
        </View>
        <View style={styles.iconButton}>
          <Text style={styles.emoji}>👋</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={onClose}>
          <X size={24} color="#ff3b30" />
        </TouchableOpacity>
      </View>
      <Text style={styles.statusText}>No one else is here yet...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  soundWave: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 12,
    marginTop: 5,
    gap: 2,
  },
  bar: {
    width: 3,
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  bar1: { height: 6 },
  bar2: { height: 12 },
  bar3: { height: 8 },
  emoji: {
    fontSize: 24,
  },
  statusText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
}); 