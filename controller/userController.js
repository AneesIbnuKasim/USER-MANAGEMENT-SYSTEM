const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const sendVerifyEmail = require("../config/nodemailer")   //nodemailer setup
const session = require("express-session")


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
//user login flow
const loadLogin = (req,res)=>{
    try {
        res.render("user/login")
    } catch (error) {
        console.log(error.message);
    }
}

//user login logic
const userLogin = async(req,res)=>{
    try {
        const { email, password } = req.body
    const userInfo = await User.findOne({email:email})
    if (userInfo) {
        const passMatch = await bcrypt.compare(password, userInfo.password)
        if (passMatch) {
            if(userInfo.is_verified === 0) {
                res.render('user/login', {message:"Please verify your email"})
            }
            else {
                req.session.user_id = userInfo._id

                console.log('session',req.session);
                
                res.redirect('/api/user/home')
            }
        }
        else {
            res.render('user/login', {message:"Email or password incorrect"})
        }
    }
    else {
        res.render('user/login', {message:"Email or password incorrect"})
    }
    } catch (error) {
        console.log(error.message);
    }
}

// load home page
const loadHome = async(req,res)=>{
    try {
        res.render('user/home')
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    userRegister,
    verifyEmail ,
    loadLogin ,
    userLogin ,
    loadHome
}