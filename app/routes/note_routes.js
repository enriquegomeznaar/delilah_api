module.exports = function(app,con){
	const mysql = require("mysql");/*dependencias*/
	var con = mysql.createConnection({
	  host: "127.0.0.1",/*LOCALHOST siempre es 127.0.0.1*/
	  user: "root",/*usuario*/
	  password: "",
	  database: "delilah"/*tu base de datos*/
	});

	const bodyParser = require("body-parser");/*dependencias*/
	const jwt = require("jsonwebtoken")


	app.use(bodyParser.urlencoded({extended:true}))

	/*TRAER PEDIDOS*/
	app.get("/listOrder",(req,res)=>{
		if (typeof req.headers.auth != "undefined") {
			jwt.verify(req.headers.auth,"delilahdemo",(err,token)=>{
				rol = token.login.rol;
			})
		}
		else{
			res.sendStatus("404");
		}
		if (rol === "admin") {
			var query = "SELECT idpedido,metodo,hora,estado,pago,usuario,direccion,telefono,nombre,email  FROM pedidos INNER JOIN usuarios ON pedidos.iduser = usuarios.iduser"
			con.query(query,function(err,result,fields){
				res.send(result);
			});
		}
		else{
			res.sendStatus("403");
		}
	})
	app.get("/order",(req,res)=>{
		var idpedido = req.headers.idpedido;
		var pedido = [];
		var productos = [];
		

		if (typeof req.headers.auth != "undefined") {
			jwt.verify(req.headers.auth,"delilahdemo",(err,token)=>{
				rol = token.login.rol;
				iduser = token.login.iduser;
			})
		}
		else{
			res.sendStatus("404");
		}
		if (rol === "admin" || rol === "user") {
			var query = "SELECT pedidos.idpedido,pedidos.metodo,pedidos.hora,pedidos.estado,pedidos.pago,usuarios.direccion,usuarios.nombre FROM pedidos INNER JOIN usuarios ON usuarios.iduser = pedidos.iduser WHERE pedidos.idpedido = "+mysql.escape(idpedido)+" AND pedidos.iduser = "+mysql.escape(iduser)+" ORDER BY pedidos.idpedido LIMIT 1";
			con.query(query,function(err,result,fields){
				pedido.push("detalles",result);
				var stmt = "SELECT pedidos_list.cantidad, productos.nombre_producto,productos.precio FROM pedidos_list INNER JOIN productos ON productos.idproducto = pedidos_list.idproducto INNER JOIN pedidos ON pedidos.idpedido = pedidos_list.idpedido WHERE pedidos_list.idpedido = "+mysql.escape(idpedido)+" AND pedidos.iduser = "+mysql.escape(iduser);
				con.query(stmt,function(err,result,fields){
					pedido.push("productos",result);
					res.send(pedido);
				});
			});
		}
		else{
			res.sendStatus("403");
		}
	})
	/*CREAR pedido*/
	app.post("/order",(req,res)=>{
		var idpedido;
		var iduser;
		var rol;
		var pago;
		var metodo;
		if (typeof req.body.auth != "undefined") {
			jwt.verify(req.body.auth,"delilahdemo",(err,token)=>{
				iduser = token.login.iduser;
				rol = token.login.rol;
				pago = req.body.pago;
				metodo = req.body.metodo;
			})
		}
		else{
			res.sendStatus("404");
		}

		var sql =  "INSERT INTO pedidos (iduser,estado,pago,metodo) VALUE ("+mysql.escape(iduser)+",'nuevo',"+mysql.escape(pago)+","+mysql.escape(metodo)+")";
	
		con.query(sql, function (err, result, fields) {
		/*YA INSERTO EL pedido*/
		});
			var stmt = "SELECT * FROM pedidos ORDER BY idpedido DESC LIMIT 1";

		function getLastId(callback) {
			con.query(stmt, function (err, result, fields) {
			callback(null,result);
			});
		}
		var result;
		getLastId(function(err,data){
			if (err) {
				console.log(err)
			}
			if (data) {
				result = data;
				const array = req.body.list_quantity;



			req.body.list_product.forEach(function(value,key){
				var query = "INSERT INTO pedidos_list (idproducto,idpedido,cantidad) VALUE("+mysql.escape(value)+","+mysql.escape(result[0].idpedido)+","+mysql.escape(req.body.list_quantity[key])+")";
				con.query(query, function (err, result, fields) {
				if (err) throw err;
					});
				})
				res.sendStatus("200")
			}
		});	
	})
	/*Editar orden*/
	app.put("/order",(req,res)=>{
		var iduser;
		var rol;
		if (typeof req.body.auth !== "undefined") {
			jwt.verify(req.body.auth,"delilahdemo",(err,token)=>{
				iduser = token.login.iduser;
				rol = token.login.rol
			})
		}
		else{
			res.sendStatus("404");
		}
		if (rol === "admin") {
			var estado = req.body.estado;
			var idpedido = req.body.idpedido;
			var query = "UPDATE pedidos SET estado = "+mysql.escape(estado)+" WHERE idpedido ="+mysql.escape(idpedido);

			con.query(query,function(err,result,fields){
				res.sendStatus("200");
			})
		}
		else{
			res.sendStatus("403");
		}
	})
	/*Borrar orden*/

	app.delete("/order",(req,res)=>{
		if (typeof req.headers.auth !== "undefined") {
			jwt.verify(req.headers.auth,"delilahdemo",(err,token)=>{
				rol = token.login.rol;
			})
		}
		else{
			res.sendStatus("404");
		}
		if (rol === "admin") {
			var idpedido = req.headers.idpedido;
			var query = "DELETE FROM pedidos WHERE idpedido = "+mysql.escape(idpedido);
			con.query(query,function(err,result,fields){
				if(result.affectedRows == 0){
					res.sendStatus("500");
				}
			})
			var query = "DELETE FROM pedidos_list WHERE idpedido = "+mysql.escape(idpedido);
			con.query(query,function(err,result,fields){
			})
			res.sendStatus("200");

		}
		else{
			res.sendStatus("403");
		}
	})

	
	/*CLIENTES*/

	/*Registro de usuario*/
	app.post("/register",(req,res)=>{
		
		var usuario = req.body.usuario;
		var telefono = req.body.telefono;
		var password = req.body.password;
		var email = req.body.email;
		var nombre = req.body.nombre;
		var direccion = req.body.direccion;
		var admin = req.body.admin;

		var query =  "INSERT INTO usuarios (usuario,telefono,password,email,nombre,direccion,admin) VALUE ("+mysql.escape(usuario)+","+mysql.escape(telefono)+","+mysql.escape(password)+","+mysql.escape(email)+","+mysql.escape(nombre)+","+mysql.escape(direccion)+","+mysql.escape(admin)+")";

		con.query(query,function(err,result,fields){
		if (err)throw err;
			res.sendStatus("200");
		})
	})
	/*TRAER usuario*/
	app.get("/user",(req,res)=>{
		var rol;
		if (typeof req.headers.auth !== "undefined") {
			jwt.verify(req.headers.auth,"delilahdemo",(err,token)=>{
				rol = token.login.rol;
			})
		}
		else{
			res.sendStatus("404");
		}
		if (rol === "admin") {
			con.query("SELECT * FROM usuarios", function (err, result, fields) {
			if (err) throw err;
				res.send(result);
			});
		}
		else{
			res.sendStatus("403");
		}
	})
	/*Login usuario*/
	app.get("/login",(req,res) => {
		
		var usuario = req.headers.usuario;
		var password = req.headers.password;
		var sql =  "SELECT * FROM usuarios WHERE usuario = "+mysql.escape(usuario)+" AND password = "+mysql.escape(password)+"";

		con.query(sql, function (err, result, fields) {
		if (result.length == 0 ) res.sendStatus("500");
		else{
			var rol;
			if (result[0].admin == 1){
				rol = "admin";
			}
			else{
				rol = "user";
			}
				const login = {
					iduser: result[0].iduser,
					usuario: result[0].usuario,
					nombre:result[0].nombre,
					telefono: result[0].telefono,
					password: result[0].password,
					direccion: result[0].direccion,
					email: result[0].email,
					rol: rol
				}
				jwt.sign({login:login},"delilahdemo",(err,token)=>{
					res.json(token)
					
				})
			}
		});
	})
	/*TRAER lista producto*/
	app.get("/product",(req,res)=>{
		var rol;
		if (typeof req.headers.auth !== "undefined") {
			jwt.verify(req.headers.auth,"delilahdemo",(err,token)=>{
				rol = token.login.rol
			})
		}
		else{
			res.sendStatus("403");
		}
		if (rol === "admin" || rol === "user") {
			con.query("SELECT * FROM productos", function (err, result, fields) {
			if (err) throw err;
				res.send(result);
			});
		}
		else{
			res.sendStatus("404");
		}
	})


	/*INSERTAR PRODUCTO*/
	app.post("/product",(req,res) => {
		if (typeof req.body.auth !== "undefined") {

		}
		else{
			res.sendStatus("404");
		}
		jwt.verify(req.body.auth,"delilahdemo",(err,token)=>{
			if (token.login.rol != "admin") {
				res.sendStatus("403");
			}
			else{
				var nombre_producto = req.body.nombre_producto;
				var precio = req.body.precio;
				var descripcion = req.body.descripcion;

				var stmt = "INSERT INTO productos (nombre_producto,precio,descripcion) VALUE ("+mysql.escape(nombre_producto)+","+mysql.escape(precio)+","+mysql.escape(descripcion)+")";
				con.query(stmt,function (err,result,fields){
					res.sendStatus("200");
				})
			}
		})
		
	})
	/*UPDATE PRODUCTO*/
	app.put("/product",(req,res) => {
		if (typeof req.body.auth !== "undefined") {
		}

		else{
			res.sendStatus("404");
		}
		jwt.verify(req.body.auth,"delilahdemo",(err,token)=>{
			if (token.login.rol != "admin") {
				res.sendStatus("403");
			}
			else{

				var idProducto = req.body.idproducto;
				var nombre_producto = req.body.nombre_producto;
				var precio = req.body.precio;
				var descripcion = req.body.descripcion;

				var stmt = "UPDATE productos SET nombre_producto = "+mysql.escape(nombre_producto)+", precio ="+mysql.escape(precio)+",descripcion ="+mysql.escape(descripcion)+" WHERE idProducto = "+mysql.escape(idProducto);
				con.query(stmt,function (err,result,fields){
					res.sendStatus("200");
				})
			}
		})
	})
	/*ELIMINAR PRODUCTO*/
	app.delete("/product",(req,res) => {
		if (typeof req.body.auth !== "undefined") {
		}
		else{
			res.sendStatus("404");
		}
		jwt.verify(req.body.auth,"delilahdemo",(err,token)=>{
			if (token.login.rol != "admin") {
				res.sendStatus("403");
			}
			else{

				var idProducto = req.body.idproducto;
				var stmt = "DELETE FROM productos WHERE idproducto ="+mysql.escape(idProducto);
				con.query(stmt,function (err,result,fields){
					res.sendStatus("200");
				})
			}
		})
	})
}

