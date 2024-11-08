const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5444,
    database: 'postgres'
});

try {
    // Drop table if it exists, then create a new users table
    pool.query("DROP TABLE IF EXISTS users;");

    pool.query(`CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);
} catch (e) { 
    console.log(e)
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool : pool
};
