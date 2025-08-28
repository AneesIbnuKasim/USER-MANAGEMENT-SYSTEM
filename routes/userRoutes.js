const express = require("express")
const {userRegister, verifyEmail, loadLogin, userLogin, loadHome, loadForget, forgetPassMail, loadPassReset, resetPassword}  = require("../controller/userController.js")
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
router.post('/forget', forgetPassMail)

//get reset password function
router.get('/forget-password', loadPassReset)

//post new password with user_id
router.post('/forget-password', resetPassword)


module.exports = router
