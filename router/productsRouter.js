const express = require('express')
const router = express.Router()
const { productsController } = require('../controller')
const {
    fetchProducts,
    fetchProductsById,
    addToCart,
    getCart,
    deleteCart,
    checkOut
} = productsController

router.get('/getAll', fetchProducts)
router.get('/getAll/:id', fetchProductsById)
router.post('/cart', addToCart)
router.get('/cart/:id', getCart)
router.delete('/delCart/:id', deleteCart)
router.post('/transaction', checkOut)

// cart delete, update transaction

module.exports = router
