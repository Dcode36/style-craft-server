const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const { createCategoryController, updateCategoryController, categroyController, singleCategoryController, deleteCategoryController } = require('../controller/categoryController');

const router = express.Router();


// routes
// create category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)

// update Category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController )

// get all category

router.get('/all-category', categroyController)


// single category
router.get('/single-category/:slug', singleCategoryController);
// delete category

router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)
module.exports = router;