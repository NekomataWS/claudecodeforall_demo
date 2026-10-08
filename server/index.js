require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const path    = require('path');

const app = express();

app.use(express.json());

// Serve the static Mind Cafe site from the project root
app.use(express.static(path.join(__dirname, '..')));

// Payment API
app.use('/api/payments', require('./routes/payments'));

// 404 — fall through to index for SPA-style (if ever needed)
app.use((_req, res) => res.status(404).send('Not found'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mind Cafe  →  http://localhost:${PORT}`);
  console.log(`Payment mode: ${process.env.PAYMENT_MODE || 'mock'}`);
});
