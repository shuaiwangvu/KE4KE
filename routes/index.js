
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


var rdfData = fs.readFileSync(filename).toString();

var store = rdf.graph();
var contentType='text/turtle';
// var knows = FOAF('knows'); //???
var baseUrl="http://www.w3.org/2002/07/owl#Thing";
// var body = '<a> <b> <c> .';
rdf.parse(rdfData,store,baseUrl);

console.log (" ==== BEGINNING OF HISTORY! ====\n");

console.log("There are ", store.length, " triples");

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
        res.render('members', {input: question, output: chatbot_reply, lst: hello});
    });

    // res.render('members', {input: question, output: answer});
});

router.post('/members/submit', function (req, res, next) {
    var id = req.body.id;
    console.log(id);
    res.redirect('/members/' + id)
});

module.exports = router;