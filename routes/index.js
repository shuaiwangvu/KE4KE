
var express = require('express');
var router = express.Router();


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
        console.log(chatbot_reply)
        res.render('members', { title: 'Members', condition: true, anyArray: [1,2,3], reply: chatbot_reply });
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
    res.render('members', {output: req.params.id});
});

router.post('/members/submit', function (req, res, next) {
    var id = req.body.id;
    console.log(id)
    res.redirect('/members/' + id)
})

module.exports = router;