
var express = require('express');
var router = express.Router();
var fs = require('fs');

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

rdf.parse(rdfData,store,baseUrl);
rdf.parse(rdfData2,store2,baseUrl);


console.log (" ==== BEGINNING OF PEOPLE! ====\n");

console.log("There are ", store.length, " triples in people ontology");
console.log("There are ", store2.length, " triples in publications ontology");

var is_of_type = rdf.sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
var individual = rdf.sym("http://www.w3.org/2002/07/owl#NamedIndividual");

// GLOBAL LIST OF ALL PEOPLE . NOTE THAT NOT ALL PEOPLE ARE SCIENTISTS
var all_people = []; // uri
var recommended_people = [];
var other_people = [];

var to_display = [];
var upper = [];
var lower = [];

var location = 0;

var people_prefix = "file:/Users/finnpotason/Programming/FOAF/krr.rdf#";
var people = store.each(undefined, is_of_type, individual);
console.log('HOW MANY RESULTS ARE THERE? -- ', people.length);

for (var i=0; i<people.length;i++) {
    var p = people[i];
    console.log('The URI of this people is: ', p.uri); // the WebID of a friend

    var pl = {uri : p.uri, interest: [], position: "", email : ""};


    // title and name
    var has_first_name = rdf.sym("http://xmlns.com/foaf/0.1/givenname");
    var first_name = store.any(p, has_first_name);
    var has_family_name = rdf.sym("http://xmlns.com/foaf/0.1/family_name");
    var family_name = store.any(p, has_family_name);
    console.log("This people has first name: ", first_name.value);
    console.log("This people has family name: ", family_name.value);

    var has_title = rdf.sym("http://xmlns.com/foaf/0.1/title");
    var title = store.any(p, has_title);
    console.log("This people has title: ", title.value);

    //interest
    var interest = [];
    var interest_string = "";
    var has_interest = rdf.sym("http://xmlns.com/foaf/0.1/interest");

    var interest_list = store.each(p, has_interest, undefined);
    if (interest_list.length > 0){
				pl.interest.push(interest_list[0].value);
        interest_string += interest_list[0].value;
				for (var j=1; j<interest_list.length;j++) {
            it = interest_list[j];
            interest += it.value; // the WebID of a friend
            interest_string += "; ";
            interest_string += it.value;
            pl.interest.push (it.value);
        }
        console.log("This person has interest in ", interest, " = ", pl.interest.length);

    };

    //description = topic_interest

    var has_description = rdf.sym("http://xmlns.com/foaf/0.1/topic_interest");
    var description = store.any(p, has_description);
    console.log("This people has description: ", description.value);

    //image
    var has_image = rdf.sym("http://xmlns.com/foaf/0.1/depiction");
    var image = store.any(p, has_image);
    console.log("This people has image: ", image.value);

    //homepage
    var has_homepage = rdf.sym("http://xmlns.com/foaf/0.1/homepage");
    var homepage = store.any(p, has_homepage);
    console.log("This people has homepage: ", homepage.value);

    // position
    var has_position = rdf.sym("http://xmlns.com/foaf/0.1/status");
    var position = store.any(p, has_position);
    console.log("This people has position: ", position.value);

    pl.position = position.value;

    //email
    var has_email = rdf.sym("http://xmlns.com/foaf/0.1/mbox");
    var email = store.any(p, has_email);
    console.log("This people has email: ", email.value);

    pl.email = email.value;


    //store up and go
    all_people.push(pl); // all this person in the all_people for splitting

    var pp = {uri: p.uri ,name : title.value + " " + first_name.value + " "+ family_name.value,
        interest: interest_string, image: image.value, homepage: homepage.value, position: position.value,
        email: email.value, description: description.value};

    console.log("Initialised an entry for " + pp.name + "\n");

    // -- PREPARE A LIST OF PEOPLE TO BE CLASSIFIED ACCORDING TO THE SPECIFICATION OF VISITORS
    to_display.push(pp);
}

var upper = [];
var lower = to_display;

console.log('         < ALL PEOPLE > ', all_people.length);

console.log (" ==== END OF PEOPLE! ====\n");


console.log (" ==== BEGINNING OF PUBLICATIONS! ====\n");


var sub_class_of = rdf.sym("http://www.w3.org/2000/01/rdf-schema#subClassOf");
var topic = rdf.sym("http://example.com/ontology#Topic");



var keywords = store2.each(undefined, sub_class_of, topic);

console.log('HOW MANY Triples ARE THERE? -- ', keywords.length);

for (var i=0; i<keywords.length;i++) {
    var k = keywords[i];
    console.log('keywords uri = ', k.uri);
}
//keyword prefix = http://example.com/bibliography#

var is_published_on_year = rdf.sym("http://example.com/ontology#isPublishedOnYear");
var is_about = rdf.sym("http://example.com/ontology#isAbout");

var publication_list = [];
var keywords_by_year = [];


for (var yr = 1996; yr < 2018; yr++){
    var y = {year: yr, keyword_list: []};
    keywords_by_year.push(y);
    console.log("year ===== ", yr);
}

var publications = store2.each(undefined, is_published_on_year, undefined);

// REFERENCE: I took this method from
// https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

//REFERENCE END


//CREATE A LIST OF PUBLICATIOONS.
//IN FACT, HERE WE ONLY NEED THE KEYWORDS OF EACH YEAR.

for (var i=0; i<publications.length;i++) {
    var p = publications[i];
    console.log('publications uri = ', p.uri);

    var year = store2.any(p, is_published_on_year);
    console.log(' is published on year', year.value);


    var its_keywords = store2.each(p, is_about);
    if (its_keywords.length > 0){
        for (var k =0; k < its_keywords.length; k++){
            kw = its_keywords[k];
            console.log("        it has ", kw.value, " keywords");

            keywords_by_year.forEach(function (ky) {
                if (ky.year == year.value){

                    var index = kw.value.indexOf("#");
                    var keyword = kw.value.substring(index+1);
                    keyword = keyword.replaceAll('_', ' ');

                    ky.keyword_list.push(keyword);
                    console.log(year.value , ' capture ', kw.value);

                }
            });

        }
    }

}
console.log("END OF PUBLICATION.");
// why is this code not working?
// var image = store.any(p, has_image);
// keywords_by_year.forEach(function (ky) {
//     console.log("this is year", ky.year);
//     for (kwd in ky.keyword_list){
//         console.log("     has keyword: ", kwd);
//     }
// });

// SIMPLY OUTPUT THE KEYWORDS
for (var yr=0; yr<keywords_by_year.length;yr++) {
    kwy = keywords_by_year[yr];

    console.log('this is year ', kwy.year);
    console.log('has keywords ', kwy.keyword_list);

}



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { condition: true, anyArray: [1,2,3] });
});


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

router.get('/news', function(req, res, next) {
    res.render('news', { title: 'News', condition: true, anyArray: [1,2,3] });
});

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

    var question = req.params.id;

    // console.log(rdfData);
    // console.log('======= end of file =======');

    var stms = store.statementsMatching(undefined, undefined , undefined);
    for (var i=0; i<stms.length;i++) {
        console.log("\n");
        var stm = stms[i];
        var subject = stm.subject.uri;
        var predicate = stm.predicate.uri;
        var object = stm.object;


        console.log("termType = ", object.termType);

        console.log("subject: "+ subject);
        console.log("predicate: "+ predicate);
        // console.log("******** object: "+ object.toString());
        if (object.termType === "Literal") {
            console.log("Object : value of = ", object.value);
        }else {
            console.log("Object : uri = ", object.uri)
        }

        console.log(stm) // the WebID of a friend

    }

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

router.post('/members/submit', function (req, res, next) {
    var id = req.body.id;
    console.log(id);
    res.redirect('/members/' + id)
});

module.exports = router;
