import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Sun, Cloud, CloudRain, CloudSnow, Zap } from 'lucide-react-native';

interface WeatherCardProps {
  temperature: number;
  condition: string;
  description: string;
  location: string;
  onPress?: () => void;
  unit: 'metric' | 'imperial';
}

export function WeatherCard({
  temperature,
  condition,
  description,
  location,
  onPress,
  unit,
}: WeatherCardProps) {
  const getWeatherIcon = (condition: string) => {
    const iconProps = { size: 48, color: '#4facfe' };
    
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun {...iconProps} />;
      case 'clouds':
        return <Cloud {...iconProps} />;
      case 'rain':
        return <CloudRain {...iconProps} />;
      case 'snow':
        return <CloudSnow {...iconProps} />;
      case 'thunderstorm':
        return <Zap {...iconProps} />;
      default:
        return <Cloud {...iconProps} />;
    }
  };

  const formatTemperature = (temp: number) => {
    return `${Math.round(temp)}°${unit === 'metric' ? 'C' : 'F'}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>{location}</Text>
      </View>
      
      <View style={styles.weatherContent}>
        <View style={styles.iconContainer}>
          {getWeatherIcon(condition)}
        </View>
        
        <View style={styles.temperatureContainer}>
          <Text style={styles.temperatureText}>
            {formatTemperature(temperature)}
          </Text>
          <Text style={styles.descriptionText}>
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperatureText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '300',
    marginBottom: 4,
  },
  descriptionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});