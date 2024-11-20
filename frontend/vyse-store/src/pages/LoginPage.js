import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ setToken = (token) => console.log('Token:', token) }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleLogin = async () => {
    setMessage('');
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
  
      console.log('Login API Response:', response);
  
      const { token, user } = response.data;
  
      // Call setToken with the received token
      setToken(token);
  
      // Redirect based on role
      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error during login:', error);
  
      // Error message for users
      if (error.response && error.response.status === 401) {
        setMessage('Invalid email or password.');
      } else {
        setMessage('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="card bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="input input-bordered w-full"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            className="input input-bordered w-full"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-10 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        <button
          className="btn btn-primary w-full flex justify-center items-center"
          onClick={handleLogin}
          disabled={loading} // Disable button during loading
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div> // Spinner
          ) : (
            'Login'
          )}
        </button>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
