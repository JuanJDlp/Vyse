const { pool } = require("../database/DataBaseConfiguration")

const ProductModel = {

    createProduct: async (name, description, price, quantity) => {
        try{
            const result = await pool.query(
                `INSERT INTO products (name, description,price,quantity)
                VALUES ($1,$2,$3,$4) RETURNING *`, [name,description,price,quantity]
            )
            return result.rows[0];
        }catch(err){
            console.error('Error creating the product', err);
            throw err;
        }
    },

    getAllProducts: async () => {
        try {
            const result = await pool.query(
                `SELECT * FROM products`,
            );
            return result.rows;
        } catch (err) {
            console.error('Error getting all the products', err);
            throw err;
        }
    },
}

module.exports = {ProductModel}