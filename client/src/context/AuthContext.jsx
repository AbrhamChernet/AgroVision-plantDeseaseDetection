import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verify cookie on bootup
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get('/auth/me');
        if (res.data && res.data.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Silent error since cookie might not exist on first load
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const register = async (name, phone, password, profilePhoto = '') => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name, phone, password, profilePhoto });
      if (res.data && res.data.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        toast.success(res.data.message || 'ምዝገባው በተሳካ ሁኔታ ተጠናቋል!');
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'ምዝገባው አልተሳካም።' };
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password, rememberMe = false) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { phone, password, rememberMe });
      if (res.data && res.data.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        toast.success(res.data.message || 'እንኳን ደህና መጡ!');
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'መግባት አልተሳካም።' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('በተሳካ ሁኔታ ወጥተዋል።');
    } catch (err) {
      toast.error('መውጣት አልተቻለም።');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
