import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = ({userRole, setCartCount }) => { // Added userRole prop
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(null); // Feedback message
  const [messageType, setMessageType] = useState(''); // Message type ('success' or 'error')
  // Fetch products when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  // Handle adding a product to the cart
  const handleAddToCart = (productId) => {
    axios
      .post(
        'http://localhost:8080/api/client/cart',
        {
          product_id: productId,
          quantity: 1, // Default quantity for now
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Add token for authenticated requests
        }
      )
      .then(() => {
        setCartCount((prevCount) => prevCount + 1); // Increment cart count in the Navbar
        setMessage('Product added to cart');
        setMessageType('success');
        setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
      })
      .catch((error) => {
        console.error('Error adding product:', error);
        setMessage('Failed to add product to cart');
        setMessageType('error');
        setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen px-8 mx-14">
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-semibold text-center mb-6">Available Products</h1>

        {/* Feedback Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              messageType === 'success' ? 'bg-success text-success-content' : 'bg-error text-error-content'
            }`}
          >
            {message}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card bg-base-200/10 shadow-md">
              <figure>
                <img
                  src="https://via.placeholder.com/150" // Placeholder image
                  alt={product.name}
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                <p>{product.description}</p>
                <p className="font-bold text-primary">${product.price}</p>
                <div className="card-actions justify-end">
                  {userRole === 'admin' ? (
                    <button className="btn btn-disabled btn-sm">Admin View</button>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleAddToCart(product.id)} // Pass product ID
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
