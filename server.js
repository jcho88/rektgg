
/*!
 * nodejs-express-mongoose-demo
 * Copyright(c) 2013 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */
/**
 * Module dependencies
 */

var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('config');
var I18n = require('i18n-2');
var favicon = require('serve-favicon');

var app = express();
var port = process.env.PORT || 3000;

app.use(favicon( __dirname + '/public/img/favicon.ico'));
// Attach the i18n property to the express request object
// And attach helper methods for use in templates
I18n.expressBind(app, {
    locales: ['riot_api']
});

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});

// Bootstrap passport config
require('./config/passport')(passport, config);

// Bootstrap application settings
require('./config/express')(app, passport);

// Bootstrap routes
require('./config/routes')(app, passport);

app.disable('x-powered-by');
app.listen(port);
console.log('Express app started on port ' + port);

/**
 * Expose
 */

module.exports = app;
