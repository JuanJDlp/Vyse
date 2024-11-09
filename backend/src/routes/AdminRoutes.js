const express = require("express");
const router = express.Router()
const { createProduct } = require("../controller/ProductController")
const authMiddleware = require("../middlewares/JWTMiddleware")

router.post("/products" , authMiddleware, createProduct)

module.exports = router;