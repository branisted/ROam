const express = require('express');
const app = express();
const port = 3001; // Use a different port than frontend

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('my-database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

const session = require('express-session');
const bcrypt = require('bcrypt');

app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: true,
}));
