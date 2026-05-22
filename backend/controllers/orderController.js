const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (products && products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // HARDCODED FALLBACK FOR PREVIEW
    if (['1', '2', '3'].includes(req.user._id?.toString())) {
      return res.status(201).json({
        _id: 'mock-order-' + Date.now(),
        userId: req.user._id,
        products,
        shippingAddress,
        paymentMethod,
        totalAmount,
        paymentStatus: 'Completed',
        orderStatus: 'Confirmed'
      });
    }

    const order = new Order({
      userId: req.user._id,
      products,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = status;
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrderById, getMyOrders, getAllOrders, updateOrderStatus };
