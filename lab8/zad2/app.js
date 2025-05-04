const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const client = redis.createClient({ url: 'redis://redis:6379' });

client.connect().catch(console.error);

app.use(bodyParser.json());

app.post('/messages', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).send("Message is required");
    await client.rPush("messages", message);
    res.status(201).send("Message added");
});

app.get('/messages', async (req, res) => {
    const messages = await client.lRange("messages", 0, -1);
    res.json({ messages });
});

app.listen(port, () => {
    console.log(`API działa na http://localhost:${port}`);
});
