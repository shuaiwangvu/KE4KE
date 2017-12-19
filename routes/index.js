
var express = require('express');
var router = express.Router();
var fs = require('fs');



var path = require('path');
var rdf = require('rdflib');

var filename = './people.owl';

// var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
var watson = require("watson-developer-cloud");

var conversation = new watson.ConversationV1 ({
    // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
    // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
    'username': '83490051-78f4-4ef0-b96f-4760d94c7050',
    'password': 'Di0IxL6GHSr1',
    'version_date': '2017-11-26'
});


// conversation.listWorkspaces(function(err, response) {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log(JSON.stringify(response, null, 2));
//     }
// });


// conversation.message({
//     workspace_id: '49317eb4-0292-4f3d-a6ea-93dc547151ac',
//     input: {'text': 'Hello'}
// },  function(err, response) {
//     if (err)
//         console.log('error:', err);
//     else
//         // console.log(JSON.stringify(response, null, 2));
//         console.log(response.output.text);
// });


//     < PRE PROCESSING OF DATA >
var rdfData = fs.readFileSync(filename).toString();

var store = rdf.graph();
var contentType='text/turtle';
// var knows = FOAF('knows'); //???
var baseUrl="http://www.w3.org/2002/07/owl#Thing";
// var body = '<a> <b> <c> .';
rdf.parse(rdfData,store,baseUrl);


console.log (" ==== BEGINNING OF HISTORY! ====\n");

console.log("There are ", store.length, " triples");

var is_of_type = rdf.sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
var individual = rdf.sym("http://www.w3.org/2002/07/owl#NamedIndividual");

// GLOBAL LIST OF ALL PEOPLE . NOTE THAT NOT ALL PEOPLE ARE SCIENTISTS
var all_people = []; // uri
var recommended_people = [];
var other_people = [];

var to_display = [];


var people_prefix = "file:/Users/finnpotason/Programming/FOAF/krr.rdf#";
var people = store.each(undefined, is_of_type, individual);
console.log('HOW MANY RESULTS ARE THERE? -- ', people.length);
for (var i=0; i<people.length;i++) {
    var p = people[i];
    console.log('The URI of this people is: ', p.uri); // the WebID of a friend
    all_people += p.uri;

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
    for (var j=0; j<interest_list.length;j++) {
        it = interest_list[j];
        interest += it.value; // the WebID of a friend
        interest_string += " ";
        interest_string += it.value;
    }
    console.log("This person has interest in ", interest);

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

    var pp = {uri: p.uri ,name : title.value + " " + first_name.value + " "+ family_name.value,
        interest: interest_string, image: image.value, homepage: homepage.value, position: position.value};

    console.log("Initialised an entry for " + pp.name + "\n");
    to_display.push(pp);
}

console.log('         < ALL PEOPLE > ', all_people.length);

console.log (" ==== END OF HISTORY! ====\n");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { condition: true, anyArray: [1,2,3] });
});


router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About', condition: true, anyArray: [1,2,3] });
});

router.get('/members', function(req, res, next) {

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
        res.render('members', { output: chatbot_reply });
    });


    // res.render('members', { title: 'Members', condition: true, anyArray: [1,2,3], reply: chatbot_reply });

});

router.get('/projects', function(req, res, next) {
    res.render('projects', { title: 'Projects', condition: true, anyArray: [1,2,3] });
});

router.get('/publications', function(req, res, next) {
    res.render('publications', { title: 'Publications', condition: true, anyArray: [1,2,3] });
});


router.get('/members/:id', function(req, res, next) {

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


    // var answer = 'answer of ' + question;
    var chatbot_reply;

    var interest_restrictions = [];
    conversation.message({
        workspace_id: '49317eb4-0292-4f3d-a6ea-93dc547151ac',
        input: {'text': question}
    },  function(err, response) {
        if (err)
            console.log('error:', err);
        else
            console.log(JSON.stringify(response, null, 2));
            chatbot_reply = response.output.text.toString();
            console.log('there are ', response.entities.length, 'entities');
            response.entities.forEach(function (item) {
                console.log(item.value);
            });
        console.log('REPLY FROM WATSON: ', chatbot_reply);

        // ==========THIS IS A TEST ON RETRIVING FROM KNOWLEDGE GRAPH
        var deep_learning = rdf.literal("deep learning");



        // var interest = rdf.sym('http://xmlns.com/foaf/0.1/interest'); //
        var friends = store.each( undefined, undefined, deep_learning);
        console.log('HOW MANY RESULTS ARE THERE? -- ', friends.length);
        for (var i=0; i<friends.length;i++) {
            var friend = friends[i];
            console.log('===================SEARCHING RESULT=======', friend.uri) // the WebID of a friend
        }
        var hello = [1,2,3];

        // res.render('members', { output: chatbot_reply });
        // console.log("TO DISPLAY :" + to_display[0].name);
        res.render('members', {input: question, output: chatbot_reply, people: to_display});
    });

    // res.render('members', {input: question, output: answer});
});

router.post('/members/submit', function (req, res, next) {
    var id = req.body.id;
    console.log(id);
    res.redirect('/members/' + id)
});

module.exports = router;