var express = require('express');
var quizController = require('../controllers/quiz_controller.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

//Autoload de comandos con :quizId . 
//Si la petición lleva parametro quizId, captura antes que ninguno la petición e intermedia antes que el resto(show y answer).
//Solo si existe el parámetro :quizId está en algún lugar de la cabecera HTTP (en query, body o param).
router.param('quizId',quizController.load);

router.get('/quizes', quizController.index); // mostrará las respuestas
router.get('/quizes/:quizId(\\d+)', quizController.show);//enseñar pregunta
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);//donde comprobará la respuesta
//antes:
//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer', quizController.answer);

router.get('/author', function(req ,res){
	res.render('author',{name:'Marcos José Rivera Souto', photo:'/images/yo.png', description:'Programador backend de A Coruña.<br/>Con ganas de aprender de todo lo que se preste.'})
});

module.exports = router;
