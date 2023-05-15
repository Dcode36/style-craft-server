const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const { createProductController, getProductController, relatedProductController,productCategoryController,getSingleProductController, searchProductController,productListController,productCountController,productFilterController,productPhotoController, deleteProductController, updateProductController } = require('../controller/productController');
const formidable = require('express-formidable');

const router = express.Router();

// Routes
router.post('/create-product', requireSignIn, isAdmin, formidable(),createProductController);
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(),updateProductController)

// get product

router.get('/get-product', getProductController);

//single product

router.get('/get-product/:slug', getSingleProductController);

//get photo

router.get('/product-photo/:pid', productPhotoController);

//delete product

router.delete('/delete-product/:pid', deleteProductController);

router.post('/product-filters', productFilterController);

router.get('/product-count', productCountController);

router.get('/product-list/:page', productListController);

router.get('/search/:keyword', searchProductController);

router.get('/related-product/:pid/:cid', relatedProductController);

router.get('/product-category/:slug', productCategoryController)

// router.post('/orders', paymentOrderController);
// router.post('/callback', paymentCallback);
module.exports = router;