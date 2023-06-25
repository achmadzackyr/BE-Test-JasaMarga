const express = require('express')
const ruasController = require('../Controllers/ruasController')
const { create } = ruasController
const userAuth = require('../Middlewares/userAuth')
const modelValidation = require('../Middlewares/modelValidation')

const router = express.Router()

router.post('/create', [modelValidation.createRuasValidation, userAuth.verifyToken], create)

module.exports = router