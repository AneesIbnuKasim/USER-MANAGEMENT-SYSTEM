const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const randomstring = require('randomstring')
const {sendPassResetEmail} = require('../config/nodemailer')
const { securePassword } = require('../controller/userController')

//load admin login page
const loadLogin = async(req, res)=>{
    try {
        res.render('admin/login')
    } catch (error) {
        console.log(error.message);
    }
}

//admin login logic
const adminLogin = async(req, res)=>{
    try {
        const { email, password } = req.body
        const adminData = await User.findOne({email:email})
        
        if(adminData && adminData.is_admin===1) {
            const passMatch = await bcrypt.compare(password, adminData.password)
            if (passMatch) {
                req.session.adminId = adminData._id
                res.redirect('/api/admin/home')
            }
            else {
                res.render('admin/login',{message:'Invalid email or password'})
            }
        }
        else {
            res.render('admin/login',{message:'Invalid email or not an admin'})
        }
    } catch (error) {
        console.log(error.message);
    }
}

//load dashboard page
const loadHome = async(req, res)=>{
    try {
        const id = req.session.adminId
        const adminData = await User.findOne({_id:id})
        res.render('admin/home',{user:adminData})
    } catch (error) {
        console.log(error.message);
    }
}

//logout admin
const logoutAdmin = async(req, res)=>{
    try {
        req.session.destroy((err)=>{
            if(err) {
                console.log(err);
                return res.render('admin/home')
            }
            res.clearCookie("connect.sid",{path:'/'})
            res.redirect('/api/admin/login')
        })
        
    } catch (error) {
        console.log(error.message);
    }
}

//load forget password page
const  loadForget = async(req, res)=>{
    try {
        res.render('admin/forget')
    } catch (error) {
        console.log(error.message);
    }
}

//send reset link on reset form submission
const resetPassLink = async(req, res)=>{
    try {
    const { email } = req.body
    const randomString = await randomstring.generate()
    const adminData = await User.findOne({email:email})
    
    if(adminData && adminData.is_admin===1) {
        await User.findOneAndUpdate({email:email},{$set:{token:randomString}})
        sendPassResetEmail(adminData.name, adminData.email,randomString ,'admin')
        res.render('admin/forget',{message:"email sent successfully"})
    }
    else {
        res.render('admin/forget',{message:"Email not registered"})
    }
    
    } catch (error) {
        console.log(error.message);
    }
}

//load new password reset page
const loadPassReset = async(req, res)=>{
    try {
        const token = req.query.token
        const tokenData = await User.findOne({token:token})
        if (tokenData) {
            res.render('admin/passReset',{admin_id:tokenData._id})
        }
        else {
            res.render('admin/404',{message:"Invalid token"})
        }
        
    } catch (error) {
        console.log(error.message);
        
    }
}

// //reset password
const resetPassword = async(req, res)=>{
    try {
        const { password, admin_id} = req.body
        
    const hashedPass = await securePassword(password)
    const updatedUser = await User.findByIdAndUpdate({_id:admin_id},{$set:{password:hashedPass},token:''})
    res.redirect('/api/admin/login')
    } catch (error) {
        console.log(error.message);
    }
}

//load dashboard page
const loadDashboard = async(req, res)=>{
    try {
        const userData = await User.find({is_admin:0})
        res.render("admin/dashboard",{users:userData})
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports = {
    loadLogin,
    adminLogin,
    loadHome,
    logoutAdmin,
    loadForget,
    resetPassLink,
    loadPassReset,
    resetPassword,
    loadDashboard
}