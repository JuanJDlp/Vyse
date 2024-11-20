const { pool } = require("../database/DataBaseConfiguration")

const CartModel = {
    addItemToCart: async (user_id, product_id, quantity) => {
        try {
            const result = await pool.query(
                `INSERT INTO cart (user_id,product_id,quantity)
                VALUES ($1,$2,$3) RETURNING *`, [user_id, product_id, quantity]
            )
            return result.rows[0]
        } catch (err) {
            console.error('Error adding product to the cart', err);
            throw err;
        }
    },
    cleanCartForUser: async (user_id) => {
        try {
            await pool.query(`DELETE FROM cart WHERE user_id = $1`,
                [user_id])
        } catch (err) {
            console.error('Error while deleting the cart for the user', err);
            throw err;
        }
    },

    getAllProductsInTheCart: async (user_id) => {
        try {
            const result = await pool.query(`SELECT p.id, p.name, p.description,p.price,c.quantity,p.image FROM cart c JOIN products p on p.id = c.product_id WHERE user_id = $1`, [user_id]);
            return result.rows;
        } catch (err) {
            console.log("Error while fetching all the products in the cart");
            throw err;
        }
    },

    getAllPurchasesHistory: async (user_id) => {
        try {
            const result = await pool.query(
                `SELECT r.invoice_id, r.created_at, r.total_amount, 
                    ri.product_id, ri.quantity, ri.price, p.name
             FROM receipt r
             JOIN receipt_items ri ON r.invoice_id = ri.receipt_id
             JOIN products p ON ri.product_id = p.id
             WHERE r.user_id = $1
             ORDER BY r.created_at DESC`,
                [user_id]
            );

            const purchases = {};

            // Organize data into the required structure
            result.rows.forEach(row => {
                const { invoice_id, created_at, total_amount, quantity, price, name } = row;
                if (!purchases[invoice_id]) {
                    purchases[invoice_id] = {
                        invoice_id,
                        date: created_at.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                        total_amount,
                        items: []
                    };
                }

                purchases[invoice_id].items.push({
                    name,
                    quantity,
                    price,
                    total: (price * quantity).toFixed(2) // Calculate total for the item
                });
            });

            // Convert the object to an array
            return Object.values(purchases);
        } catch (err) {
            console.error('Error retrieving purchase history', err);
            throw err;
        }
    },


    checkout: async (user_id) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Retrieve and consolidate cart items by product
            const cartItemsResult = await client.query(
                `SELECT c.product_id, SUM(c.quantity) AS quantity, p.price 
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = $1
             GROUP BY c.product_id, p.price`,
                [user_id]
            );

            const cartItems = cartItemsResult.rows;
            if (cartItems.length === 0) {
                throw new Error("Cart is empty");
            }

            // Calculate total amount and validate stock
            let totalAmount = 0;
            for (const item of cartItems) {
                totalAmount += item.price * item.quantity;

                // Check if enough quantity is available in stock
                const productStockResult = await client.query(
                    `SELECT quantity FROM products WHERE id = $1`,
                    [item.product_id]
                );
                const productStock = productStockResult.rows[0].quantity;

                if (productStock < item.quantity) {
                    throw new Error(`Not enough stock for product ID ${item.product_id}`);
                }

                // Update product stock after validation
                await client.query(
                    `UPDATE products SET quantity = quantity - $1 WHERE id = $2`,
                    [item.quantity, item.product_id]
                );
            }

            // Insert receipt
            const receiptResult = await client.query(
                `INSERT INTO receipt (user_id, total_amount) VALUES ($1, $2) RETURNING invoice_id`,
                [user_id, totalAmount]
            );
            const invoice_id = receiptResult.rows[0].invoice_id;

            // Insert consolidated receipt items
            for (const item of cartItems) {
                await client.query(
                    `INSERT INTO receipt_items (receipt_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
                    [invoice_id, item.product_id, item.quantity, item.price]
                );
            }

            // Clear the cart
            await client.query(`DELETE FROM cart WHERE user_id = $1`, [user_id]);

            await client.query('COMMIT');
            return { invoice_id, totalAmount, items: cartItems };
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Transaction error', err);
            throw err;
        } finally {
            client.release();
        }
    }
}

module.exports = { CartModel }