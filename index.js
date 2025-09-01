require("dotenv").config()
const connectDB = require("./config/dbconfig")
const express = require("express")
const app = express()
const path = require("path")
const port = process.env.PORT || 5000
const userRoute = require("./routes/userRoutes")
const adminRoute = require("./routes/adminRoutes")
const session = require("express-session")
const flash = require('connect-flash')

//session middelware
app.use(session({
    secret: "mysecret",   // session secret key
    resave: false,           // don't save session if unmodified
    saveUninitialized: true, // save new sessions
    cookie: { 
        maxAge: 1000 * 60 * 60, // 1 hour
        secure: false,           // true if using HTTPS
        sameSite: 'lax'
    }
}));
//use express for body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,"public")))

//set view engine
app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))

//user base api 
app.use('/api/user',userRoute)
//admin route 
app.use('/api/admin',adminRoute)

//connect flash for notifications
app.use(flash())

//pass session data to all ejs pages using middleware
app.use((req, res, next)=>{
    res.locals.adminId = req.session.userId
    next()
})

connectDB();
app.listen(port,()=>{
    console.log(`server running at ${port}`);  //server creation
})