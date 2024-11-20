import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ token, userRole }) => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">Vyse Store</Link>
        </div>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-gray-300">Store</Link>
          {token ? (
            <>
              {userRole === 'admin' ? (
                <Link to="/admin" className="hover:text-gray-300">Admin Dashboard</Link>
              ) : (
                <>
                  <Link to="/cart" className="hover:text-gray-300">Cart</Link>
                  <Link to="/purchases" className="hover:text-gray-300">Purchase History</Link>
                </>
              )}
              <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
