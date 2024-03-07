const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());
app.use(cors())

const dbPath = './data.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connectado con la base de datos.');
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('username: ' + username, 'password: ' + password);
  db.run('INSERT INTO data (username, password) VALUES (?, ?)', [username, password], function (err) {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(201).json({ message: 'Datos registrados.' });
  });
});

app.get('/view', (req, res) => {
  db.all('SELECT * FROM data', (err, users) => {
    if (err) {
      return res.status(500).send('Error al obtener usuarios de la base de datos');
    }
    res.json(users);
  });
})

app.listen(3000, () => {
  console.log('El servidor se está ejecutando en el puerto 3000.');
});