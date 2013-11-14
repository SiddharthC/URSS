/*
 * Module dependencies
 */
//Graph var start
var fs = require("fs");
var url = require("url");
var queryString = require("querystring");
var util = require("util");
// dynamic graph
var rowCounter = 101;
//

var express = require('express');
var mysql = require('mysql');

var connection = mysql.createConnection({
		   user: 'csteam',
		   password: 'rnadb',
		   host: 'bioce32502.biology.gatech.edu',
		   port: '3306',
		   database: 'urss2',
	});

//Disconnect handle function
function handleDisconnect(myconnection) {
    myconnection.on('error', function(err) {

        console.log('\nRe-connecting lost connection: ' + err.stack);
        connection.destroy();

        connection = mysql.createConnection(connection.config);
        handleDisconnect(connection);
        connection.connect();

    });
}

handleDisconnect(connection);
connection.connect();

var app = express();

app.set('views', __dirname + '/views');

app.engine('html', require('ejs').renderFile);

//weird changes
//app.use(express.bodyParser());    //connect warning fix
app.use(express.json());
app.use(express.urlencoded());
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

app.get('/detail', function (req,res){
	res.render('structure.html');
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

app.get('/biodomainload', function (req, res) {
  var results;
  connection.query('select distinct org_type from orna', function(err, rows, fs){
		if(err){
			console.log('Something is broken, errors are what follows');
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

//Grapher section

app.get('/getPropertyName', function (request, response){
    console.log("requesthandler: Request handler 'getPropertyName' was called");

    var data = url.parse(request.url).query;
    var obj = queryString.parse(data);
    //console.log("value of propertyType is "+ obj.propertyType);
    var query = 'select distinct( ' + obj.propertyType + ' ) as A from orna ';
    var contents = [];

    //console.log("Value of contents is "+ contents);

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        rows.forEach(function(elem) {
            contents.push(elem.A);
            //console.log("Value of elem.A is "+ elem.A);
        });

        response.writeHead(200, {
            'content-type': 'application/json'
        });
        response.end(JSON.stringify(contents));
    });
    //console.log("getPropertyName returned");
});

app.get('/getColumnData', function (request, response){
    console.log("requesthandler: Request handler 'getColumnData' was called");

    var data = url.parse(request.url).query;
    var obj = queryString.parse(data);

    if (obj.rnaType == "orna") {
        var query = 'select ' + obj.selnuc + ' as ColData from rnaseq where ' + obj.nuc + ' ' + obj.operation + ' ' + obj.percentValue +
            ' and seq_id in ( select orna_seq_id from orna where ' + obj.propertyType + '="' + obj.propertyName + '")';
    } else if (obj.rnaType == "srna") {

        //  console.log("in srna section");
        var query = 'select ' + obj.selnuc + ' as ColData from rnaseq where ' + obj.nuc + ' ' + obj.operation + ' ' + obj.percentValue +
            ' and seq_id in ( select srna_seq_id from srna where srna_orna_id in (select orna_id from orna where ' + obj.propertyType + '="' + obj.propertyName + '"))';
    } else {

    }
    var contents = [];
    var funcs = obj.func;
    //console.log("Value of contents is "+ contents);

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        rows.forEach(function(elem) {
            var funcs_eq = funcs.replace("x", elem.ColData);
            try {
                //        console.log(eval(funcs_eq));
                contents.push(eval(funcs_eq));
            } catch (e) {
                if (e instanceof SyntaxError) {
                    console.log("Syntax Error for input function");
                }
            }


            //console.log("Value of elem.A is "+ elem.A);
        });

        // Add id to serie to distinguish each serie for further remove
        var id = obj.serieid;
        var serie = {
            histogramFlag: false,
            name: obj.selnuc,
            data: contents,
            id: id
        };
        response.writeHead(200, {
            'content-type': 'application/json'
        });
        response.end(JSON.stringify(serie));

    });
});

app.get('/getStepFreq', function (request, response){
    console.log("requesthandler: Request handler 'getStepFreq' was called");

    var reqQuery = url.parse(request.url).query;
    var obj = queryString.parse(reqQuery);

    var maxminQuery;

    if (obj.rnaType == "orna") {
        maxminQuery = 'select max( ' + obj.selnuc + ') as max, min( ' + obj.selnuc + ' ) as min from rnaseq where ' + obj.nuc + ' ' + obj.operation + ' ' + obj.percentValue +
            ' and seq_id in ( select orna_seq_id from orna where ' + obj.propertyType + '="' + obj.propertyName + '")';
    } else if (obj.rnaType == "srna") {
        maxminQuery = 'select max( ' + obj.selnuc + ') as max, min( ' + obj.selnuc + ' ) as min from rnaseq where ' + obj.nuc + ' ' + obj.operation + ' ' + obj.percentValue + ' and seq_id in ( select srna_seq_id from srna where srna_orna_id in (select orna_id from orna where ' + obj.propertyType + '="' + obj.propertyName + '"))';
    } else {}

    var step = parseFloat(obj.stepSize);

    //console.log("The step size used is " + step);

    //console.log("maxminQuery is " + maxminQuery);

    var serie, step_max = 0,
        step_min = 0;

    var contents = [];

    connection.query(maxminQuery, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        // console.log("max is " + rows[0].max);
        // console.log("min is " + rows[0].min);

        step_max = rows[0].max;
        step_min = rows[0].min;

        // console.log("Value of step min is " + step_min);
        // console.log("Value of step max is " + step_max);

        var lock = 0;

        for (var i = step_min; i < (step_max + step); i += step) {
            lock++;
        }

        // console.log("The value of lock is " + lock);

        for (var i = step_min; i < (step_max + step); i += step) {

            if (obj.rnaType == "orna") {
                var query = 'select count(' + obj.selnuc + ') as num_count from rnaseq where ' + obj.selnuc + ' >= ' + i + ' and ' + obj.selnuc + ' < ' + (i + step) + ' and ' + obj.nuc + ' ' + obj.operation + ' ' + obj.percentValue +
                    ' and seq_id in ( select orna_seq_id from orna where ' + obj.propertyType + '="' + obj.propertyName + '")';
            } else if (obj.rnaType == "srna") {
                var query = 'select count(' + obj.selnuc + ') as num_count from rnaseq where ' + obj.selnuc + ' >= ' + i + ' and ' + obj.selnuc + ' < ' + (i + step) + ' and ' + obj.nuc + ' ' + obj.operation + ' ' + obj.percentValue +
                    ' and seq_id in ( select srna_seq_id from srna where srna_orna_id in (select orna_id from orna where ' + obj.propertyType + '="' + obj.propertyName + '"))';

            } else {}

            // console.log("The query fired is " + query);

            connection.query(query, function(err, rows1, fields) {
                if (err) {
                    console.log(err);
                    throw err;
                }

                try {

                    // console.log("The count value pushed is " + parseInt(rows1[0].num_count));
                    contents.push(parseInt(rows1[0].num_count));

                } catch (e) {
                    if (e instanceof SyntaxError) {
                        console.log("Syntax Error for input function");
                    }
                }

                lock--;

                if (lock == 0) {
                    queryDone();
                }
            });
        }

        function queryDone() {
            var id = obj.serieid;
            serie = {
                rnaType: obj.rnaType,
                propertyType: obj.propertyType,
                propertyName: obj.propertyName,
                selnuc: obj.selnuc,
                nuc: obj.nuc,
                operation: obj.operation,
                percentValue: obj.percentValue,
                func: obj.func,
                max: step_max,
                min: step_min,
                step: step,
                histogramFlag: true,
                name: obj.selnuc + " frequency",
                data: contents,
                id: id
            };
            response.writeHead(200, {
                'content-type': 'application/json'
            });
            response.end(JSON.stringify(serie));
        }

    });
});

app.get('/getXdisplay', function (request, response){
    console.log("requesthandler: Request handler 'getXdisplay' was called");

    var reqQuery = url.parse(request.url).query;
    var obj = queryString.parse(reqQuery);

    var maxminQuery;

    if (obj.rnaType == "orna") {
        maxminQuery = 'select max( ' + obj.selnuc + ') as max, min( ' + obj.selnuc + ' ) as min from rnaseq where ' + obj.nuc + ' ' + obj.operation + ' ' + obj.percentValue +
            ' and seq_id in ( select orna_seq_id from orna where ' + obj.propertyType + '="' + obj.propertyName + '")';
    } else if (obj.rnaType == "srna") {
        maxminQuery = 'select max( ' + obj.selnuc + ') as max, min( ' + obj.selnuc + ' ) as min from rnaseq where ' + obj.nuc + ' ' + obj.operation + ' ' + obj.percentValue + ' and seq_id in ( select srna_seq_id from srna where srna_orna_id in (select orna_id from orna where ' + obj.propertyType + '="' + obj.propertyName + '"))';
    } else {}

    var step = parseFloat(obj.stepSize);

    var serie, step_max = 0,
        step_min = 0;

    var contents = [];

    connection.query(maxminQuery, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        step_max = rows[0].max;
        step_min = rows[0].min;

        var xstring = [];

        for (var i = step_min; i < (step_max + step); i += step) {
            xstring.push(parseFloat(i.toFixed(2)) + '-' + parseFloat((i + step).toFixed(2)));
        }

        response.writeHead(200, {
            'content-type': 'application/json'
        });

        response.end(JSON.stringify(xstring));
    });

});


// Grapher functions end.

app.listen(3000);

console.log('Server running at http://localhost:3000/');