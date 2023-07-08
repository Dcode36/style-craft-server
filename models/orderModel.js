const mongoose  = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        _id: {
          type: mongoose.ObjectId,
          ref: "Products",
        },
        name: String,
        slug: String,
        __v: Number,
      },
    ],
    size: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Processed",
      enum: ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);


const Order= mongoose.model("Order", orderSchema);

 module.exports = Order