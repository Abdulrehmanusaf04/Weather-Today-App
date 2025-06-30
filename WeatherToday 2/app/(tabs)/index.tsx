import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
  RefreshControl,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import {
  Search,
  MapPin,
  RefreshCw,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Zap,
  Eye,
  Droplets,
  Wind,
  Gauge,
  Sunrise,
  Sunset,
  Thermometer,
} from 'lucide-react-native';
import { WeatherService } from '@/services/weatherService';
import { StorageService } from '@/services/storageService';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  feelsLike: number;
  uvIndex: number;
}

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  useEffect(() => {
    loadSettingsAndWeather();
  }, []);

  const loadSettingsAndWeather = async () => {
    const savedUnit = await StorageService.getItem('unit');
    const unitToUse = (savedUnit as 'metric' | 'imperial') || 'metric';
    setUnit(unitToUse);
    await initializeWeather(unitToUse);
  };
  
  const initializeWeather = async (currentUnit: 'metric' | 'imperial') => {
    try {
      setLoading(true);
      setError(null);

      // Try to get cached data first
      const cachedWeather = await StorageService.getItem('currentWeather');
      if (cachedWeather) {
        setWeatherData(JSON.parse(cachedWeather));
      }

      // Get current location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Please search for a city.');
        setLoading(false);
        // Fallback to a default city if permission denied
        await fetchWeatherByCity('New York', currentUnit);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const weather = await WeatherService.getCurrentWeather(
        location.coords.latitude,
        location.coords.longitude,
        currentUnit
      );
      
      setWeatherData(weather);
      await StorageService.setItem('currentWeather', JSON.stringify(weather));
    } catch (err: any) {
      setError(err.message || 'Failed to load weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city: string, currentUnit: 'metric' | 'imperial') => {
    if (!city.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const weather = await WeatherService.getWeatherByCity(city, currentUnit);
      setWeatherData(weather);
      await StorageService.setItem('currentWeather', JSON.stringify(weather));
      setSearchQuery('');
    } catch (err: any) {
      setError(err.message || 'City not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSettingsAndWeather();
    setRefreshing(false);
  }, []);

  const handleSearchChange = async (text: string) => {
    setSearchQuery(text);
    
    if (text.length >= 3) {
      try {
        const citySuggestions = await WeatherService.searchCities(text);
        setSuggestions(citySuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionPress = async (city: any) => {
    setSearchQuery(city.name);
    setShowSuggestions(false);
    setSuggestions([]);
    await fetchWeatherByCity(city.name, unit);
  };

  const getWeatherIcon = (condition: string) => {
    const lowerCaseCondition = condition.toLowerCase();
    const iconProps = { size: 100, color: '#ffffff' };

    if (lowerCaseCondition.includes('sunny') || lowerCaseCondition.includes('clear')) {
      return <Sun {...iconProps} />;
    }
    if (lowerCaseCondition.includes('cloudy') || lowerCaseCondition.includes('overcast')) {
      return <Cloud {...iconProps} />;
    }
    if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) {
      return <CloudRain {...iconProps} />;
    }
    if (lowerCaseCondition.includes('snow') || lowerCaseCondition.includes('sleet') || lowerCaseCondition.includes('blizzard')) {
      return <CloudSnow {...iconProps} />;
    }
    if (lowerCaseCondition.includes('thunder')) {
      return <Zap {...iconProps} />;
    }
    if (lowerCaseCondition.includes('mist') || lowerCaseCondition.includes('fog')) {
      return <Eye {...iconProps} />;
    }
    // Default icon for other conditions like 'Partly cloudy'
    return <Cloud {...iconProps} />;
  };

  const getGradientColors = (condition: string): [string, string] => {
    const lowerCaseCondition = condition.toLowerCase();

    if (lowerCaseCondition.includes('sunny') || lowerCaseCondition.includes('clear')) {
      return ['#4facfe', '#00f2fe']; // Bright blue sky
    }
    if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle') || lowerCaseCondition.includes('thunder')) {
      return ['#4b6cb7', '#182848']; // Dark stormy blue
    }
    if (lowerCaseCondition.includes('snow') || lowerCaseCondition.includes('sleet') || lowerCaseCondition.includes('blizzard')) {
      return ['#83a4d4', '#b6fbff']; // Icy blue
    }
    // Default for cloudy, overcast, mist, etc.
    return ['#667db6', '#0082c8']; // Standard cloudy blue
  };

  const formatTemperature = (temp: number) => {
    return `${Math.round(temp)}°${unit === 'metric' ? 'C' : 'F'}`;
  };

  if (loading && !weatherData) {
    return (
      <LinearGradient colors={['#667db6', '#0082c8']} style={styles.container}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const gradientColors: [string, string] = weatherData
    ? (getGradientColors(weatherData.condition) as [string, string])
    : ['#667db6', '#0082c8'];

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#fff" />}
        >
          {/* Search Section */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#8b9dc3" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search city..."
                placeholderTextColor="#8b9dc3"
                value={searchQuery}
                onChangeText={handleSearchChange}
                onSubmitEditing={() => fetchWeatherByCity(searchQuery, unit)}
                returnKeyType="search"
              />
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <RefreshCw size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                keyExtractor={(item, index) => `${item.id || index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionPress(item)}
                  >
                    <MapPin size={16} color="#8b9dc3" />
                    <Text style={styles.suggestionText}>
                      {item.name}, {item.country}
                    </Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
              />
            </View>
          )}
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {weatherData && (
            <View style={styles.weatherContent}>
              {/* Main Info */}
              <View style={styles.mainInfoContainer}>
                <View style={styles.locationContainer}>
                  <MapPin size={24} color="#ffffff" />
                  <Text style={styles.locationText}>{weatherData.location}</Text>
                </View>
                <View style={styles.weatherIconContainer}>
                  {getWeatherIcon(weatherData.condition)}
                </View>
                <Text style={styles.temperatureText}>{formatTemperature(weatherData.temperature)}</Text>
                <Text style={styles.conditionText}>{weatherData.description}</Text>
              </View>

              {/* Details Grid */}
              <View style={styles.detailsGrid}>
                <DetailBox icon={<Thermometer size={24} color="#fff" />} label="Feels Like" value={formatTemperature(weatherData.feelsLike)} />
                <DetailBox icon={<Droplets size={24} color="#fff" />} label="Humidity" value={`${weatherData.humidity}%`} />
                <DetailBox icon={<Wind size={24} color="#fff" />} label="Wind Speed" value={`${Math.round(weatherData.windSpeed)} ${unit === 'metric' ? 'km/h' : 'mph'}`} />
                <DetailBox icon={<Gauge size={24} color="#fff" />} label="Pressure" value={`${weatherData.pressure} hPa`} />
                <DetailBox icon={<Sunrise size={24} color="#fff" />} label="Sunrise" value={weatherData.sunrise} />
                <DetailBox icon={<Sunset size={24} color="#fff" />} label="Sunset" value={weatherData.sunset} />
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const DetailBox = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <View style={styles.detailBox}>
    <View style={styles.detailBoxHeader}>
      {icon}
      <Text style={styles.detailBoxLabel}>{label}</Text>
    </View>
    <Text style={styles.detailBoxValue}>{value}</Text>
  </View>
);

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
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  refreshButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 12,
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  mainInfoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  locationText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  weatherIconContainer: {
    marginBottom: 20,
  },
  temperatureText: {
    color: '#ffffff',
    fontSize: 64,
    fontWeight: '300',
    marginBottom: 8,
  },
  conditionText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  weatherContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  detailBox: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  detailBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailBoxLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  detailBoxValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    maxHeight: 200,
  },
  suggestionsList: {
    borderRadius: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  suggestionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});