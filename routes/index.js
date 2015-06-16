var express = require('express');
var quizController = require('../controllers/quiz_controller.js');
var commentController = require('../controllers/comment_controller.js');
var sessionController = require('../controllers/session_controller.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors:[]}); // lo de errors es para reinicializar los errores q. pudiera ser que ser renderizaran con otra petición anterior, ver quiz_controler.js
});

//Autoload de comandos con :quizId . 
//Si la petición lleva parametro quizId, captura antes que ninguno la petición e intermedia antes que el resto(show y answer).
//Solo si existe el parámetro :quizId está en algún lugar de la cabecera HTTP (en query, body o param).
router.param('quizId',quizController.load);
//si la ruta que se pide contiene el parámetro commentId ejecutará...
router.param('commentId',commentController.load);

//Definición de las rutas de sesión
router.get('/login',sessionController.new); //pide formulario de login
router.post('/login',sessionController.create); //crear sesión
router.get('/logout',sessionController.destroy);	//destruir sesión (realmente debería ser router.delete... pero se hizo con get standard...)

router.get('/quizes', quizController.index); //controler.js mostrará las respuestas
router.get('/quizes/:quizId(\\d+)', quizController.show);//enseñar pregunta
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);//donde comprobará la respuesta

router.get('/quizes/new', quizController.new); // mostrará el formulario para crear la pregunta
router.post('/quizes/create', quizController.create); // creará la pregunta
router.get('/quizes/:quizId(\\d+)/edit',sessionController.loginRequired, quizController.edit); // formulario de edición de una pregunta
router.put('/quizes/:quizId(\\d+)', 	sessionController.loginRequired, quizController.update); // actualizar una pregunta (enviado desde el edit)
router.delete('/quizes/:quizId(\\d+)', 	sessionController.loginRequired, quizController.destroy); // eliminar una pregunta (enviado desde el edit)

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', 
			sessionController.loginRequired, commentController.publish);//realmente no debería ser get, sino put, y con eso ya no se pondría "/publish".. pero el ejercicio se hizo así antes.

//antes:
//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer', quizController.answer);

router.get('/author', function(req ,res){
	res.render('author',{name:'Marcos José Rivera Souto', photo:'/images/yo.png', description:'Programador backend de A Coruña.<br/>Con ganas de aprender de todo lo que se preste.', errors:[]})
});

module.exports = router;
