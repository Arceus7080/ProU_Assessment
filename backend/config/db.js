// backend/config/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'prou_user',
  password: process.env.DB_PASSWORD || 'prou_pass',
  database: process.env.DB_NAME || 'prou_db',
  waitForConnections: true,
  connectionLimit: 10,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
});

module.exports = pool;
