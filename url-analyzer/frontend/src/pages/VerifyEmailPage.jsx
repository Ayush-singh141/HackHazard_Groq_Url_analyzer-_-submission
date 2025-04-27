import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const otpRefs = useRef([]);
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const { pendingVerification, verifyRegistration, resendVerificationOTP, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from query params or context
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email') || pendingVerification?.email;
  
  // Redirect if already authenticated or no email to verify
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else if (!email) {
      navigate('/register');
    }
  }, [isAuthenticated, email, navigate]);
  
  // Set up countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);
  
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
  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };
  
  // Handle key down events
  const handleKeyDown = (index, e) => {
    // On backspace, clear current field and focus previous
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      otpRefs.current[index - 1].focus();
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    
    // Validate OTP
    if (otpValue.length !== 6) {
      toast.error('Please enter all 6 digits of the verification code');
      return;
    }
    
    try {
      const result = await verifyRegistration(email, otpValue);
      
      if (result.success) {
        toast.success(result.message || 'Email verified successfully! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        toast.error(result.message || 'Verification failed');
        
        // Clear OTP fields on error
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0].focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      const result = await resendVerificationOTP(email);
      
      if (result.success) {
        toast.success(result.message || 'Verification code resent successfully');
        setTimer(60);
        setResendDisabled(true);
        
        // Clear OTP fields
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0].focus();
      } else {
        toast.error(result.message || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background py-12 px-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a verification code to <span className="font-semibold">{email}</span>
          </p>
        </div>
        
        {/* Verification Form */}
        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="bg-white rounded-xl shadow-md p-8"
        >
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-4 text-center">
              Enter the 6-digit verification code
            </label>
            
            <div className="flex justify-between gap-2 mb-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => otpRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            
            <p className="text-gray-500 text-sm text-center mt-2">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendDisabled}
                className={`font-medium ${resendDisabled ? 'text-gray-400' : 'text-primary hover:text-primary-dark'}`}
              >
                {resendDisabled ? `Resend in ${timer}s` : 'Resend Code'}
              </button>
            </p>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full py-3"
          >
            Verify Email
          </button>
          
          {/* Back to Registration Link */}
          <p className="text-center mt-6 text-gray-600">
            Wrong email?{' '}
            <Link to="/register" className="text-primary hover:text-primary-dark font-medium">
              Go back to signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage; 