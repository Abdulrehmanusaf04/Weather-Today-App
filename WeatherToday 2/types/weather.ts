export interface WeatherData {
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

export interface ForecastDay {
  date: string;
  day: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export type TemperatureUnit = 'metric' | 'imperial';
export type Theme = 'light' | 'dark';