const express = require('express');
const redis = require('redis');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const redisClient = redis.createClient({ url: 'redis://redis:6379' });

const pgPool = new Pool({
    host: 'postgres',
    user: 'postgres',
    password: 'mysecretpassword',
    database: 'mydb',
    port: 5432,
});

async function waitForPostgres(pool, retries = 10, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            await pool.query('SELECT 1');
            console.log('Połączono z PostgreSQL');
            return;
        } catch (err) {
            console.log(`Czekam na PostgreSQL (${i + 1}/${retries})...`);
            await new Promise(res => setTimeout(res, delay));
        }
    }
    throw new Error('Nie udało się połączyć z PostgreSQL po wielu próbach.');
}

app.post('/messages', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).send('Message is required');
    await redisClient.rPush('messages', message);
    res.send('Message added');
});

app.get('/messages', async (req, res) => {
    const messages = await redisClient.lRange('messages', 0, -1);
    res.json({ messages });
});

app.post('/users', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).send('Name is required');
    await pgPool.query('INSERT INTO users(name) VALUES($1)', [name]);
    res.send('User added');
});

app.get('/users', async (req, res) => {
    const result = await pgPool.query('SELECT * FROM users');
    res.json(result.rows);
});

(async () => {
    try {
        console.log('Łączenie z Redis...');
        await redisClient.connect();
        console.log('Połączono z Redis');

        console.log('Sprawdzanie PostgreSQL...');
        await waitForPostgres(pgPool);

        console.log('Tworzenie tabeli users jeśli nie istnieje...');
        await pgPool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );`);

        app.listen(3000, () => {
            console.log('Express działa na porcie 3000');
        });
    } catch (err) {
        console.error('Błąd startu aplikacji:', err);
        process.exit(1);
    }
})();
