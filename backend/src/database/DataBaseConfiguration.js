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
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS products;
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
quantity INTEGER NOT NULL
);
`);
} catch (e) { 
    console.log(e)
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool : pool
};
