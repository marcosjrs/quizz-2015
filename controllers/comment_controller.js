//#########################################################################
// comment_controller.js middleware.
// Se trata del controlador de la tabla comment.
//#########################################################################

var models =require('../models/models.js');
//Método de patrón Autoload. Se ejecuta cuando hay en la url, pedida, un parametro correspondiente a :commentId
//Busca el comentario con ese id, y si lo encuentra inyecta en el req (request) un objeto comment con los datos.
exports.load = function(req,res,next,commentId){
	models.Comment.find({
		where:{
			id:Number(commentId)
		}
	}).then(function(comment){
		if(comment){
			req.comment = comment;
			next();
		}else{
			next(new Error("No existe un comentario con el id "+ commentId));
		}
	}).catch(function(error){	next(error);	});
}

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

//GET /quizes/:quizId/comments/:commentId/publish , como  lleva :commentId se ejecutará antes exports.load... según lo expuesto en routes/index.ejs
exports.publish = function(req, res){
	req.comment.publicado = true;
	req.comment.save({fields:["publicado"]})
		.then(function(){	res.redirect('/quizes/'+req.params.quizId);	})
		.catch(function(error){	next(error);	})
}
