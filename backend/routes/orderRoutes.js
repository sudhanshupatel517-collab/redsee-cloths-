const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin, requirePermission } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, requirePermission('manage_orders'), getAllOrders);
  
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById)
  .put(protect, requirePermission('manage_orders'), updateOrderStatus);

module.exports = router;
