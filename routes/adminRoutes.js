const express = require('express')
const { loadLogin, adminLogin, loadDashboard } = require('../controller/adminController')
const router = express.Router()

//load admin login page
router.get('/login',loadLogin)

//post admin login details
router.post('/login',adminLogin)

//route to load dashbord
router.get('/dashboard',loadDashboard)

module.exports = router