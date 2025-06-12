
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MOCK_USER_ID, MOCK_USER_EMAIL } from '../constants';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial auth check
    setLoading(false); 
  }, []);

  const login = async (email: string, _password?: string): Promise<void> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, validate credentials against a backend
    // For demo, if email matches mock, log in. Otherwise, treat as new user for register path.
    if (email === MOCK_USER_EMAIL || localStorage.getItem(`user_${email}`)) {
      const user: User = { id: MOCK_USER_ID, email }; // Use consistent ID or retrieve stored user
      setCurrentUser(user);
    } else {
        // Simple demo: if not mock user, create a new one on login attempt if not existing
        // This is not standard, normally login fails if user doesn't exist.
        // For this demo, let's make login also act as register if user not found for simplicity.
        const user: User = { id: `user_${Date.now()}`, email };
        localStorage.setItem(`user_${email}`, JSON.stringify(user)); // Store user details for "persistence"
        setCurrentUser(user);
    }
    setLoading(false);
  };

  const register = async (email: string, _password?: string): Promise<void> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, create user in backend
    // For demo, create a new user
    const newUser: User = { id: `user_${Date.now()}`, email };
    localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
    setCurrentUser(newUser);
    setLoading(false);
  };

  const logout = (): void => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
