import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

// Supabase credentials
const supabaseUrl = 'https://ykjnrzjaloprbcfrvbxr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlram5yemphbG9wcmJjZnJ2YnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2Mzk0MDksImV4cCI6MjA2NjIxNTQwOX0.qAg1lEA95YDlIa8NGLg-4Yhf-qZdedkzeyx0VghRqjc';

// Custom storage implementation for debugging
const customStorage = {
  getItem: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      console.log('Storage getItem:', key, value ? 'has value' : 'no value');
      return value;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log('Storage setItem:', key, 'value set');
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log('Storage removeItem:', key, 'removed');
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Authentication helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'bolt-expo-starter://reset-password',
  });
  return { data, error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  console.log('getSession result:', { session: !!session, error });
  return { session, error };
};

// Manual clear function for testing
export const clearAuthData = async () => {
  try {
    // Clear all possible Supabase auth keys
    const keysToRemove = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'supabase.auth.expiresAt',
      'supabase.auth.expiresIn',
      'supabase.auth.accessToken',
      'supabase.auth.refreshToken',
      'supabase.auth.user',
      'supabase.auth.session'
    ];
    
    for (const key of keysToRemove) {
      await AsyncStorage.removeItem(key);
      console.log('Cleared key:', key);
    }
    
    console.log('Auth data cleared manually');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}; 