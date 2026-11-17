import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking stored auth
    const storedUser = localStorage.getItem('ecoruta_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email, password, role = 'citizen') => {
    // Mock login - in real app, this would call an API
    const mockUser = {
      id: '1',
      name: email.split('@')[0],
      email,
      role,
      points: role === 'citizen' ? 1250 : 0,
      level: 'Eco Guardian',
      avatar: null,
    };
    setUser(mockUser);
    localStorage.setItem('ecoruta_user', JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  }, []);

  const register = useCallback((name, email, password, role = 'citizen') => {
    const mockUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      points: 0,
      level: 'Eco Novato',
      avatar: null,
    };
    setUser(mockUser);
    localStorage.setItem('ecoruta_user', JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ecoruta_user');
  }, []);

  const updateProfile = useCallback((updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('ecoruta_user', JSON.stringify(updatedUser));
    return Promise.resolve(updatedUser);
  }, [user]);

  const addPoints = useCallback((points) => {
    if (user) {
      const updatedUser = { ...user, points: user.points + points };
      setUser(updatedUser);
      localStorage.setItem('ecoruta_user', JSON.stringify(updatedUser));
    }
  }, [user]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    addPoints,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}