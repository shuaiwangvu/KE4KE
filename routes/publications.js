var express = require('express');
var router = express.Router();
var fs = require('fs');

var path = require('path');
var rdf = require('rdflib');

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


// STEP 0: LOAD KNOWLEDGE BASES:  PUBLICATIONS

var rdfData2 = fs.readFileSync(filename2).toString();

var store2 = rdf.graph();

var contentType= 'text/turtle';
var baseUrl="http://www.w3.org/2002/07/owl#Thing";


rdf.parse(rdfData2,store2,baseUrl);
// console.log("There are ", store2.length, " triples in publications ontology");

// console.log (" ==== BEGINNING OF PUBLICATIONS! ====\n");


var sub_class_of = rdf.sym("http://www.w3.org/2000/01/rdf-schema#subClassOf");
var topic = rdf.sym("http://example.com/ontology#Topic");



var keywords = store2.each(undefined, sub_class_of, topic);

// console.log('HOW MANY Triples ARE THERE? -- ', keywords.length);

for (var i=0; i<keywords.length;i++) {
    var k = keywords[i];
    // console.log('keywords uri = ', k.uri);
}
//keyword prefix = http://example.com/bibliography#

var is_published_on_year = rdf.sym("http://example.com/ontology#isPublishedOnYear");
var is_about = rdf.sym("http://example.com/ontology#isAbout");

var publication_list = [];
var keywords_by_year = [];


for (var yr = 1996; yr < 2018; yr++){
    var y = {year: yr, keyword_list: []};
    keywords_by_year.push(y);
    // console.log("year ===== ", yr);
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
    // console.log('publications uri = ', p.uri);

    var year = store2.any(p, is_published_on_year);
    // console.log(' is published on year', year.value);


    var its_keywords = store2.each(p, is_about);
    if (its_keywords.length > 0){
        for (var k =0; k < its_keywords.length; k++){
            kw = its_keywords[k];
            // console.log("        it has ", kw.value, " keywords");

            keywords_by_year.forEach(function (ky) {
                if (ky.year == year.value){

                    var index = kw.value.indexOf("#");
                    var keyword = kw.value.substring(index+1);
                    keyword = keyword.replaceAll('_', ' ');

                    ky.keyword_list.push(keyword);
                    // console.log(year.value , ' capture ', kw.value);

                }
            });

        }
    }

}
// console.log("END OF PUBLICATION.");



router.get('/', function(req, res, next) {
    res.render('./research/publications', { title: 'Publications', condition: true, anyArray: [1,2,3]});
});

module.exports = router;