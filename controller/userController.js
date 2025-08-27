const User = require("../models/userModel")

//Register new users
const userRegister = async(req,res)=>{
    try {
    const {name, email, mobile, password, is_admin, is_verified, token} = req.body
    
    const user = new User({
    name: name,
    password: password
})
 const response = await user.save()
 res.send("reg successful"+response)
    } catch (error) {
        res.send(error.message)
    }
}

module.exports = {userRegister}