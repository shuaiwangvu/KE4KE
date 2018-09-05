var express = require('express');
var router = express.Router();
var fs = require('fs');

var path = require('path');
var rdf = require('rdflib');

//var passport = require("passport");
//var LocalStrategy = require("passport-local");
//var User = require("../models/user");


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { condition: true, anyArray: [1,2,3] });
});


//LOGIN & REGISTER

//show register form
router.get("/register", function(req, res){
    res.render("./login/register", { title: 'Register', condition: true, anyArray: [1,2,3] });
})

////Handle sign up logic
//router.post("/register", function(req, res){
//    var newUser = new User({username: req.body.username})
//    User.register(newUser, req.body.password, function(err, user){
//        if(err){
//            console.log(err);
//            return res.render("register")
//        }
//        passport.authenticate("local")(req, res, function(){
//            res.redirect("/");
//        })
//    })
//})

//Login ROUTE
router.get('/login', function(req, res, next) {
    res.render('./login/login', { title: 'Login', condition: true, anyArray: [1,2,3] });
});

//router.post("/login", passport.authenticate("local", 
//    {
//        successRedirect: "/",
//        failureRedirect: "./login/login"
//     }), function(req, res){
//    
//})

// Logout ROUTE
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
})

// Profile Edit
router.get("/profile/edit", function(req,res){
console.log(toDisplay)
res.render('./profile/edit', {toDisplay: toDisplay})
});

router.post("/profile", function(req,res){

for (var i=0; i<toDisplay.length;i++) {
    toDisplay[i]['value'] = req.body.valuePredicate[i]
    
    if (toDisplay[i]['attribute'] == 'family_name'){
        name = req.body.valuePredicate[i]            
    } 

}
var data = JSON.stringify(toDisplay)
fs.writeFile(name +'.json', data);

res.render('./profile/view', {toDisplay: toDisplay})


});



module.exports = router;