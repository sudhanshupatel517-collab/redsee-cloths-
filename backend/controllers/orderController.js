const Order = require('../models/Order');
const Product = require('../models/Product');

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

const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod, totalAmount, razorpayPaymentId } = req.body;

    if (products && products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // HARDCODED FALLBACK FOR PREVIEW
    if (['1', '2', '3'].includes(req.user._id?.toString())) {
      const mockId = Math.floor(10000000 + Math.random() * 90000000).toString();
      return res.status(201).json({
        _id: mockId,
        userId: req.user._id,
        products,
        shippingAddress,
        paymentMethod,
        totalAmount,
        paymentStatus: paymentMethod === 'UPI' ? 'Pending' : 'Completed',
        orderStatus: 'Confirmed',
        razorpayPaymentId
      });
    }

    const orderId = await generateUniqueOrderId();
    const order = new Order({
      _id: orderId,
      userId: req.user._id,
      products,
      shippingAddress,
      paymentMethod,
      totalAmount,
      razorpayPaymentId,
    });

    const createdOrder = await order.save();

    // Increment salesCount for each purchased product
    if (products && products.length > 0) {
      for (const item of products) {
        try {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { salesCount: item.quantity }
          });
        } catch (err) {
          console.error(`Failed to increment salesCount for product ${item.product}:`, err);
        }
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('products.product');

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
    const orders = await Order.find({ userId: req.user._id }).populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('products.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus, courier, trackingId } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (status !== undefined) order.orderStatus = status;
      if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;
      if (courier !== undefined) order.courier = courier;
      if (trackingId !== undefined) order.trackingId = trackingId;
      
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      
      // Populate product details back to keep frontend state consistent
      const populated = await Order.findById(updatedOrder._id)
        .populate('userId', 'name email')
        .populate('products.product');
        
      res.json(populated);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMyOrderAddress = async (req, res) => {
  try {
    const { name, street, city, state, zipCode, country, phone } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify ownership
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Verify order is active
    if (['Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot change shipping details for delivered or cancelled orders' });
    }

    // Update shipping address fields
    order.shippingAddress = {
      name: name || order.shippingAddress.name,
      street: street || order.shippingAddress.street,
      city: city || order.shippingAddress.city,
      state: state || order.shippingAddress.state,
      zipCode: zipCode || order.shippingAddress.zipCode,
      country: country || order.shippingAddress.country,
      phone: phone || order.shippingAddress.phone,
    };

    const updatedOrder = await order.save();
    
    const populated = await Order.findById(updatedOrder._id)
      .populate('userId', 'name email')
      .populate('products.product');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrderById, getMyOrders, getAllOrders, updateOrderStatus, updateMyOrderAddress };
