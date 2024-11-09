const express = require("express");
const router = express.Router()
const { addProductToCart, checkOutClientCart, getAllProductsInCart, getAllPurchases } = require("../controller/CartController")
const authMiddleware = require("../middlewares/JWTMiddleware")

router.post("/cart", authMiddleware, addProductToCart)
router.post("/checkout", authMiddleware, checkOutClientCart)
router.get("/cart", authMiddleware, getAllProductsInCart)
router.get("/purchases", authMiddleware, getAllPurchases)

module.exports = router;