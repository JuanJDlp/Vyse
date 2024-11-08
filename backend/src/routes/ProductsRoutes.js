const express = require("express");
const router = express.Router()
const {getAllProducts} = require("../controller/ProductController")

router.get("/",getAllProducts)

module.exports = router;