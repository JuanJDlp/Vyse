import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = ({ token, updateCartCount }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = () => {
      const token = localStorage.getItem('token');
      axios
        .get('http://localhost:8080/api/client/cart', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const items = response.data;
          setCartItems(items);
          updateCartCount(items.reduce((sum, item) => sum + item.quantity, 0)); // Update cart count badge
        })
        .catch((error) => console.error('Error fetching cart items:', error));
    };

    fetchCartItems();
  }, [token, updateCartCount]);

  return (
    <div className="container mx-auto py-10 px-8">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {cartItems.map((item) => (
            <div key={item.id} className="card bg-base-200 shadow-md p-4">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p>{item.description}</p>
              <p className="font-bold">Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
