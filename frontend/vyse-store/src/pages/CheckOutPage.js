import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const CheckoutPage = ({ token, updateCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const fetchCartItems = () => {
    const token = localStorage.getItem("token");
    axios
    .get("http://localhost:8080/api/client/cart", {
        headers: { Authorization: `Bearer ${token}` }, // Ensure this is valid
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
        const totalCost = consolidatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        setTotalPrice(totalCost);
        updateCartCount(consolidatedItems.reduce((sum, item) => sum + item.quantity, 0));
      })
      .catch((error) => console.error("Error fetching cart items:", error));
  };

  const generatePDF = (invoiceData) => {
    console.log("Generating PDF with invoice data:", invoiceData);
  
    if (!invoiceData || !invoiceData.items || !invoiceData.invoice_id) {
      console.error("Invalid invoice data:", invoiceData);
      return;
    }
  
    const doc = new jsPDF();
    const { invoice_id, date, items, total_amount } = invoiceData;
  
    // Convert total_amount to a number
    const totalAmountNumber = parseFloat(total_amount) || 0;
  
    // Add Title
    doc.setFontSize(16);
    doc.text("Invoice", 10, 10);
  
    // Add Invoice Details
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoice_id}`, 10, 20);
    doc.text(`Date: ${new Date(date).toLocaleString()}`, 10, 30);
  
    // Add Table Headers
    doc.text("Item", 10, 50);
    doc.text("Qty", 100, 50);
    doc.text("Price", 120, 50);
    doc.text("Total", 150, 50);
  
    // Add Items
    let yOffset = 60; // Initial Y position for table rows
    items.forEach((item) => {
      console.log("Adding item to PDF:", item);
  
      // Ensure numerical values for item.price and item.total
      const itemName = item.name || "Unknown";
      const itemQuantity = item.quantity || 0;
      const itemPrice = parseFloat(item.price) || 0; // Convert to number
      const itemTotal = parseFloat(item.total) || 0; // Convert to number
  
      doc.text(itemName, 10, yOffset);
      doc.text(String(itemQuantity), 100, yOffset);
      doc.text(`$${itemPrice.toFixed(2)}`, 120, yOffset);
      doc.text(`$${itemTotal.toFixed(2)}`, 150, yOffset);
  
      yOffset += 10;
      if (yOffset > 270) {
        // If the content reaches the bottom of the page
        doc.addPage();
        yOffset = 20;
      }
    });
  
    // Add Total Amount at the end
    doc.text(`Total Amount: $${totalAmountNumber.toFixed(2)}`, 10, yOffset + 10);
  
    // Save the PDF
    console.log("Saving PDF...");
    doc.save(`Invoice_${invoice_id}.pdf`);
  };
  
  

  const handlePayment = async () => {
    setLoading(true);
  
    const token = localStorage.getItem("token");
    try {
      // Initiate the checkout process
      const checkoutResponse = await axios.post(
        "http://localhost:8080/api/client/checkout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const { invoice_id } = checkoutResponse.data;
  
      // Fetch invoice details using the new endpoint
      const invoiceResponse = await axios.get(
        `http://localhost:8080/api/client/purchase/${invoice_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const invoiceData = invoiceResponse.data;
  
      // Generate PDF
      generatePDF(invoiceData);
  
      // Clear Cart Items Locally
      setCartItems([]);
  
      // Redirect to Purchase History after 3 seconds
      setTimeout(() => {
        console.log("Redirecting to /purchases...");
        navigate("/purchases");
      }, 3000);
    } catch (error) {
      console.error("Error processing payment or fetching invoice:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  
  

  useEffect(() => {
    fetchCartItems();
  }, [token, updateCartCount]);

  return (
    <div className="container mx-auto py-10 px-8">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="flex gap-8">
          <div className="flex-1">
            {cartItems.map((item) => (
              <div key={item.id} className="card bg-base-100 border-b-2 border-t-2 p-4 mb-4 rounded-sm hover:shadow-sm">
                <div className="flex items-center gap-4">
                  <div>
                  <figure>
                  <img
                    src={item.image || "https://via.placeholder.com/150"} // Use product's image or fallback
                    alt={item.name || 'Product Image'}
                    className="w-full h-32 object-cover rounded-t-md"
                  />
                </figure>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p>{item.description}</p>
                    <p className="font-bold"> ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
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
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : "Pay"}
                
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
