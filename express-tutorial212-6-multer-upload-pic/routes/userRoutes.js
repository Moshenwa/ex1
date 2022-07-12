const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userControllers')
const authController = require('./../controllers/authControllers')

router.route('/')
    .get(userController.getUsers)

router.route('/forgotPassword')
    .post(authController.forgotPassword)

router.route('/signup')
    .post(authController.signUp)

router.route('/login')
    .post(authController.login)

router.route('/updateMe')
    .patch(authController.protect, userController.uploadUserPhoto, userController.updateMe)
/* 
.patch()
.delete() */
router.route('/resetPassword/:resetToken')
    .patch(authController.resetPassword)




module.exports = router;