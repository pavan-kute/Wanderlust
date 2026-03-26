if(process.env.NODE_ENV !="production"){
require('dotenv').config()   //.env file package
}

// console.log(process.env.SECRETE)   // remove this after you've confirmed it is working


const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl =process.env.ATLASDB_URL;

const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require ("./utils/ExpressError.js");
const session = require("express-session");  // session cookies package req
const MongoStore = require("connect-mongo").default;

const flash = require("connect-flash");    // flash package req using pop flash 
const passport = require ("passport")
const LocalStrategy = require ("passport-local");
const User = require ("./models/user.js");     // passport req auntectication

const listingRouter = require("./routes/listing.js");  // routes folder requre
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const { required } = require('joi');
const { error } = require('console');


main().then(()=>{
    console.log("MongoDB Conncted !")
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate)   // ejs- mate pakage 
app.use(express.static(path.join(__dirname, "public")));    // use for a public folder css file ke liye


   //  mongo -connect session for cookies and 24 hours after update

const store = new MongoStore({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

//error aya tho

store.on("error", (err)=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

 const sessionOptions = {
    store,
    secret : process.env.SESSION_SECRET || "mysupersecretcode",
    resave: false,
    saveUninitialized : true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // kitne din bhad hamara page log out ho jaye cookies
        maxAge: 7 * 24 * 60 * 60 * 1000,                // cookies session use  
        httpOnly: true,
    },

 };




 app.use(session (sessionOptions));
 app.use(flash());


       // PASSPORT AUNTHETICATION  //

   app.use(passport.initialize());
   app.use(passport.session());
   passport.use(new LocalStrategy(User.authenticate()));

   passport.serializeUser(User.serializeUser());      // serelise use kre
   passport.deserializeUser(User.deserializeUser());   // deserlise use



 
 // create a middleware

 app.use((req,res,next)=>{
    res.locals.success =req.flash("success");
    res.locals.error =req.flash("error");
    res.locals.currUser = req.user;
    next();
 });

    //   // DEMO USER L.8 //

    // app.get("/demouser", async (req,res)=>{
    //      let fakeUser = new User({
    //         email: "student@gmail.com",          
    //         username: "delta-student"            // fake user-name
    //      });

    // let registeredUser = await User.register (fakeUser, "helloworld");
    // res.send(registeredUser);
    // })







     // Routes folder me listing path kiya
     app.get("/", (req,res)=>{
        res.redirect("/listings");
     });
     app.use("/listings",listingRouter)  // jaha pr bhi listing routes aayega hum apan routes listing file ko send krenge
     app.use("/listings/:id/reviews",reviewsRouter)
     app.use("/",userRouter);
  



  //    app.all(*)  means sare ke sare incoming routes ke sath match kr do

 app.use(/.*/, (req,res,next)=>{
    next(new ExpressError (404, "Page not found"));   // msg or status ke liye
 });



        // ERROR HANDLER middleware // custom error L.3

    app.use((err,req,res,next)=>{
        let {status=500, message="Something went wrong !"} = err;
        // res.status(status).send(message);
        res.status(status).render("error.ejs",{message});   // rendor.ejs file
        // res.send ("Something went wrong !")
    });




app.listen(port,()=>{
    console.log(`server listening to port ${port}!`);
});


