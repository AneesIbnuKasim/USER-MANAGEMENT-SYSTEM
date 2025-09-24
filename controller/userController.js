const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const {sendVerifyEmail, sendPassResetEmail} = require("../config/nodemailer")   //nodemailer setup
const randomString = require("randomstring")


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
    //set mail options
     const mailOptions =
        {
            from: '"Anees" <webhostinganees@gmail.com>',
            to: email,
            subject: "Email verification",
            text: "Hello world?", // plain‑text body
            html: `<b>hello ${userData.name}! please click on the link to verify <a href=http://localhost:3000/api/user/verify?id=${userData._id}>Verify Email</a></b>`, // HTML body
          }

    sendVerifyEmail(mailOptions)
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
                req.session.userId = userInfo._id    
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
        const id = req.session.userId
        console.log('login:',req.session.userId);
        
        const userData = await User.findOne({_id:id})
        res.render('user/home',{user:userData})
    } catch (error) {
        console.log(error.message);
    }
}
// load forget password page
const loadForget = async(req,res)=>{
    try {
        res.render('user/forget')
    } catch (error) {
        console.log(error.message);
    }
}
//send password reset mail
const forgetPassMail = async(req, res)=>{
    try {
        const { email } = req.body
        const userData = await User.findOne({email:email})
        if (userData) {
            if (userData.is_verified === 0) {
                res.render('user/forget',{message:"Please verify your Email"})
            }
            else {
                const randomstring = randomString.generate()
                await User.updateOne({email:email},{$set:{token:randomstring}})

                //set mail options
                 const mailOptions =
        {
            from: '"Anees" <webhostinganees@gmail.com>',
            to: email,
            subject: "Password Reset",
            text: "?", // plain‑text body
            html: `<b>hello ${userData.name}! please click on the link to reset <a href=http://localhost:3000/api/user/forget-password?token=${randomstring}>Password</a></b>`, // HTML body
          }
                sendVerifyEmail(mailOptions)
                res.render('user/forget',{message:"Reset link has been sent to your email"})
            }
        }
        else {
            res.render("user/forget", {message: "Invalid email"})
        }
    } catch (error) {
        console.log(error.message);
    }
}

//load password reset page
const loadPassReset = async(req, res)=>{
    try {
        const token = req.query.token
        const tokenData = await User.findOne({token:token})
        if (tokenData) {
            res.render('user/passReset',{user_id:tokenData._id})
        }
        else {
            res.render('user/404',{message:"Invalid token"})
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

// //update and reset password by giving new password 
const resetPassword = async(req, res)=>{
    try {
        const { password, user_id} = req.body
    const hashedPass = await securePassword(password)
    const updatedUser = await User.findByIdAndUpdate({_id:user_id},{$set:{password:hashedPass},token:''})
    res.redirect('/api/user/login')
    } catch (error) {
        console.log(error.message);
    }
}

//load verify email page
const loadVerifyEmail = async(req, res)=>{
    try {
        res.render('user/verifyEmail')
    } catch (error) {
        console.log(error.message);
        
    }
}

//send link to verify email
const sendVerMail = async(req, res)=>{
    try {
        const { email } = req.body
    const userData = await User.findOne({email:email})
    if(userData) {
        sendVerifyEmail(userData.name, email, userData._id)
        res.render('user/verifyEmail', {message: 'Verification link has been sent to your email'})
    }
    else {
        res.render('user/verifyEmail', {message: 'Email is not registered'})
    }
    } catch (error) {
        console.log(error.message);
        
    }
}

//logout user & destroy session data
const logoutUser = async(req, res)=>{
    
    try {
        req.session.destroy((err)=>{
            if(err){ 
            console.log('logout failed')
            return
            }
            //clear cookie
            res.clearCookie('connect.sid')
            //redirect to login page
            res.redirect('/api/user/login')
        })

    } catch (error) {
        console.log(error.message)
        
    }
}

//Load edit page
const editLoad = async(req, res)=>{
    try {
        const id = req.query.id
        const userData = await User.findOne({_id:id})
        res.render('user/edit',{user:userData})   
    } catch (error) {
        console.log(error.message)
    }
}

//edit and update new data to user
const editUser = async(req, res)=>{
    try {
        const { userId, name, email, mobile } = req.body
        if (req.file) {
            const image = req.file.filename
            const updatedUser = await User.findByIdAndUpdate({_id:userId},{$set:{name:name,email:email,mobile:mobile,image:image}})
        }   
        else {
            const updatedUser = await User.findByIdAndUpdate({_id:userId},{$set:{name:name,email:email,mobile:mobile}})
        }
        res.redirect('/api/user/home')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    userRegister,
    verifyEmail,
    loadLogin,
    userLogin,
    loadHome,
    loadForget,
    forgetPassMail,
    loadPassReset,
    resetPassword,
    loadVerifyEmail,
    sendVerMail,
    logoutUser,
    editLoad,
    editUser,
    securePassword
}