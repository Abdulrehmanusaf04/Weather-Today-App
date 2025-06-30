import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, getCurrentUser, getSession } from '@/services/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { session } = await getSession();
        console.log('Initial session:', session?.user?.email || 'none');
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'none');
        console.log('Previous user state:', user?.email || 'none');
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        console.log('New user state:', session?.user?.email || 'none');
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      console.log('Signing out...');
      console.log('Current user before sign out:', user?.email || 'none');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful - waiting for state change');
        
        // Immediately clear the state as a backup
        setUser(null);
        setSession(null);
        
        // Add a fallback timeout in case the auth state change doesn't fire
        setTimeout(() => {
          console.log('Fallback: Checking if user state was updated');
          if (user !== null) {
            console.log('Fallback: Manually clearing user state');
            setUser(null);
            setSession(null);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, clear the state
      setUser(null);
      setSession(null);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 