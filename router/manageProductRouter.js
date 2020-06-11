const express = require('express')
const router = express.Router()
const { manageProductController } = require('../controller')
const { getAllProducts, addProduct, editProduct, deleteProduct, addCategory, fetchCategory, getOneProduct } = manageProductController

router.get('/', getAllProducts)
router.get('/one-product/:id', getOneProduct)
router.post('/', addProduct)
router.patch('/:id', editProduct)
router.delete('/delete-product/:id', deleteProduct)
router.get('/fetch-category', fetchCategory)
router.post('/new-category', addCategory)
    
module.exports = router