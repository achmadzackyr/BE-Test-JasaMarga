const express = require('express')
const ruasController = require('../Controllers/ruasController')
const { create, update, deleteRuas, detail, getAll } = ruasController
const userAuth = require('../Middlewares/userAuth')
const modelValidation = require('../Middlewares/modelValidation')

const router = express.Router()

router.get('/', userAuth.verifyToken, getAll)
router.get('/:id', userAuth.verifyToken, detail)
router.post('/create', [modelValidation.createRuasValidation, userAuth.verifyToken], create)
router.put('/update/:id', [modelValidation.updateRuasValidation, userAuth.verifyToken], update)
router.delete('/delete/:id', userAuth.verifyToken, deleteRuas)

module.exports = router