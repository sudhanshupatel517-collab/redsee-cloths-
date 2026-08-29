const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const PendingPayment = require('../models/PendingPayment');

// Lazy-initialize Razorpay instance (avoids crash if keys aren't configured yet)
let _razorpayInstance = null;
const getRazorpayInstance = () => {
  if (!_razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    }
    _razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpayInstance;
};

// Shared helper: generate unique 8-digit order ID (same logic as orderController)
const generateUniqueOrderId = async () => {
  let isUnique = false;
  let orderId = '';
  while (!isUnique) {
    const randNum = Math.floor(10000000 + Math.random() * 90000000);
    orderId = randNum.toString();
    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      isUnique = true;
    }
  }
  return orderId;
};

// Shared helper: validate items, check stock, and calculate server-side totals
// Returns { validatedItems, subtotal } or throws an error
const validateAndCalculate = async (items) => {
  if (!items || items.length === 0) {
    const err = new Error('No items provided');
    err.statusCode = 400;
    throw err;
  }

  const validatedItems = [];
  let subtotal = 0;

  for (const item of items) {
    if (!item.product || !item.quantity || item.quantity < 1) {
      const err = new Error(`Invalid item: product ID and quantity (>= 1) are required`);
      err.statusCode = 400;
      throw err;
    }

    const product = await Product.findById(item.product);
    if (!product) {
      const err = new Error(`Product not found: ${item.product}`);
      err.statusCode = 404;
      throw err;
    }

    if (!product.published) {
      const err = new Error(`Product is not available: ${product.name}`);
      err.statusCode = 400;
      throw err;
    }

    // Validate variant stock if size/color specified
    if (product.variants && product.variants.length > 0 && item.size && item.color) {
      const variant = product.variants.find(
        v => v.size === item.size && v.color === item.color
      );
      if (!variant) {
        const err = new Error(`Variant not found: ${product.name} (${item.size}, ${item.color})`);
        err.statusCode = 400;
        throw err;
      }
      if (variant.stock < item.quantity) {
        const err = new Error(`Insufficient stock for ${product.name} (${item.size}, ${item.color}). Available: ${variant.stock}`);
        err.statusCode = 400;
        throw err;
      }
    } else if (product.totalStock < item.quantity) {
      const err = new Error(`Insufficient stock for ${product.name}. Available: ${product.totalStock}`);
      err.statusCode = 400;
      throw err;
    }

    const itemPrice = product.pricing.finalPrice;
    subtotal += itemPrice * item.quantity;

    validatedItems.push({
      product: product._id,
      quantity: item.quantity,
      size: item.size || '',
      color: item.color || '',
      price: itemPrice // DB price, not client-supplied
    });
  }

  return { validatedItems, subtotal };
};

// Shared helper: calculate shipping and tax from subtotal (matches frontend logic)
const calculateTotals = (subtotal) => {
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax, rounded to 2 decimals
  const totalAmount = Math.round((subtotal + shipping + tax) * 100) / 100;
  return { shipping, tax, totalAmount };
};

// Shared helper: decrement variant stock for purchased items
const decrementStock = async (validatedItems) => {
  for (const item of validatedItems) {
    try {
      if (item.size && item.color) {
        // Decrement specific variant stock
        await Product.findOneAndUpdate(
          { _id: item.product, 'variants.size': item.size, 'variants.color': item.color },
          { $inc: { 'variants.$.stock': -item.quantity } }
        );
        // Trigger totalStock + inventoryStatus recalculation via save
        const prod = await Product.findById(item.product);
        if (prod) await prod.save();
      }
      // Always increment salesCount
      await Product.findByIdAndUpdate(item.product, {
        $inc: { salesCount: item.quantity }
      });
    } catch (err) {
      console.error(`Failed to update stock/salesCount for product ${item.product}:`, err);
    }
  }
};

// @desc    Create a Razorpay order (server-side price calculation)
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Validate items and calculate server-side price
    const { validatedItems, subtotal } = await validateAndCalculate(items);
    const { totalAmount } = calculateTotals(subtotal);

    // Amount in paise for Razorpay (INR × 100)
    const amountInPaise = Math.round(totalAmount * 100);

    // Create Razorpay order via SDK
    const razorpayOrder = await getRazorpayInstance().orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `redsee_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
      }
    });

    // Store pending payment for verification later
    await PendingPayment.create({
      razorpayOrderId: razorpayOrder.id,
      userId: req.user._id,
      items: validatedItems.map(i => ({
        product: i.product,
        quantity: i.quantity,
        size: i.size,
        color: i.color
      })),
      shippingAddress,
      calculatedAmount: totalAmount,
    });

    // Return only public info to frontend — NEVER the secret
    res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('createRazorpayOrder error:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message || 'Failed to create Razorpay order' });
  }
};

// @desc    Verify Razorpay payment signature and create RedSee order
// @route   POST /api/payment/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification parameters' });
    }

    // 1. Look up the pending payment
    const pendingPayment = await PendingPayment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!pendingPayment) {
      return res.status(404).json({ message: 'Payment session not found or expired' });
    }

    // 2. Idempotency check — if already completed, return the existing order
    if (pendingPayment.status === 'completed' && pendingPayment.completedOrderId) {
      const existingOrder = await Order.findById(pendingPayment.completedOrderId)
        .populate('products.product');
      if (existingOrder) {
        return res.status(200).json({
          message: 'Payment already verified',
          order: existingOrder
        });
      }
    }

    // 3. Verify ownership
    if (pendingPayment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this payment' });
    }

    // 4. Verify Razorpay signature (HMAC SHA256)
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Mark as failed but don't delete — for audit trail
      return res.status(400).json({ message: 'Payment verification failed: invalid signature' });
    }

    // 5. Re-validate stock before finalizing (another user could have bought in between)
    try {
      await validateAndCalculate(pendingPayment.items);
    } catch (stockErr) {
      return res.status(400).json({ message: `Stock validation failed after payment: ${stockErr.message}. Please contact support for a refund.` });
    }

    // 6. Create the RedSee order
    const orderId = await generateUniqueOrderId();

    // Rebuild validated items with DB prices
    const { validatedItems, subtotal } = await validateAndCalculate(pendingPayment.items);
    const { totalAmount } = calculateTotals(subtotal);

    const order = new Order({
      _id: orderId,
      userId: req.user._id,
      products: validatedItems,
      shippingAddress: pendingPayment.shippingAddress,
      paymentMethod: 'Razorpay',
      totalAmount,
      paymentStatus: 'Completed',
      orderStatus: 'Confirmed',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    const createdOrder = await order.save();

    // 7. Decrement stock and increment salesCount
    await decrementStock(validatedItems);

    // 8. Clear user's server-side cart
    try {
      await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });
    } catch (cartErr) {
      console.error('Failed to clear server cart:', cartErr);
    }

    // 9. Mark pending payment as completed (idempotency)
    pendingPayment.status = 'completed';
    pendingPayment.completedOrderId = orderId;
    await pendingPayment.save();

    // 10. Return populated order
    const populatedOrder = await Order.findById(createdOrder._id)
      .populate('products.product');

    res.status(201).json({
      message: 'Payment verified and order created successfully',
      order: populatedOrder,
    });
  } catch (error) {
    console.error('verifyRazorpayPayment error:', error);
    res.status(500).json({ message: error.message || 'Payment verification failed' });
  }
};

// @desc    Get Razorpay Key ID (public key only)
// @route   GET /api/payment/key
// @access  Private
const getKey = (req, res) => {
  res.status(200).json({ keyId: process.env.RAZORPAY_KEY_ID });
};

// @desc    Handle Razorpay webhook events (safety net)
// @route   POST /api/payment/webhook
// @access  Public (verified via webhook signature)
const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // If no webhook secret configured, skip verification
    if (!webhookSecret) {
      console.warn('RAZORPAY_WEBHOOK_SECRET not configured — webhook endpoint disabled');
      return res.status(200).json({ status: 'ok' });
    }

    // Verify webhook signature
    const receivedSignature = req.headers['x-razorpay-signature'];
    if (!receivedSignature) {
      return res.status(400).json({ message: 'Missing webhook signature' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== receivedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured') {
      const paymentEntity = payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      // Check if order already created (idempotent)
      const pendingPayment = await PendingPayment.findOne({ razorpayOrderId });
      if (!pendingPayment || pendingPayment.status === 'completed') {
        // Already processed or not found — acknowledge webhook
        return res.status(200).json({ status: 'ok' });
      }

      // If still pending, the frontend verification may have failed.
      // Create the order from the webhook as a safety net.
      const { validatedItems, subtotal } = await validateAndCalculate(pendingPayment.items);
      const { totalAmount } = calculateTotals(subtotal);
      const orderId = await generateUniqueOrderId();

      const order = new Order({
        _id: orderId,
        userId: pendingPayment.userId,
        products: validatedItems,
        shippingAddress: pendingPayment.shippingAddress,
        paymentMethod: 'Razorpay',
        totalAmount,
        paymentStatus: 'Completed',
        orderStatus: 'Confirmed',
        razorpayOrderId,
        razorpayPaymentId,
      });

      await order.save();
      await decrementStock(validatedItems);

      // Clear user cart
      try {
        await User.findByIdAndUpdate(pendingPayment.userId, { $set: { cart: [] } });
      } catch (cartErr) {
        console.error('Webhook: Failed to clear user cart:', cartErr);
      }

      pendingPayment.status = 'completed';
      pendingPayment.completedOrderId = orderId;
      await pendingPayment.save();

      console.log(`Webhook: Order ${orderId} created from payment.captured event`);
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    // Always return 200 to Razorpay to prevent retries on our errors
    res.status(200).json({ status: 'error logged' });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getKey,
  handleWebhook,
  // Export helpers for use in orderController
  validateAndCalculate,
  calculateTotals,
  decrementStock,
  generateUniqueOrderId,
};
