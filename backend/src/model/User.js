const { pool } = require("../database/DataBaseConfiguration")

const UserModel = {
    createUser: async (username, email, hashedPassword, role) => {
        try {
            const result = await pool.query(
                `INSERT INTO users (username, email, password, role) 
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [username, email, hashedPassword, role]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Error creating user:', err);
            throw err;
        }
    },

    getUserByEmail: async (email) => {
        try {
            const result = await pool.query(
                `SELECT * FROM users WHERE email = $1`,
                [email]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Error fetching user by email:', err);
            throw err;
        }
    },

    getUserByID: async (id) => {
        try {
            const result = await pool.query(
                `SELECT * FROM users WHERE id = $1`,
                [id]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Error getting the user by id', err);
            throw err;
        }
    },

    userExists: async (id) => {
        try {
            const result = await pool.query(
                `SELECT COUNT(*) FROM users WHERE id = $1`,
                [id]
            );
            return result.rows[0].count > 0;
        } catch (err) {
            console.error('Error checking if user exists:', err);
            throw err;
        }
    }
};

module.exports = {

    UserModel

};

