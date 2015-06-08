//##################################################
// models.js define como se construye todo el modelo.
//##################################################

var path = require('path');

// Postgres: DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite: DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
console.log("DB_name: "+DB_name+"\n user: "+user+"\n pwd: "+pwd+"\n protocol: "+protocol+"\n dialect: "+dialect+"\n port: "+port,
host)
var storage = process.env.DATABASE_STORAGE;

//Cargar Sequelize para crear un Model ORM
var Sequelize = require('sequelize');
//Usar BBDD SQLite y donde. new Sequelize('database', 'username', 'password'...
var sequelize = new Sequelize(DB_name,user,pwd,{
	dialect:dialect,
	protocol:protocol,
	port:port,
	host:host,
	storage:storage, // solo para SQLite (.env)
	omitNull:true	// solo para Postgres
});
//var sequelize = new Sequelize(null,null,null, {dialect:"sqlite", storage:"quiz.sqlite"} ); //antes

//Importar la definicion de la tabla quiz, de quiz.js (como VO), pero no se pone extensión.
var Quiz = sequelize.import(path.join(__dirname,'quiz'));  //Otra forma sería, directamente:   var Quiz = sequelize.define('Quiz',{ pregunta:DataTypes.STRING, respuesta:DataTypes.STRING });

exports.Quiz = Quiz; //exportar la definición de tabla Quiz, para poder importarlos en otros sitios de la aplicación

//Creamos e inicializamos la tabla de preguntas en DB, con sequelize.sync(), en caso de que no tuviera ningún registro la tabla.
sequelize.sync()
		.then(function(result) {
			Quiz.count().then(function (count){
    			if(count === 0) { 
    				return Quiz.create({
						pregunta:'Capital de Italia',
						respuesta:'Roma'
					}).then(function(){	console.log("Base de datos inicializada...")	});
    			}
			})		
		});