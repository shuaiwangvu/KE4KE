var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



// the following is my code:
var hbs = require('express-handlebars');// Finn

<<<<<<< HEAD
var index = require('./routes/index'),
		members = require('./routes/members'),
		publications = require('./routes/publications'),
		courses = require('./routes/courses'),
		about = require('./routes/aboutUs'),
		news = require('./routes/news'),
		studentProjects = require('./routes/studentProjects'),
		vacancies = require('./routes/vacancies'),
		contact = require('./routes/contact'),
		collcaboration = require('./routes/collaboration]'),
		projects = require('./routes/projects');
=======
var indexRoutes 	= require('./routes/index');
//var membersRoutes = require('../routes/members');
//var publicationsRoutes = require('../routes/publications');
>>>>>>> aa96afdeb435b204ab3460a62ad03c7070758f62

var app = express();

// view engine setup

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'})); // Finn
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); // Finn

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

<<<<<<< HEAD
app.use('/', index);
app.use('/members', members);
app.use('/publications', publications);
app.use('/courses', courses);
app.use('/about', about);
app.use('/news', news);
app.use('/studentprojects', studentProjects);
app.use('/vacancies', vacancies);
app.use('/contact', contact);
app.use('/collaboration', collcaboration);
app.use('/projects', projects);
=======
app.use('/', indexRoutes);
//app.use('/members', membersRoutes);
//app.use('/publications', publicationsRoutes);
//app.use('/members', membersRoutes);
>>>>>>> aa96afdeb435b204ab3460a62ad03c7070758f62

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
