
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { condition: true, anyArray: [1,2,3] });
});


router.get('/about.html', function(req, res, next) {
    res.render('about', { title: 'About', condition: true, anyArray: [1,2,3] });
});

router.get('/members.html', function(req, res, next) {
    res.render('members', { title: 'Members', condition: true, anyArray: [1,2,3] });
});

router.get('/projects.html', function(req, res, next) {
    res.render('projects', { title: 'Projects', condition: true, anyArray: [1,2,3] });
});

router.get('/publications.html', function(req, res, next) {
    res.render('publications', { title: 'Publications', condition: true, anyArray: [1,2,3] });
});


module.exports = router;