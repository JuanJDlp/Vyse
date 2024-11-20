import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PurchaseHistoryPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [message, setMessage] = useState(null); // Feedback message
  const [messageType, setMessageType] = useState(''); // Message type ('success' or 'error')

  const fetchPurchaseHistory = () => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:8080/api/client/purchases', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPurchases(response.data);
      })
      .catch((error) => {
        console.error('Error fetching purchase history:', error);
        setMessage('Failed to load purchase history.');
        setMessageType('error');
      });
  };

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-6">Your Purchase History</h1>

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

        {/* Purchases */}
        {purchases.length === 0 ? (
          <p className="text-center text-gray-600">You have no purchases yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => (
              <div key={purchase.invoice_id} className="card bg-base-200/10 shadow-md">
                <div className="mt-4 p-4">
                  <h2 className="font-semibold text-lg">Invoice #{purchase.invoice_id}</h2>
                  <p className="text-gray-500 text-sm">Date: {purchase.date}</p>
                  <div className="mt-3">
                    <h3 className="font-semibold text-primary mb-2">Items:</h3>
                    <ul className="list-disc list-inside text-sm">
                      {purchase.items.map((item, index) => {
                        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
                        const total = price * item.quantity;
                        return (
                          <li key={index}>
                            {item.name || 'Unknown'} - {item.quantity} x ${price.toFixed(2)} = ${total.toFixed(2)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <p className="font-bold text-lg text-primary mt-4">
                    Total: ${parseFloat(purchase.total_amount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
