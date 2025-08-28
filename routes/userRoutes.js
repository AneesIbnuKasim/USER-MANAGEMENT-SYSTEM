const express = require("express")
const {userRegister, verifyEmail, loadLogin, userLogin, loadHome, loadForget, forgetMail}  = require("../controller/userController.js")
const router = express.Router()
const upload = require("../config/multer.js")
const { isLogin, isLogout } = require("../middlewares/auth.js")

router.get('/register',isLogout,(req,res)=>{
    res.render('user/register')
})
router.post('/register',upload.single('image') ,userRegister)

router.get('/verify', verifyEmail)

//user login routes
//get login page
router.get('/login',isLogout, loadLogin)

//post login details
router.post('/login', userLogin)
//load home page
router.get('/home',isLogin, loadHome)

//get forget password page
router.get('/forget',isLogout, loadForget)

//post forget password details
router.post('/forget', forgetMail)

module.exports = router
