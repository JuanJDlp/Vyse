const express = require("express");
const router = express.Router()
const { addProductToCart, 
    checkOutClientCart, 
    getAllProductsInCart, 
    getAllPurchases, 
    updateProductQuantityInCart, 
    deleteCartItem,
    getPurchaseByInvoiceId } = require("../controller/CartController")
const authMiddleware = require("../middlewares/JWTMiddleware")

router.post("/cart", authMiddleware, addProductToCart)
router.post("/checkout", authMiddleware, checkOutClientCart)
router.get("/cart", authMiddleware, getAllProductsInCart)
router.get("/purchases", authMiddleware, getAllPurchases)
router.put("/cart/:itemId", authMiddleware, updateProductQuantityInCart);
router.delete('/cart/:itemId', authMiddleware, deleteCartItem);
router.get('/purchase/:invoice_id', authMiddleware, getPurchaseByInvoiceId);



module.exports = router;