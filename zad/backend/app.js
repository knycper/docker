const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'database',
    user: 'root',
    password: 'root',
    database: 'appdb'
});

app.get('/', (req, res) => {
    res.send('Hello from backend!');
});

app.get('/db', (req, res) => {
    db.query('SELECT NOW() AS time', (err, results) => {
        if (err) {
            return res.status(500).send('Błąd połączenia z bazą: ' + err.message);
        }
        res.send('Połączenie z bazą OK. Czas: ' + results[0].time);
    });
});

app.listen(port, () => {
    console.log(`Backend działa na porcie ${port}`);
});
