var express            = require('express');
var router             = express.Router();
var fs                 = require('fs'),
    rdf                = require('rdflib'),
    session            = require('express-session'),
    passport           = require('passport'),
    LocalStrategy      = require('passport-local').Strategy,
    flash              = require('connect-flash');


<<<<<<< HEAD
var path = require('path');
var rdf = require('rdflib');

//var passport    = require("passport");
//var LocalStrategy = require("passport-local");
//var passport = require("passport");
//var User = require("../models/user");

var filename = './people.owl';
var filename2 = './publications.owl';

// var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
var watson = require("watson-developer-cloud");

var conversation = new watson.ConversationV1 ({
    // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
    // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
    'username': '83490051-78f4-4ef0-b96f-4760d94c7050',
    'password': 'Di0IxL6GHSr1',
    'version_date': '2017-11-26'
});


var hometown = [
  {lat: 52.371591, lng: 4.888045}, // albert
  {lat: 52.089428, lng: 4.962933}, // Harmelen
  {lat: 52.378951, lng: 4.655923}, // Harlem
  {lat: 39.094480, lng: 107.984852}, //ordos
  {lat: 30.573953, lng: 114.328528}, // wu han
  {lat: 54.970417, lng: -1.624563}, // newcastel
  {lat: 35.673309, lng: 51.408175} // iran
];

var oldmembers = [
  {lat: 52.371591, lng: 4.888045}, // Rinke Hoekstra (now at Elsevier)
  {lat: 52.332627, lng: 4.867903}, // Triply/ VU
  {lat: 40.766041, lng:-73.988471}, // Sara Magliacane  IBM@NY
  {lat: 52.355052, lng:4.953405}, // science park
  {lat: 52.294813, lng:4.957984}, // AMC
  {lat: 52.332927, lng: 4.867603},// VU
  {lat: 30.563953, lng: 114.329528}, // wuhan
  {lat: 52.332027, lng: 4.867613}, // VU
  {lat:  52.157142, lng: 4.485209}, //leiden
  {lat: 52.157873, lng:4.486108}, //leiden
  {lat: 52.332227, lng: 4.867913}, // VU
  {lat: -35.304239, lng: -71.625783},//Cilli
  {lat: 52.295764, lng:4.676865}, // Jora solutions??
  {lat: 52.356868, lng:4.951838}, //CWI
  {lat: -25.746558, lng:28.278893}, // CSIR , south africa
  {lat: 52.081026, lng:4.345630}, //DANS
  {lat: 44.246656, lng:-70.636723}, // IBM US
  {lat: 42.372614, lng:-71.077291}, // philips research
  {lat: 42.372414, lng:-71.077301}, // philips research
  {lat: 51.984615, lng:5.665780}, //wachningen University
  {lat: 51.995846, lng:4.376735}, // TU Delft
  {lat: 52.360595, lng:4.902973}, // McKinsey)
  {lat: 52.333096, lng:4.866444},// VU web and media
  {lat: 52.333196, lng:4.866344},// VU web and media
  {lat: 52.334478, lng:4.866203}, // communication VU
  {lat: 52.332137, lng:4.867893}, // VU
  {lat: 38.030445, lng:23.792949}, // greece
  {lat: 47.533739, lng:7.638444}, // Switzerland
  {lat: 49.484178, lng:8.460603}, //mannheim germany
  {lat: 52.024990, lng:-0.706864}, // open univeristy
  {lat: 52.303042, lng:4.715054}, // LogicaCMG
  {lat: -41.290538, lng:174.778265}, // NZ
  {lat: 52.091326, lng:5.122773}, // Utrecht
  {lat: 51.819282, lng:5.856759}, // Nijmegen
  {lat: 43.607611, lng:-73.180503}, //Castelon
  {lat: 52.130770, lng:4.695389}
];

var visitors = [
  {lat: 30.563953, lng: 114.329528},//wuhan
  {lat: 30.563953, lng: 114.329528},//wuhan
  {lat: 35.305336, lng: 25.072624},//forth
  {lat: -15.989339, lng: -48.045224},//brazil
  {lat: 42.877197, lng: -8.558904},// USC.es
  {lat: 46.067179, lng: 11.149779},// Trento
  {lat: 46.067879, lng: 11.149739},// Trento
  {lat: 53.466792, lng: -2.233894},// manchester
  {lat: 52.388606, lng: 9.713342},//leipsig
  {lat: 40.448507, lng: -3.719130},//UPM madrid
  {lat: -33.811886, lng: 151.025533},//west sydney
  {lat: 32.056282, lng: 118.794243},//SouthEast uni, china
  {lat: 43.561983, lng: 1.467986},//IRIT, Toulouse, FR
  {lat: 39.879869, lng: 116.479347},// Beijing University of Technology
  {lat: 53.308813, lng: -6.223562},//Ireland, Galway
  {lat: 37.184853, lng: -3.600579},//Granada, ES
  {lat: 53.120094, lng: 8.852710},//bremen university
  {lat: 33.954318, lng: -111.957057},// Arizona State University
  {lat: 51.514231, lng: -0.128518},//Yahoo, uk
  {lat: 30.763851, lng: 103.970534},//chendu, china
  {lat: 39.480926, lng: -0.341142},//Universitat Politècnica de València
];



// STEP 0: LOAD KNOWLEDGE BASES: PEOPLE AND PUBLICATIONS

var rdfData = fs.readFileSync(filename).toString();
var rdfData2 = fs.readFileSync(filename2).toString();

var store = rdf.graph();
var store2 = rdf.graph();

var contentType='text/turtle';
var baseUrl="http://www.w3.org/2002/07/owl#Thing";
=======
var store           =   rdf.graph();
var filename        =   './1537970111555.ttl';
var rdfData         =   fs.readFileSync(filename).toString();
var baseUrl         =   "http://www.w3.org/2002/07/owl#Thing";
>>>>>>> 9202097be4618590a1b4e4a3d794d98b999e9967

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

<<<<<<< HEAD

router.get('/about', function(req, res, next) {
    res.render('./aboutUs/about', { title: 'About', condition: true, anyArray: [1,2,3] });
});

router.get('/courses', function(req, res, next) {
    res.render('./teaching/courses', { title: 'Courses', condition: true, anyArray: [1,2,3] });
});

router.get('/studentprojects', function(req, res, next) {
    res.render('./teaching/studentprojects', { title: 'Studentprojects', condition: true, anyArray: [1,2,3] });
});


router.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Contact', condition: true, anyArray: [1,2,3] });
});
=======
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

>>>>>>> 9202097be4618590a1b4e4a3d794d98b999e9967

router.post("/profile/edit", authenticationMiddleware() ,function(req,res){

<<<<<<< HEAD
router.get('/collaboration', function(req, res, next) {
    res.render('./aboutUs/collaboration', { title: 'Collaboration', condition: true, anyArray: [1,2,3] });
});

router.get('/vacancies', function(req, res, next) {
    res.render('./aboutUs/vacancies', { title: 'Vacancies', condition: true, anyArray: [1,2,3] });
});



// show register form
router.get("/register", function(req, res){
    res.render("./login/register", { title: 'register', condition: true, anyArray: [1,2,3] });
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





router.get('/projects', function(req, res, next) {
    res.render('./research/projects', { title: 'Projects', condition: true, anyArray: [1,2,3] });
});

router.get('/publications', function(req, res, next) {
    res.render('./research/publications', { title: 'Publications', condition: true, anyArray: [1,2,3]});
});
=======
    // Remove all obejects from the store
    var predicates = get_attributes()
    predicates.forEach(function(predicate) {
        predicate = clean_uri(predicate)
        store.removeMany(name, FOAF(predicate), undefined)
        store.removeMany(name, KRR(predicate), undefined)

    });
>>>>>>> 9202097be4618590a1b4e4a3d794d98b999e9967

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

<<<<<<< HEAD
router.get('/members', function(req, res, next) {

    location  = 1;
    upper = [];
    lower = to_display;

    recommended_people = [];
    other_people = [];
    // STEP 1: START THE CHATBOT (IBM BLUEMIX CONVERSATION API)
    var chatbot_reply; // empty string for now

    conversation.message({
    workspace_id: '49317eb4-0292-4f3d-a6ea-93dc547151ac',
    input: {'text': 'Hello'}
},  function(err, response) {
    if (err)
        console.log('error:', err);
    else
        console.log(JSON.stringify(response, null, 2));
        // console.log(response.output.text);
        chatbot_reply = response.output.text
        console.log(chatbot_reply);
        res.render('members', { output: chatbot_reply, upper: upper, lower: lower, hometown: hometown, oldmembers:oldmembers, visitors:visitors});
    });
    // res.render('members', { title: 'Members', condition: true, anyArray: [1,2,3], reply: chatbot_reply });
    // res.render('members', {input: "", output: "", upper: upper, lower: lower});
});

router.get('/members/:id', function(req, res, next) {
    upper = [];
    lower = [];
    var valid = true;
    var found = true;
=======
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
>>>>>>> 9202097be4618590a1b4e4a3d794d98b999e9967

//         // - find some existing statements and iterate over them
//         var statements = kb.statementsMatching(me, FOAF('mbox'));
//         statements.forEach(function(statement) {
//             console.log(statement.object.uri);
//         });

//         // - delete some statements
//         kb.removeMany(me, FOAF('mbox'));

<<<<<<< HEAD
    var stms = store.statementsMatching(undefined, undefined , undefined);
    for (var i=0; i<stms.length;i++) {
        console.log("\n");
        var stm = stms[i];
        var subject = stm.subject.uri;
        var predicate = stm.predicate.uri;
        var object = stm.object;
=======
//         // - print modified RDF document
//         rdf.serialize(undefined, kb, undefined, 'application/rdf+xml', function(err, str) {
//             console.log(str);
//         });
//     });
// });

>>>>>>> 9202097be4618590a1b4e4a3d794d98b999e9967

    // data = rdf.serialize(undefined, kb, undefined, 'application/rdf+xml', function(err, str) {
    //         console.log(str);


    console.log('going to serialize')


    rdf.serialize(undefined,store,baseUrl, undefined, function(err, str){
        if (err){
            console.log(err)
        } else{

<<<<<<< HEAD
    //INTERACTION WITH CHATBOT
    // var answer = 'answer of ' + question;
    var chatbot_reply;

    var interest_restrictions = [];
    conversation.message({
        workspace_id: '49317eb4-0292-4f3d-a6ea-93dc547151ac',
        input: {'text': question}
    },  function(err, response) {
        if (err)
            console.log('error:', err);
        else{
            console.log(JSON.stringify(response, null, 2));
            chatbot_reply = response.output.text.toString();
            console.log('there are ', response.entities.length, 'entities');

            // STEP 2: OBTAIN ENTITIES
            response.entities.forEach(function (item) {
                console.log("Entity :", item.value);
            });
            if (response.entities.length !== 0){
                //UPDATE THE TWO LITS ACCORIDNG TO THE DOMAIN
                if (location%3 == 1)
                {

                    // STEP 3: MODIFY THE LIST ACCORDING TO THE SPECIFICAITON
                    recommended_people = [];
                    other_people = [];
                    all_people.forEach(function (ppl) {
                        var flag = true;
                        response.entities.forEach(function (item) {
                            var comp = ppl.interest.includes(item.value);
                            // console.log("test", item.value, "is in ", ppl.interest, ": ", comp);
                            if (comp === false) {
                                flag = false;
                            }

                        });

                        if (flag === true) {
                            recommended_people.push(ppl);
                        } else {
                            other_people.push(ppl);
                        }
                        // console.log('why?');

                    });
                };
                console.log("location ==== ", location);


                //STEP 4: MATCH AND UPDATE THE TWO LIST ACCORDING TO THE POSITION
                if (location%3 == 2)
                {
                    var to_remove = [];
                    recommended_people.forEach(function (ppl) {
                        var flg = false;

                        response.entities.forEach(function (item) {
                            console.log("position needed", item.value);
                            console.log("There are ", recommended_people.length, " recommended people");
                            console.log("this person", ppl.uri, " has position ", ppl.position);
                            if (ppl.position == item.value) {
                                flg = true;
                            }

                        });

                        if (flg == true) {
                            //nothing changes to this people
                            console.log("nothing changes for ppl", ppl.uri);
                        } else {
                            console.log("does not meet the requirement so move it to the other list:", ppl.uri);
                            // other_people.push(ppl);
                            to_remove.push(ppl);

                        }
                        // console.log('why?');

                    });
                    to_remove.forEach(function(ppl){
                        var index = recommended_people.indexOf(ppl);
                        if (index > -1) {

                            //STEP 5: RANKING: SIMPLE RANKING WITH FIRST MATCH FIRST PRESENT
                            recommended_people.splice(index, 1);
                        }else{
                            console.log("ERROR!!!!!!!!!");
                        }
                        other_people.push(ppl);
                    });



                };



                console.log('REPLY FROM WATSON: ', chatbot_reply);

                // ==========THIS IS A TEST ON RETRIVING FROM KNOWLEDGE GRAPH
                // var deep_learning = rdf.literal("deep learning");



                // var interest = rdf.sym('http://xmlns.com/foaf/0.1/interest'); //
                // var friends = store.each( undefined, undefined, deep_learning);
                // console.log('HOW MANY RESULTS ARE THERE? -- ', friends.length);
                // for (var i=0; i<friends.length;i++) {
                //     var friend = friends[i];
                //     console.log('===================SEARCHING RESULT=======', friend.uri) // the WebID of a friend
                // }

                to_display.forEach(function (display_ppl) {
                    var flag_rec = false;
                    recommended_people.forEach(function(reco){
                        if (display_ppl.uri == reco.uri){
                            flag_rec = true;
                        }
                    });
                    if (flag_rec == true){
                        upper.push(display_ppl)
                    }else{
                        lower.push(display_ppl);
                    };
                });

                // if no one was found then display only the secretary
                if (recommended_people.length == 0){
                    upper= [];
                    console.log("no one found and now!!!");
                    found = false;
                    chatbot_reply = "No one was found. Please contact our secretary."
                    to_display.forEach(function (display_ppl) {
                        if (display_ppl.position == "secretary"){
                            upper.push(display_ppl)
                        };
                    });
                };

            } else{

                upper = [];
                lower = [];

                valid = false;
                console.log("watson does not understand!!!");
                chatbot_reply = "Watson cannot understand you. You may contact our secretary.";
                to_display.forEach(function (display_ppl) {
                    if (display_ppl.position == "secretary"){
                        upper.push(display_ppl)
                    };
                });

            }
            location += 1;
            res.render('members', {input: question, output: chatbot_reply, valid:valid , found: found, upper: upper, lower: lower, hometown: hometown, oldmembers: oldmembers, visitors:visitors});
        }
    });

});
=======
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
>>>>>>> 9202097be4618590a1b4e4a3d794d98b999e9967


module.exports = router;