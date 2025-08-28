const nodemailer = require("nodemailer")

// send email for verification
const sendVerifyEmail = async(name, email, userId)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "apikey",
          pass: "PLACEHOLDER"
        },
      })
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

module.exports = sendVerifyEmail