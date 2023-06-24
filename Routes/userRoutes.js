const express = require('express')
const userController = require('../Controllers/userController')
const { register, login } = userController
const userAuth = require('../Middlewares/userAuth')

const router = express.Router()

//register endpoint
//passing the middleware function to the register
router.post('/register', [userAuth.registerValidation, userAuth.saveUser], register)

//login route
router.post('/login', userAuth.loginValidation, login)

module.exports = router