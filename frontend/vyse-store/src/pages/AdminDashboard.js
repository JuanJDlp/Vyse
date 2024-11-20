import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', quantity: '' });

  const fetchProducts = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8080/api/products', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => setProducts(response.data))
    .catch(error => console.error('Error fetching products:', error));
  };

  const handleAddProduct = () => {
    const token = localStorage.getItem('token');
    axios.post('http://localhost:8080/api/admin/add-product', newProduct, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      alert('Product added!');
      fetchProducts(); // Refresh product list
    })
    .catch(error => console.error('Error adding product:', error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="card shadow-md p-5 bg-white">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
      <h2>Add Product</h2>
      <input type="text" placeholder="Name" onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
      <input type="text" placeholder="Description" onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
      <input type="number" placeholder="Price" onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
      <input type="number" placeholder="Quantity" onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} />
      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  );
};

export default AdminDashboard;
