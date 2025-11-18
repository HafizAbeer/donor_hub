import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Generate a simple token (in production, use JWT or secure token)
const generateToken = (email) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // Create a simple token format: email_timestamp_random
  const tokenString = `${email}_${timestamp}_${random}`;
  // Use base64 encoding
  try {
    return btoa(unescape(encodeURIComponent(tokenString)));
  } catch {
    // Fallback if btoa fails
    return tokenString.split('').map(c => c.charCodeAt(0).toString(16)).join('');
  }
};

// Verify token exists and is valid
const verifyToken = (token) => {
  if (!token || typeof token !== 'string' || token.length < 10) return false;
  try {
    // Try to decode
    let decoded;
    try {
      decoded = decodeURIComponent(escape(atob(token)));
    } catch {
      // If base64 decode fails, check if it's hex format
      if (token.match(/^[0-9a-f]+$/i)) {
        decoded = token; // Accept hex format as valid
      } else {
        return false;
      }
    }
    // Check if decoded contains expected parts
    if (decoded.includes('_')) {
      const parts = decoded.split('_');
      return parts.length >= 2 && parts[0].includes('@');
    }
    // Accept hex format tokens
    return true;
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && verifyToken(storedToken) && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        // Invalid data, clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    // Generate token
    const authToken = generateToken(userData.email);
    
    // Store token and user
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };

  const isSuperAdmin = user?.role === 'superadmin';
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';
  const isAuthenticated = !!(user && token && verifyToken(token));

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isSuperAdmin, 
      isAdmin, 
      isUser, 
      isAuthenticated,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

