const Razorpay = require('razorpay');
const dotenv = require('dotenv');

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

const createRazorpayOrder = async (amount, receiptId) => {
  const options = {
    amount: amount * 100, // Amount in paise
    currency: 'USD', // Adjust to INR if targeting India
    receipt: receiptId,
  };
  
  try {
    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    throw new Error('Razorpay order creation failed: ' + error.message);
  }
};

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret');
  hmac.update(orderId + "|" + paymentId);
  const generatedSignature = hmac.digest('hex');
  
  return generatedSignature === signature;
};

module.exports = { createRazorpayOrder, verifyRazorpaySignature, razorpayInstance };
