import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DeleteModal, EditModal } from '../components/Modal';
import Pagination from '../components/Pagination';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6); // Max products per page
  const [totalPages, setTotalPages] = useState(1);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', quantity: '' });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Fetch products from the backend
  const fetchProducts = () => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:8080/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProducts(response.data);
        setTotalPages(Math.ceil(response.data.length / productsPerPage));
      })
      .catch((error) => console.error('Error fetching products:', error));
  };

  // Add a new product
  const handleAddProduct = () => {
    const token = localStorage.getItem('token');
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.quantity) {
      setMessage('All fields are required!');
      setMessageType('error');
      return;
    }
    axios
      .post(
        'http://localhost:8080/api/admin/products',
        {
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          quantity: parseInt(newProduct.quantity, 10),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setMessage('Product added successfully!');
        setMessageType('success');
        fetchProducts();
        setNewProduct({ name: '', description: '', price: '', quantity: '' });
        setTimeout(() => setMessage(null), 3000);
      })
      .catch((error) => {
        console.error('Error adding product:', error);
        setMessage('Failed to add product. Please check the data and try again.');
        setMessageType('error');
        setTimeout(() => setMessage(null), 3000);
      });
  };

  // Trigger delete confirmation modal
  const handleDelete = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    const token = localStorage.getItem('token');
    axios
      .delete(`http://localhost:8080/api/admin/products/${productToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setProducts(products.filter((product) => product.id !== productToDelete)); // Remove locally
        setShowDeleteModal(false);
        setMessage('Product deleted successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(null), 3000);
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        setMessage('Failed to delete product. Please try again.');
        setMessageType('error');
        setTimeout(() => setMessage(null), 3000);
      });
  };

  // Trigger edit modal
  const handleEdit = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  // Confirm edit action
  const confirmEdit = () => {
    const token = localStorage.getItem('token');
    axios
      .put(
        `http://localhost:8080/api/admin/products/${editProduct.id}`,
        {
          name: editProduct.name,
          description: editProduct.description,
          price: parseFloat(editProduct.price),
          quantity: parseInt(editProduct.quantity, 10),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setProducts(
          products.map((product) =>
            product.id === editProduct.id ? editProduct : product
          )
        );
        setShowEditModal(false);
        setMessage('Product updated successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(null), 3000);
      })
      .catch((error) => {
        console.error('Error editing product:', error);
        setMessage('Failed to update product. Please try again.');
        setMessageType('error');
        setTimeout(() => setMessage(null), 3000);
      });
  };

  // Change page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold text-center">Admin Dashboard</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            messageType === 'success' ? 'bg-success text-success-content' : 'bg-error text-error-content'
          }`}
        >
          {message}
        </div>
      )}

      {showDeleteModal && (
        <DeleteModal
          title="Delete Product"
          message="This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {showEditModal && (
        <EditModal title="Edit Product" onConfirm={confirmEdit} onCancel={() => setShowEditModal(false)}>
          <div className="space-y-3">
            <input
              type="text"
              className="input input-bordered w-full"
              value={editProduct.name}
              onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
              placeholder="Name"
            />
            <input
              type="text"
              className="input input-bordered w-full"
              value={editProduct.description}
              onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
              placeholder="Description"
            />
            <input
              type="number"
              className="input input-bordered w-full"
              value={editProduct.price}
              onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
              placeholder="Price"
            />
            <input
              type="number"
              className="input input-bordered w-full"
              value={editProduct.quantity}
              onChange={(e) => setEditProduct({ ...editProduct, quantity: e.target.value })}
              placeholder="Quantity"
            />
          </div>
        </EditModal>
      )}

      <h2 className="text-lg font-normal mt-6 text-base-content/70">Add Product</h2>
      <div className="flex gap-2 mt-4 mb-4">
        <input
          type="text"
          placeholder="Name"
          className="input input-bordered w-full"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          className="input input-bordered w-full"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          className="input input-bordered w-full"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="input input-bordered w-full"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          className="input input-bordered w-full"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
        />
        <button onClick={handleAddProduct} className="btn btn-md btn-primary align-middle">
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto card shadow-md rounded-lg">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-secondary text-base-content">
              <th className="px-4 py-2 text-medium text-left">Name</th>
              <th className="px-4 py-2 text-medium text-left">Description</th>
              <th className="px-4 py-2 text-medium text-left">Price</th>
              <th className="px-4 py-2 text-medium text-left">Quantity</th>
              <th className="px-4 py-2 text-medium text-left">Image</th>
              <th className="px-4 py-2 text-medium text-center">Manage</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr key={product.id} className={`${index % 2 === 0 ? 'bg-base-200' : 'bg-base100'} hover:bg-base-300`}>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.description}</td>
                <td className="border px-4 py-2">${product.price}</td>
                <td className="border px-4 py-2">{product.quantity}</td>
                <td className="border px-4 py-2">{product.image}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn btn-circle btn-xs btn-ghost bg-transparent hover:btn-ghost mr-3 hover:text-error-content text-error-content/70"
                  >
                    <i className="fa-solid fa-pen hover:text-base-content text-base-content/70"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn btn-circle btn-xs btn-ghost bg-transparent hover:btn-ghost hover:text-error-content text-error-content/70"
                  >
                    <i className="fa-solid fa-trash "></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default AdminDashboard;
