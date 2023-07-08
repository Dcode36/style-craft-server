// const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');
// const https = require('https');
const Razorpay = require('razorpay');
var crypto = require("crypto");
const Payment = require("../models/paymentModel")
const Order = require("../models/orderModel")
const dotenv = require("dotenv");
dotenv.config();
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
}); 


const checkout = async (req, res) => {
  try {
    const { amount } = req.body;
    let receipt_id = Math.random();
    receipt_id = receipt_id * 10000;
    receipt_id = Math.floor(receipt_id);
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_" + receipt_id,
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};
const paymentVerification = async (req, res) => {
  const { payment_id, order_id, signature, cart } = req.body;

  const bodyText = order_id + "|" + payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", "VPnT8mZx6uosUDgHyAfnW99B")
    .update(bodyText.toString())
    .digest("hex");

  const result = { status: false };

  if (expectedSignature === signature) {
    try {
      // Database operations to create the order
      const order = new Order({
        products: cart.products,
        size: cart.size,
        address: cart.address,
        quantity: cart.quantity,
        payment: {
          razorpay_order_id: order_id,
          razorpay_payment_id: payment_id,
          razorpay_signature: signature,
        },
        buyer: req.user._id, // Assuming authenticated user's ID is available in req.user._id
        status: "Not Processed",
      });

      await order.save();

      result.status = true;
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error,
      });
    }
  } else {
    res.status(400).json(result);
  }
};



module.exports = { checkout, paymentVerification };
