const slugify = require('slugify');
const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel')
// const fs = require('fs');
// const { v4: uuidv4 } = require("uuid");
// const https = require("https");
// const Razorpay = require("razorpay");
// var crypto = require("crypto");

// var instance = new Razorpay({
//     key_id: "rzp_test_sbh9iyAB48kjF3",
//     key_secret: "VPnT8mZx6uosUDgHyAfnW99B",
// });

// const paymentOrderController = async (req, res) => {
//     const { amount } = req.body;
//     let receipt_id = Math.random();
//     receipt_id = receipt_id * 10000;
//     receipt_id = Math.floor(receipt_id);
//     var options = {
//         amount: amount * 100,
//         currency: "INR",
//         receipt: "order_" + receipt_id,
//     };
//     try {
//         let order = await instance.orders.create(options);
//         res.status(200).send({
//             status: true,
//             order,
//         });
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success: false,
//             message: "Error in payment Order"
//         })

//     }
// }


// const paymentCallback = async (request, response) => {
//     let { payment_id, order_id, signature } = request.body;

//     let bodyText = order_id + "|" + payment_id;

//     var expectedSignature = crypto
//         .createHmac("sha256", "VPnT8mZx6uosUDgHyAfnW99B")
//         .update(bodyText.toString())
//         .digest("hex");

//     // console.log("sig received ", signature);
//     // console.log("sig generated ", expectedSignature);

//     var result = { status: false };
 
//     if (expectedSignature === signature) result = { status: true };
//     response.status(200).send(result);
// };
const createProductController = async (req, res) => {
    try {
        const { name,
            slug,
            description,
            price,
            category,
            quantity,
            shipping
        } = req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "description is Required" });
            case !price:
                return res.status(500).send({ error: "price is Required" });
            case !category:
                return res.status(500).send({ error: "category is Required" });
            case !quantity:
                return res.status(500).send({ error: "quantity is Required" });

            case photo && photo.size > 16777216:
                return res.status(500).send({ error: "Photo is Required and should be les than 1 mb" });
        }
        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product created succesfully",
            products

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: true,
            error,
            message: "Error in creating product"
        })
    }
}

const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate("category").select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            count: products.length,
            message: "All products",
            products,

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Getting product",
            error: error.message
        })
    }
}

const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category");
        res.status(200).send({
            success: true,
            message: "single product Fetched",
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Getting product",
            error: error.message
        })

    }

}
const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");

        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Getting photo",
            error
        })
    }
}

const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Product Deleted Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Deleting product",
            error
        })
    }

}
const updateProductController = async (req, res) => {
    try {
        const { name,
            slug,
            description,
            price,
            category,
            quantity,
            shipping
        } = req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "description is Required" });
            case !price:
                return res.status(500).send({ error: "price is Required" });
            case !category:
                return res.status(500).send({ error: "category is Required" });
            case !quantity:
                return res.status(500).send({ error: "quantity is Required" });

            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "Photo is Required and should be les than 1 mb" });
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {
                ...req.fields, slug: slugify(name)
            },
            {
                new: true
            })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product update succesfully",
            products

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updating product",
            error
        })
    }

}
const productFilterController = async (req, res) => {
    try {
        const { checked } = req.body;
        let args = {}
        if (checked.length > 0) args.category = checked;
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While filtering product",
            error
        })
    }
}
const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error  product count",
            error
        })

    }

}
const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error  product List",
            error
        })

    }
}

const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await productModel.find({
            $or: [
                {
                    name: { $regex: keyword, $options: "i" }
                },
                {
                    description: { $regex: keyword, $options: "i" }
                }
            ]
        }).select("-photo")
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error Seraching Product",
            error
        })
    }
}

const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel
            .find({
                category: cid,
                _id: { $ne: pid },
            })
            .select("-photo")
            .limit(3)
            .populate("category");
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while geting related product",
            error,
        });
    }
}

const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productModel.find({ category }).populate('category')
        res.status(200).send({
            success: true,
            category,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            messgae: "Error in Product Category"
        })
    }
}

module.exports = { createProductController, productCategoryController, relatedProductController, searchProductController, productListController, productCountController, getProductController, productFilterController, getSingleProductController, productPhotoController, deleteProductController, updateProductController }