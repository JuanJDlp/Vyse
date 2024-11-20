import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ token, userRole, cartCount }) => {
  const location = useLocation(); // Get the current route

  // Function to check if the link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-primary text-base-100 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold italic">
          <Link to="/">Vyse Store</Link>
        </div>
        <div className="flex gap-4">
          {/* Highlight active link */}
          <Link
            to="/"
            className={`hover:text-secondary/50 ${isActive('/') ? 'font-semibold  text-secondary' : 'text-base-100'}`}
          >
            <i class="fa-solid fa-house"></i>
          </Link>
          {token ? (
            <>
              {userRole === 'admin' ? (
                <Link
                  to="/admin"
                  className={`hover:text-secondary/50 ${isActive('/admin') ? 'font-semibold  text-secondary' : 'text-base-100'}`}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <div className="relative flex items-center">
                    <Link
                      to="/cart"
                      className={`hover:text-secondary/50 ${isActive('/cart') ? ' text-secondary' : 'text-base-100'}`}
                    >
                      <i className="fa-solid fa-cart-shopping"></i>
                    </Link>
                    {cartCount > 0 && (
                      <div className="absolute -top-1 -right-2 badge badge-accent badge-xs">
                        {cartCount}
                      </div>
                    )}
                  </div>
                  <Link
                    to="/purchases"
                    className={`hover:text-secondary/50 ${isActive('/purchases') ? 'font-semibold  text-secondary' : 'text-base-100'}`}
                  >
                    <i class="fa-regular fa-clock"></i>
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                className="text-base-100 hover:text-secondary/50"
              >
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`hover:text-secondary/50 ${isActive('/login') ? 'font-semibold  text-secondary' : 'text-base-100'}`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`hover:text-secondary/50 ${isActive('/register') ? 'font-semibold  text-secondary' : 'text-base-100'}`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
