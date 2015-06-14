//#########################################################################
// comment_controller.js middleware.
// Se trata del controlador de la tabla comment.
//#########################################################################

var models =require('../models/models.js');

//Para: GET /quizes/:quiId/comments/new
exports.new = function(req,res){
	res.render('comments/new.ejs',{quizid:req.params.quizId, errors:[]});
}

//Para: POST /quizes/:quiId/comments
exports.create = function(req,res){
	var comment = models.Comment.build( {
		texto: req.body.comment.texto,
		QuizId: req.params.quizId
		}  
	);
	//guardar en la BBDD (solo los campos "pregunta" y"respuesta") y una vez guardado redireccionar a quizes.
	//antes validamos según las "normas" puestas en la definicion del modelo de la tabla (models/quiz.js)
console.log(comment);
	comment
	.validate()
	.then(
		function(err){
		if(err){ //Hay un error y hay que mostrarlo
			// en err.errors van los msg de error puestos en la validaciones de cada campo en models/comment.js (errors es un array de message s  de las validaciones que no cumple, ver layout.ejs)
			res.render("comments/new.ejs",
				{comment:comment, quizid:req.params.quizId, errors:err.errors}); // por esto tenemos que reinicializar errors en el resto de los sitios que mandamos renderizar...
		}else{ // no hay ningún error, por tanto solo hay que guardar y redireccionar a quizes
			comment
				.save()
				.then(function(){
					res.redirect('/quizes/'+req.params.quizId); //redirect a la pregunta que tendrá los comentarios
				});
		}
	});
	
}
