var fs = require("fs");
var url = require("url");
var queryString = require("querystring");
var mysql = require("mysql");
var util = require("util");
// dynamic graph
var rowCounter = 101;

//zt : solve timeout issue

function handleDisconnect(myconnection) {
    myconnection.on('error', function(err) {

        console.log('\nRe-connecting lost connection: ' + err.stack);
        connection.destroy();

        connection = mysql.createConnection(connection.config);
        handleDisconnect(connection);
        connection.connect();

    });
}

var connection = mysql.createConnection({
    host: 'bioce32502.biology.gatech.edu', //host url
    //mysql port
    port: '3306', //put port number
    user: 'root', //put username,
    password: 'urss', //put password
    database: 'urss', // database name 
});

// to handle mysql disconnect
handleDisconnect(connection);
connection.connect()

function elbaVisualization(response, request) {
    console.log("requesthandler: Request handler 'elbaVisualization' was called");

    fs.readFile('elbaVisualization.html', function(error, data) {
        response.writeHead(200, {
            'content-type': 'text/html'
        });
        response.end(data);
    });
}

function getPropertyName(response, request) {
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
}

function getColumnData(response, request) {
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
        var id = obj.nuc + '.' + obj.operation + '.' + obj.percentValue + '.' + obj.propertyType + '.' + obj.propertyName;
        var serie = {
            name: obj.selnuc,
            data: contents,
            id: id
        };
        response.writeHead(200, {
            'content-type': 'application/json'
        });
        response.end(JSON.stringify(serie));

    });
}

function getStepFreq(response, request) {
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
            var id = obj.nuc + '.' + obj.operation + '.' + obj.percentValue + '.' + obj.propertyType + '.' + obj.propertyName;
            serie = {
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
}


function serveFileJS(response, request) {
    console.log("requesthandler: Request handler 'serveFileJS' was called");

    var pathname = url.parse(request.url).pathname;
    // remove the first forward slash and read file
    fs.readFile(pathname.substring(1, pathname.length), function(error, data) {
        response.writeHead(200, {
            'content-type': 'text/javascript'
        });
        response.end(data);
    });
}

function serveFileCSS(response, request) {
    console.log("requesthandler: Request handler 'serveFileCSS' was called");

    var pathname = url.parse(request.url).pathname;
    fs.readFile(pathname.substring(1, pathname.length), function(error, data) {
        response.writeHead(200, {
            'content-type': 'text/css'
        });
        response.end(data);
    });
}

function serveFileImage(response, request) {
    console.log("requesthandler: Request handler 'serveFileImage' was called");

    // list of supported image types
    var imageTypeMimeMap = new Object();
    imageTypeMimeMap.png = "image/png";
    imageTypeMimeMap.jpg = "image/jpeg";
    imageTypeMimeMap.jpeg = "image/jpeg";

    var pathname = url.parse(request.url).pathname;
    var filetype = pathname.substring(pathname.lastIndexOf(".") + 1, pathname.length);
    console.log(filetype);
    console.log(imageTypeMimeMap[filetype]);
    console.log(pathname);
    fs.stat("." + pathname, function(err, stat) {
        console.log(stat);
        response.writeHead(200, {
            'content-type': imageTypeMimeMap[filetype],
            'content-length': stat.size
        });

        var rs = fs.createReadStream("." + pathname);
        console.log(rs);
        util.pump(rs, response, function(err) {
            if (err) {
                console.log(err);
                throw err;
            }
        });
    });
}

exports.elbaVisualization = elbaVisualization;
exports.getColumnData = getColumnData;
exports.getStepFreq = getStepFreq;
exports.getPropertyName = getPropertyName;
exports.serveFileJS = serveFileJS;
exports.serveFileCSS = serveFileCSS;
exports.serveFileImage = serveFileImage;