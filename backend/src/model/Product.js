const { pool } = require("../database/DataBaseConfiguration")

const ProductModel = {

    createProduct: async (name, description, price, quantity,image) => {
        try{
            const result = await pool.query(
                `INSERT INTO products (name, description,price,quantity,image)
                VALUES ($1,$2,$3,$4,$5) RETURNING *`, [name,description,price,quantity,image]
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
    updateProduct: async (id, name, description, price, quantity,image) => {
        try {
          const result = await pool.query(
            `UPDATE products
             SET name = $1, description = $2, price = $3, quantity = $4, image = $5
             WHERE id = $6 RETURNING *`,
            [name, description, price, quantity,image, id]
          );
          return result.rows[0];
        } catch (err) {
          console.error("Error updating the product", err);
          throw err;
        }
      },
    
      deleteProduct: async (id) => {
        try {
          const result = await pool.query(
            `DELETE FROM products WHERE id = $1 RETURNING *`,
            [id]
          );
          return result.rows[0];
        } catch (err) {
          console.error("Error deleting the product", err);
          throw err;
        }
      },
}

module.exports = {ProductModel}