var express = require('express');
var quizController = require('../controllers/quiz_controller.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);
router.get('/author', function(req ,res){
	res.render('author',{name:'Marcos José Rivera Souto', photo:'/images/yo.png', description:'Programador backend de A Coruña.<br/>Con ganas de aprender de todo lo que se preste.'})
});

module.exports = router;
