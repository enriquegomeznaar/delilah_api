const express = require("express");/*dependencias*/
const bodyParser = require("body-parser");/*dependencias*/

const app =  express();

const jwt = require("jsonwebtoken");

const port = 8000;
const puerto = 3000;


app.use(bodyParser.urlencoded({extended:true}))

app.listen(puerto,() => {
	console.log("Live on port "+puerto);
})

require("./app/routes")(app)
