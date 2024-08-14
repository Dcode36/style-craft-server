// routes/orderRoutes.js
const express = require('express');
const { getUserOrders } = require('../controller/orderController');

const router = express.Router();

router.get('/orders/:userId', getUserOrders);

module.exports = router;
