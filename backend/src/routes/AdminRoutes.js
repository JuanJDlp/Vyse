const express = require("express");
const router = express.Router()
const { createProduct } = require("../controller/ProductController")

router.post("/products" , createProduct)

module.exports = router;