const express = require("express")
const {userRegister, verifyEmail, loadLogin, userLogin, loadHome, loadForget, forgetPassMail, loadPassReset, resetPassword, loadVerifyEmail, sendVerMail, logoutUser, editLoad, editUser}  = require("../controller/userController.js")
const router = express.Router()
const upload = require("../config/multer.js")
const { isLogin, isLogout } = require("../middlewares/auth.js")

router.get('/register',isLogout,(req,res)=>{
    res.render('user/register')
})
router.post('/register',upload.single('image') ,userRegister)

//send verify email
router.get('/verify', verifyEmail)

//get login page
router.get('/login',isLogout, loadLogin)

//post login details
router.post('/login', userLogin)

//load home page
router.get('/home', isLogin, loadHome)

//get forget password page
router.get('/forget',isLogout, loadForget)

//post forget password details
router.post('/forget', forgetPassMail)

//get reset password function
router.get('/forget-password',isLogout, loadPassReset)

//post new password with user_id
router.post('/forget-password', resetPassword)

//load email verify page
router.get('/verify-email',isLogout, loadVerifyEmail)

//post email verify data
router.post('/verify-email', sendVerMail)

//Logout user 
router.get('/logout',isLogin, logoutUser)

//get edit page route
router.get('/edit',isLogin, editLoad)

//post edit page form details
router.post('/edit',upload.single('image'), isLogin, editUser)

//global route
router.get(/.*/, (req, res) => {
  res.redirect('/api/user/login'); // Redirect all unknown user paths to login
});

module.exports = router
