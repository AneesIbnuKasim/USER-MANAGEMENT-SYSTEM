require("dotenv").config()
const connectDB = require("./config/dbconfig")
const express = require("express")
const app = express()
const path = require("path")
const port = process.env.PORT || 5000
const user = require("./controller/userController")
const userRoute = require("./routes/userRoutes")

//use express for body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,"public")))

//set view engine
app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))

//user base api 
app.use('/api/user',userRoute)


connectDB();
app.listen(port,()=>{
    console.log(`server running at ${port}`);  //server creation
})