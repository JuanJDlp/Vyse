const { body, validationResult } = require('express-validator');
const { CartModel } = require('../model/Cart')
const { UserModel } = require("../model/User")

const addProductToCart = async (req, res) => {
    await body('quantity').not().isEmpty().run(req);
    await body('product_id').not().isEmpty().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        console.log(req.user)
        const idOfUserInToken = req.user.userId;
        const userExists = UserModel.userExists(idOfUserInToken)
        if (userExists) {
            const { product_id, quantity } = req.body;
            await CartModel.addItemToCart(idOfUserInToken, product_id, quantity)
        }

        res.status(201).json({
            message: "Product added to cart"
        });

    } catch (err) {
        console.log('error while adding a product to a cart', err)
        res.status(500).json({ error: 'Unable to add a product to a cart' })
    }
}

const checkOutClientCart = async (req, res) => {
    try {
        const userID = req.user.userId
        const { invoice_id, totalAmount, items } = await CartModel.checkout(userID)
        res.status(200).json({
            invoice_id,
            items,
            total_amount: totalAmount
        })
    } catch (err) {
        console.log('Error while doing the checkout', err)
        res.status(500).json({ error: 'Unable to do the checkout at this moment' })
    }
}

const getAllProductsInCart = async (req, res) => {
    try {
        const userID = req.user.userId
        const products = await CartModel.getAllProductsInTheCart(userID);

        res.status(200).json(
            products
        )
    } catch (err) {
        console.log('Error while getting all the items', err)
        res.status(500).json({ error: 'Unable to check the items in the cart a this moment' })
    }
}

const getAllPurchases = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await CartModel.getAllPurchasesHistory(userId)
        res.status(200).json(
            result
        )
    } catch (err) {
        console.log('Error while getting the purchases', err)
        res.status(500).json({ error: 'Unable to check the items in the cart a this moment' })
    }
}

const updateProductQuantityInCart = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
  
    try {
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: "Invalid quantity" });
      }
  
      const userID = req.user.userId;
  
      // Update the cart item quantity
      const updatedItem = await CartModel.updateCartItemQuantity(userID, itemId, quantity);
  
      if (updatedItem) {
        return res.status(200).json({ message: "Quantity updated", updatedItem });
      } else {
        return res.status(404).json({ error: "Cart item not found" });
      }
    } catch (err) {
      console.error("Error updating cart item", err);
      return res.status(500).json({ error: "Unable to update cart item" });
    }
  };

  const deleteCartItem = async (req, res) => {
    try {
      const userID = req.user.userId;
      const { itemId } = req.params;
  
      const result = await CartModel.deleteCartItem(userID, itemId);
      if (result) {
        res.status(200).json({ message: 'Product removed from cart' });
      } else {
        res.status(404).json({ error: 'Item not found in cart' });
      }
    } catch (err) {
      console.error('Error deleting product from cart', err);
      res.status(500).json({ error: 'Unable to delete the item at this moment' });
    }
  };

  const getPurchaseByInvoiceId = async (req, res) => {
    try {
      const userID = req.user.userId;
      const { invoice_id } = req.params;
  
      const purchaseData = await CartModel.getPurchaseByInvoiceId(userID, invoice_id);
  
      res.status(200).json(purchaseData);
    } catch (err) {
      console.error("Error fetching purchase by invoice ID:", err);
      res.status(err.message === "Invoice not found" ? 404 : 500).json({ error: err.message });
    }
  };
  
  module.exports = {
    ...require("./CartController"), // Include existing methods
    getPurchaseByInvoiceId,
  };
  
  
  
  module.exports = {
    addProductToCart,
    checkOutClientCart,
    getAllProductsInCart,
    getAllPurchases,
    updateProductQuantityInCart, 
    deleteCartItem,
    getPurchaseByInvoiceId
  };
  