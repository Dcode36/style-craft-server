// const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');
// const https = require('https');
const Razorpay = require('razorpay');
var crypto = require("crypto");
const Payment = require("../models/paymentModel")

const instance = new Razorpay({
  key_id: 'rzp_test_sbh9iyAB48kjF3',
  key_secret: 'VPnT8mZx6uosUDgHyAfnW99B',
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
  const { payment_id, order_id, signature } = req.body;

  const bodyText = order_id + "|" + payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", "VPnT8mZx6uosUDgHyAfnW99B")
    .update(bodyText.toString())
    .digest("hex");

  const result = { status: false };

  if (expectedSignature === signature) {
    // Database operations can be performed here

    await Payment.create({
      razorpay_order_id: order_id,
      razorpay_payment_id: payment_id,
      razorpay_signature: signature,
    });

    result.status = true;
  }

  res.status(200).send(result);
};


module.exports = { checkout, paymentVerification };
