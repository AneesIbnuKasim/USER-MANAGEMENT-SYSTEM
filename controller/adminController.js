const User = require('../models/userModel')
const bcrypt = require('bcrypt')

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
                res.redirect('/api/admin/dashboard')
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
const loadDashboard = async(req, res)=>{
    try {
        res.render('admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    adminLogin,
    loadDashboard
}