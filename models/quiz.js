//##################################################################################################
//Representa la Tabla Quiz. El controlador de esta 'tabla' por nomenclatura debería estar en carpeta
// controllers y llamarse a igual que la tabla y seguido por "_controller", quedando:
// controllers/quiz_controller.js  
// y la vistas estan en la carpeta views/quizes/  y sus rutas de acceso a cada una tambien utilizan 
// plural, "quizzes" (vease routes/index.js)
//##################################################################################################

module.exports = function(sequelize, DataTypes) {
	// http://sequelize.readthedocs.org/en/2.0/docs/models-definition/#validations
	return sequelize.define('Quiz',{
								pregunta:{
									type:DataTypes.STRING,
									validate: {
										notEmpty:{ msg:"-> Falta pregunta" }
									}
								},
								respuesta:{
									type:DataTypes.STRING,
									validate: {
										notEmpty:{ msg:"-> Falta respuesta" }
									}
								}
							}); // pregunta y respuesta son todos los campos de la tabla y son de tipo String

};