import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = 'https://hackhazard-groq-url-analyzer.onrender.com/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [animationStarted, setAnimationStarted] = useState(false);
  
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();
  
  // Apply animations on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const animationTimeout = setTimeout(() => {
      setAnimationStarted(true);
    }, 100);
    
    return () => clearTimeout(animationTimeout);
  }, []);
  
  // Validate email
  const validateEmail = () => {
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    
    // Clear errors when user types
    if (formErrors.email) {
      setFormErrors(prev => ({
        ...prev,
        email: undefined
      }));
    }
  };
  
  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    
    // Clear errors when user types
    if (formErrors.otp) {
      setFormErrors(prev => ({
        ...prev,
        otp: undefined
      }));
    }
  };
  
  // Handle password input change
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    
    // Clear errors when user types
    if (formErrors.newPassword) {
      setFormErrors(prev => ({
        ...prev,
        newPassword: undefined
      }));
    }
  };
  
  // Handle confirm password input change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    
    // Clear errors when user types
    if (formErrors.confirmPassword) {
      setFormErrors(prev => ({
        ...prev,
        confirmPassword: undefined
      }));
    }
  };
  
  // Validate OTP
  const validateOtp = () => {
    const errors = {};
    
    if (!otp.trim()) {
      errors.otp = 'OTP is required';
    } else if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      errors.otp = 'OTP must be 6 digits';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate new password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      if (response.data.success) {
        toast.success('OTP sent to your email');
        setOtpSent(true);
      } else {
        toast.error(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
      
      if (message.toLowerCase().includes('not found')) {
        setFormErrors({ email: 'Email not registered' });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle verifying OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!validateOtp()) return;
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, { 
        email, 
        otp 
      });
      
      if (response.data.success) {
        toast.success('OTP verified successfully');
        setOtpVerified(true);
      } else {
        toast.error(response.data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
      
      if (message.toLowerCase().includes('invalid')) {
        setFormErrors({ otp: 'Invalid OTP' });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle resetting password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { 
        email, 
        otp,
        newPassword 
      });
      
      if (response.data.success) {
        toast.success('Password reset successful');
        // Redirect to login page after a slight delay
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background py-12 px-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <div 
          ref={titleRef}
          className={`text-center mb-10 ${animationStarted ? 'animate-fadeInDown' : 'hidden-ready'}`}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2 hover-scale">
            {otpVerified 
              ? 'Create New Password' 
              : otpSent 
                ? 'Verify OTP' 
                : 'Forgot Password'}
          </h1>
          <p className="text-gray-600">
            {otpVerified 
              ? 'Enter your new password' 
              : otpSent 
                ? 'Enter the 6-digit code sent to your email' 
                : 'We\'ll send a verification code to your email'}
          </p>
        </div>
        
        {/* Form */}
        <div 
          ref={formRef}
          className={`bg-white rounded-xl shadow-md p-8 hover-glow ${animationStarted ? 'animate-fadeInUp' : 'hidden-ready'}`}
        >
          {/* Request OTP Form */}
          {!otpSent && (
            <form onSubmit={handleSendOtp}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`input w-full hover-glow ${formErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={loading}
                  placeholder="Enter your registered email"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full py-3 hover-lift"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>
          )}
          
          {/* Verify OTP Form */}
          {otpSent && !otpVerified && (
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-6">
                <label htmlFor="otp" className="block text-gray-700 font-medium mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  className={`input w-full hover-glow ${formErrors.otp ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={loading}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
                {formErrors.otp && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.otp}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full py-3 mb-4 hover-lift"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  'Verify Code'
                )}
              </button>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-primary hover:text-primary-dark hover-border inline-block pb-1"
                    disabled={loading}
                  >
                    Resend
                  </button>
                </p>
              </div>
            </form>
          )}
          
          {/* Reset Password Form */}
          {otpVerified && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-6">
                <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className={`input w-full hover-glow ${formErrors.newPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={loading}
                  placeholder="Enter new password"
                />
                {formErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.newPassword}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`input w-full hover-glow ${formErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={loading}
                  placeholder="Confirm your new password"
                />
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full py-3 hover-lift"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
          
          {/* Back to Login Link */}
          <p className="text-center mt-6 text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark hover-border inline-block pb-1 font-medium">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 