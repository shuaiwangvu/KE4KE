var express            = require('express');
var router             = express.Router();
var fs                 = require('fs'),
    rdf                = require('rdflib'),
    session            = require('express-session'),
    passport           = require('passport'),
    LocalStrategy      = require('passport-local').Strategy,
    flash              = require('connect-flash');


var store           =   rdf.graph();
var filename        =   './1537970111555.ttl';
var rdfData         =   fs.readFileSync(filename).toString();
var baseUrl         =   "http://www.w3.org/2002/07/owl#Thing";

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


passport.use(new LocalStrategy(function(username, password, done) {
    console.log('in passport')
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


function remove_dups(list) {
    let unique = {};
    list.forEach(function(i) {
        if(!unique[i]) {
            unique[i] = true;
        }
    });

    return Object.keys(unique);
};

function clean_uri(uri){
    uri = uri.split("/").reverse()[0];
    uri = uri.split("#").reverse()[0];

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
    var list_predicates = get_attributes()
    var to_display = {};

    list_predicates.forEach(function(predicate) {
        var list_objects = [];
        rdf_store.forEach(function(stm){
            if (stm.predicate.value == predicate){
                list_objects.push(stm.object.value)
            }
        });
        attribute = clean_uri(predicate)
        to_display[attribute] = list_objects
    });
    return to_display   
}

function authenticationMiddleware () {
    return function (req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      }
      res.redirect('/login')
    }
  }


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { condition: true, anyArray: [1,2,3] });
});

//Login ROUTE
router.get('/login', function(req, res, next) {
    res.render('./profile/login', { title: 'Login', condition: true, anyArray: [1,2,3] });
});

router.post('/login',
    passport.authenticate('local', { 
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true 
    })
);

// Profile Edit
router.get("/profile/edit", authenticationMiddleware(), function(req,res){
    var to_display = get_attributes_values()
    res.render('./profile/edit', {to_display: to_display})
});


router.post("/profile/edit", authenticationMiddleware() ,function(req,res){

    // Remove all obejects from the store
    var predicates = get_attributes()
    predicates.forEach(function(predicate) {
        predicate = clean_uri(predicate)
        store.removeMany(name, FOAF(predicate), undefined)
        store.removeMany(name, KRR(predicate), undefined)

    });

    // Add new obecjets to the store
    // Person Data
    store.add(name, FOAF('depiction'), rdf.literal(req.body.depiction))
    store.add(name, FOAF('title'), rdf.literal(req.body.title))
    store.add(name, FOAF('givenname'), rdf.literal(req.body.first_name))
    store.add(name, FOAF('nick'), rdf.literal(req.body.nickname))
    store.add(name, FOAF('family_name'), rdf.literal(req.body.familiy_name))
    store.add(name, FOAF('status'), rdf.literal(req.body.position))
    store.add(name, FOAF('topic_interest'), rdf.literal(req.body.biography))
    store.add(name, KRR('password'), rdf.literal(req.body.password))
    store.add(name, KRR('officeNumber'), rdf.literal(req.body.office_number))

    // Links
    // store.add(name, FOAF('mbox'), req.body.email)
    // store.add(name, KRR('twitterAccount'), FOAF(req.body.twitterAccount))

    // Interests
    if(typeof req.body.interest === 'string' || req.body.interest instanceof String){
        var interest = req.body.interest
        store.add(name, FOAF('interest'), interest);
    } else {
        var interests = req.body.interest
        interests.forEach(function(interest) {
            store.add(name, FOAF('interest'), interest);
        });
    };
    console.log(store)
    // store.add(name, KRR('teacherOfCourse'), req.body.teacherOfCourse)  
    // store.add(name, FOAF('currentProject'), req.body.currentProject)

    datum = Date.now()



//     // - create an empty store
// var kb = new rdf.IndexedFormula();

// // - load RDF file
// fs.readFile('people_new.ttl', function (err, data) {
//     if (err) { /* error handling */ }

//     // NOTE: to get rdflib.js' RDF/XML parser to work with node.js,
//     // see https://github.com/linkeddata/rdflib.js/issues/47

//     // - parse RDF/XML file
//     rdf.parse(data.toString(), kb, './people_new.ttl', 'application/rdf+xml', function(err, kb) {
//         if (err) { /* error handling */ }

//         var me = kb.sym('http://kindl.io/christoph/foaf.rdf#me');

//         // // - add new properties
//         kb.add(me, FOAF('mbox'), kb.sym('mailto:e0828633@student.tuwien.ac.at'));
//         kb.add(me, FOAF('nick'), 'ckristo');

//         // - alter existing statement
//         kb.removeMany(me, FOAF('age'));
//         kb.add(me, FOAF('age'), kb.literal('25'));

//         // - find some existing statements and iterate over them
//         var statements = kb.statementsMatching(me, FOAF('mbox'));
//         statements.forEach(function(statement) {
//             console.log(statement.object.uri);
//         });

//         // - delete some statements
//         kb.removeMany(me, FOAF('mbox'));

//         // - print modified RDF document
//         rdf.serialize(undefined, kb, undefined, 'application/rdf+xml', function(err, str) {
//             console.log(str);
//         });
//     });
// });


    // data = rdf.serialize(undefined, kb, undefined, 'application/rdf+xml', function(err, str) {
    //         console.log(str);


    console.log('going to serialize')


    rdf.serialize(undefined,store,baseUrl, undefined, function(err, str){
        if (err){
            console.log(err)
        } else{

            fs.writeFile(datum + '.ttl', str, function() {
                res.redirect("/profile")
                
            })
            console.log(str)
        }
    })

  //  fs.writeFile(datum +'.ttl',store);

});

router.get("/profile", authenticationMiddleware() ,function(req,res){
    var to_display = get_attributes_values();
    res.render('./profile/view', {to_display: to_display})
});




// Logout ROUTE
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
})


module.exports = router;