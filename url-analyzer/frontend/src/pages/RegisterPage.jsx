import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const { register, isAuthenticated, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
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
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success && result.needsVerification) {
        toast.info(result.message || 'Please verify your email to complete registration');
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else if (result.success) {
        toast.success('Registration successful! Welcome aboard!');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Registration failed');
        
        // Set specific field errors based on the response
        if (result.message?.toLowerCase().includes('username')) {
          setFormErrors(prev => ({ ...prev, username: 'Username already taken' }));
        } else if (result.message?.toLowerCase().includes('email')) {
          setFormErrors(prev => ({ ...prev, email: 'Email already registered' }));
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background py-12 px-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">
            Join URL Analyzer to save your analyses
          </p>
        </div>
        
        {/* Registration Form */}
        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="bg-white rounded-xl shadow-md p-8"
        >
          {/* Username Field */}
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`input w-full ${formErrors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
              disabled={loading}
            />
            {formErrors.username && (
              <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
            )}
          </div>
          
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
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
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
          
          {/* Confirm Password Field */}
          <div className="mb-8">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input w-full ${formErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
              disabled={loading}
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
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
              'Sign Up'
            )}
          </button>
          
          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 