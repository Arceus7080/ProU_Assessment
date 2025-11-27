// backend/server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'prou_user',
  password: process.env.DB_PASSWORD || 'prou_pass',
  database: process.env.DB_NAME || 'prou_db',
  waitForConnections: true,
  connectionLimit: 10
};

let pool;
(async function init() {
  try {
    pool = mysql.createPool(DB_CONFIG);
    await pool.query('SELECT 1');
    console.log('MySQL connected');
  } catch (err) {
    console.error('MySQL init error:', err.message);
    process.exit(1);
  }
})();

async function query(sql, params=[]) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

/* Employees */
app.get('/api/employees', async (req, res) => {
  try { res.json(await query('SELECT * FROM employees')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/employees', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await query('INSERT INTO employees (name, email) VALUES (?, ?)', [name, email]);
    res.json({ id: result.insertId, name, email });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/employees/:id', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await query('UPDATE employees SET name=?, email=? WHERE id=?', [name, email, req.params.id]);
    res.json({ affectedRows: result.affectedRows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM employees WHERE id=?', [req.params.id]);
    res.json({ affectedRows: result.affectedRows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* Tasks */
app.get('/api/tasks', async (req, res) => {
  try {
    const sql = `SELECT t.*, e.name AS employee_name
                 FROM tasks t LEFT JOIN employees e ON t.employee_id = e.id
                 ORDER BY t.created_at DESC`;
    res.json(await query(sql));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/tasks', async (req, res) => {
  const { title, description, employee_id, status } = req.body;
  try {
    const result = await query(
      'INSERT INTO tasks (title, description, employee_id, status) VALUES (?, ?, ?, ?)',
      [title, description || null, employee_id || null, status || 'pending']
    );
    res.json({ id: result.insertId, title, description, employee_id, status: status || 'pending' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/tasks/:id', async (req, res) => {
  const { title, description, employee_id, status } = req.body;
  try {
    const result = await query(
      'UPDATE tasks SET title=?, description=?, employee_id=?, status=? WHERE id=?',
      [title, description || null, employee_id || null, status || 'pending', req.params.id]
    );
    res.json({ affectedRows: result.affectedRows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM tasks WHERE id=?', [req.params.id]);
    res.json({ affectedRows: result.affectedRows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on', PORT));
