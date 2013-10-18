/*
 * Module dependencies
 */
var express = require('express');
var mysql = require('mysql');

var connection = mysql.createConnection({
		   user: 'csteam',
		   password: 'rnadb',
		   host: 'bioce32502.biology.gatech.edu',
		   port: '3306',
		   database: 'urss2',
	});

	connection.connect();

var app = express();

app.set('views', __dirname + '/views');

app.engine('html', require('ejs').renderFile);

//weird changes
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));


app.get('/page2', function (req, res) {
  res.render('page2.html');
});

app.post('/page1', function (req, res) {
  var results;
  connection.query(req.body.userquery, function(err, rows, fs){
		if(err){
			results = JSON.stringify({"error": "idk what happened"});
			console.log('More errors');
			console.log(err);
			console.log(fs);
			res.json(results);
			return;
		}	
		results = JSON.stringify(rows);
		res.json(results);
	});
});

app.get('/', function (req, res) {
  res.render('index.html');
});

app.get('/original', function (req, res) {
  res.render('indexOriginal.html');
});



app.get('/classload', function (req, res) {
  var results;
  connection.query('select distinct rna_class from orna', function(err, rows, fs){
		if(err){
			console.log('Something is broken');
			console.log(err);
			console.log(fs);
		}	
		results = JSON.stringify(rows);
		res.json(results);
	});
});

app.get('/orgload', function (req, res) {
  var results;
  connection.query('select distinct org from orna', function(err, rows, fs){
		if(err){
			console.log('Something is broken, errors are what follows');
			console.log(err);
			console.log(fs);
		}	
		results = JSON.stringify(rows);
		res.json(results);
	});
});

app.get('/nameload', function (req, res) {
  var results;
  connection.query('select distinct name from orna', function(err, rows, fs){
		if(err){
			console.log('something broke son');
			console.log(err);
			console.log(fs);
		}	
		results = JSON.stringify(rows);
		res.json(results);
	});
});

app.get('/ornaidload', function (req, res) {
  var results;
  connection.query('select distinct orna_id from orna', function(err, rows, fs){
		if(err){
			console.log('something broke son');
			console.log(err);
			console.log(fs);
		}	
		results = JSON.stringify(rows);
		res.json(results);
	});
});

app.listen(3000);

console.log('Server running at http://localhost:3000/');