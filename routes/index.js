var express            = require('express');
var router             = express.Router();
var fs                 = require('fs'),
    rdf                = require('rdflib'),
    session            = require('express-session'),
    passport           = require('passport'),
    LocalStrategy      = require('passport-local').Strategy,
    flash              = require('connect-flash');


var store           = rdf.graph();
var filename        = './people_new.ttl';
var rdfData         = fs.readFileSync(filename).toString();
var baseUrl="http://www.w3.org/2002/07/owl#Thing";

rdf.parse(rdfData,store,baseUrl);

var FOAF = rdf.Namespace("http://xmlns.com/foaf/0.1/")
var KRR = rdf.Namespace("http://www.semanticweb.org/aron/ontologies/2018/2/people#")
var name = ""

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    done(null, { id: id, nickname: "test"})
  });


passport.use(new LocalStrategy(
    function(username, password, done) {
        name = KRR(username)
        id = '1234'
        var rdf_store = store.statementsMatching(name, KRR('password'), undefined);
        
        if (rdf_store && rdf_store.length){
            rdf_store.forEach(function(stm){

                if (password === stm.object.value) {
                    return done(null, { name: username, id: id});
                } else { 
                    return done(null, false, { message: 'Incorrect password.' }) }
            })
        } else { return done(null, false, { message: 'Incorrect username.' }) }
    }
));
    

router.use(express.static('public'));
router.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { condition: true, anyArray: [1,2,3] });
});

function remove_dups(list) {
    let unique = {};
    list.forEach(function(i) {
    if(!unique[i]) {
        unique[i] = true;
    }
    });
    return Object.keys(unique);
}
function clean_uri(uri){
    uri = uri.split("/").reverse()[0];
    uri = uri.split("#").reverse()[0];
    uri = uri.replace("_", " ");

    return uri
}

function get_attributes(){
    var rdf_store = store.statementsMatching(name, undefined, undefined);
    var list_attributes = []
    
    rdf_store.forEach(function(attribute) {
        list_attributes.push(attribute.predicate.value)
    });


    unique_attributes = remove_dups(list_attributes)
    
    return unique_attributes
}

function get_attributes_values(){
    var rdf_store = store.statementsMatching(name, undefined, undefined);
    var list_attributes = get_attributes()
    var to_display = [];

    list_attributes.forEach(function(attribute) {
        var list_objects = [];
        rdf_store.forEach(function(stm){
            if (stm.predicate.value == attribute){
                list_objects.push(stm.object.value)
            }
        });
        
        to_display.push({predicate: clean_uri(attribute), object: list_objects})
    });
    return to_display   
}


//Login ROUTE
router.get('/login', function(req, res, next) {
    res.render('./profile/login', { title: 'Login', condition: true, anyArray: [1,2,3] });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/profile',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

// Profile Edit
router.get("/profile/edit", function(req,res){
    predicates = get_attributes_values()
    console.log(predicates)
    res.render('./profile/edit', {predicate: predicate})
});

router.get("/profile", function(req,res){
    var to_display = get_attributes_values();

    res.render('./profile/view', {to_display: to_display})
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

// Logout ROUTE
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
})


module.exports = router;