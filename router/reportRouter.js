const express = require('express')
const router = express.Router()
const { reportController } = require('../controller')
const { getReport, getSelectOptions, dummyData } = reportController

router.get('/', getReport)
router.get('/select-options/', getSelectOptions)
// router.get('/dummy', dummyData)

module.exports = router
