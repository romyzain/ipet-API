const express = require('express')
const router = express.Router()
const { manageProductController, productPackageController } = require('../controller')
const { getAllProducts, addProduct, editProduct, deleteProduct, addCategory, fetchCategory, getOneProduct } = manageProductController
const { getAllPackage, searchProduct, addPackage, editPackage, deletePackage } = productPackageController

router.get('/', getAllProducts)
router.get('/one-product/:id', getOneProduct)
router.post('/', addProduct)
router.patch('/:id', editProduct)
router.delete('/delete-product/:id', deleteProduct)
router.get('/fetch-category', fetchCategory)
router.post('/new-category', addCategory)
router.get('/product-package', getAllPackage)
router.get('/search-product', searchProduct)
router.post('/add-package', addPackage)
router.post('/edit-package', editPackage)
router.post('/delete-package', deletePackage)
module.exports = router