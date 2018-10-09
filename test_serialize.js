// var fs                 = require('fs'),
//     rdf                = require('rdflib');



// var store           =   rdf.graph();
// var filename        =   './people_new.ttl';
// var rdfData         =   fs.readFileSync(filename).toString();
// var baseUrl         =   "http://www.w3.org/2002/07/owl#Thing";


// var FOAF = rdf.Namespace("http://xmlns.com/foaf/0.1/")
// var KRR = rdf.Namespace("http://www.semanticweb.org/aron/ontologies/2018/2/people#")
// var name = FOAF('no-name')


// store.add(undefined, FOAF('depiction'), rdf.literal('hallo'))

// store.statementsMatching(name,undefined,undefined)
// console.log(store)

// store.serialize(undefined,store,undefined, undefined, function(err, str){
//     if (err){
//         console.log(err)
//     } else{
//         fs.writeFile(datum + '.ttl', str, function() {
//             // res.redirect("/profile")
            
//         })
//         console.log(str)
//     }
// })



/**
* rdflib.js with node.js -- basic RDF API example.
* @author ckristo
*/

var fs = require('fs');
var $rdf = require('rdflib');

FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
XSD  = $rdf.Namespace('http://www.w3.org/2001/XMLSchema#');

// - create an empty store
var kb = new $rdf.IndexedFormula();

// - load RDF file
fs.readFile('./people_new.ttl', function (err, data) {
    if (err) { /* error handling */ }
    console.log('data')

        console.log(data)
    // NOTE: to get rdflib.js' RDF/XML parser to work with node.js,
    // see https://github.com/linkeddata/rdflib.js/issues/47

    // - parse RDF/XML file
    $rdf.parse(data.toString(), kb, './people_new.ttl', undefined, function(err, kb) {
        if (err) { /* error handling */ }
        console.log('kb: ', kb)
        var me = kb.sym('http://kindl.io/christoph/foaf.rdf#me');

        // - add new properties
        kb.add(me, FOAF('mbox'), kb.sym('mailto:e0828633@student.tuwien.ac.at'));
        // kb.add(me, FOAF('nick'), 'ckristo');

        // - alter existing statement
        kb.removeMany(me, FOAF('age'));
        kb.add(me, FOAF('age'), kb.literal(25, null, XSD('integer')));
        console.log('kb 2: ', kb)
        // - find some existing statements and iterate over them
        // var statements = kb.statementsMatching(me, FOAF('mbox'));
        // statements.forEach(function(statement) {
        //     console.log(statement.object.uri);
        // });

        // - delete some statements
        kb.removeMany(me, FOAF('mbox'));

        // - print modified RDF document
        $rdf.serialize(undefined, kb, undefined, 'application/n-triple', function(err, str) {
            console.log(str);
        });
    });
});