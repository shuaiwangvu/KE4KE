var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// the following is my code:
var hbs = require('express-handlebars');// Finn

var indexRoutes = require('./routes/index'),
		membersRoutes = require('./routes/members'),
		publicationsRoutes = require('./routes/publications'),
		coursesRoutes = require('./routes/courses'),
		aboutRoutes = require('./routes/aboutUs'),
		newsRoutes = require('./routes/news'),
		studentProjectsRoutes = require('./routes/studentProjects'),
		vacanciesRoutes = require('./routes/vacancies'),
		contactRoutes = require('./routes/contact'),
		collcaborationRoutes = require('./routes/collaboration]'),
		projectsRoutes = require('./routes/projects');


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

app.use('/', indexRoutes);
app.use('/members', membersRoutes);
app.use('/publications', publicationsRoutes);
app.use('/courses', coursesRoutes);
app.use('/about', aboutRoutes);
app.use('/news', newsRoutes);
app.use('/studentprojects', studentProjectsRoutes);
app.use('/vacancies', vacanciesRoutes);
app.use('/contact', contactRoutes);
app.use('/collaboration', collcaborationRoutes);
app.use('/projects', projectsRoutes);


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
