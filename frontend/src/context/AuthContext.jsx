import React, { createContext, useContext, useState, useEffect } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('marjam_token'));
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setLimits(data.user.limits);
      } else {
        // Token invalid
        logout();
      }
    } catch (err) {
      console.error('Auth error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        setLimits(data.limits);
        localStorage.setItem('marjam_token', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.detail || data.error || 'Login failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        setLimits(data.limits);
        localStorage.setItem('marjam_token', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.detail || data.error || 'Registration failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setLimits(null);
    localStorage.removeItem('marjam_token');
  };

  const isAdmin = () => user?.tier === 'admin';
  const isPremium = () => user?.tier === 'premium' || user?.tier === 'admin';
  const isFree = () => user?.tier === 'free';

  const canDownload = () => limits?.can_download ?? false;
  const canUseMood = (mood) => {
    if (!limits) return false;
    return !limits.locked_moods?.includes(mood.toLowerCase());
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      limits,
      loading,
      login,
      register,
      logout,
      isAdmin,
      isPremium,
      isFree,
      canDownload,
      canUseMood,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
