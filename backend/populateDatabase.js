const { pool } = require('./src/database/DataBaseConfiguration');

const populateDatabase = async () => {
  try {
    // Insert fake users
    await pool.query(`
      INSERT INTO users (username, email, password, role)
      VALUES 
      ('admin', 'admin@example.com', 'admin123', 'admin'),
      ('john_doe', 'john@example.com', 'password123', 'user'),
      ('jane_doe', 'jane@example.com', 'password123', 'user');
    `);

    // Insert fake products
    await pool.query(`
      INSERT INTO products (name, description, price, quantity, image)
      VALUES 
      ('Laptop', 'A high-performance laptop', 1200, 10, 'https://via.placeholder.com/150'),
      ('Smartphone', 'Latest smartphone model', 800, 20, 'https://via.placeholder.com/150'),
      ('Headphones', 'Noise-cancelling headphones', 200, 15, 'https://via.placeholder.com/150'),
      ('Gaming Console', 'Next-gen gaming console', 500, 8, 'https://via.placeholder.com/150'),
      ('Smartwatch', 'A stylish smartwatch', 150, 25, 'https://via.placeholder.com/150');
    `);

    console.log('Database has been populated!');
    process.exit();
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
};

populateDatabase();
