const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")

const userRoute = require("./routes/user")
const blogRoute = require("./routes/blog")
const { checkForAuthenticationCookie } = require("./middlewares/authentication")

const app = express()
const PORT = 8000

mongoose.connect("mongodb://127.0.0.1:27017/blogify").then((e)=>console.log("mongodb connected"))

const Blog = require("./models/blog")
app.use(express.static(path.resolve("./public")))

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended:false}))//to parse form data
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))


app.use('/user',userRoute)
app.use("/blog",blogRoute)

app.get("/",async(req,res)=>{
    const allBlogs = await Blog.find({})
    res.render("home.ejs",{
        user : req.user,
        blogs : allBlogs
    })
})

app.listen(PORT,()=>console.log(`server started at port : ${PORT}`))