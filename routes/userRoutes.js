const express = require("express")
const {userRegister, verifyEmail}  = require("../controller/userController.js")
const router = express.Router()
const upload = require("../config/multer.js")

router.get('/register',(req,res)=>{
    res.render('user/register')
})
router.post('/register',upload.single('image') ,userRegister)

router.get('/verify', verifyEmail)

module.exports = router
