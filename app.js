//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const md5 = require("md5");
// const encrypt = require('mongoose-encryption');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

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

// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret , encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        const user = new User({
            username: username,
            password: hash
        });
        user.save()
        .then(()=>{
            res.render("secrets")
        })
        .catch((err)=>{
            console.log(err);
        });
    });
});

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username})
    .then((user)=>{
        bcrypt.compare(password, user.password, function(err, result) {
            if(result == true){
                res.render("secrets");
            }
        });
    })
    .catch((err)=>{
        console.log(err);
    });
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000.");
});
