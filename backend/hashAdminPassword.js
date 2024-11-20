const bcrypt = require('bcryptjs');
const { pool } = require('./src/database/DataBaseConfiguration');

const hashAdminPassword = async () => {
  try {
    const userPassword = 'password123'; // The plain text password
    const hashedPassword = await bcrypt.hash(userPassword, 10); // Hash the password

    // Update the admin's password in the database
    await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, 'jane@example.com']
    );

    console.log('user password has been updated and hashed successfully!');
    process.exit();
  } catch (err) {
    console.error('Error hashing user password:', err);
    process.exit(1);
  }
};

hashAdminPassword();
