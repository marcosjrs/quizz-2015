//#########################################################################
// session_controller.js middleware.
//#########################################################################

var models =require('../models/models.js');

//Para: GET /login   Pedir formulario de login
exports.new = function(req,res){
	var errors = req.session.errors || {}; //guardamos los errores en la variable
	req.session.errors = {}; 				// y la "limpiamos" para que esten vacios para otra petición de formulario
	res.render('sessions/new.ejs',{errors:errors});
}

//Para: POST /login  Crear sesión
exports.create = function(req,res){

	var login = req.body.login;
	var password = req.body.password;

	var useController = require('./user_controller'); // importamos el controlador de usuarios...
	useController.autenticar(login,password,function(error,user){

		if(error){// si hay un error redireccionamos de nuevo a la pantalla de error, mostrando en esa pantalla el siguiente error:
			req.session.errors=[{"message":'Se ha producido un error: '+error}];
			res.redirect("/login");
			return;   //<<-- return que no dejaría continuar en las siquientes líneas...
		}
		//No hay error.
		req.session.user = { id:user.id, username:user.username };//Creamos req.sesion.user con id de usuario y nombre.
		res.redirect(req.session.redir.toString()); //redireccion a la ultima path guardada en req.session.redir (desde app.js)
	});
	
}

//Para: GET /logout Destruir sesión
exports.destroy = function(req,res){
	delete req.session.user;
	console.log("req.session.redir");
	console.log(req.session.redir);
	res.redirect(req.session.redir.toString()); //redireccion a la ultima path guardada en req.session.redir (desde app.js)
}

//MW de autorización de accesos HTTP restringidos. 
//Este midleware esta puesto en conjunto al de crear, modificar y borrar... se ejecuta antes. 
//Se trata de comprobar si está registrado, y si no se deriva a /login ...
exports.loginRequired = function(req,res,next){
	if(req.session.user){
		next();
	}else{
		res.redirect('/login');
	}
}