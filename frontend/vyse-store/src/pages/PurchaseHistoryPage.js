import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const PurchaseHistoryPage = ({token, userRole, setCartCount }) => { // Added userRole prop
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(null); // Feedback message
  const [messageType, setMessageType] = useState(''); // Message type ('success' or 'error')
  const navigate = useNavigate();
  // Fetch products when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/client/purchases')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen px-8 mx-14">
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-semibold text-center mb-6">Purchase History</h1>

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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
