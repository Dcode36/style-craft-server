const express = require('express');
const { registerController, loginController, testController, forgotPasswordController, updateProfileController } = require('../controller/authController')
const router = express.Router();
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")

// routing
// Register || Method post
router.post('/register', registerController)

// LOGIN || METHOD POST

router.post('/login', loginController);

// forgot password

router.post('/forgot-password', forgotPasswordController)



// test 
router.get('/test', requireSignIn, isAdmin, testController)

// protected Auth

router.get('/user-auth', requireSignIn, (req, res)=>{
    res.status(200).send({
        ok : true
    })
})
// admin auth
router.get('/admin-auth', requireSignIn,isAdmin, (req, res)=>{
    res.status(200).send({
        ok : true
    })
})


router.put('/profile', requireSignIn, updateProfileController);

module.exports = router;