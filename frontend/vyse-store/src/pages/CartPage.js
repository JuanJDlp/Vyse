import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const CartPage = ({ token, updateCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const MIN_ORDER_AMOUNT = 1; // Set your minimum order amount
  const MAX_ORDER_AMOUNT = 10000000; // Set your maximum order amount
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // "error" or "success"
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  const handleMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
  };

  const fetchCartItems = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8080/api/client/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const items = response.data;
  
        // Consolidate items based on product id
        const consolidatedItems = items.reduce((acc, item) => {
          const existingItem = acc.find((i) => i.id === item.id);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            acc.push({ ...item });
          }
          return acc;
        }, []);
  
        setCartItems(consolidatedItems);
  // Calculate total price
  const totalCost = consolidatedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  setTotalPrice(totalCost);

  // Update cart badge
  updateCartCount(consolidatedItems.reduce((sum, item) => sum + item.quantity, 0));
      })
      .catch((error) => console.error("Error fetching cart items:", error));
  };
  
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      handleMessage(
        "You have no items in your cart. Please add some items before proceeding to checkout.",
        "error"
      );
      return;
    }
  
    if (totalPrice <= 0) {
      handleMessage(
        "The total price of your items is $0. Please add some items to proceed.",
        "error"
      );
      return;
    }
  
    if (totalPrice <= MIN_ORDER_AMOUNT) {
      handleMessage(
        `The total price of your items is $${totalPrice}. The minimum order amount is $${MIN_ORDER_AMOUNT}.`,
        "error"
      );
      return;
    }
  
    if (totalPrice > MAX_ORDER_AMOUNT) {
      handleMessage(
        `The total price of your items is $${totalPrice}. The maximum order amount is $${MAX_ORDER_AMOUNT}.`,
        "error"
      );
      return;
    }
  
    setLoading(true); // Show loading spinner

    // Simulate checkout process
    setTimeout(() => {
      setLoading(false); // Hide loading spinner
      navigate("/checkout");
    }, 2000); // Replace with actual API call

    
  };
  

  const handleQuantityChange = (itemId, newQuantity) => {
    const token = localStorage.getItem("token");
  
    if (newQuantity <= 0) {
      handleDeleteItem(itemId); // Delete item if quantity is <= 0
      return;
    }
  
    axios
      .put(
        `http://localhost:8080/api/client/cart/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
        fetchCartItems(); // Refresh total price
      })
      .catch((error) => console.error("Error updating quantity:", error));
  };
  

  const handleDeleteItem = (itemId) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8080/api/client/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Remove item locally from state
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        fetchCartItems(); // Refresh the cart state
      })
      .catch((error) => console.error("Error deleting item:", error));
  };
  
  
  
  

  useEffect(() => {
    fetchCartItems();
  }, [token, updateCartCount]);
  

  return (
    <div className="container mx-auto py-10 px-8">
      {message && (
      <div
        className={`mb-4 p-4 rounded ${
          messageType === "error" ? "bg-error text-error-content" : "bg-success text-success-content"
        }`}
      >
        {message}
      </div>
    )}
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="flex gap-8">
          <div className="flex-1">
            {cartItems.map((item) => (
              <div key={item.id} className="card bg-base-100 border-b-2 border-t-2 p-4 mb-4 rounded-sm hover:shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <figure>
                      <img
                        src={item.image || "https://via.placeholder.com/150"}// Placeholder image
                        alt={item.name || "Image"}
                      />
                    </figure>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p>{item.description}</p>
                    <p className="font-bold">Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="btn btn-ghost btn-xs text-base-content/70 hover:text-base-content"
                    >
                      <i class="fa-solid fa-minus"></i>
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="btn btn-ghost btn-xs text-base-content/70 hover:text-base-content"
                    >
                      <i class="fa-solid fa-plus "></i>
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="btn btn-ghost btn-xs text-base-content/70 hover:text-base-content"
                    >
                      <i className="fa-solid fa-trash "></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-1/3">
            <div className="card bg-base-100 shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Total</h2>
              <p className="text-lg font-bold">Subtotal: ${totalPrice.toFixed(2)}</p>
              
              <button
                className="btn btn-primary w-full"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Processing..." : "Go to Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
