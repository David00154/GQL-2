const mysql = require('mysql');

var connection = mysql.createConnection({
   // host     : 'localhost',
   host: 'b3iys1pqgas1f9pc9khr-mysql.services.clever-cloud.com',
   // user     : 'david00154',
   user: 'uee21zva2ajabcab',
   // password : '00154abs',
   password: 'mOxW2iz0Cm58LwgSKFwt',
   // database : 'binterestDB'
   database: 'b3iys1pqgas1f9pc9khr'
 });
  
 connection.connect();

 module.exports = {
    connection
  }