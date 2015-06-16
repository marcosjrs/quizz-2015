//#########################################################################
// user_controller.js middleware.
//#########################################################################

var users = {
				admin: {id:1, username:"admin", password:"1234"},
				pepe: {id:2, username:"pepe", password:"5678"}
			};

//Comprueba si el usuario está registrado en users y ejecuta callback
exports.autenticar = function(login, password, callback){
	if(users[login]){// si ese usuario (pasado mediante variable login) existe en users....
		if(password === users[login].password){
			callback(null, users[login]);
		}else{
			callback(new Error("Password erróneo"));
		}
	}else{
		callback(new Error("No existe ese usuario"));
	}
	
}

