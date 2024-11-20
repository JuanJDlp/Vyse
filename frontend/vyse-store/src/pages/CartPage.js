import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = ({ token }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8080/api/client/cart', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => setCartItems(response.data))
    .catch(error => console.error('Error fetching cart items:', error));
  }, []);
  

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartPage;
