import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'https://hackhazard-groq-url-analyzer.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingVerification, setPendingVerification] = useState(null);

  // Logout user - redirects to homepage after clearing authentication state
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setPendingVerification(null);
    // Redirect to homepage after logout
    window.location.href = '/';
  };

  // Setup axios interceptor for auth headers
  useEffect(() => {
    // Clear any existing interceptors
    if (axios.interceptors.request.handlers && axios.interceptors.request.handlers.length > 0) {
      axios.interceptors.request.handlers.forEach((handler, idx) => {
        axios.interceptors.request.eject(idx);
      });
    }
    
    // Add a new interceptor with the current token
    const interceptor = axios.interceptors.request.use(
      (config) => {
        // Always fetch the token directly from localStorage for the most up-to-date value
        const currentToken = localStorage.getItem('token');
        if (currentToken && currentToken !== 'undefined' && currentToken !== 'null') {
          config.headers.Authorization = `Bearer ${currentToken}`;
          
          // Update our state if needed
          if (currentToken !== token) {
            console.log('Token updated from localStorage');
            setToken(currentToken);
          }
        } else if (config.url.includes('/auth/')) {
          // Don't require token for auth endpoints
          console.log('Auth endpoint - no token required');
        } else {
          console.log('No valid token found for request');
          if (token) {
            // Clear invalid token state
            setToken(null);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Load user from token on mount or when token changes
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/auth/me`);
        setUser(res.data);
      } catch (err) {
        console.error('Error loading user:', err);
        // Call logout directly in this scope to avoid dependency issues
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      
      // Instead of setting user and token, set pending verification
      setPendingVerification({
        email: userData.email,
        username: userData.username
      });
      
      return { 
        success: true, 
        needsVerification: true,
        email: userData.email,
        message: res.data.message
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Verify email with OTP for registration
  const verifyRegistration = async (email, otp) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`${API_URL}/auth/verify-registration`, { email, otp });
      
      const { token, user } = res.data;
      
      // Update localStorage first
      localStorage.setItem('token', token);
      
      // Update state
      setToken(token);
      setUser(user);
      setPendingVerification(null);
      
      return { success: true, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Verification failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Resend verification OTP
  const resendVerificationOTP = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`${API_URL}/auth/resend-verification`, { email });
      
      return { success: true, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to resend verification code';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Clear any existing token first
      localStorage.removeItem('token');
      setToken(null);
      
      const res = await axios.post(`${API_URL}/auth/login`, credentials);
      
      // Check if user needs email verification
      if (res.data.needsVerification) {
        setPendingVerification({
          email: credentials.email,
        });
        
        return { 
          success: false, 
          needsVerification: true,
          message: res.data.message 
        };
      }
      
      const { token, user } = res.data;
      
      // Verify token is valid
      if (!token || token === 'undefined' || token === 'null') {
        throw new Error('Server returned invalid token');
      }
      
      // First update localStorage, then update state
      localStorage.setItem('token', token);
      console.log('Token saved to localStorage:', token.substring(0, 10) + '...');
      
      // Update state
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        pendingVerification,
        isAuthenticated: !!user,
        register,
        verifyRegistration,
        resendVerificationOTP,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 