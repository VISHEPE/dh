const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'simple_crud',
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to serve HTML
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Routes
app.get('/', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) throw err;
    res.render('index', { items: results });
  });
});

app.post('/add', (req, res) => {
  const { name, description } = req.body;
  db.query('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.post('/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  db.query('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM items WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
