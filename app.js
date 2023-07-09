//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const md5 = require("md5");
// const encrypt = require('mongoose-encryption');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(session({
    secret: 'This is our secret you cannot tell anyone.',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB")
.then(()=>{
    console.log("Database Connected.");
})
.catch((err)=>{
    console.log(err);
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose)

// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret , encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.get("/secrets", (req, res)=>{
    if (req.isAuthenticated()){
        res.render("secrets");
    } else{
        res.redirect("/login");
    }
});

app.get("/logout", (req, res)=>{
    req.logout(function(err) {
        if (err) { 
            console.log(err);;
        } else {
            res.redirect('/');
        }
    });
});

app.post("/register", (req, res)=>{
    
    User.register({username:req.body.username}, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else{
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
        }
      
    });
    
    // const username = req.body.username;
    // const password = req.body.password;

    // bcrypt.hash(password, saltRounds, function(err, hash) {
    //     const user = new User({
    //         username: username,
    //         password: hash
    //     });
    //     user.save()
    //     .then(()=>{
    //         res.render("secrets")
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     });
    // });
});

app.post("/login", (req, res)=>{
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if (err){
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    })
    

    // const username = req.body.username;
    // const password = req.body.password;

    // User.findOne({username: username})
    // .then((user)=>{
    //     bcrypt.compare(password, user.password, function(err, result) {
    //         if(result == true){
    //             res.render("secrets");
    //         }
    //     });
    // })
    // .catch((err)=>{
    //     console.log(err);
    // });
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000.");
});
