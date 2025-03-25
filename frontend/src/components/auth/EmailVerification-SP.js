import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  console.log("EmailVerification component rendered with location:", location);

  //check email status
  useEffect(() => {
    console.log("Location state:", location.state);
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    
    if (location.state?.email) {
      console.log("Email from state:", location.state.email);
      setEmail(location.state.email);
    } else if (emailParam) {
      console.log("Email from URL param:", emailParam);
      setEmail(emailParam);
    }
  }, [location]);

  //countdown timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Jump into next input field.
  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.substring(0, 1);
    }
    
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);
    
    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace to go to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event to fill all inputs
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.substring(0, 6).split('');
      const newVerificationCode = [...verificationCode];
      
      digits.forEach((digit, index) => {
        if (index < 6) {
          newVerificationCode[index] = digit;
        }
      });
      
      setVerificationCode(newVerificationCode);
      
      // Focus the next empty input or the last one
      const nextEmptyIndex = newVerificationCode.findIndex(value => !value);
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        inputRefs.current[nextEmptyIndex].focus();
      } else {
        inputRefs.current[5].focus();
      }
    }
  };

  // Submit verification code
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Combine the digits into a single code
    const code = verificationCode.join('');
    
    if (code.length !== 6) {
      setError('Please enter the full 6-digit verification code');
      return;
    }
    
    if (!email) {
      setError('Email address is missing. Please try again or contact support.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-email', {
        email,
        code
      });
      
      setSuccess(response.data.message || 'Email verified successfully!');
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/dashboard-sp');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify email. Please try again..');
    } finally {
      setLoading(false);
    }
  };

  // Resend verification code
  const handleResend = async () => {
    if (resendDisabled) return;
    
    if (!email) {
      setError('Email address is missing. Please try again or contact support.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    setResendDisabled(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/resend-verification', {
        email
      });
      
      setSuccess(response.data.message || 'Verification code resent successfully!');
      setTimer(60); // Set 60 second cooldown
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code. Please try again.');
      setResendDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Verify Your Email</h2>
        <p className="verification-message">
          We've sent a 6-digit verification code to<br />
          <strong>{email || 'your email address'}</strong>
        </p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="verification-form">
          <div className="verification-inputs">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength="1"
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="verification-input"
                autoFocus={index === 0}
                disabled={loading}
                style={{
                  width: '45px',
                  height: '45px',
                  textAlign: 'center',
                  fontSize: '20px',
                  margin: '0 5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            ))}
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || verificationCode.some(digit => !digit)}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '10px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        
        <div className="auth-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>Didn't receive the code?</p>
          <button 
            onClick={handleResend} 
            disabled={resendDisabled || loading}
            style={{
              background: 'none',
              border: 'none',
              color: '#0066cc',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            {resendDisabled 
              ? `Resend code in ${timer}s` 
              : 'Resend code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;