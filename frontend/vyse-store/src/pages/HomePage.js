import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold text-center mb-10">Available Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="card bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-500">{product.description}</p>
              <p className="text-xl font-bold text-blue-600">Price: ${product.price}</p>
              <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
              <button className="mt-4 btn btn-primary w-full">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
