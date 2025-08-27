const User = require("../models/userModel")

//Register new users
const userRegister = async(req,res)=>{
    try {
    const {name, email, mobile, password, is_admin, is_verified, token} = req.body
    
    const user = new User({
    name: name,
    email : email,
    mobile: mobile,
    password: password,
    image: req.file? req.file.filename:null,
    is_admin: 0
})
 const userData = await user.save()
if (userData){
    res.render("user/register",{message:"Registration has been completed successfully"})
}
else {
    res.render("user/register",{message:"Registration has been failed"})
}
 
    } catch (error) {
        res.send(error.message)
    }
}

module.exports = {userRegister}