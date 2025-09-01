const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "apikey",
    pass: "PLACEHOLDER"
  },
})
// send email for verification
const sendVerifyEmail = async(name, email, userId)=>{
      const mailOptions =
        {
            from: '"Anees" <webhostinganees@gmail.com>',
            to: email,
            subject: "Email verification",
            text: "Hello world?", // plain‑text body
            html: `<b>hello ${name}! please click on the link to verify <a href=http://localhost:3000/api/user/verify?id=${userId}>Verify Email</a></b>`, // HTML body
          }
      await transporter.sendMail(mailOptions, function(error, info){
        if (error) console.log(error)
        else console.log("Email has been sent",info.response)
      });
}
const sendPassResetEmail = async(name, email, token, role)=>{
      const mailOptions =
        {
            from: '"reply@UMS" <webhostinganees@gmail.com>',
            to: email,
            subject: "Password Reset",
            text: "Hello world?",
            html: `<b>hello ${name}! please click on the link to reset <a href=http://localhost:3000/api/${role}/forget-password?token=${token}>password</a></b>`,
          }
      await transporter.sendMail(mailOptions, function(error, info){
        if (error) console.log(error)
        else console.log("Reset link has been sent",info.response)
      });
}

module.exports = {
  sendVerifyEmail,
  sendPassResetEmail
}