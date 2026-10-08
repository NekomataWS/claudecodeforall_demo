// Payment service — dispatches to mock or 2C2P based on PAYMENT_MODE.
// Real 2C2P integration requires confirmed API version and sandbox credentials.

function createPaymentToken(order) {
  const mode = process.env.PAYMENT_MODE || 'mock';

  if (mode === 'mock') {
    const base = process.env.BASE_URL || 'http://localhost:3000';
    return {
      token: `MOCK-${order.id}`,
      paymentUrl: `${base}/mock-payment.html?orderId=${order.id}`,
    };
  }

  // Real 2C2P — not yet implemented.
  // Before implementing: confirm with 2C2P which API version is in use,
  // whether per-transaction frontendReturnUrl / backendReturnUrl is supported,
  // and obtain sandbox MID + keys.
  throw new Error(
    'Real 2C2P integration is not yet configured. Set PAYMENT_MODE=mock for development.'
  );
}

module.exports = { createPaymentToken };
