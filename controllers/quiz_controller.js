//#########################################################################
// quiz_controller.js middleware.
// Se trata del controlador de la tabla quiz, véase quiz.js para más info.
//#########################################################################

var models =require('../models/models.js');

//Autoload - factoriza el código si ruta incluye un parametro ( :quizId )
//Middleware (intermediario) que buscará en la bbdd el id del quiz (quizId), si lo encuentra lo asigna en el request (req),
//luego se ejecutará el método que "le tocaba" (show o answer), y como llevan el objeto request con la nueva variable "quiz" ..
exports.load = function(req, res, next, quizId){
	models.Quiz.findById(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next(); // para que continue con las siguientes peticiones...
			}else{
				next( new Error('No exite el quizId= '+quizId)  );
			}
		}
	).catch(function(error){ 		next(error);		});
};

exports.show = function(req, res){
	//req.params son los parámetros de la solicitud http que nos está llegando
	//models.Quiz.findById(req.params.quizId).then(function(quiz){
	//	res.render('quizes/show',{ quiz:quiz });//con la pregunta seleccionada mediante parámetros.
	//});
	//Al implementar el "Autoload", se queda así:
	res.render('quizes/show',{ quiz:req.quiz });
};

exports.answer = function(req, res){
	//renderiza answer.ejs con variable respuesta dependiente de lo contestado
	//req.params son los parámetros de la solicitud http que nos está llegando y 
	//req.query son los parámetros pasados, en este caso mediante el formulario.
	//models.Quiz.findById(req.params.quizId).then(function(quiz){
	//	if(req.query.respuesta === quiz.respuesta){
	//		res.render('quizes/answer', {quiz: quiz, respuesta:'Correcto'});
	//	}else{
	//		res.render('quizes/answer', {quiz: quiz, respuesta:'Incorrecto'});
	//	}
	//});
	//Al implementar el "Autoload", se queda así:
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){  resultado = 'Correcto';  }
	res.render('quizes/answer', {quiz: req.quiz, respuesta:resultado});
};

exports.index = function(req, res){
	//renderiza question.ejs al que se le pasa la variable quizes con todas las preguntas
	//Si el request lleva un 'parametro' "search" no vacio creamos una query similar a: 
	//where pregunta like "%palabrabuscar%"
	var query =  req.query.search && req.query.search != "" ? { where: { pregunta: {like:"%"+req.query.search+"%"} } } :{} ;
	models.Quiz.findAll(query).then(function(quizes){
		res.render('quizes/index.ejs',{ quizes:quizes });
	}).catch(function(error){ 		next(error);		});
};

