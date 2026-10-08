const express = require('express');
const crypto  = require('crypto');
const db      = require('../db/db');
const { findBySku } = require('../catalog');
const { createPaymentToken } = require('../services/payment');

const router = express.Router();

// ── Helpers ─────────────────────────────────────────────────────────────────

function newId()  { return crypto.randomUUID(); }
function now()    { return new Date().toISOString(); }
function invoice(){ return `COFFEE-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`; }

function logEvent(orderId, eventType, verificationResult, payload) {
  db.prepare(
    'INSERT INTO payment_events (id, order_id, event_type, received_at, verification_result, payload) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(newId(), orderId, eventType, now(), verificationResult ?? null, payload ? JSON.stringify(payload) : null);
}

// ── POST /api/payments/create ────────────────────────────────────────────────

router.post('/create', (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items must be a non-empty array' });
  }

  let total = 0;
  const orderItems = [];

  for (const { sku, qty } of items) {
    if (typeof sku !== 'string') {
      return res.status(400).json({ error: 'Each item requires a sku string' });
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      return res.status(400).json({ error: `Invalid quantity for sku: ${sku}` });
    }
    const catalogItem = findBySku(sku);
    if (!catalogItem) {
      return res.status(400).json({ error: `Unknown sku: ${sku}` });
    }
    total += catalogItem.price * qty;
    orderItems.push({ sku: catalogItem.sku, name: catalogItem.name, qty, unitPrice: catalogItem.price });
  }

  const orderId   = newId();
  const invoiceNo = invoice();
  const ts        = now();

  db.prepare(`
    INSERT INTO orders (id, invoice_no, items, amount, currency, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(orderId, invoiceNo, JSON.stringify(orderItems), total, 'THB', 'PENDING', ts, ts);

  logEvent(orderId, 'ORDER_CREATED', null, { invoice_no: invoiceNo, amount: total });

  let paymentUrl;
  try {
    ({ paymentUrl } = createPaymentToken({ id: orderId, invoice_no: invoiceNo, amount: total }));
  } catch (err) {
    return res.status(503).json({ error: err.message });
  }

  res.json({ orderId, paymentUrl });
});

// ── GET /api/payments/:orderId/status ────────────────────────────────────────

router.get('/:orderId/status', (req, res) => {
  const row = db.prepare(
    'SELECT id, invoice_no, items, amount, currency, status, created_at, updated_at FROM orders WHERE id = ?'
  ).get(req.params.orderId);

  if (!row) return res.status(404).json({ error: 'Order not found' });

  res.json({ ...row, items: JSON.parse(row.items) });
});

// ── POST /api/payments/2c2p/callback ────────────────────────────────────────
// Real 2C2P backend notification. In mock mode: log and acknowledge only.

router.post('/2c2p/callback', (req, res) => {
  const mode = process.env.PAYMENT_MODE || 'mock';

  if (mode === 'mock') {
    logEvent('unknown', '2C2P_CALLBACK_MOCK', 'MOCK_IGNORED', { body: req.body });
    return res.sendStatus(200);
  }

  // TODO (sandbox/production): implement 2C2P signature validation.
  // 1. Parse and decode payload per confirmed 2C2P API version.
  // 2. Verify HMAC/JWT using TWO_C_TWO_P_SECRET_KEY.
  // 3. Match invoiceNo, amount, currency, MID against stored order.
  // 4. Update order status atomically; guard against replay by provider_transaction_id.
  // 5. Return 200 regardless — log failures, never expose internals.
  return res.status(501).json({ error: '2C2P callback not yet implemented for this mode' });
});

// ── POST /api/payments/mock/complete ────────────────────────────────────────

router.post('/mock/complete', (req, res) => {
  if (process.env.PAYMENT_MODE !== 'mock') {
    return res.status(403).json({ error: 'Mock endpoints are disabled in non-mock mode' });
  }

  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  const order = db.prepare('SELECT id, status FROM orders WHERE id = ?').get(orderId);
  if (!order)                     return res.status(404).json({ error: 'Order not found' });
  if (order.status !== 'PENDING') return res.status(409).json({ error: `Order is already ${order.status}` });

  const ts = now();
  db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').run('PAID', ts, orderId);
  db.prepare(`
    INSERT INTO payments (id, order_id, provider, provider_transaction_id, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(newId(), orderId, '2c2p-mock', `MOCK-TXN-${orderId.slice(0, 8).toUpperCase()}`, 'PAID', ts, ts);
  logEvent(orderId, 'MOCK_PAYMENT_COMPLETE', 'MOCK_SUCCESS', null);

  const returnUrl = process.env.COFFEE_FRONTEND_RETURN_URL || 'http://localhost:3000/payment-result.html';
  res.json({ redirectUrl: `${returnUrl}?orderId=${orderId}` });
});

// ── POST /api/payments/mock/cancel ───────────────────────────────────────────

router.post('/mock/cancel', (req, res) => {
  if (process.env.PAYMENT_MODE !== 'mock') {
    return res.status(403).json({ error: 'Mock endpoints are disabled in non-mock mode' });
  }

  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  const order = db.prepare('SELECT id, status FROM orders WHERE id = ?').get(orderId);
  if (!order)                     return res.status(404).json({ error: 'Order not found' });
  if (order.status !== 'PENDING') return res.status(409).json({ error: `Order is already ${order.status}` });

  const ts = now();
  db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').run('CANCELLED', ts, orderId);
  db.prepare(`
    INSERT INTO payments (id, order_id, provider, provider_transaction_id, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(newId(), orderId, '2c2p-mock', null, 'CANCELLED', ts, ts);
  logEvent(orderId, 'MOCK_PAYMENT_CANCEL', 'MOCK_CANCELLED', null);

  const returnUrl = process.env.COFFEE_FRONTEND_RETURN_URL || 'http://localhost:3000/payment-result.html';
  res.json({ redirectUrl: `${returnUrl}?orderId=${orderId}&cancelled=1` });
});

module.exports = router;
