const express = require('express')
const router = express.Router()
const { manageProductController } = require('../controller')
const { getAllProducts, addProduct, editProduct, deleteProduct } = manageProductController

router.get('/', getAllProducts)
router.post('/', addProduct)
router.patch('/:id', editProduct)
router.delete('/delete-product/:id', deleteProduct)

module.exports = router