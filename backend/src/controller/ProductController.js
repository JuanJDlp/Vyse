const { ProductModel } = require("../model/Product")
const { body, validationResult } = require('express-validator');

const createProduct = async (req, res) => {
    await body('name').not().isEmpty().trim().escape().run(req);
    await body('description').not().isEmpty().trim().escape().run(req);
    await body('price').not().isEmpty().run(req);
    await body('quantity').not().isEmpty().run(req);

    //TODO:ACTIVAR ESTA LINEA CUANDO SE VAYA A PROBAR LA API FINAL
    // if (req.user.role !== "admin"){
    //     res.status(403).json({error: "You need to be an admin to create a product" })
    // }

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

module.exports = {
    createProduct,
    getAllProducts
}