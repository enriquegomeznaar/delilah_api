const mysql = require("mysql");/*dependencias*/
var con = mysql.createConnection({
  host: "127.0.0.1",/*LOCALHOST siempre es 127.0.0.1*/
  user: "root",/*usuario*/
  password: "",
  database: "delilah"/*tu base de datos*/
});