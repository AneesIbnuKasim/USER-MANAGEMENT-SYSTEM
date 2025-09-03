require('dotenv').config()
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SENDGRID_API,
    pass: process.env.SENDGRID_PASS
  },
})
// send email for verification
const sendVerifyEmail = async(mailOptions)=>{
     
      await transporter.sendMail(mailOptions, function(error, info){
        if (error) console.log(error)
        else console.log("Email has been sent",info.response)
      });
}

module.exports = {
  sendVerifyEmail
}