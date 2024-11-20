const { pool } = require('./src/database/DataBaseConfiguration');

const populateDatabase = async () => {
  try {
    // Delete all data from the database
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM cart');
    await pool.query('DELETE FROM receipt');
    await pool.query('DELETE FROM receipt_items');
    

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
      ('Laptop', 'A high-performance laptop ideal for work and gaming.', 2500, 10, 'https://m.media-amazon.com/images/I/71ygD+0w49L._AC_UY218_.jpg'),
      ('Gaming Headphones', 'Noise-cancelling headphones with surround sound.', 800, 15, 'https://m.media-amazon.com/images/I/712fHsfyIFL._AC_UY218_.jpg'),
      ('Wireless Mouse', 'Ergonomic wireless mouse with fast response time.', 50, 30, 'https://m.media-amazon.com/images/I/51dsuumz6HL._AC_UY218_.jpg'),
      ('Gaming Console', 'Next-gen console with 4K support and high FPS.', 500, 8, 'https://m.media-amazon.com/images/I/71wpE+ZIehL._AC_UY218_.jpg'),
      ('Smartwatch', 'Stylish smartwatch with health tracking.', 150, 25, 'https://m.media-amazon.com/images/I/61CZSoSnVPL._AC_UY218_.jpg'),
      ('Tablet', 'Lightweight tablet with high-resolution display.', 600, 10, 'https://m.media-amazon.com/images/I/71yE2gpf+QL._AC_UY218_.jpg'),
      ('Bluetooth Speaker', 'Portable Bluetooth speaker with powerful bass.', 300, 20, 'https://m.media-amazon.com/images/I/71IkzmEvucL._AC_UY218_.jpg'),
      ('Mechanical Keyboard', 'Mechanical keyboard with RGB lighting.', 120, 15, 'https://m.media-amazon.com/images/I/61Y97LP2mDL._AC_UY218_.jpg'),
      ('External SSD', '1TB portable SSD with fast data transfer rates.', 250, 12, 'https://m.media-amazon.com/images/I/41toBPLCXML._AC_UY218_.jpg'),
      ('Monitor', '4K Ultra HD monitor with high refresh rate.', 800, 5, 'https://m.media-amazon.com/images/I/71P1MZ8ztDL._AC_UY218_.jpg');
    `);

    console.log('Database has been populated!');
    process.exit();
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
};

populateDatabase();
