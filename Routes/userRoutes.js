const express = require('express')
const userController = require('../Controllers/userController')
const { register, login, importUser } = userController
const userAuth = require('../Middlewares/userAuth')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router()

//passing the middleware function to the register
router.post('/register', [userAuth.registerValidation, userAuth.saveUser], register)
router.post('/login', userAuth.loginValidation, login)
router.post('/import', [userAuth.verifyToken, upload.single('template')], importUser)

module.exports = router