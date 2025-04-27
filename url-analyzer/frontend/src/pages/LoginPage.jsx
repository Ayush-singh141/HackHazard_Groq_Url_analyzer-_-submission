import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const { login, isAuthenticated, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if this is a session refresh
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('refreshed') === 'true') {
      toast.info('Please log in again to continue.');
    }
  }, [location.search, toast]);
  
  // Get redirect path from URL query params
  const getRedirectPath = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('redirect') || 'dashboard';
  };
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = getRedirectPath();
      navigate(`/${redirectPath}`);
    }
  }, [isAuthenticated, navigate, location.search]);
  
  // Apply animations on mount
  useEffect(() => {
    const timeline = gsap.timeline();
    
    if (titleRef.current && formRef.current) {
      timeline
        .from(titleRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        })
        .from(formRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        }, '-=0.3');
    }
  }, []);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        toast.success('Login successful! Redirecting...');
        
        // Get redirect path from URL query params
        const redirectPath = getRedirectPath();
        navigate(`/${redirectPath}`);
      } else if (result.needsVerification) {
        toast.info(result.message || 'Please verify your email');
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        toast.error(result.message || 'Login failed');
        
        // Set email error for clarity
        setFormErrors(prev => ({
          ...prev,
          // Clear password field on error
          password: '',
          email: result.message.toLowerCase().includes('not found') ? 'User not found' : undefined
        }));
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div ref={titleRef} className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Login</h1>
          <p className="text-gray-600">
            Sign in to your URL Analyzer account
          </p>
        </div>
        
        {/* Login Form */}
        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="bg-white rounded-xl shadow-md p-8"
        >
          {/* Form-level error message */}
          {formErrors.form && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {formErrors.form}
            </div>
          )}
          
          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input w-full ${formErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              disabled={loading}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>
          
          {/* Password Field */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input w-full ${formErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
              disabled={loading}
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full py-3"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size="small" color="white" />
            ) : (
              'Sign In'
            )}
          </button>
          
          {/* Register Link */}
          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-dark font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 