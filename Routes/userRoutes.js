const express = require('express')
const userController = require('../Controllers/userController')
const { register, login, importUser } = userController
const userAuth = require('../Middlewares/userAuth')
const modelValidation = require('../Middlewares/modelValidation')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router()

//passing the middleware function to the register
router.post('/register', [modelValidation.registerValidation, userAuth.saveUser], register)
router.post('/login', modelValidation.loginValidation, login)
router.post('/import', [userAuth.verifyToken, upload.single('template')], importUser)

module.exports = router