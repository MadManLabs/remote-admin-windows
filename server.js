// Modules
var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');

// Set server port
var port = process.env.PORT || 6060;

// Create server
var server = http.createServer(app).listen(port);
console.log("Server running on http://localhost:" + port);

// Require and configure socket.io
var io = require('socket.io')(server);

// Parse application/json
app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Serve up static assests
app.use(express.static(__dirname + '/public'));

// Set pug as view engine
app.set('view engine', 'pug');
//app.set('views', __dirname + '/public/views');

// Routes
require('./app/routes')(app);

// IO
require('./app/io')(io);

// Expose app
exports = module.exports = app;
