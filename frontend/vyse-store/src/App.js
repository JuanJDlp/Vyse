import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import PurchaseHistoryPage from './pages/PurchaseHistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import CheckoutPage from './pages/CheckOutPage';

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);
  const [cartCount, setCartCount] = useState(0); // Cart count state
  const handleSetToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);

    // Decode role from token payload (using base64 decoding for simplicity)
    const payload = JSON.parse(atob(newToken.split('.')[1]));
    setUserRole(payload.role); // Extract role from the token
  };

  const updateCartCount = (count) => {
    setCartCount(count);
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
      <Navbar token={token} userRole={userRole} cartCount={cartCount} />
      <Routes>
      <Route
          path="/"
          element={<HomePage token={token} userRole={userRole} setCartCount={setCartCount} />} // Pass setCartCount to HomePage
        />
        <Route path="/login" element={<LoginPage setToken={handleSetToken} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage token={token} updateCartCount={updateCartCount}/>} />
        <Route path="/purchases" element={<PurchaseHistoryPage token={token}/>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/checkout" element={<CheckoutPage token={token} updateCartCount={updateCartCount}/>} />
      </Routes>
    </Router>
  );
};

export default App;
