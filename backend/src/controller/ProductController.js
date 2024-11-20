const { ProductModel } = require("../model/Product")
const { body, validationResult } = require('express-validator');

const createProduct = async (req, res) => {
    await body('name').not().isEmpty().trim().escape().run(req);
    await body('description').not().isEmpty().trim().escape().run(req);
    await body('price').not().isEmpty().run(req);
    await body('quantity').not().isEmpty().run(req);

    
     if (req.user.role !== "admin"){
        res.status(403).json({error: "You need to be an admin to create a product" })
     }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, quantity } = req.body;

    try {
        await ProductModel.createProduct(name, description, price, quantity);

        res.status(201).json({
            message: "Product added successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Invalid data' });
    }
}

const getAllProducts = async (req, res) => {
    try {

        const products = await ProductModel.getAllProducts();

        res.status(200).json(
            products
        )

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to fetch all the data' })
    }
}


const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;
  
    try {
      await ProductModel.updateProduct(id, name, description, price, quantity);
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  const deleteProduct = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedProduct = await ProductModel.deleteProduct(id);
  
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
}