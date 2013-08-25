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

    var data = url.parse(request.url).query;
    var obj = queryString.parse(data);

    seqQuery = 'select orna_seq_id as SeqIds from orna where ' + obj.propertyType + '="' + obj.propertyName + '"';

    var seqIds = [];

    connection.query(seqQuery, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        rows.forEach(function(elem) {
            try {
                seqIds.push(elem.SeqIds);
            } catch (e) {
                if (e instanceof SyntaxError) {
                    console.log("Syntax Error for input function");
                }
            }
        });

        maxminQuery = 'select max( ' + obj.selnuc + ') as max, min( ' + obj.selnuc + ' ) as min from rnaseq where ' + obj.nuc + ' ' + obj.operation + ' ' + obj.percentValue + ' and seq_id in ( ' + seqIds + ')';


        var max = 0,
            min = 0;

        connection.query(maxminQuery, function(err, rows, fields) {
            if (err) {
                console.log(err.code);
                throw err;
            }

            rows.forEach(function(elem) {
                try {
                    //        console.log(eval(funcs_eq));
                    max = elem.max;
                    min = elem.min;
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        console.log("Syntax Error for input function");
                    }
                }

                //console.log("Value of elem.A is "+ elem.A);
            });

            var resolution = 1;

            var usedStep = (parseFloat(obj.stepSize) > 0.05) ? parseFloat(obj.stepSize) : 0.05;

            resolution++ = (max - min) / usedStep;

            var stepmin = min;

            var contents = [];

            for (var i; i < resolution; i++) {

                var query = 'select count(' + obj.selnuc + ') as Count from rnaseq where ' + obj.selnuc + ' >= ' + stepmin + ' and ' + obj.selnuc + ' < ' + (stepmin + usedStep) + ' and ' + obj.nuc + ' ' + obj.operation + ' ' + obj.percentValue +
                    ' and seq_id in ( ' + seqIds + ')';

                connection.query(query, function(err, rows, fields) {
                    if (err) {
                        console.log(err.code);
                        throw err;
                    }

                    rows.forEach(function(elem) {
                        try {
                            //        console.log(eval(funcs_eq));
                            contents.push(elem.Count);
                        } catch (e) {
                            if (e instanceof SyntaxError) {
                                console.log("Syntax Error for input function");
                            }
                        }

                        //console.log("Value of elem.A is "+ elem.A);
                    });

                    stepmin += usedStep;

                });

            }

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