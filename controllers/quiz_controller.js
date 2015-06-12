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
	res.render('quizes/show',{ quiz:req.quiz , errors:[]});
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
	res.render('quizes/answer', {quiz: req.quiz, respuesta:resultado, errors:[]});
};

exports.index = function(req, res){
	//renderiza question.ejs al que se le pasa la variable quizes con todas las preguntas
	//Si el request lleva un 'parametro' "search" no vacio creamos una query similar a: 
	//where pregunta like "%palabrabuscar%"
	var query =  req.query.search && req.query.search != "" ? { where: { pregunta: {like:"%"+req.query.search+"%"} } } :{} ;
	models.Quiz.findAll(query).then(function(quizes){
		res.render('quizes/index.ejs',{ quizes:quizes , errors:[] });
	}).catch(function(error){ 		next(error);		});
};

exports.new = function(req,res){
	//construye un objeto quiz con un metodo de sequelize (build),
	//donde el objeto que se le pasa tendrá  unos atributos con el mismo nombre que los campos de la tabla.
	// con ese objeto renderizará quizes/new.ejs (que a su vez utilizará _form.ejs como si de un partial se tratase.)
	// ese objeto formará parte del body (req.body), con lo que luego al hacer el create continuará en el body ese objeto
	var quiz = models.Quiz.build(
		{pregunta:"Pregunta", respuesta:"Respuesta", tema:models.TEMAS[0].value}//por defecto el primero
	);
	res.render('quizes/new',{quiz:quiz, temas:models.TEMAS, errors:[]});
}

exports.create = function(req,res){
	//vease explicación en el exports.new
	var quiz = models.Quiz.build( req.body.quiz );
	//guardar en la BBDD (solo los campos "pregunta" y"respuesta") y una vez guardado redireccionar a quizes.
	//antes validamos según las "normas" puestas en la definicion del modelo de la tabla (models/quiz.js)

	quiz
	.validate()
	.then(
		function(err){
		if(err){ //Hay un error y hay que mostrarlo en "quizes\new" que es desde donde se esta creando este quiz... pero en lugar de ponerlo hay lo ponemos en el layout, layout.ejs 
			// en err.errors van los msg de error puestos en la validaciones de cada campo en models/quiz.js (errors es un array de message s  de las validaciones que no cumple, ver layout.ejs)
			res.render("quizes/new",{quiz:quiz, errors:err.errors}); // por esto tenemos que reinicializar errors en el resto de los sitios que mandamos renderizar...
		}else{ // no hay ningún error, por tanto solo hay que guardar y redireccionar a quizes
			quiz.save({fields:["pregunta","respuesta","tema"]})
				.then(function(){
					res.redirect('/quizes'); //redirect sobre objeto de response.
				});
		}
	});
	
}

exports.edit = function(req, res){ // mostrará formulario para editar pregunta
	res.render('quizes/edit',{ quiz:req.quiz, temas:models.TEMAS, errors:[]});//eq.quiz insertada antes en req mediante el metodo de tipo "autoload" anterior, load.
}; 

exports.update = function(req, res){
	//inyectamos quiz en el objeto request con los datos (del "autoload", metodo exports.load), luego lo validaremos 
	//y si es correcto lo guardamos y si no mostramos el edit con los errores.
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	console.log("tema");
	console.log(req.body.quiz );
	req.quiz
	.validate()
	.then(
		function(err){
		if(err){ //Hay un error y hay que mostrarlo en "quizes\edit" que es desde donde se esta editando este quiz... pero en lugar de ponerlo hay lo ponemos en el layout, layout.ejs 
			// en err.errors van los msg de error puestos en la validaciones de cada campo en models/quiz.js (errors es un array de message s  de las validaciones que no cumple, ver layout.ejs)
			res.render("quizes/edit",{quiz:req.quiz, errors:err.errors}); // por esto tenemos que reinicializar errors en el resto de los sitios que mandamos renderizar...
		}else{ // no hay ningún error, por tanto solo hay que guardar y redireccionar a quizes
			req.quiz.save({fields:["pregunta","respuesta","tema"]})
				.then(function(){
					res.redirect('/quizes'); //redirect sobre objeto de response (con url relativo)
				});
		}
	});
};

exports.destroy = function(req, res){
	req.quiz.destroy()
				.then(function(){ res.redirect('/quizes'); }) // redirije a quizes si va bien
				.catch(function(error){ next(error)});
};


