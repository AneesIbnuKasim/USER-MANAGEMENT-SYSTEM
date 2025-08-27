const express = require("express")
const {userRegister}  = require("../controller/userController.js")
const router = express.Router()

router.get('/register',(req,res)=>{
    res.render('user/register')
})
router.post('/register',userRegister)


module.exports = router
