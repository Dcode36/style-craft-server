const express = require('express');
const {checkout, paymentVerification  } = require('../controller/paymentController');
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router();


router.post('/checkout',checkout);
router.post('/callback',paymentVerification);
 
module.exports = router;