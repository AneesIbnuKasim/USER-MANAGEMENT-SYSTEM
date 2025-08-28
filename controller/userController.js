const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const sendVerifyEmail = require("../config/nodemailer")

const securePassword = async(password)=>{
    const hashedPass = await bcrypt.hash(password, 10)
    return hashedPass
}

//Register new users
const userRegister = async(req,res)=>{
    try {
    const {name, email, mobile, password} = req.body
    const sPassword = await securePassword(password)

    const user = new User({
    name: name,
    email : email,
    mobile: mobile,
    password: sPassword,
    image: req.file? req.file.filename:null,
    is_admin: 0
})
 const userData = await user.save()
if (userData){
    sendVerifyEmail(name, email, userData._id)
    res.render("user/register",{message:"Registration has been completed successfully, please verify the mail"})
}
else {
    res.render("user/register",{message:"Registration has been failed"})
}
 
    } catch (error) {
        res.send(error.message)
    }
}

// load verify email page + change verify status
const verifyEmail = async(req,res)=>{
    const updateUser = await User.updateOne({_id:req.query.id},{$set:{is_verified:1}})
    res.render('user/emailVerified')
}

module.exports = {
    userRegister,
    verifyEmail
}