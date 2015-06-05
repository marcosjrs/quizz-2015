//midleware

//GET /quizes/question
exports.question = function(req, res){
	//renderiza question.ejs al que se le pasa la variable pregunta
	res.render('quizes/question',{pregunta:'Capital de Italia'});
}

//GET /quizes/answer
exports.answer = function(req, res){
	//renderiza answer.ejs con variable respuesta dependiente de lo contestado
	if(req.query.respuesta=="Roma"){
		res.render('quizes/answer',{respuesta: 'Correcto'});
	}else{
		res.render('quizes/answer',{respuesta: 'Incorrecto'});
	}
}