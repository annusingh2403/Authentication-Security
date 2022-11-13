require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

mongoose.connect("mongodb://0.0.0.0:27017/userDB");

const userSchema = new mongoose.Schema({
	email: String,
	password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);



app.get("/", function (req, res) {
	res.render("home");
});

app.get("/login", function (req, res) {
	res.render("login");
});

app.get("/register", function (req, res) {

	res.render("register");
});

app.post("/register", function(req, res){

	const newUser = new User({
		email: req.body.username,
		password: req.body.password
	});

	newUser.save(function(err){
		if(err){
			res.send(err);
		}else {
			res.render("secrets");
		}
	});
})

app.post("/login", function(req, res){

	const userName = req.body.username;
	const userpassword = req.body.password;

	User.findOne({email: userName}, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			if(foundUser){
				if(foundUser.password === userpassword){
					res.render("secrets");
				}else {
				res.send("Please enter valid credentials");
			}
			}
		}
	})
})





app.listen("3000", function () {
	console.log("Server started on port 3000");
});
