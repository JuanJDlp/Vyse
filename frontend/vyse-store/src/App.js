import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import PurchaseHistoryPage from './pages/PurchaseHistoryPage';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);

  const handleSetToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);

    // Decode role from token payload (using base64 decoding for simplicity)
    const payload = JSON.parse(atob(newToken.split('.')[1]));
    setUserRole(payload.role); // Extract role from the token
  };

  // Check the role when the app initializes
  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
    }
  }, [token]);

  return (
    <Router>
      <Navbar token={token} userRole={userRole} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setToken={handleSetToken} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/purchases" element={<PurchaseHistoryPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
