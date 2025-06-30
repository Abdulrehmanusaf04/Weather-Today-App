import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Thermometer,
  Moon,
  Sun,
  MapPin,
  Bell,
  Info,
  Trash2,
  LogOut,
  User,
} from 'lucide-react-native';
import { StorageService } from '@/services/storageService';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedUnit = await StorageService.getItem('unit');
      const savedTheme = await StorageService.getItem('theme');
      const savedNotifications = await StorageService.getItem('notifications');

      if (savedUnit) setUnit(savedUnit as 'metric' | 'imperial');
      if (savedTheme) setIsDarkMode(savedTheme === 'dark');
      if (savedNotifications) setNotificationsEnabled(savedNotifications === 'true');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleUnitChange = async (newUnit: 'metric' | 'imperial') => {
    setUnit(newUnit);
    await StorageService.setItem('unit', newUnit);
  };

  const handleThemeChange = async (value: boolean) => {
    setIsDarkMode(value);
    await StorageService.setItem('theme', value ? 'dark' : 'light');
  };

  const handleNotificationChange = async (value: boolean) => {
    setNotificationsEnabled(value);
    await StorageService.setItem('notifications', value.toString());
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all cached weather data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.removeItem('currentWeather');
              await StorageService.removeItem('forecast');
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Settings: Starting sign out...');
              await signOut();
              console.log('Settings: Sign out completed');
              
              // Force navigation to auth screen
              setTimeout(() => {
                console.log('Settings: Forcing navigation to auth');
                router.replace('/auth/signin');
              }, 100);
            } catch (error) {
              console.error('Settings: Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.content}>
          {/* User Profile Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={20} color="#4facfe" />
              <Text style={styles.sectionTitle}>Account</Text>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userStatus}>Signed in</Text>
            </View>
            
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <LogOut size={16} color="#ff3b30" />
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          {/* Temperature Unit Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Thermometer size={20} color="#4facfe" />
              <Text style={styles.sectionTitle}>Temperature Unit</Text>
            </View>
            
            <View style={styles.optionRow}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  unit === 'metric' && styles.activeUnitButton
                ]}
                onPress={() => handleUnitChange('metric')}
              >
                <Text style={[
                  styles.unitButtonText,
                  unit === 'metric' && styles.activeUnitButtonText
                ]}>
                  Celsius (°C)
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  unit === 'imperial' && styles.activeUnitButton
                ]}
                onPress={() => handleUnitChange('imperial')}
              >
                <Text style={[
                  styles.unitButtonText,
                  unit === 'imperial' && styles.activeUnitButtonText
                ]}>
                  Fahrenheit (°F)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Theme Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              {isDarkMode ? (
                <Moon size={20} color="#4facfe" />
              ) : (
                <Sun size={20} color="#4facfe" />
              )}
              <Text style={styles.sectionTitle}>Appearance</Text>
            </View>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Dark Mode</Text>
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeChange}
                trackColor={{ false: '#767577', true: '#4facfe' }}
                thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color="#4facfe" />
              <Text style={styles.sectionTitle}>Notifications</Text>
            </View>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Weather Alerts</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationChange}
                trackColor={{ false: '#767577', true: '#4facfe' }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Data Management Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Trash2 size={20} color="#4facfe" />
              <Text style={styles.sectionTitle}>Data Management</Text>
            </View>
            
            <TouchableOpacity style={styles.actionButton} onPress={clearCache}>
              <Text style={styles.actionButtonText}>Clear Cache</Text>
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info size={20} color="#4facfe" />
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            
            <View style={styles.aboutContent}>
              <Text style={styles.aboutText}>
                Weather App v1.0.0
              </Text>
              <Text style={styles.aboutSubtext}>
                Beautiful weather forecasts powered by OpenWeatherMap
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  userInfo: {
    marginBottom: 16,
  },
  userEmail: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userStatus: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    gap: 8,
  },
  signOutButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  unitButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeUnitButton: {
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    borderColor: '#4facfe',
  },
  unitButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  activeUnitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  actionButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutContent: {
    alignItems: 'center',
  },
  aboutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  aboutSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
});