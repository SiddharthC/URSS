var fs = require("fs");
var url = require("url");
var queryString = require("querystring");
var mysql = require("mysql");
var util = require("util");
// dynamic graph
var rowCounter = 101;

// to handle mysql disconnect
// it has the timeout problem
/**
function handleDisconnect(connection) {
    connection.on('error', function(err) {
        if (!err.fatal) {
            return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            throw err;
        }

        console.log('Re-connecting lost connection: ' + err.stack);

        connection = mysql.createConnection(connection.config);
        handleDisconnect(connection);
        connection.connect();
    });
}
*/

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

// function getExptId(response, request) {
//     console.log("requesthandler: Request handler 'getExptId' was called");

//     var query = 'select experimentid,name ' + 'from ' + 'experiment';
//     var contents = [];

//     connection.query(query, function(err, rows, fields) {
//         if (err) {
//             console.log(err.code);
//             throw err;
//         }

//         rows.forEach(function(elem) {
//             var object = new Object();
//             object.experimentid = elem.experimentid;
//             object.name = elem.name;
//             contents.push(object);
//         });

//         response.writeHead(200, {
//             'content-type': 'application/json'
//         });
//         response.end(JSON.stringify(contents));
//     });

// }

// function getExptItr(response, request) {
//     console.log("requesthandler: Request handler 'getExptItr' was called");

//     var data = url.parse(request.url).query;
//     var query = 'select iterationid ' + 'from ' + 'experimentiteration ' + 'where ' + 'experimentid="' + data + '"';
//     var contents = [];

//     connection.query(query, function(err, rows, fields) {
//         if (err) {
//             console.log(err.code);
//             throw err;
//         }

//         rows.forEach(function(elem) {
//             contents.push(elem.iterationid);
//         });

//         response.writeHead(200, {
//             'content-type': 'application/json'
//         });
//         response.end(JSON.stringify(contents));
//     });
// }

// function getNodeId(response, request) {
//     console.log("requesthandler: Request handler 'getNodeId' was called");

//     var data = url.parse(request.url).query;
//     var query = 'select id,name ' + 'from ' + 'experimentnode ' + 'where ' + 'experimentid="' + data + '"';
//     var contents = [];

//     connection.query(query, function(err, rows, fields) {
//         if (err) {
//             console.log(err.code);
//             throw err;
//         }

//         rows.forEach(function(elem) {
//             var object = new Object();
//             object.id = elem.id;
//             object.name = elem.name;
//             contents.push(object);
//         });

//         response.writeHead(200, {
//             'content-type': 'application/json'
//         });
//         response.end(JSON.stringify(contents));
//     });
// }

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

    if(obj.rnaType == "orna"){
        var query = 'select ' + obj.selnuc + ' as ColData from rnaseq where ' + obj.nuc + ' ' + obj.operation + ' ' + obj.percentValue +
                    ' and seq_id in ( select orna_seq_id from orna where ' + obj.propertyType + '="' + obj.propertyName + '")';
    }
    else if (obj.rnaType == "srna"){

      //  console.log("in srna section");
        var query = 'select ' + obj.selnuc + ' as ColData from rnaseq where ' + obj.nuc + ' ' + obj.operation + ' ' + obj.percentValue +
                    ' and seq_id in ( select srna_seq_id from srna where srna_orna_id in (select orna_id from orna where ' 
                        + obj.propertyType + '="' + obj.propertyName + '"))';   
    }
    else{

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

    seqQuery ='select orna_seq_id as SeqIds from orna where ' + obj.propertyType + '="' + obj.propertyName + '"';

    var seqIds = [];

    connection.query(seqQuery, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        rows.forEach(function(elem) {
            try {
        //        console.log(eval(funcs_eq));
                seqIds.push(elem.SeqIds);
            } catch (e) {
                if (e instanceof SyntaxError) {
                    console.log("Syntax Error for input function");
                }
            }

            //console.log("Value of elem.A is "+ elem.A);
        });

    maxminQuery = 'select max(obj.selnuc) as max, min(obj.selnuc) as min from rnaseq where ' + obj.nuc + ' ' + obj.operation + ' ' 
                    + obj.percentValue + ' and seq_id in ( ' + seqIds + ')'


    var max=0, min=0;

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

        var usedStep = if(parseFloat(obj.stepSize) > 0.05)?parseFloat(obj.stepSize):0.05;

        resolution++ = (max - min)/usedStep;

        var stepmin = min;

        var contents = [];

        for(var i; i<resolution; i++){

            var query = 'select count(' + obj.selnuc + ') as Count from rnaseq where '+ obj.selnuc +' >= '+ stepmin + ' and '+ obj.selnuc +' < '+(stepmin+usedStep)+' and ' + obj.nuc + ' ' + obj.operation + ' ' + obj.percentValue +
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

function getColumnDataCorr(response, request) {
    console.log("requesthandler: Request handler 'getColumnDataCorr' was called");

    var reqQuery = url.parse(request.url).query;
    var obj = queryString.parse(reqQuery);

    var query1 = 'select tablename,dictionaryid ' + 'from ' + 'dictionary ' + 'where ' + 'experimentid="' + obj.x_exptID + '" and iterationid=' + obj.x_exptITR + ' and nodeid=' + obj.x_nodeID + ' and resourcename="' + obj.x_resName + '"';
    //zt
    console.log(query1);
    var colName1 = obj.x_colName;
    var lower1 = obj.x_lower;
    var upper1 = obj.x_upper;
    //zt
    console.log("Lower1: " + lower1);
    console.log("Upper1: " + upper1);

    var query2 = 'select tablename,dictionaryid ' + 'from ' + 'dictionary ' + 'where ' + 'experimentid="' + obj.exptID + '" and iterationid=' + obj.exptITR + ' and nodeid=' + obj.nodeID + ' and resourcename="' + obj.resourceName + '"';
    //zt
    console.log(query2);
    var colName2 = obj.columnName;
    var lower2 = obj.lower;
    var upper2 = obj.upper;
    //zt
    console.log("Lower2: " + lower2);
    console.log("Upper2: " + upper2);

    var funcs = obj.func;

    connection.query(
        query1,

        function(err, xrows, fields) {
            if (err) {
                console.log(err.code);
                throw err;
            }

            connection.query(
                query2,

                function(err, yrows, fields) {
                    if (err) {
                        console.log(err.code);
                        throw err;
                    }

                    query1 = 'select ' + colName1 + ' from ' + xrows[0].tablename + ' where ' + 'dictionaryid=' + xrows[0].dictionaryid + ' and id between ' + lower1 + ' and ' + upper1 + ' order by id';
                    connection.query(
                        query1,

                        function(err, xrows1, fields) {
                            if (err) {
                                console.log(err);
                                throw err;
                            }

                            query2 = 'select ' + colName2 + ' from ' + yrows[0].tablename + ' where ' + 'dictionaryid=' + yrows[0].dictionaryid + ' and id between ' + lower2 + ' and ' + upper2 + ' order by id';
                            connection.query(
                                query2,

                                function(
                                    err, yrows1, fields) {
                                    if (err) {
                                        console.log(err);
                                        throw err;
                                    }

                                    var contents = [];

                                    var i, j, key1, key2;

                                    for (
                                        i = lower1, j = lower2; i < upper1; i++, j++) {

                                        for (key1 in xrows1[i]) {

                                            for (key2 in yrows1[j]) {

                                                console.log("Entered...");
                                                if (key1 == colName1 && key2 == colName2) {
                                                    console.log("Even more...");
                                                    var funcs_eq = funcs.replace("x", xrows1[i][key1]);
                                                    var funcs_new = funcs_eq.replace("y", yrows1[j][key2]);

                                                    console.log('funcs_new ' + funcs_new);

                                                    try {
                                                        contents.push(eval(funcs_new));
                                                    } catch (e) {
                                                        if (e instanceof SyntaxError) {
                                                            console.log("Syntax Error for input function");
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    var serie = {
                                        name: colName1 + " w.r.t. " + colName2,
                                        data: contents
                                    };

                                    response.writeHead(
                                        200, {
                                            'content-type': 'application/json'
                                        });
                                    response.end(JSON.stringify(serie));

                                });
                        });
                });
        });

}

exports.elbaVisualization = elbaVisualization;
// exports.getExptId = getExptId;
// exports.getExptItr = getExptItr;
// exports.getNodeId = getNodeId;
// exports.getResourceName = getResourceName;
// exports.getColumnName = getColumnName;
exports.getColumnData = getColumnData;
exports.getStepFreq = getStepFreq;
// exports.getColumnDataCorr = getColumnDataCorr;
// exports.getStepFreq = getStepFreq;
// exports.getStepPlot = getStepPlot;
// exports.getXdisplay = getXdisplay;
// exports.getUpper = getUpper;
// exports.getLower = getLower;
// exports.getColumnDataForNodeAvg = getColumnDataForNodeAvg;
exports.getPropertyName = getPropertyName;
// exports.getDynamicData = getDynamicData;
exports.serveFileJS = serveFileJS;
exports.serveFileCSS = serveFileCSS;
exports.serveFileImage = serveFileImage;