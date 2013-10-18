function hittinDatDbUp(){
var mysql = require('mysql');
var connection = mysql.createConnection({
       user: 'csteam',
       password: 'rnadb',
       host: 'bioce32502.biology.gatech.edu',
       port: '3306',
       database: 'urss2',
});

connection.connect();
}