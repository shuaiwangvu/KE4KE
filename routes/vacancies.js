var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

router.get('/', function(req, res, next) {
    res.render('./aboutUs/vacancies', { title: 'Vacancies', condition: true, anyArray: [1,2,3] });
});

module.exports = router;
