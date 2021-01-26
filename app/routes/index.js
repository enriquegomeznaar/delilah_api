const noteRoutes = require("./note_routes");
module.exports = function(app,con){
	noteRoutes(app,con);
}