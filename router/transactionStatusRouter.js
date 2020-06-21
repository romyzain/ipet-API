const express = require('express')
const router = express.Router()
const { transactionStatusController } = require('../controller')
const { getTransaction, changeStatus, fetchPending } = transactionStatusController

router.post('/', getTransaction)
router.get('/pending', fetchPending)
router.post('/change-status', changeStatus)

module.exports = router
