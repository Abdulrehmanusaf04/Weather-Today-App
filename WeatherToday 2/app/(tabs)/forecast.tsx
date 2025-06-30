import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Thermometer } from 'lucide-react-native';
import { WeatherService } from '@/services/weatherService';
import { StorageService } from '@/services/storageService';

export default function ForecastScreen() {
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  useEffect(() => {
    loadForecastData();
  }, []);

  const loadForecastData = async () => {
    try {
      setLoading(true);
      setError(null);
      const savedUnit = await StorageService.getItem('unit');
      const unitToUse = (savedUnit as 'metric' | 'imperial') || 'metric';
      setUnit(unitToUse);

      const cachedWeather = await StorageService.getItem('currentWeather');
      if (!cachedWeather) {
        setError('No location set. Please go to the weather tab first.');
        setLoading(false);
        return;
      }

      const { lat, lon } = JSON.parse(cachedWeather);
      const forecastData = await WeatherService.getForecast(lat, lon, unitToUse);
      setForecast(forecastData);
    } catch (err: any) {
      setError(err.message || 'Could not fetch forecast.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadForecastData();
    setRefreshing(false);
  }, []);

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  if (loading) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading Forecast...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Calendar size={24} color="#4facfe" />
          <Text style={styles.headerTitle}>7-Day Forecast</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        >
          {forecast.map((day, index) => (
            <View key={index} style={styles.dayContainer}>
              <View style={styles.dayInfo}>
                <Text style={styles.dayText}>{getDayOfWeek(day.date)}</Text>
                <Text style={styles.dateText}>{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
              </View>
              <View style={styles.tempContainer}>
                <Image
                  source={{ uri: day.icon }}
                  style={styles.weatherIcon}
                />
                <Text style={styles.conditionText}>{day.condition}</Text>
              </View>
              <View style={styles.tempRange}>
                <Text style={styles.tempText}>{Math.round(day.maxTemp)}°</Text>
                <Text style={styles.tempTextMin}>{Math.round(day.minTemp)}°</Text>
              </View>
            </View>
          ))}
        </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  dayInfo: {
    flex: 1,
  },
  dayText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  conditionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  tempRange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tempTextMin: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});