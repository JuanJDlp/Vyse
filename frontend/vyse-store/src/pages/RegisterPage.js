import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Spinner state
  const navigate = useNavigate(); // React Router hook for redirection

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true); // Show spinner
    setMessage(''); // Clear any previous messages

    try {
      await axios.post('http://localhost:8080/api/auth/register', formData);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Registration failed. Please try again.');
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="card bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        {message && <p className={`text-center mb-4 ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="input input-bordered w-full"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="input input-bordered w-full"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="input input-bordered w-full"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button
          className="btn btn-primary w-full flex justify-center items-center"
          onClick={handleRegister}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div> // Spinner
          ) : (
            'Register'
          )}
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
