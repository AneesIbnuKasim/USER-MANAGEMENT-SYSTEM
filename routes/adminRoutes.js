const express = require('express')
const { loadLogin, adminLogin, loadDashboard, logoutAdmin } = require('../controller/adminController')
const { isLogout, isLogin } = require('../middlewares/adminAuth')
const router = express.Router()

//load admin login page
router.get('/login',isLogout,loadLogin)

//post admin login details
router.post('/login',adminLogin)

//route to load dashboard
router.get('/dashboard',isLogin, loadDashboard)

//route to load dashboard
router.get('/logout',isLogin, logoutAdmin)

module.exports = router