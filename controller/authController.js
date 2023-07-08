  const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel');
const Order = require("../models/orderModel")
const jwt = require('jsonwebtoken')

const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer, pincode } = req.body;
        // Validation
        if (!name) {
            return res.send({ message: " name is required" })
        }
        if (!email) {
            return res.send({ message: " email is required" })
        }
        if (!password) {
            return res.send({ message: " password is required" })
        }
        if (!phone) {
            return res.send({ message: " phone is required" })
        }
        if (!address) {
            return res.send({ message: " address is required" })
        }
        if (!answer) {
            return res.send({ message: " answer is required" })
        }
        if (!pincode) {
            return res.send({ message: " answer is required" })
        }
        // check user
        const existingUser = await userModel.findOne({ email });

        // existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Registerd please login"
            })
        }

        // register user

        const hashedPassword = await hashPassword(password);

        // save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            answer,
            pincode
        }).save();

        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error
        })
    }

}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validation

        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid Email Or Password"
            })
        }
        // check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email Is not Registerd"
            })
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            })
        }

        // token

        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d', })

        res.status(200).send({
            success: true,
            message: 'Login Successfully ',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                pincode: user.pincode
            },
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error

        })
    }
}

// forgotPasswordController

const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;

        if (!email) {
            res.status(400).send({ message: "Email Is required" })
        }
        if (!answer) {
            res.status(400).send({ message: "answer Is required" })
        }
        if (!newPassword) {
            res.status(400).send({ message: "newPassword Is required" })
        }
        // cheack
        const user = await userModel.findOne({ email, answer })

        // validation
        if (!user) {
            res.status(404).send({
                success: false,
                message: 'Wrong Email Or Answer'
            })
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went Wrong",
            error
        })
    }

}

const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);

        if (password && password.length < 6) {
            return res.json({ error: "Password is Required and 6 character Long" })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, { new: true });
        res.status(200).send({
            success: true,
            message: "Profile Updated successfully",
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: true,
            message: "Error In updating Profile"
        })
    }
}

// test
const testController = (req, res) => {
    res.send("protected routes")

}
const getOrderController = async (req, res) => {
    try {
      const orders = await Order.find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.send(orders);
    } catch (error) {
      console.log(error); // Log the error to the console for debugging
      res.status(500).send({
        success: false,
        message: "Error while getting orders",
        error: error.message, // Include the error message in the response
      });
    }
  };
  
  
module.exports = { registerController, loginController, testController, getOrderController, forgotPasswordController, updateProfileController }