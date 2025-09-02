const express = require('express')
const { loadLogin, adminLogin, loadDashboard, logoutAdmin, loadForget, resetPassLink, loadPassReset, resetPassword, loadHome, editUser, loadEdit, deleteUser } = require('../controller/adminController')
const { isLogout, isLogin } = require('../middlewares/adminAuth')
const upload = require("../config/multer.js")
const router = express.Router()

//load admin login page
router.get('/login',isLogout,loadLogin)

//post admin login details
router.post('/login',adminLogin)

//route to load dashboard
router.get('/home',isLogin, loadHome)

//route to load dashboard
router.get('/logout',isLogin, logoutAdmin)

//route to admin forget password
router.get('/forget',isLogout, loadForget)

//post to admin forget password form details
router.post('/forget',isLogout, resetPassLink)

//load password reset page
router.get('/forget-password',loadPassReset)

//reset/update with new password
router.post('/forget-password',resetPassword)

//load dashboard page
router.get('/dashboard',isLogin, loadDashboard)

//load edit user page for admin
router.get('/edit',isLogin, loadEdit)

//update user
router.post('/edit',upload.single('image'),isLogin, editUser)

//delete selected user
router.get('/delete', isLogin, deleteUser)

module.exports = router