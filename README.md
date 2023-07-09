# Authentication-Secrets
Authentication &amp; Security for users of the web app.

## Security Level 01: Save password in plain text

require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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
    const user = new User({
      username: username,
      password: password
    });
    user.save()
    .then(()=>{
      res.render("secrets")
    })
    .catch((err)=>{
      console.log(err);
    });
});

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username})
    .then((user)=>{
      if(user.password === password){
        res.render("secrets");
      }
    })
    .catch((err)=>{
      console.log(err);
    });
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000.");
});

## Security Level 02: Save password in encrypted form

require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encryption = require("mongoose-encryption");

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

var secret = "Thisisyoursecretpassword."
userSchema.plugin(encrypt, { secret: secret , encryptedFields: ["password"]});

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
    const user = new User({
      username: username,
      password: password
    });
    user.save()
    .then(()=>{
      res.render("secrets")
    })
    .catch((err)=>{
      console.log(err);
    });
});

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username})
    .then((user)=>{
      if(user.password === password){
        res.render("secrets");
      }
    })
    .catch((err)=>{
      console.log(err);
    });
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000.");
});

## Security Level 03: Save password's hash

require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5")

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
    const user = new User({
      username: username,
      password: md5(password)
    });
    user.save()
    .then(()=>{
      res.render("secrets")
    })
    .catch((err)=>{
      console.log(err);
    });
});

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({username: username})
    .then((user)=>{
      if(user.password === password){
        res.render("secrets");
      }
    })
    .catch((err)=>{
      console.log(err);
    });
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000.");
});
