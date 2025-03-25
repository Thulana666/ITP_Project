import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [isServiceProvider, setIsServiceProvider] = useState(false);
  const [mfaPreference, setMfaPreference] = useState(false);
  const [role, setRole] = useState('customer'); // Default role
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Password validation (same as backend)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //"removed the !password `!` for test or something"
    if (passwordRegex.test(password)) {
      setError('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    let userData = {
      fullName,
      email,
      password,
      isServiceProvider, 
      role: isServiceProvider ? 'service_provider' : 'customer',
    };

    // If registering as a service provider, add extra fields
    if (isServiceProvider) {
      if (!phoneNumber || !serviceType) {
        setError('Please fill in all service provider details.');
        return;
      }
      userData = { ...userData, phoneNumber, serviceType, mfaPreference };
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      // Show alert box for successful registration
  alert(response.data.message || 'Registration successful!');
      window.location.href = '/login';
      setMessage(response.data.message || 'Registration successful!');
      setError('');
      
      console.log('Registered user:', response.data);
      
      // Clear form
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPhoneNumber('');
      setServiceType('');
      setIsServiceProvider(false);
      setMfaPreference(false);
    } catch (error) {
      setMessage('');
      setError(error.response?.data?.message || 'Server error');
    }
  };

  return (
    <div>
      
      <form onSubmit={handleSubmit}>
        <h2>Registration</h2>
        <div>
          <label>Full Name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>

        <div>
          <label>
            <input type="checkbox" checked={isServiceProvider} onChange={(e) => setIsServiceProvider(e.target.checked)} />
            Register as Service Provider?
          </label>
        </div>

        {isServiceProvider && (
          <>
            <div>
              <label>Phone Number</label>
              <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>
            <div>
              <label>Service Type</label>
              <input type="text" value={serviceType} onChange={(e) => setServiceType(e.target.value)} required />
            </div>
            <div>
              <label>
                <input type="checkbox" checked={mfaPreference} onChange={(e) => setMfaPreference(e.target.checked)} />
                Enable MFA (Two-Factor Authentication)
              </label>
            </div>
          </>
        )}

        <button type="submit">Register</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default Register;
