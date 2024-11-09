const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5444,
    database: 'postgres'
});

//TODO: ASI NO SE DEBERIA INICIAR UNA BASE DE DATOS XD
try {
    // Drop table if it exists, then create a new users table
    pool.query(
        `
        DROP TABLE IF EXISTS receipt CASCADE; 
        DROP TABLE IF EXISTS receipt_items CASCADE;
        DROP TABLE IF EXISTS cart CASCADE;
        DROP TABLE IF EXISTS products CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        `);

    pool.query(`
        CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
id SERIAL PRIMARY KEY,
name VARCHAR(50) NOT NULL,
description VARCHAR(50) NOT NULL,
price NUMERIC NOT NULL,
quantity INTEGER NOT NULL CHECK(quantity >= 0)
);

CREATE TABLE cart(
id SERIAL PRIMARY KEY,
user_id INTEGER,
product_id INTEGER,
quantity INTEGER NOT NULL CHECK(quantity >= 0),
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE receipt (
    invoice_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE receipt_items (
    receipt_id INT REFERENCES receipt(invoice_id),
    product_id INT REFERENCES products(id),
    quantity INT,
    price DECIMAL(10, 2),
    PRIMARY KEY (receipt_id, product_id)
);

`);
} catch (e) { 
    console.log(e)
}

module.exports = {
    pool : pool
};
