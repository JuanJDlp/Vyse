const express = require("express");
const router = express.Router()
const { createProduct, updateProduct, deleteProduct } = require("../controller/ProductController")
const authMiddleware = require("../middlewares/JWTMiddleware")

router.post("/products" , authMiddleware, createProduct)
router.put("/products/:id", authMiddleware, updateProduct);
router.delete("/products/:id", authMiddleware, deleteProduct);


module.exports = router;