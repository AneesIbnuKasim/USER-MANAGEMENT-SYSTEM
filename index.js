require("dotenv").config()
const connectDB = require("./config/dbconfig")
const express = require("express")
const app = express()
const path = require("path")
const port = process.env.PORT || 5000
const userRoute = require("./routes/userRoutes")
const adminRoute = require("./routes/adminRoutes")
const session = require("express-session")
const nocache = require("nocache")
const flash = require('connect-flash')

// nocache middleware to prevent browser to save protected page caches
app.use(nocache());

//session middleware to save user data to session
app.use(session({
    secret: process.env.SESSION_SECRET,   // session secret key
    resave: false,           // don't save session if unmodified
    saveUninitialized: true, // save new sessions
    cookie: { 
        maxAge: 1000 * 60 * 60, // 1 hour
        secure: false,           // true if using HTTPS
    }
}));
//use express for body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set static path folder
app.use(express.static(path.join(__dirname,"public")))

//set view engine
app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))

//pass session data to all ejs pages using middleware
app.use((req, res, next)=>{
    res.locals.adminId = req.session.adminId
    res.locals.isAdminAuthenticated = req.session.adminId ? true : false
    res.locals.userId = req.session.userId
    res.locals.isUserAuthenticated = req.session.userId ? true : false
    next()
})

//user base api 
app.use('/api/user',userRoute)
//admin route 
app.use('/api/admin',adminRoute)

//connect flash for notifications
app.use(flash())

//db connect
connectDB();

//listen to server
app.listen(port,()=>{
    console.log(`server running at ${port}`);  //server creation
})