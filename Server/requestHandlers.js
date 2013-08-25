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
function handleDisconnect(myconnection){
	myconnection.on('error', function(err){

	    console.log('\nRe-connecting lost connection: ' +err.stack);
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
    user: 'root',//put username,
    password: 'urss', //put password
    database: 'urss',// database name 
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

function getExptId(response, request) {
    console.log("requesthandler: Request handler 'getExptId' was called");

    var query = 'select experimentid,name ' + 'from ' + 'experiment';
    var contents = [];

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        rows.forEach(function(elem) {
            var object = new Object();
            object.experimentid = elem.experimentid;
            object.name = elem.name;
            contents.push(object);
        });

        response.writeHead(200, {
            'content-type': 'application/json'
        });
        response.end(JSON.stringify(contents));
    });

}

function getExptItr(response, request) {
    console.log("requesthandler: Request handler 'getExptItr' was called");

    var data = url.parse(request.url).query;
    var query = 'select iterationid ' + 'from ' + 'experimentiteration ' + 'where ' + 'experimentid="' + data + '"';
    var contents = [];

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        rows.forEach(function(elem) {
            contents.push(elem.iterationid);
        });

        response.writeHead(200, {
            'content-type': 'application/json'
        });
        response.end(JSON.stringify(contents));
    });
}

function getNodeId(response, request) {
    console.log("requesthandler: Request handler 'getNodeId' was called");

    var data = url.parse(request.url).query;
    var query = 'select id,name ' + 'from ' + 'experimentnode ' + 'where ' + 'experimentid="' + data + '"';
    var contents = [];

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        rows.forEach(function(elem) {
            var object = new Object();
            object.id = elem.id;
            object.name = elem.name;
            contents.push(object);
        });

        response.writeHead(200, {
            'content-type': 'application/json'
        });
        response.end(JSON.stringify(contents));
    });
}

function getResourceName(response, request) {
    console.log("requesthandler: Request handler 'getResourceName' was called");

    var reqQuery = url.parse(request.url).query;
    var obj = queryString.parse(reqQuery);
    var query = 'select resourcename ' + 'from ' + 'dictionary ' + 'where ' + 'experimentid="' + obj.exptID + '" and iterationid=' + obj.exptITR + ' and nodeid=' + obj.nodeID;
    var contents = [];

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        rows.forEach(function(elem) {
            contents.push(elem.resourcename);
        });

        response.writeHead(200, {
            'content-type': 'application/json'
        });
        response.end(JSON.stringify(contents));
    });
}

function getColumnName(response, request) {
    console.log("requesthandler: Request handler 'getColumnName' was called");

    var reqQuery = url.parse(request.url).query;
    var obj = queryString.parse(reqQuery);
    var query = 'select tablename,dictionaryid ' + 'from ' + 'dictionary ' + 'where ' + 'experimentid="' + obj.exptID + '" and iterationid=' + obj.exptITR + ' and nodeid=' + obj.nodeID + ' and resourcename="' + obj.resourceName + '"';

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        query = 'desc ' + rows[0].tablename;
        connection.query(query, function(err, rows1, fields) {
            if (err) {
                console.log(err.code);
                throw err;
            }

            var i = 0;
            var contents = [];
            rows1.forEach(function(elem) {
                i++;
                if (i == 1 || i == 2) {
                    return true;
                }
                contents.push(elem.Field);
            });

            response.writeHead(200, {
                'content-type': 'application/json'
            });
            response.end(JSON.stringify(contents));

        });
    });

}

function getColumnData(response, request) {
    console.log("requesthandler: Request handler 'getColumnData' was called");

    var reqQuery = url.parse(request.url).query;
    var obj = queryString.parse(reqQuery);
    var query = 'select tablename,dictionaryid ' + 'from ' + 'dictionary ' + 'where ' + 'experimentid="' + obj.exptID + '" and iterationid=' + obj.exptITR + ' and nodeid=' + obj.nodeID + ' and resourcename="' + obj.resourceName + '"';
    var colName = obj.columnName;
    var lower = obj.lower;
    var upper = obj.upper;
    var funcs = obj.func;
    var cumm = obj.cumm;
    var cumm_sum = 0;

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        query = 'select ' + colName + ' from ' + rows[0].tablename + ' where ' + 'dictionaryid=' + rows[0].dictionaryid + ' and id between ' + lower + ' and ' + upper + ' order by id';
        connection.query(query, function(err, rows1, fields) {
            if (err) {
                console.log(err);
                throw err;
            }

            var contents = [];
            rows1.forEach(function(elem) {
                for (var key in elem) {
                    if (key == colName) {

                        //Added for function functionality
                        var funcs_eq = funcs.replace("x", elem[key]);

                        try {

                            if (cumm == 1) {
                                cumm_sum += eval(funcs_eq);
                                contents.push(cumm_sum);
                            } else {
                                contents.push(eval(funcs_eq));
                            }
                        } catch (e) {
                            if (e instanceof SyntaxError) {
                                console.log("Syntax Error for input function");
                            }
                        }

                    }
                }
            });

            // Add id to serie to distinguish each serie for further remove
            var id = obj.exptID + '.' + obj.exptITR + '.' + obj.nodeID + '.' + obj.resourceName + '.' + colName;
            var serie = {
                name: colName,
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

function getColumnDataForNodeAvg(response, request) {
    console.log("requesthandler: Request handler 'getColumnDataForNodeAvg' was called");

    var reqQuery = url.parse(request.url).query;
    var obj = queryString.parse(reqQuery);
    var colName = obj.columnName;
    var query = 'select tablename,dictionaryid ' + 'from ' + 'dictionary ' + 'where ' + 'experimentid="' + obj.exptID + '" and iterationid=' + obj.exptITR + ' and nodeid=' + obj.nodeID + ' and resourcename="' + obj.resourceName + '"';

    var readonly = obj.readonly;

    connection.query(
    query,

    function(err, rows, fields) {
        if (err) {
            console.log(err);
            throw err;
        }

        query = 'select avg(x.' + colName + ') ' + 'from ' + rows[0].tablename + ' x, ' + 'elba.dictionary y ' + 'where ' + 'y.nodeid = ' + obj.nodeID + ' ' + 'and y.resourcename = "' + obj.resourceName + '" ' + 'and y.experimentid = "' + obj.exptID + '" ' + 'and x.dictionaryid = y.dictionaryid group by y.dictionaryid order by y.iterationid';
        console.log("query: " + query);
        connection.query(query, function(err, rows1, fields) {
            if (err) {
                console.log(err);
                throw err;
            }

            var contents = [];
            var key = "avg(x." + colName + ")";
            rows1.forEach(function(elem) {
                contents.push(elem[key]);
            });

            var serie = {
                name: 'avg(' + colName + ')',
                data: contents
            };

            response.writeHead(200, {
                'content-type': 'application/json'
            });
            response.end(JSON.stringify(serie));
        });
    });
}

function getXdisplay(response, request) {

    console.log("requesthandler: Request handler 'getXdisplay' was called");

    var reqQuery = url.parse(request.url).query;
    var obj = queryString.parse(reqQuery);
    var query = 'select tablename,dictionaryid from dictionary where experimentid="' + obj.exptID + '" and iterationid=' + obj.exptITR + ' and nodeid=' + obj.nodeID + ' and resourcename="' + obj.resourceName + '"';
    var colName = obj.columnName;
    var lower = obj.lower;
    var upper = obj.upper;
    var funcs = obj.func;
    var step = parseFloat(obj.step);

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        query = 'SELECT max(' + colName + ') as max, min(' + colName + ') as min FROM ' + rows[0].tablename + ' WHERE dictionaryid =  ' + rows[0].dictionaryid + ' and id between ' + lower + ' and ' + upper;

        connection.query(query, function(err, step_rows, fields) {
            if (err) {
                console.log(err);
                throw err;
            }

            var step_max = 0 | step_rows[0].max;
            var step_min = 0 | step_rows[0].min;

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

}

function getStepFreq(response, request) {

    console.log("requesthandler: Request handler 'getStepFreq' was called");

    var reqQuery = url.parse(request.url).query;
    var obj = queryString.parse(reqQuery);
    var query = 'select tablename,dictionaryid from dictionary where experimentid="' + obj.exptID + '" and iterationid=' + obj.exptITR + ' and nodeid=' + obj.nodeID + ' and resourcename="' + obj.resourceName + '"';
    var colName = obj.columnName;
    var lower = obj.lower;
    var upper = obj.upper;
    var funcs = obj.func;
    var step = parseFloat(obj.step);

    var serie;

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        query = 'SELECT max(' + colName + ') as max, min(' + colName + ') as min FROM ' + rows[0].tablename + ' WHERE dictionaryid =  ' + rows[0].dictionaryid + ' and id between ' + lower + ' and ' + upper;

        connection.query(query, function(err, step_rows, fields) {
            if (err) {
                console.log(err);
                throw err;
            }

            var step_max = 0 | step_rows[0].max;
            var step_min = 0 | step_rows[0].min;

            var contents = [];

            var lock = 0;

            for (var i = step_min; i < (step_max + step); i += step) {
                lock++;
            }

            for (var i = step_min; i < (step_max + step); i += step) {
                query = 'select count(' + colName + ') as num_count from ' + rows[0].tablename + ' where ' + 'dictionaryid=' + rows[0].dictionaryid + ' and ' + colName + ' >= ' + i + ' and ' + colName + ' < ' + (i + step) + ' and id between ' + lower + ' and ' + upper;

                // console.log("query:"+ query);

                connection.query(query, function(err, rows1, fields) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }

                    try {
                        // console.log("$$$$$$$$$$$$$$$ pushed : " + rows1[0].num_count);
                        contents.push(parseInt(rows1[0].num_count));
                        // console.log('contents : ' + contents + '\n');

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


                // console.log("##################### " + query + "\n");

                // console.log('contents : ' + contents + '\n');


                var id = obj.exptID + '.' + obj.exptITR + '.' + obj.nodeID + '.' + obj.resourceName + '.' + colName;
                serie = {
                    name: colName + "frequency",
                    data: contents,
                    id: id
                };

                // console.log("--------------------\n " + step_max + "\n" + step_min + "\n------------------------\n");

                response.writeHead(200, {
                    'content-type': 'application/json'
                });

                response.end(JSON.stringify(serie));

            }

        });

    });

}

function getStepPlot(response, request) {

    console.log("requesthandler: Request handler 'getStepPlot' was called");

    var reqQuery = url.parse(request.url).query;
    var obj = queryString.parse(reqQuery);
    var query = 'select tablename,dictionaryid from dictionary where experimentid="' + obj.exptID + '" and iterationid=' + obj.exptITR + ' and nodeid=' + obj.nodeID + ' and resourcename="' + obj.resourceName + '"';
    var colName = obj.columnName;
    var lower = obj.lower;
    var upper = obj.upper;
    var funcs = obj.func;
    var step = parseFloat(obj.step);

    var serie;

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        query = 'SELECT max(' + colName + ') as max, min(' + colName + ') as min FROM ' + rows[0].tablename + ' WHERE dictionaryid =  ' + rows[0].dictionaryid + ' and id between ' + lower + ' and ' + upper;

        connection.query(query, function(err, step_rows, fields) {
            if (err) {
                console.log(err);
                throw err;
            }

            var step_max = 0 | step_rows[0].max;
            var step_min = 0 | step_rows[0].min;

            var contents = [];

            var lock = 0;

            var j = 0,
                k = 0;

            for (var i = step_min; i < (step_max + step); i += step) {
                lock++;
            }

            for (var i = step_min; i < (step_max + step); i += step) {
                query = 'select ' + colName + ' from ' + rows[0].tablename + ' where dictionaryid=' + rows[0].dictionaryid + ' and ' + colName + ' >= ' + i + ' and ' + colName + ' < ' + (i + step) + ' and id between ' + lower + ' and ' + upper + ' order by id';

                // console.log("query:"+ query);

                connection.query(query, function(err, rows1, fields) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }

                    rows1.forEach(function(elem) {
                        for (var key in elem) {
                            if (key == colName) {

                                try {
                                    contents[k] = [];
                                    contents[k][0] = j;

                                    contents[k][1] = elem[key];

                                    k++;

                                    //   contents.push(elem[key]);
                                } catch (e) {
                                    if (e instanceof SyntaxError) {
                                        console.log("Syntax Error for input function");
                                    }
                                }

                            }
                        }
                    });

                    lock--;

                    j++;

                    if (lock == 0) {
                        queryDone();
                    }

                });

            }

            function queryDone() {


                // console.log("##################### " + query + "\n");

                // console.log('contents : ' + contents + '\n');


                var id = obj.exptID + '.' + obj.exptITR + '.' + obj.nodeID + '.' + obj.resourceName + '.' + colName;
                serie = {
                    name: colName,
                    data: contents,
                    id: id
                };

                // console.log("--------------------\n " + step_max + "\n" + step_min + "\n------------------------\n");

                response.writeHead(200, {
                    'content-type': 'application/json'
                });

                response.end(JSON.stringify(serie));

            }

        });

    });

}

function getDynamicData(response, request) {
    console.log("requesthandler: Request handler 'getColumnData' was called");

    var reqQuery = url.parse(request.url).query;
    var obj = queryString.parse(reqQuery);
    var query = 'select tablename,dictionaryid ' + 'from ' + 'dictionary ' + 'where ' + 'experimentid="' + obj.exptID + '" and iterationid=' + obj.exptITR + ' and nodeid=' + obj.nodeID + ' and resourcename="' + obj.resourceName + '"';
    var colName = obj.columnName;

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        // dynamic graph - start
        // handle if no rows returned
        if (rows[0] === undefined) {
            console.log("requestHandler: rows empty");
            return;
        }

        query = 'select ' + colName + ' from ' + rows[0].tablename + ' where dictionaryid=' + rows[0].dictionaryid + ' order by id'; // + ' limit 100';
        //zt
        console.log(query);
        query += ((obj.onlyOne === 'true') ? (' and id=' + rowCounter++) : (' limit 100'));
        // dynamic graph - end
        connection.query(query, function(err, rows1, fields) {
            if (err) {
                console.log(err);
                throw err;
            }

            var contents = [];
            rows1.forEach(function(elem) {
                for (var key in elem) {
                    if (key == colName) {
                        contents.push(elem[key]);
                    }
                }
            });

            var serie = {
                name: colName,
                data: contents
            };

            response.writeHead(200, {
                'content-type': 'application/json'
            });
            response.end(JSON.stringify(serie));
        });
    });

}

//get upper value for selected experiment, iteration, node, resource and serie 

function getUpper(response, request) {
    console.log("requesthandler: Request handler 'getUpper' was called");

    var reqQuery = url.parse(request.url).query;
    var obj = queryString.parse(reqQuery);
    var query = 'select tablename,dictionaryid ' + 'from ' + 'dictionary ' + 'where ' + 'experimentid="' + obj.exptID + '" and iterationid=' + obj.exptITR + ' and nodeid=' + obj.nodeID + ' and resourcename="' + obj.resourceName + '"';

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        query = 'select id from ' + rows[0].tablename + ' where ' + 'dictionaryid=' + rows[0].dictionaryid + ' order by id DESC LIMIT 1';
        connection.query(query, function(err, rows1, fields) {
            if (err) {
                console.log(err);
                throw err;
            }

            var upper = 0;
            rows1.forEach(function(elem) {
                upper = elem.id;
            });

            response.writeHead(200, {
                'content-type': 'application/json'
            });
            response.end(JSON.stringify(upper));
        });
    });

}

//get lower value for selected experiment, iteration, node, resource and serie 

function getLower(response, request) {
    console.log("requesthandler: Request handler 'getLower' was called");

    var reqQuery = url.parse(request.url).query;
    var obj = queryString.parse(reqQuery);
    var query = 'select tablename,dictionaryid ' + 'from ' + 'dictionary ' + 'where ' + 'experimentid="' + obj.exptID + '" and iterationid=' + obj.exptITR + ' and nodeid=' + obj.nodeID + ' and resourcename="' + obj.resourceName + '"';

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.code);
            throw err;
        }

        query = 'select id from ' + rows[0].tablename + ' where ' + 'dictionaryid=' + rows[0].dictionaryid + ' order by id ASC LIMIT 1';
        connection.query(query, function(err, rows1, fields) {
            if (err) {
                console.log(err);
                throw err;
            }

            var lower = 0;
            rows1.forEach(function(elem) {
                lower = elem.id;
            });

            response.writeHead(200, {
                'content-type': 'application/json'
            });
            response.end(JSON.stringify(lower));
        });
    });

}

//

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
    console.log("Lower1: "+ lower1);
    console.log("Upper1: "+ upper1);

    var query2 = 'select tablename,dictionaryid ' + 'from ' + 'dictionary ' + 'where ' + 'experimentid="' + obj.exptID + '" and iterationid=' + obj.exptITR + ' and nodeid=' + obj.nodeID + ' and resourcename="' + obj.resourceName + '"';
    //zt
    console.log(query2);
    var colName2 = obj.columnName;
    var lower2 = obj.lower;
    var upper2 = obj.upper;
    //zt
    console.log("Lower2: "+ lower2);
    console.log("Upper2: "+ upper2);
    
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
exports.getExptId = getExptId;
exports.getExptItr = getExptItr;
exports.getNodeId = getNodeId;
exports.getResourceName = getResourceName;
exports.getColumnName = getColumnName;
exports.getColumnData = getColumnData;
exports.getColumnDataCorr = getColumnDataCorr;
exports.getStepFreq = getStepFreq;
exports.getStepPlot = getStepPlot;
exports.getXdisplay = getXdisplay;
exports.getUpper = getUpper;
exports.getLower = getLower;
exports.getColumnDataForNodeAvg = getColumnDataForNodeAvg;
exports.getDynamicData = getDynamicData;
exports.serveFileJS = serveFileJS;
exports.serveFileCSS = serveFileCSS;
exports.serveFileImage = serveFileImage;