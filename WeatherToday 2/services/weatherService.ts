import axios from 'axios';

const API_KEY = 'e88eb1df6a824268a5115217252306';
const API_URL = 'https://api.weatherapi.com/v1';

const formatCurrentWeatherData = (data: any, unit: 'metric' | 'imperial') => {
  const { location, current, forecast } = data;
  return {
    location: `${location.name}, ${location.country}`,
    temperature: unit === 'metric' ? current.temp_c : current.temp_f,
    condition: current.condition.text,
    description: current.condition.text,
    humidity: current.humidity,
    windSpeed: unit === 'metric' ? current.wind_kph : current.wind_mph,
    pressure: current.pressure_mb,
    visibility: unit === 'metric' ? current.vis_km : current.vis_miles,
    feelsLike: unit === 'metric' ? current.feelslike_c : current.feelslike_f,
    uvIndex: current.uv,
    lat: location.lat,
    lon: location.lon,
    sunrise: forecast.forecastday[0].astro.sunrise,
    sunset: forecast.forecastday[0].astro.sunset,
  };
};

const formatForecastData = (data: any, unit: 'metric' | 'imperial') => {
  const { forecast } = data;
  return forecast.forecastday.map((day: any) => ({
    date: day.date,
    minTemp: unit === 'metric' ? day.day.mintemp_c : day.day.mintemp_f,
    maxTemp: unit === 'metric' ? day.day.maxtemp_c : day.day.maxtemp_f,
    condition: day.day.condition.text,
    icon: `https:${day.day.condition.icon}`,
  }));
};

const getWeatherData = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: query,
        days: 7,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data.error) {
      console.error('WeatherAPI Error:', error.response.data.error.message);
      throw new Error(error.response.data.error.message);
    }
    console.error('Network or other error:', error.message);
    throw new Error('Could not connect to the weather service.');
  }
};

const getCurrentWeather = async (lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') => {
  const data = await getWeatherData(`${lat},${lon}`);
  return formatCurrentWeatherData(data, unit);
};

const getWeatherByCity = async (city: string, unit: 'metric' | 'imperial' = 'metric') => {
  const data = await getWeatherData(city);
  return formatCurrentWeatherData(data, unit);
};

const getForecast = async (lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') => {
  const data = await getWeatherData(`${lat},${lon}`);
  return formatForecastData(data, unit);
};

const searchCities = async (query: string) => {
  if (query.length < 3) return []; // Don't search for less than 3 characters
  try {
    const response = await axios.get(`${API_URL}/search.json`, {
      params: {
        key: API_KEY,
        q: query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('City search error:', error);
    return []; // Return empty array on error
  }
};

export const WeatherService = {
  getCurrentWeather,
  getWeatherByCity,
  getForecast,
  searchCities,
};