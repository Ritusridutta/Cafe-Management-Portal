const db = require("../config/db");

const initDB = () => {

  // USERS
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100),
      password VARCHAR(255),
      phone VARCHAR(20),
      city VARCHAR(50),
      address TEXT
    )
  `);

  // MENU
  db.query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      category VARCHAR(50),
      price DECIMAL(10,2),
      image VARCHAR(255),
      is_available BOOLEAN DEFAULT TRUE
    )
  `);

  // ORDERS
  db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(20) UNIQUE,
      user_email VARCHAR(100),
      total DECIMAL(10,2),

      status ENUM(
        'placed',
        'accepted',
        'being_prepared',
        'ready',
        'completed'
      ) DEFAULT 'placed',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

    )
  `);

  // ORDER ITEMS
  db.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(20),
      item_name VARCHAR(100),
      category VARCHAR(50),
      price DECIMAL(10,2),
      quantity INT,
      FOREIGN KEY (order_id) REFERENCES orders(order_id)
    )
  `);

  // RAW ITEMS
  db.query(`
    CREATE TABLE IF NOT EXISTS raw_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      stock INT,
      unit VARCHAR(20)
    )
  `);

  // FEEDBACK
  db.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      rating INT,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Tables Initialized ✅");
};

module.exports = initDB;